import chromadb
from app.core.config import settings

chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DATA_PATH)
collection = chroma_client.get_or_create_collection(
    name="ncert_study_material", 
    metadata={"hnsw:space": "cosine"}
)
