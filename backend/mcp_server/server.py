"""MCP server: exposes clinic DB/tool operations to any MCP-compatible client.

Run standalone with:
    uv run python -m backend.mcp_server.server
"""

from mcp.server.fastmcp import FastMCP

from backend.tools import clinic_tools

mcp = FastMCP("medicore-clinic-tools")


@mcp.tool()
def pull_patient_history(patient_id: int) -> dict:
    """Get a patient's core record and visit count."""
    return clinic_tools.pull_patient_history(patient_id)


@mcp.tool()
def check_available_slots(doctor_id: int, days_ahead: int = 7) -> list[dict]:
    """List open appointment slots for a doctor over the next N days."""
    return clinic_tools.check_available_slots(doctor_id, days_ahead)


@mcp.tool()
def book_appointment(patient_id: int, doctor_id: int, slot_time: str, booked_via: str = "agent") -> dict:
    """Book an appointment for a patient with a doctor at the given ISO datetime slot."""
    return clinic_tools.book_appointment(patient_id, doctor_id, slot_time, booked_via)


@mcp.tool()
def record_intake(patient_id: int, symptoms_text: str, uploaded_image_url: str | None = None) -> dict:
    """Store a new patient intake record before triage."""
    return clinic_tools.record_intake(patient_id, symptoms_text, uploaded_image_url)


@mcp.tool()
def update_triage_result(intake_id: int, severity: str, status: str) -> dict:
    """Record triage severity and approval status for an intake record."""
    return clinic_tools.update_triage_result(intake_id, severity, status)


@mcp.tool()
def submit_insurance_claim(visit_id: int, patient_id: int, insurance_plan_id: int, amount: float) -> dict:
    """Create a draft insurance claim for a completed visit."""
    return clinic_tools.submit_insurance_claim(visit_id, patient_id, insurance_plan_id, amount)


@mcp.tool()
def send_reminder(patient_id: int, message: str, channel: str = "sms") -> dict:
    """Send a reminder/notification to a patient."""
    return clinic_tools.send_reminder(patient_id, message, channel)


if __name__ == "__main__":
    mcp.run()
