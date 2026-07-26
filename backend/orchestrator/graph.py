"""LangGraph orchestrator — implements the patient journey state diagram:

    Intake -> Triage -> (nurse checkpoint) -> Scheduling -> Billing -> FollowUp
                              |
                              v
                          Escalated (urgent cases exit here)

Run a single journey with `run_patient_journey()`. The graph uses a SQLite
checkpointer so state persists across the human-in-the-loop interrupt.
"""

from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import END, StateGraph

from backend.agents import (
    billing_agent,
    followup_agent,
    intake_agent,
    scheduling_agent,
    triage_agent,
)
from backend.orchestrator.state import PatientJourneyState


def intake_node(state: PatientJourneyState) -> PatientJourneyState:
    result = intake_agent.run_intake(state["patient_id"], state["symptoms_text"])
    return {**state, "intake_id": result["intake_id"], "status": "intake_complete"}


def triage_node(state: PatientJourneyState) -> PatientJourneyState:
    result = triage_agent.assess_severity(state["intake_id"], state["symptoms_text"])
    return {
        **state,
        "severity": result["severity"],
        "triage_rationale": result["rationale"],
        "status": "awaiting_nurse_approval",
    }


def nurse_checkpoint_node(state: PatientJourneyState) -> PatientJourneyState:
    """This node intentionally does nothing but pause — the graph is compiled
    with an interrupt before this node so a human can review `severity` and
    `triage_rationale`, then resume the graph with `nurse_approved` set.
    """
    return state


def route_after_nurse(state: PatientJourneyState) -> str:
    if state.get("severity") == "urgent" and not state.get("nurse_approved"):
        return "escalated"
    return "scheduling" if state.get("nurse_approved") else "escalated"


def escalated_node(state: PatientJourneyState) -> PatientJourneyState:
    return {**state, "status": "escalated_to_emergency_care"}


def scheduling_node(state: PatientJourneyState) -> PatientJourneyState:
    result = scheduling_agent.find_and_book_slot(state["patient_id"], state["doctor_id"])
    return {
        **state,
        "appointment_id": result.get("appointment_id"),
        "slot_time": result.get("slot_time"),
        "status": "appointment_booked",
    }


def billing_node(state: PatientJourneyState) -> PatientJourneyState:
    # visit_id/amount would normally come from the doctor's post-visit notes;
    # stubbed here with placeholder values for the demo flow.
    result = billing_agent.draft_claim(
        visit_id=state.get("visit_id", 0),
        patient_id=state["patient_id"],
        insurance_plan_id=1,
        visit_summary=state.get("triage_rationale", ""),
        amount=state.get("claim_amount", 150.0),
    )
    return {**state, "claim_id": result.get("claim_id"), "status": "claim_filed"}


def followup_node(state: PatientJourneyState) -> PatientJourneyState:
    followup_agent.send_followup(state["patient_id"], state.get("triage_rationale", ""))
    return {**state, "followup_sent": True, "status": "journey_complete"}


def build_graph():
    graph = StateGraph(PatientJourneyState)

    graph.add_node("intake", intake_node)
    graph.add_node("triage", triage_node)
    graph.add_node("nurse_checkpoint", nurse_checkpoint_node)
    graph.add_node("escalated", escalated_node)
    graph.add_node("scheduling", scheduling_node)
    graph.add_node("billing", billing_node)
    graph.add_node("followup", followup_node)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "triage")
    graph.add_edge("triage", "nurse_checkpoint")
    graph.add_conditional_edges(
        "nurse_checkpoint",
        route_after_nurse,
        {"scheduling": "scheduling", "escalated": "escalated"},
    )
    graph.add_edge("escalated", END)
    graph.add_edge("scheduling", "billing")
    graph.add_edge("billing", "followup")
    graph.add_edge("followup", END)

    checkpointer = SqliteSaver.from_conn_string("./data/langgraph_checkpoints.sqlite")
    return graph.compile(checkpointer=checkpointer, interrupt_before=["nurse_checkpoint"])


def run_patient_journey(patient_id: int, doctor_id: int, symptoms_text: str, thread_id: str) -> PatientJourneyState:
    """Runs the journey up to (and pausing at) the nurse checkpoint."""
    app = build_graph()
    config = {"configurable": {"thread_id": thread_id}}
    initial_state: PatientJourneyState = {
        "patient_id": patient_id,
        "doctor_id": doctor_id,
        "symptoms_text": symptoms_text,
        "status": "started",
    }
    result = app.invoke(initial_state, config=config)
    return result


def resume_after_nurse_approval(thread_id: str, approved: bool) -> PatientJourneyState:
    """Call this after a nurse reviews the triage output in the admin dashboard."""
    app = build_graph()
    config = {"configurable": {"thread_id": thread_id}}
    app.update_state(config, {"nurse_approved": approved})
    result = app.invoke(None, config=config)
    return result
