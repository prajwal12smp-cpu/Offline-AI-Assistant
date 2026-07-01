from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
import json
from app.db.database import get_db
from app.db.models import Quiz, User
from app.schemas.schemas import QuizCreate, QuizResponse
from app.core.security import get_current_teacher, get_current_user

router = APIRouter(tags=["quizzes"])

@router.post("/teacher/quizzes")
def create_quiz(quiz: QuizCreate, current_user: User = Depends(get_current_teacher), db: Session = Depends(get_db)):
    db_quiz = Quiz(
        teacher_id=current_user.id,
        subject=quiz.subject,
        question=quiz.question,
        options=json.dumps(quiz.options),
        correct_answer=quiz.correct_answer
    )
    db.add(db_quiz)
    db.commit()
    return {"status": "success", "message": "Quiz added"}

@router.get("/quizzes", response_model=List[QuizResponse])
def get_quizzes(subject: Optional[str] = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if subject:
        rows = db.query(Quiz).filter(Quiz.subject == subject).all()
    else:
        rows = db.query(Quiz).all()
        
    quizzes = []
    for r in rows:
        q = {
            "id": r.id,
            "teacher_id": r.teacher_id,
            "subject": r.subject,
            "question": r.question,
            "options": json.loads(r.options),
            "correct_answer": r.correct_answer if current_user.role == "teacher" else None
        }
        quizzes.append(q)
    return quizzes
