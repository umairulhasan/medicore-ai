"""Billing/Insurance Agent — drafts insurance claims.

Framework note: financial/legal document generation benefits from strict
structured output. Swap the plain dict return below for a Pydantic AI agent
with a typed output schema when you build this out further.
"""

from langchain_openai import ChatOpenAI

from backend.config import settings
from backend.rag.retriever import retrieve_context
from backend.tools import clinic_tools

SYSTEM_PROMPT = """You are the Billing Agent for {clinic_name}.
Given a visit summary and the patient's insurance coverage rules, draft a
short claim justification. Be factual and concise — this is used to
pre-fill an insurance claim form, not to make coverage decisions.
""".format(clinic_name=settings.clinic_name)


def draft_claim(visit_id: int, patient_id: int, insurance_plan_id: int, visit_summary: str, amount: float) -> dict:
    llm = ChatOpenAI(model="gpt-4.1-mini", api_key=settings.openai_api_key)

    coverage_context = retrieve_context(f"insurance plan {insurance_plan_id} coverage rules", k=2)

    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            (
                "user",
                f"Coverage rules:\n{coverage_context}\n\n"
                f"Visit summary: {visit_summary}\n\n"
                f"Draft a one-paragraph claim justification for a ${amount} charge.",
            ),
        ]
    )

    claim = clinic_tools.submit_insurance_claim(
        visit_id=visit_id,
        patient_id=patient_id,
        insurance_plan_id=insurance_plan_id,
        amount=amount,
    )

    return {**claim, "justification": response.content}
