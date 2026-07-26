"""Patient-facing chat endpoints — drives the LangGraph patient journey."""

from fastapi import APIRouter
from pydantic import BaseModel

from backend.orchestrator.graph import resume_after_nurse_approval, run_patient_journey

router = APIRouter(prefix="/chat", tags=["chat"])


class StartJourneyRequest(BaseModel):
    patient_id: int
    doctor_id: int
    symptoms_text: str
    thread_id: str


class NurseDecisionRequest(BaseModel):
    thread_id: str
    approved: bool


@router.post("/start")
def start_journey(payload: StartJourneyRequest):
    """Kicks off Intake -> Triage, then pauses at the nurse checkpoint."""
    result = run_patient_journey(
        patient_id=payload.patient_id,
        doctor_id=payload.doctor_id,
        symptoms_text=payload.symptoms_text,
        thread_id=payload.thread_id,
    )
    return result


@router.post("/nurse-decision")
def nurse_decision(payload: NurseDecisionRequest):
    """Resumes the journey after a nurse approves/escalates the triage result."""
    result = resume_after_nurse_approval(thread_id=payload.thread_id, approved=payload.approved)
    return result
