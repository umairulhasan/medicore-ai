# MediCore AI

AI operations platform for small clinics, dental practices, and diagnostic centers.
See `docs/MediCore-AI-Project-Documentation.md` for full architecture, ERD, and diagrams.

## Project layout

```
medicore-ai/
├── pyproject.toml
├── .env.example
├── backend/                 # FastAPI app, agents, orchestrator, RAG, MCP, DB
│   ├── main.py               # FastAPI entrypoint
│   ├── config.py             # settings loader
│   ├── database/              # SQLAlchemy models + session + seed data
│   ├── mcp_server/             # MCP tool server (DB + file tools)
│   ├── tools/                  # plain tool functions used by agents
│   ├── agents/                  # one file per agent
│   ├── orchestrator/             # LangGraph state machine
│   ├── rag/                       # embeddings, retriever, knowledge base docs
│   ├── documents/                  # DOCX / PDF / PPTX generation
│   └── routers/                     # FastAPI route handlers
├── frontend/                # Gradio apps
│   ├── patient_app.py         # patient-facing chat widget
│   ├── admin_dashboard.py     # clinic admin dashboard
│   └── shared/api_client.py   # thin HTTP client to the backend
└── data/                    # sqlite DB + chroma vector store (created at runtime)
```

## Setup

```bash
# 1. Install dependencies
uv sync

# 2. Copy env template and fill in your keys
cp .env.example .env

# 3. Initialize the database (creates tables + seeds synthetic demo data)
uv run python -m backend.database.seed

# 4. Ingest the RAG knowledge base
uv run python -m backend.rag.ingest

# 5. Start the backend API
uv run uvicorn backend.main:app --reload --port 8000

# 6. In a separate terminal, start the patient chat frontend
uv run python frontend/patient_app.py

# 7. In another terminal, start the admin dashboard
uv run python frontend/admin_dashboard.py
```

## Notes

- All patient data in `seed.py` is synthetic — never load real patient information into this demo project.
- The MCP server (`backend/mcp_server/server.py`) can also be run standalone and connected to from any MCP-compatible client:
  ```bash
  uv run python -m backend.mcp_server.server
  ```
