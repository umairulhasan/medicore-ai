"""Generates a PDF insurance claim form."""

from datetime import datetime
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from backend.config import settings

OUTPUT_DIR = Path("./data/generated/claims")


def generate_claim_pdf(
    patient_name: str,
    insurance_provider: str,
    amount: float,
    justification: str,
    claim_id: int,
) -> str:
    """Builds a claim PDF and returns the saved file path."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"claim_{claim_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = OUTPUT_DIR / filename

    c = canvas.Canvas(str(filepath), pagesize=letter)
    width, height = letter

    y = height - 72
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, y, settings.clinic_name)
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(72, y, settings.clinic_address)

    y -= 40
    c.setFont("Helvetica-Bold", 13)
    c.drawString(72, y, f"Insurance Claim #{claim_id}")

    y -= 30
    c.setFont("Helvetica", 11)
    for label, value in [
        ("Patient", patient_name),
        ("Insurance Provider", insurance_provider),
        ("Amount", f"${amount:.2f}"),
        ("Filed On", datetime.utcnow().strftime("%Y-%m-%d")),
    ]:
        c.drawString(72, y, f"{label}: {value}")
        y -= 18

    y -= 20
    c.setFont("Helvetica-Bold", 11)
    c.drawString(72, y, "Justification:")
    y -= 18
    c.setFont("Helvetica", 10)

    # simple text wrap
    words = justification.split()
    line = ""
    for word in words:
        if len(line + word) > 90:
            c.drawString(72, y, line)
            y -= 14
            line = ""
        line += word + " "
    if line:
        c.drawString(72, y, line)

    c.save()
    return str(filepath)
