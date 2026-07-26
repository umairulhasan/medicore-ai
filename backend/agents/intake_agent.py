"""Intake Agent — LangChain + OpenAI function calling.

Collects patient symptoms, checks existing records, and records a new
intake entry for the Triage Agent to pick up.
"""

from langchain_openai import ChatOpenAI

from backend.config import settings
from backend.tools import clinic_tools

SYSTEM_PROMPT = """You are the Intake Agent for {clinic_name}.
Collect the patient's symptoms clearly and courteously, ask any clarifying
questions needed, then confirm you've logged their information. Never give
medical advice or diagnoses — that is the Triage Agent's job with human
oversight.
""".format(clinic_name=settings.clinic_name)


def run_intake(patient_id: int, message: str) -> dict:
    """Process one patient message, log the intake, and return a reply."""
    llm = ChatOpenAI(model="gpt-4.1-mini", api_key=settings.openai_api_key)

    history = clinic_tools.pull_patient_history(patient_id)

    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            ("user", f"Patient record: {history}\n\nPatient says: {message}"),
        ]
    )

    intake_result = clinic_tools.record_intake(patient_id=patient_id, symptoms_text=message)

    return {
        "reply": response.content,
        "intake_id": intake_result["intake_id"],
    }
