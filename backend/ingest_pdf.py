import os
import chromadb
from pypdf import PdfReader

# Initialize ChromaDB in persistence mode
CHROMA_DATA_PATH = "chroma_db_store"
client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)
collection_name = "ncert_study_material"

# Create or get the collection
collection = client.get_or_create_collection(
    name=collection_name,
    metadata={"hnsw:space": "cosine"} # cosine similarity for semantics
)

def chunk_text(text, chunk_size=1000, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start+chunk_size])
        start += chunk_size - overlap
    return chunks

def ingest_pdf(pdf_path):
    print(f"Reading {pdf_path}...")
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text
    
    # Chunking
    print("Chunking text...")
    chunks = chunk_text(full_text)
    
    # Ingesting into Vector DB
    docs = []
    ids = []
    metadatas = []
    
    base_name = os.path.basename(pdf_path)
    
    for i, chunk in enumerate(chunks):
        docs.append(chunk)
        ids.append(f"{base_name}_chunk_{i}")
        metadatas.append({"source": base_name, "chunk_index": i})
    
    print(f"Adding {len(docs)} chunks to ChromaDB...")
    collection.add(
        documents=docs,
        metadatas=metadatas,
        ids=ids
    )
    print(f"Completed ingestion for {base_name}.")

if __name__ == "__main__":
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    pdf_files = [f for f in os.listdir(data_dir) if f.endswith(".pdf")]
    
    if not pdf_files:
        print(f"No PDFs found in the '{data_dir}' folder. Please place some NCERT PDF files there.")
    else:
        for pdf in pdf_files:
            ingest_pdf(os.path.join(data_dir, pdf))
