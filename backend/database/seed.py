"""Seeds the database with SYNTHETIC demo data only.

Never load real patient information here or anywhere in this project.
Run with: uv run python -m backend.database.seed
"""

from datetime import date, datetime, timedelta

from backend.database.models import (
    Doctor,
    InsurancePlan,
    Patient,
    Appointment,
)
from backend.database.session import get_session, init_db


def seed() -> None:
    init_db()

    with get_session() as db:
        if db.query(Patient).count() > 0:
            print("Database already seeded. Skipping.")
            return

        plan_a = InsurancePlan(
            provider_name="BlueShield Basic",
            coverage_rules="Covers 80% of outpatient visits, no dental.",
            plan_tier="basic",
        )
        plan_b = InsurancePlan(
            provider_name="HealthFirst Plus",
            coverage_rules="Covers 100% of outpatient visits, includes dental and vision.",
            plan_tier="premium",
        )
        db.add_all([plan_a, plan_b])
        db.flush()  # populate IDs

        dr_lee = Doctor(full_name="Dr. Amara Lee", specialty="General Practice", schedule_pattern="Mon-Fri 9-5")
        dr_khan = Doctor(full_name="Dr. Imran Khan", specialty="Dermatology", schedule_pattern="Tue/Thu 10-4")
        db.add_all([dr_lee, dr_khan])
        db.flush()

        patient_1 = Patient(
            full_name="Jordan Rivera",
            date_of_birth=date(1990, 4, 12),
            phone="+1-555-0101",
            email="jordan.rivera@example.com",
            insurance_plan_id=plan_a.insurance_plan_id,
        )
        patient_2 = Patient(
            full_name="Sam Okafor",
            date_of_birth=date(1985, 11, 3),
            phone="+1-555-0102",
            email="sam.okafor@example.com",
            insurance_plan_id=plan_b.insurance_plan_id,
        )
        db.add_all([patient_1, patient_2])
        db.flush()

        appt = Appointment(
            patient_id=patient_1.patient_id,
            doctor_id=dr_lee.doctor_id,
            slot_time=datetime.utcnow() + timedelta(days=2, hours=3),
            status="booked",
            booked_via="agent",
        )
        db.add(appt)

        print("Seeded database with synthetic demo data:")
        print(f"  - {db.query(Patient).count()} patients")
        print(f"  - {db.query(Doctor).count()} doctors")
        print(f"  - {db.query(InsurancePlan).count()} insurance plans")
        print(f"  - {db.query(Appointment).count()} appointments")


if __name__ == "__main__":
    seed()
