"""Triage Agent — assesses severity, checks RAG knowledge base, and requires
human (nurse) approval before anything is finalized. This node is also the
one implemented inside the LangGraph orchestrator (see orchestrator/graph.py)
as a graph node with an interrupt for human review.
"""

from langchain_openai import ChatOpenAI

from backend.config import settings
from backend.rag.retriever import retrieve_context
from backend.tools import clinic_tools

SYSTEM_PROMPT = """You are the Triage Agent for {clinic_name}.
Given a patient's reported symptoms and any relevant clinical knowledge base
context, classify severity as one of: low, medium, high, urgent.

You must NEVER diagnose. Only classify urgency so a human nurse can decide
next steps. If severity is "urgent", clearly state that immediate escalation
is required.
""".format(clinic_name=settings.clinic_name)


def assess_severity(intake_id: int, symptoms_text: str) -> dict:
    """First pass: LLM + RAG assessment. Requires nurse approval before use."""
    llm = ChatOpenAI(model="gpt-4.1-mini", api_key=settings.openai_api_key)

    context = retrieve_context(symptoms_text, k=3)

    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            (
                "user",
                f"Relevant knowledge base context:\n{context}\n\n"
                f"Patient symptoms: {symptoms_text}\n\n"
                "Respond with just the severity classification and a one-line rationale.",
            ),
        ]
    )

    # naive parse — a production system would use structured output (Pydantic AI)
    text = response.content.lower()
    severity = "urgent" if "urgent" in text else "high" if "high" in text else "medium" if "medium" in text else "low"

    return {
        "intake_id": intake_id,
        "severity": severity,
        "rationale": response.content,
        "requires_nurse_approval": True,
    }


def apply_nurse_decision(intake_id: int, severity: str, approved: bool) -> dict:
    """Called once a human nurse has reviewed the AI's severity assessment."""
    status = "approved" if approved else "escalated"
    return clinic_tools.update_triage_result(intake_id=intake_id, severity=severity, status=status)
