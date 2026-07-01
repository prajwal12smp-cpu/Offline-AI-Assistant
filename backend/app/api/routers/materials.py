from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pypdf import PdfReader
import os
from app.db.database import get_db
from app.db.models import User
from app.core.security import get_current_teacher
from app.core.chroma import collection

router = APIRouter(tags=["materials"])

def chunk_text(text, chunk_size=1000, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start+chunk_size])
        start += chunk_size - overlap
    return chunks

@router.post("/upload")
def upload_pdf(file: UploadFile = File(...), category: str = Form("teacher_upload"), current_user: User = Depends(get_current_teacher)):
    data_dir = "data"
    category_dir = os.path.join(data_dir, category)
    os.makedirs(category_dir, exist_ok=True)
    file_path = os.path.join(category_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    # Extract text and chunk
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text
            
    chunks = chunk_text(full_text)
    
    docs = []
    ids = []
    metadatas = []
    base_name = file.filename
    
    for i, chunk in enumerate(chunks):
        docs.append(chunk)
        ids.append(f"{base_name}_chunk_{i}")
        metadatas.append({"source": base_name, "chunk_index": i})
        
    collection.add(
        documents=docs,
        metadatas=metadatas,
        ids=ids
    )
    
    return {"filename": file.filename, "message": f"Successfully ingested {len(docs)} chunks."}

@router.get("/materials")
def list_materials():
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    materials = []
    
    categories = ["ncert", "past_papers", "teacher_upload", "uncategorized"]
    for cat in categories:
        cat_dir = os.path.join(data_dir, cat)
        if not os.path.exists(cat_dir):
            if cat == "uncategorized":
                cat_dir = data_dir
            else:
                continue
                
        for f in os.listdir(cat_dir):
            file_path = os.path.join(cat_dir, f)
            if os.path.isfile(file_path) and f.endswith(".pdf"):
                size_mb = os.path.getsize(file_path) / (1024 * 1024)
                rel_path = f if cat == "uncategorized" and cat_dir == data_dir else f"{cat}/{f}"
                materials.append({
                    "title": f,
                    "path": rel_path,
                    "category": cat if cat != "uncategorized" else "teacher_upload",
                    "type": "PDF",
                    "size": f"{size_mb:.1f} MB",
                    "date": "Local"
                })
    return materials
