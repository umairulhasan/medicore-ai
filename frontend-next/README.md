# MediCore AI — Next.js Frontend

A complete, standalone UI for MediCore AI: a marketing landing page, a
patient intake chat portal, and a clinic admin dashboard with a
human-in-the-loop nurse approval queue.

Currently runs entirely on **mocked data** (`lib/api.ts`) so you can preview
and iterate on the UI before the backend is wired up.

## Pages

- `/` — landing page (hero with animated journey visualization, agent
  breakdown, pricing)
- `/login` — sign-in page
- `/signup` — account creation page
- `/patient` — patient-facing intake chat
- `/admin` — practice metrics, PPTX report generation, nurse triage
  approval queue
- `/gradio-test` — **testing only.** Embeds the existing Python/Gradio
  frontend via iframe so you can compare it against the Next.js UI while
  both exist. Delete this route before shipping to production. Requires
  the Gradio apps to be running locally:
  ```bash
  uv run python frontend/patient_app.py       # http://localhost:7860
  uv run python frontend/admin_dashboard.py    # http://localhost:7861
  ```

## Setup

```bash
cd frontend-next
npm install
cp .env.local.example .env.local
npm run dev
```

Visit `http://localhost:3000`.

## Connecting the real backend

Every function in `lib/api.ts` has the real `fetch(...)` call written out
in a comment directly below its mock implementation, targeting the routes
already built in `backend/routers/chat.py` and `backend/routers/admin.py`.
To connect:

1. Start the FastAPI backend (`uv run uvicorn backend.main:app --reload`)
2. Set `NEXT_PUBLIC_API_URL` in `.env.local` to point at it
3. In `lib/api.ts`, uncomment each real `fetch` block and remove the
   corresponding `mockDelay(...)` line

One gap to note: `getTriageQueue()` has no backend endpoint yet — you'll
need to add one (e.g. `GET /admin/triage-queue`) that lists paused
LangGraph threads by querying the SQLite checkpointer, since the current
backend only exposes a single-thread `/chat/nurse-decision` endpoint.

Same goes for `login()` and `signup()` in `lib/api.ts` — there's no
`backend/routers/auth.py` yet. Add one with proper password hashing and
session/JWT issuance before treating the demo `localStorage` token in
`components/auth/AuthForm.tsx` as real authentication.

## Design system

- **Colors:** clinical green (primary), clay coral (CTA/urgent), mint
  (accent), warm paper background — defined in `tailwind.config.ts`
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (data/labels)
- **Signature element:** `components/landing/JourneyVisual.tsx` — an
  animated vitals-line SVG that traces the actual 5-agent LangGraph state
  machine, not a generic decorative wave
