"""Retrieval helper — used by Triage and Billing agents for RAG lookups."""

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from backend.config import settings
from backend.rag.ingest import COLLECTION_NAME

_vectorstore: Chroma | None = None


def _get_vectorstore() -> Chroma:
    global _vectorstore
    if _vectorstore is None:
        embeddings = OpenAIEmbeddings(api_key=settings.openai_api_key)
        _vectorstore = Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings,
            persist_directory=settings.chroma_persist_dir,
        )
    return _vectorstore


def retrieve_context(query: str, k: int = 3) -> str:
    """Return the top-k relevant knowledge base chunks for a query, joined as text."""
    store = _get_vectorstore()
    results = store.similarity_search(query, k=k)
    if not results:
        return "No relevant policy/knowledge found."
    return "\n\n---\n\n".join(doc.page_content for doc in results)
