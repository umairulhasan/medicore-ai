"""Scheduling Agent — finds and books appointments.

Framework note: in this scaffold it's implemented as straightforward tool
calling. Swap in CrewAI or agno here if you want true multi-agent
negotiation between patient preference and doctor availability, per the
architecture doc.
"""

from backend.tools import clinic_tools


def find_and_book_slot(patient_id: int, doctor_id: int, preferred_days_ahead: int = 7) -> dict:
    """Find the earliest available slot for a doctor and book it for the patient."""
    slots = clinic_tools.check_available_slots(doctor_id, days_ahead=preferred_days_ahead)

    if not slots or "error" in slots[0]:
        return {"status": "no_slots_available", "slots": slots}

    chosen_slot = slots[0]["slot_time"]
    booking = clinic_tools.book_appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        slot_time=chosen_slot,
        booked_via="agent",
    )

    clinic_tools.send_reminder(
        patient_id=patient_id,
        message=f"Your appointment is confirmed for {chosen_slot}.",
        channel="sms",
    )

    return {"status": "booked", **booking}
