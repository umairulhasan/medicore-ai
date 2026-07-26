"""Thin HTTP client the Gradio apps use to talk to the FastAPI backend."""

import os

import httpx

BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")


def start_journey(patient_id: int, doctor_id: int, symptoms_text: str, thread_id: str) -> dict:
    resp = httpx.post(
        f"{BACKEND_BASE_URL}/chat/start",
        json={
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "symptoms_text": symptoms_text,
            "thread_id": thread_id,
        },
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def submit_nurse_decision(thread_id: str, approved: bool) -> dict:
    resp = httpx.post(
        f"{BACKEND_BASE_URL}/chat/nurse-decision",
        json={"thread_id": thread_id, "approved": approved},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def get_metrics() -> dict:
    resp = httpx.get(f"{BACKEND_BASE_URL}/admin/metrics", timeout=30)
    resp.raise_for_status()
    return resp.json()


def generate_report() -> dict:
    resp = httpx.post(f"{BACKEND_BASE_URL}/admin/generate-report", timeout=60)
    resp.raise_for_status()
    return resp.json()
