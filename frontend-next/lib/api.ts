/**
 * API client for the MediCore AI backend.
 *
 * Every function below currently returns mocked data so the UI is fully
 * usable standalone. To connect the real backend:
 *
 *   1. Set NEXT_PUBLIC_API_URL in .env.local (see .env.local.example)
 *   2. Replace the mock implementation in each function with the
 *      commented-out `fetch(...)` call already written below it.
 *
 * Every function's real endpoint matches a route already implemented in
 * backend/routers/chat.py and backend/routers/admin.py.
 */

import {
  AuthResponse,
  JourneyStartRequest,
  JourneyState,
  LoginRequest,
  PracticeMetrics,
  SignupRequest,
  TriageQueueItem,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function mockDelay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function startJourney(payload: JourneyStartRequest): Promise<JourneyState> {
  // --- Real backend call (uncomment once connected) ---
  // const res = await fetch(`${API_URL}/chat/start`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to start patient journey");
  // return res.json();

  return mockDelay<JourneyState>({
    patient_id: payload.patient_id,
    doctor_id: payload.doctor_id,
    symptoms_text: payload.symptoms_text,
    intake_id: 101,
    severity: "medium",
    triage_rationale:
      "Reported symptoms suggest a moderate-priority concern. Recommend a same-week appointment.",
    status: "awaiting_nurse_approval",
  });
}

export async function submitNurseDecision(
  threadId: string,
  approved: boolean
): Promise<JourneyState> {
  // --- Real backend call ---
  // const res = await fetch(`${API_URL}/chat/nurse-decision`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ thread_id: threadId, approved }),
  // });
  // if (!res.ok) throw new Error("Failed to submit nurse decision");
  // return res.json();

  return mockDelay<JourneyState>({
    patient_id: 1,
    status: approved ? "claim_filed" : "escalated_to_emergency_care",
    appointment_id: approved ? 88 : undefined,
    slot_time: approved ? new Date(Date.now() + 86400000 * 2).toISOString() : undefined,
  });
}

export async function getMetrics(): Promise<PracticeMetrics> {
  // --- Real backend call ---
  // const res = await fetch(`${API_URL}/admin/metrics`);
  // if (!res.ok) throw new Error("Failed to fetch metrics");
  // return res.json();

  return mockDelay<PracticeMetrics>({
    total_patients: 342,
    appointments_last_30d: 118,
    no_shows: 7,
    claims_filed: 94,
    total_claimed_amount: 28460.5,
  });
}

export async function generateReport(): Promise<{ filepath: string }> {
  // --- Real backend call ---
  // const res = await fetch(`${API_URL}/admin/generate-report`, { method: "POST" });
  // if (!res.ok) throw new Error("Failed to generate report");
  // return res.json();

  return mockDelay({ filepath: "./data/generated/admin_reports/admin_report_demo.pptx" }, 1200);
}

export async function getTriageQueue(): Promise<TriageQueueItem[]> {
  // No dedicated backend endpoint yet — add one (e.g. GET /admin/triage-queue)
  // that lists paused LangGraph threads awaiting nurse review, then swap
  // this mock for a fetch call the same way as above.

  return mockDelay<TriageQueueItem[]>([
    {
      thread_id: "a1b2c3",
      patient_name: "Jordan Rivera",
      severity: "medium",
      rationale: "Sore throat and mild fever for two days. No red-flag symptoms reported.",
      submitted_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      thread_id: "d4e5f6",
      patient_name: "Sam Okafor",
      severity: "high",
      rationale: "Persistent chest tightness after mild exertion. Recommend same-day review.",
      submitted_at: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    },
  ]);
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  // No dedicated backend endpoint yet — add one (e.g. POST /auth/login) that
  // verifies credentials and returns a session/JWT token, then uncomment:
  //
  // const res = await fetch(`${API_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Invalid email or password");
  // return res.json();

  return mockDelay<AuthResponse>({
    user_id: 1,
    full_name: "Jordan Rivera",
    email: payload.email,
    token: "mock-token-demo",
  });
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  // No dedicated backend endpoint yet — add one (e.g. POST /auth/signup)
  // that creates the user record and returns a session/JWT token, then:
  //
  // const res = await fetch(`${API_URL}/auth/signup`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Could not create account");
  // return res.json();

  return mockDelay<AuthResponse>({
    user_id: 2,
    full_name: payload.full_name,
    email: payload.email,
    token: "mock-token-demo",
  });
}
