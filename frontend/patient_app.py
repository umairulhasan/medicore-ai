"""Patient-facing chat widget — the front door to the patient journey.

Run with: uv run python frontend/patient_app.py
"""

import os
import uuid

import gradio as gr

from frontend.shared.api_client import start_journey

# demo values — a real app would authenticate the patient and look these up
DEMO_PATIENT_ID = 1
DEMO_DOCTOR_ID = 1


def chat_fn(message: str, history: list) -> str:
    thread_id = str(uuid.uuid4())
    result = start_journey(
        patient_id=DEMO_PATIENT_ID,
        doctor_id=DEMO_DOCTOR_ID,
        symptoms_text=message,
        thread_id=thread_id,
    )
    status = result.get("status", "processing")
    if status == "awaiting_nurse_approval":
        return (
            "Thanks — I've logged your symptoms and a nurse will review them shortly. "
            "You'll receive a confirmation once your appointment is scheduled."
        )
    return f"Update: {status}"


demo = gr.ChatInterface(
    fn=chat_fn,
    title="MediCore AI — Patient Intake",
    description="Describe your symptoms and we'll help get you scheduled.",
    examples=[
        "I've had a sore throat and mild fever for two days.",
        "I need a refill on my blood pressure medication.",
    ],
)

if __name__ == "__main__":
    port = int(os.getenv("GRADIO_PATIENT_PORT", 7860))
    demo.launch(server_port=port)
