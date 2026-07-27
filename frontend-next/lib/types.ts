export interface JourneyStartRequest {
  patient_id: number;
  doctor_id: number;
  symptoms_text: string;
  thread_id: string;
}

export interface JourneyState {
  patient_id: number;
  doctor_id?: number;
  symptoms_text?: string;
  intake_id?: number;
  severity?: "low" | "medium" | "high" | "urgent";
  triage_rationale?: string;
  nurse_approved?: boolean;
  appointment_id?: number;
  slot_time?: string;
  visit_id?: number;
  claim_id?: number;
  claim_amount?: number;
  followup_sent?: boolean;
  status: string;
}

export interface PracticeMetrics {
  total_patients: number;
  appointments_last_30d: number;
  no_shows: number;
  claims_filed: number;
  total_claimed_amount: number;
}

export interface ChatMessage {
  id: string;
  role: "patient" | "assistant";
  text: string;
}

export interface TriageQueueItem {
  thread_id: string;
  patient_name: string;
  severity: JourneyState["severity"];
  rationale: string;
  submitted_at: string;
}
