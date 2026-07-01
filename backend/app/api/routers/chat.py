from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import ollama
import time
from app.db.database import get_db, SessionLocal
from app.db.models import ChatHistory
from app.schemas.schemas import ChatRequest
from app.core.chroma import collection

router = APIRouter(tags=["chat"])

def log_chat(user_id: str, role: str, content: str):
    db = SessionLocal()
    try:
        chat_entry = ChatHistory(user_id=user_id, role=role, content=content)
        db.add(chat_entry)
        db.commit()
    finally:
        db.close()

@router.delete("/history/{user_id}")
def clear_chat_history(user_id: str, db: Session = Depends(get_db)):
    db.query(ChatHistory).filter(ChatHistory.user_id == user_id).delete()
    db.commit()
    return {"status": "success", "message": "History cleared"}

@router.get("/history/{user_id}")
def get_chat_history(user_id: str, db: Session = Depends(get_db)):
    rows = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.id.asc()).limit(50).all()
    return {"history": [{"role": row.role, "content": row.content, "timestamp": row.timestamp} for row in rows]}

@router.post("/chat")
def chat(request: ChatRequest, bg_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    student_query = request.message
    
    # 1. Semantic Search
    results = collection.query(
        query_texts=[student_query],
        n_results=2
    )
    
    context_text = ""
    if results['documents'] and len(results['documents'][0]) > 0:
        context_text = "\n\n".join(results['documents'][0])
        
    # 2. Build Prompt
    subject_map = {
        "science": "Science",
        "maths": "Mathematics",
        "sst": "Social Science",
        "english": "English",
        "general": "General"
    }
    current_subject = subject_map.get(request.subject, "General")
    
    if current_subject == "General":
        system_prompt = f"""You are a helpful, simple, and friendly Universal AI Assistant for Class 10 students.
Explain concepts as easily as possible.

You MUST reply entirely in the {request.language} language. Ensure all your explanations are in {request.language}.

Relevant study material excerpt:
{context_text}

Answer the student's question using the excerpt if relevant. Otherwise, use your own knowledge.
"""
    else:
        system_prompt = f"""You are a helpful, simple, and friendly {current_subject} Teacher for Class 10 students.
Explain {current_subject} concepts as easily as possible.

CRITICAL INSTRUCTION: You represent the {current_subject} subject ONLY. 
If the student asks a question clearly related to another core subject (like Science, Mathematics, Social Science, or English) and completely unrelated to {current_subject}, you MUST POLITELY DECLINE to answer.
Tell them something like: "I am your {current_subject} teacher! For questions about that topic, please navigate to the respective subject's chat." Do NOT provide the answer if it's out of your subject's scope. 

You MUST reply entirely in the {request.language} language. Ensure all your explanations are in {request.language}.

Relevant study material excerpt:
{context_text}

Answer the student's question using the excerpt if relevant. Otherwise, use your own knowledge. 
"""
    if request.generate_quiz:
        system_prompt += "\nAt the very end of your response, ask ONE multiple-choice question to test their understanding on what you just taught them."

    # 3. Request LLM
    try:
        print(f"--> Received question: '{student_query}'")
        print("--> Asking Ollama (phi3 - smaller, much faster). This might take a few seconds...")
        start_t = time.time()
        
        response = ollama.chat(model='phi3', messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': student_query}
        ])
        ai_msg = response['message']['content']
        
        elapsed = time.time() - start_t
        print(f"--> Ollama finished responding in {elapsed:.1f} seconds!")
        
        bg_tasks.add_task(log_chat, request.user_id, "user", student_query)
        bg_tasks.add_task(log_chat, request.user_id, "assistant", ai_msg)
        
        return {"response": ai_msg, "context_used": bool(context_text)}
        
    except Exception as e:
        return {"response": f"AI engine error: Is Ollama running? Error: {str(e)}"}
