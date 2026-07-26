"""Clinic admin dashboard — metrics view + report generation + nurse approval.

Run with: uv run python frontend/admin_dashboard.py
"""

import os

import gradio as gr

from frontend.shared.api_client import generate_report, get_metrics, submit_nurse_decision


def refresh_metrics():
    m = get_metrics()
    return (
        m["total_patients"],
        m["appointments_last_30d"],
        m["no_shows"],
        m["claims_filed"],
        f"${m['total_claimed_amount']:.2f}",
    )


def handle_report_generation():
    result = generate_report()
    return f"Report generated: {result['filepath']}"


def handle_nurse_decision(thread_id: str, approve: bool):
    result = submit_nurse_decision(thread_id, approve)
    return f"Journey status: {result.get('status')}"


with gr.Blocks(title="MediCore AI — Admin Dashboard") as demo:
    gr.Markdown("# MediCore AI — Admin Dashboard")

    with gr.Tab("Practice Metrics"):
        refresh_btn = gr.Button("Refresh Metrics")
        with gr.Row():
            total_patients = gr.Number(label="Total Patients")
            appts_30d = gr.Number(label="Appointments (30d)")
            no_shows = gr.Number(label="No-shows")
            claims_filed = gr.Number(label="Claims Filed")
            total_claimed = gr.Textbox(label="Total Claimed Amount")

        refresh_btn.click(
            fn=refresh_metrics,
            outputs=[total_patients, appts_30d, no_shows, claims_filed, total_claimed],
        )

        report_btn = gr.Button("Generate Monthly PPTX Report")
        report_output = gr.Textbox(label="Report status")
        report_btn.click(fn=handle_report_generation, outputs=report_output)

    with gr.Tab("Nurse Triage Approval"):
        gr.Markdown(
            "Paste the `thread_id` from a paused patient journey (returned by "
            "`/chat/start` when status is `awaiting_nurse_approval`) to approve "
            "or escalate it."
        )
        thread_id_input = gr.Textbox(label="Thread ID")
        with gr.Row():
            approve_btn = gr.Button("Approve")
            escalate_btn = gr.Button("Escalate")
        decision_output = gr.Textbox(label="Result")

        approve_btn.click(
            fn=lambda tid: handle_nurse_decision(tid, True),
            inputs=thread_id_input,
            outputs=decision_output,
        )
        escalate_btn.click(
            fn=lambda tid: handle_nurse_decision(tid, False),
            inputs=thread_id_input,
            outputs=decision_output,
        )

if __name__ == "__main__":
    port = int(os.getenv("GRADIO_ADMIN_PORT", 7861))
    demo.launch(server_port=port)
