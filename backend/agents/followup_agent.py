"""Follow-up Agent — post-visit check-ins and medication reminders."""

from langchain_openai import ChatOpenAI

from backend.config import settings
from backend.tools import clinic_tools

SYSTEM_PROMPT = """You are the Follow-up Agent for {clinic_name}.
Write a brief, warm check-in message for a patient a few days after their
visit, referencing their visit summary. Keep it under 3 sentences.
""".format(clinic_name=settings.clinic_name)


def send_followup(patient_id: int, visit_summary: str) -> dict:
    llm = ChatOpenAI(model="gpt-4.1-mini", api_key=settings.openai_api_key)

    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            ("user", f"Visit summary: {visit_summary}"),
        ]
    )

    return clinic_tools.send_reminder(
        patient_id=patient_id,
        message=response.content,
        channel="sms",
    )
