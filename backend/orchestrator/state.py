"""State schema for the LangGraph patient journey — mirrors the state
diagram in the project documentation (Intake -> Triage -> Scheduling ->
Billing -> FollowUp), with a human-in-the-loop checkpoint at Triage.
"""

from typing import Optional, TypedDict


class PatientJourneyState(TypedDict, total=False):
    patient_id: int
    doctor_id: Optional[int]

    # Intake
    symptoms_text: Optional[str]
    intake_id: Optional[int]

    # Triage
    severity: Optional[str]
    triage_rationale: Optional[str]
    nurse_approved: Optional[bool]

    # Scheduling
    appointment_id: Optional[int]
    slot_time: Optional[str]

    # Billing
    visit_id: Optional[int]
    claim_id: Optional[int]
    claim_amount: Optional[float]

    # Follow-up
    followup_sent: Optional[bool]

    # Control flow
    status: str  # tracks current node name for observability
