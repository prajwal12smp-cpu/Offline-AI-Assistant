import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routers import auth, chat, materials, quizzes
from app.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Offline AI Classroom API", description="Professionalized API", version="1.0.0")

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data dir and serve static files for download/view
os.makedirs("data", exist_ok=True)
app.mount("/files", StaticFiles(directory="data"), name="files")

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(materials.router)
app.include_router(quizzes.router)

@app.get("/")
def read_root():
    return {"status": "Backend and RAG Engine running (Professional Mode)"}
