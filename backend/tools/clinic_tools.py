"""Plain Python tool functions.

These are the actual functions agents call. They are wrapped as:
  - OpenAI/Anthropic function-calling tools inside each agent file
  - MCP tools inside backend/mcp_server/server.py

Keeping the logic here once means both integration paths stay in sync.
"""

from datetime import datetime, timedelta
from typing import Optional

from backend.database.models import (
    Appointment,
    Claim,
    Doctor,
    IntakeRecord,
    Patient,
)
from backend.database.session import get_session


def pull_patient_history(patient_id: int) -> dict:
    """Return a patient's core record and recent visit history."""
    with get_session() as db:
        patient = db.query(Patient).filter_by(patient_id=patient_id).first()
        if not patient:
            return {"error": f"No patient found with id {patient_id}"}
        return {
            "patient_id": patient.patient_id,
            "full_name": patient.full_name,
            "date_of_birth": str(patient.date_of_birth),
            "insurance_plan_id": patient.insurance_plan_id,
            "visit_count": len(patient.visits),
        }


def check_available_slots(doctor_id: int, days_ahead: int = 7) -> list[dict]:
    """Return open appointment slots for a doctor over the next N days.

    NOTE: this is a simplified stub — a real implementation would check
    the doctor's schedule_pattern against existing bookings.
    """
    with get_session() as db:
        doctor = db.query(Doctor).filter_by(doctor_id=doctor_id).first()
        if not doctor:
            return [{"error": f"No doctor found with id {doctor_id}"}]

        existing_slots = {
            a.slot_time for a in db.query(Appointment).filter_by(doctor_id=doctor_id).all()
        }

    slots = []
    base = datetime.utcnow().replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    for day in range(days_ahead):
        for hour in (9, 11, 14, 16):
            candidate = base.replace(hour=hour) + timedelta(days=day)
            if candidate not in existing_slots:
                slots.append({"slot_time": candidate.isoformat()})
    return slots[:10]


def book_appointment(patient_id: int, doctor_id: int, slot_time: str, booked_via: str = "agent") -> dict:
    """Book a new appointment for a patient with a doctor at a given slot."""
    with get_session() as db:
        appt = Appointment(
            patient_id=patient_id,
            doctor_id=doctor_id,
            slot_time=datetime.fromisoformat(slot_time),
            status="booked",
            booked_via=booked_via,
        )
        db.add(appt)
        db.flush()
        return {
            "appointment_id": appt.appointment_id,
            "status": "booked",
            "slot_time": slot_time,
        }


def record_intake(
    patient_id: int,
    symptoms_text: str,
    uploaded_image_url: Optional[str] = None,
) -> dict:
    """Store a new patient intake record before triage."""
    with get_session() as db:
        record = IntakeRecord(
            patient_id=patient_id,
            symptoms_text=symptoms_text,
            uploaded_image_url=uploaded_image_url,
            triage_status="pending",
        )
        db.add(record)
        db.flush()
        return {"intake_id": record.intake_id, "status": "pending"}


def update_triage_result(intake_id: int, severity: str, status: str) -> dict:
    """Record the Triage Agent's assessment, including nurse approval status."""
    with get_session() as db:
        record = db.query(IntakeRecord).filter_by(intake_id=intake_id).first()
        if not record:
            return {"error": f"No intake record found with id {intake_id}"}
        record.triage_severity = severity
        record.triage_status = status
        return {"intake_id": intake_id, "severity": severity, "status": status}


def submit_insurance_claim(visit_id: int, patient_id: int, insurance_plan_id: int, amount: float) -> dict:
    """Create a draft insurance claim for a completed visit."""
    with get_session() as db:
        claim = Claim(
            visit_id=visit_id,
            patient_id=patient_id,
            insurance_plan_id=insurance_plan_id,
            amount=amount,
            status="draft",
        )
        db.add(claim)
        db.flush()
        return {"claim_id": claim.claim_id, "status": "draft", "amount": amount}


def send_reminder(patient_id: int, message: str, channel: str = "sms") -> dict:
    """Send a reminder to a patient. Stubbed — wire up to Twilio/email/TTS provider."""
    # TODO: integrate real SMS/email/TTS provider here.
    return {"patient_id": patient_id, "channel": channel, "message": message, "status": "sent (stub)"}
