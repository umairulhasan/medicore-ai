🔴 Must-have before touching ANY real patient data

1. HIPAA / compliance (non-negotiable for healthcare)

Business Associate Agreements (BAAs) with every vendor touching PHI — OpenAI/Anthropic API usage, hosting provider, SMS/email provider, database host
Encryption at rest (DB) and in transit (TLS everywhere, no exceptions)
Audit logging — who accessed which patient record, when, and why (you have agent_logs started; extend it to cover human staff access too)
Data retention & deletion policy (how long you keep records, how patients request deletion)
Signed patient consent for AI involvement in their care pathway
A designated compliance/privacy officer, even if that's just you wearing that hat formally

2. Real authentication & authorization

backend/routers/auth.py — doesn't exist yet. Needs password hashing (bcrypt/argon2), JWT or session tokens, refresh token flow
Role-based access control: patient vs. nurse vs. doctor vs. admin all need different permissions
Replace the localStorage mock token in AuthForm.tsx with real session handling (httpOnly cookies, not localStorage, for security)
Multi-factor authentication for staff accounts at minimum

3. Database production readiness

Migrate SQLite → PostgreSQL (SQLite doesn't handle concurrent writes well in production)
Add Alembic for schema migrations (right now init_db() just does create_all — no migration history)
Automated backups + tested restore procedure
Connection pooling (SQLAlchemy + pgbouncer or similar)
🟠 Must-have before selling to a real clinic

4. Real third-party integrations

SMS/email provider (Twilio, SendGrid) — send_reminder() is currently a no-op stub
Real calendar sync (Google Calendar / Outlook API) instead of the simplified slot-checking logic
Insurance clearinghouse API (e.g., Availity, Change Healthcare) instead of hardcoded coverage rules in markdown files
Voice/TTS/STT provider properly wired (currently referenced conceptually, not implemented)

5. Agent reliability & guardrails

Structured output validation on every agent response (swap plain LLM text parsing for Pydantic AI schemas — the Triage Agent's severity parsing is currently a naive string match, which is fragile)
Retry logic + timeout handling for every LLM/tool call
Cost monitoring and rate limiting per clinic (LLM API costs can spiral fast at scale)
Prompt injection defenses — a patient could try to manipulate the Intake Agent
Fallback behavior when an LLM call fails (never silently drop a patient mid-journey)
Evaluation suite — a set of test cases checking the Triage Agent classifies severity correctly, not just "runs without crashing"

6. Multi-tenancy

Right now the whole schema assumes one clinic. You need a clinic_id on every table, tenant isolation at the query layer, and per-clinic config (branding, business hours, doctors)
This is a significant schema change — better to do it now than retrofit later

7. SaaS billing infrastructure

Stripe (or similar) integration for the 3-tier subscription pricing from your docs
Usage metering if you want to cap API calls per tier
Self-serve signup → payment → provisioning flow
🟡 Should-have for a trustworthy launch

8. Testing

Backend: unit tests for tools/clinic_tools.py, integration tests for the LangGraph orchestrator (including the interrupt/resume flow), API tests for every router
Frontend: component tests, at least one end-to-end test per critical flow (patient submits symptoms → nurse approves → appointment booked)

9. Observability

Error tracking (Sentry or similar) — right now failures are silent
Structured logging across backend, agents, and MCP server
LLM call tracing (LangSmith, or your own logging) so you can debug why an agent made a specific decision — critical for both debugging and liability
Uptime monitoring + alerting

10. DevOps/infrastructure

Containerize both backend and frontend (Dockerfiles — none exist yet)
CI/CD pipeline (GitHub Actions: run tests, lint, build on every PR)
Separate dev/staging/production environments with separate .env configs
Real deployment target (Railway, Render, Fly.io, or AWS/GCP if you want more control) — not uvicorn --reload on a laptop
Custom domain + SSL certificate
CDN for the Next.js static assets

11. Frontend production cleanup

Delete /gradio-test entirely before shipping (you already know this)
Wire every mock function in lib/api.ts to the real backend
Add proper error boundaries and loading skeletons everywhere, not just spinners
Accessibility audit (screen reader testing, not just keyboard focus states)
SEO basics for the landing page (Open Graph tags, sitemap, robots.txt)
🟢 Nice-to-have once you have real customers
Admin/superadmin panel for you to manage multiple clinic tenants
Onboarding wizard for new clinics (upload their doctor list, set business hours, customize branding)
Native mobile app or PWA for patients
Analytics dashboard for you (not the clinic) — MRR, churn, usage patterns across tenants
A proper marketing site separate from the app (blog, case studies, docs)