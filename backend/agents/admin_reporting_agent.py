"""Admin Reporting Agent — aggregates practice metrics for the monthly PPTX report."""

from datetime import datetime, timedelta

from backend.database.models import Appointment, Claim, Patient
from backend.database.session import get_session


def compile_monthly_metrics() -> dict:
    """Pull raw metrics for the current month. Feeds documents/admin_report.py"""
    cutoff = datetime.utcnow() - timedelta(days=30)

    with get_session() as db:
        total_patients = db.query(Patient).count()
        appointments_last_30d = db.query(Appointment).filter(Appointment.slot_time >= cutoff).count()
        no_shows = db.query(Appointment).filter(Appointment.status == "no_show").count()
        claims_filed = db.query(Claim).filter(Claim.filed_at >= cutoff).count()
        total_claimed = sum(c.amount for c in db.query(Claim).filter(Claim.filed_at >= cutoff).all() if c.amount)

    return {
        "total_patients": total_patients,
        "appointments_last_30d": appointments_last_30d,
        "no_shows": no_shows,
        "claims_filed": claims_filed,
        "total_claimed_amount": float(total_claimed or 0),
    }
