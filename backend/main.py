"""MediCore AI backend — FastAPI entrypoint.

Run with: uv run uvicorn backend.main:app --reload --port 8000
"""

from fastapi import FastAPI

from backend.database.session import init_db
from backend.routers import admin, chat

app = FastAPI(title="MediCore AI Backend", version="0.1.0")

app.include_router(chat.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}
