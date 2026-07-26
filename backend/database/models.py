"""SQLAlchemy ORM models — mirrors the ERD in the project documentation."""

from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Date,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class InsurancePlan(Base):
    __tablename__ = "insurance_plans"

    insurance_plan_id = Column(Integer, primary_key=True)
    provider_name = Column(String, nullable=False)
    coverage_rules = Column(Text)
    plan_tier = Column(String)

    patients = relationship("Patient", back_populates="insurance_plan")
    claims = relationship("Claim", back_populates="insurance_plan")


class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date)
    phone = Column(String)
    email = Column(String)
    insurance_plan_id = Column(Integer, ForeignKey("insurance_plans.insurance_plan_id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    insurance_plan = relationship("InsurancePlan", back_populates="patients")
    appointments = relationship("Appointment", back_populates="patient")
    visits = relationship("Visit", back_populates="patient")
    claims = relationship("Claim", back_populates="patient")
    intake_records = relationship("IntakeRecord", back_populates="patient")
    agent_logs = relationship("AgentLog", back_populates="patient")


class Doctor(Base):
    __tablename__ = "doctors"

    doctor_id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    specialty = Column(String)
    schedule_pattern = Column(String)

    appointments = relationship("Appointment", back_populates="doctor")
    visits = relationship("Visit", back_populates="doctor")


class Appointment(Base):
    __tablename__ = "appointments"

    appointment_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    doctor_id = Column(Integer, ForeignKey("doctors.doctor_id"))
    slot_time = Column(DateTime, nullable=False)
    status = Column(String, default="booked")  # booked | cancelled | completed
    booked_via = Column(String, default="agent")  # agent | phone | portal

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    visit = relationship("Visit", back_populates="appointment", uselist=False)


class Visit(Base):
    __tablename__ = "visits"

    visit_id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.appointment_id"))
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    doctor_id = Column(Integer, ForeignKey("doctors.doctor_id"))
    doctor_notes = Column(Text)
    visit_summary_doc_url = Column(String)
    visit_date = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="visit")
    patient = relationship("Patient", back_populates="visits")
    doctor = relationship("Doctor", back_populates="visits")
    claims = relationship("Claim", back_populates="visit")
    prescriptions = relationship("Prescription", back_populates="visit")
    lab_orders = relationship("LabOrder", back_populates="visit")


class IntakeRecord(Base):
    __tablename__ = "intake_records"

    intake_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    symptoms_text = Column(Text)
    uploaded_image_url = Column(String)
    triage_severity = Column(String)  # low | medium | high | urgent
    triage_status = Column(String, default="pending")  # pending | approved | escalated
    submitted_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="intake_records")


class Claim(Base):
    __tablename__ = "claims"

    claim_id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.visit_id"))
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    insurance_plan_id = Column(Integer, ForeignKey("insurance_plans.insurance_plan_id"))
    amount = Column(Numeric(10, 2))
    status = Column(String, default="draft")  # draft | submitted | approved | denied
    claim_pdf_url = Column(String)
    filed_at = Column(DateTime, default=datetime.utcnow)

    visit = relationship("Visit", back_populates="claims")
    patient = relationship("Patient", back_populates="claims")
    insurance_plan = relationship("InsurancePlan", back_populates="claims")


class Prescription(Base):
    __tablename__ = "prescriptions"

    prescription_id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.visit_id"))
    medication_name = Column(String, nullable=False)
    dosage = Column(String)
    instructions = Column(Text)

    visit = relationship("Visit", back_populates="prescriptions")


class LabOrder(Base):
    __tablename__ = "lab_orders"

    lab_order_id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.visit_id"))
    test_type = Column(String, nullable=False)
    status = Column(String, default="ordered")  # ordered | in_progress | complete
    result_file_url = Column(String)

    visit = relationship("Visit", back_populates="lab_orders")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    log_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    agent_name = Column(String, nullable=False)
    action_taken = Column(String)
    tool_calls_json = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="agent_logs")
