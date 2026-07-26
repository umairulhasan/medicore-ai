"""Admin-facing endpoints — metrics, reporting, and document generation."""

from fastapi import APIRouter

from backend.agents.admin_reporting_agent import compile_monthly_metrics
from backend.documents.admin_report import generate_admin_report

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/metrics")
def get_metrics():
    return compile_monthly_metrics()


@router.post("/generate-report")
def generate_report():
    metrics = compile_monthly_metrics()
    filepath = generate_admin_report(metrics)
    return {"filepath": filepath, "metrics": metrics}
