"""Embeds the knowledge base markdown files into a persistent Chroma vector store.

Run with: uv run python -m backend.rag.ingest
"""

from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings

from backend.config import settings

KB_DIR = Path(__file__).parent / "knowledge_base"
COLLECTION_NAME = "medicore_kb"


def ingest() -> None:
    docs = []
    for path in KB_DIR.glob("*.md"):
        loader = TextLoader(str(path))
        docs.extend(loader.load())

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings(api_key=settings.openai_api_key)

    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=settings.chroma_persist_dir,
    )
    print(f"Ingested {len(chunks)} chunks from {len(docs)} documents into '{COLLECTION_NAME}'.")


if __name__ == "__main__":
    ingest()
