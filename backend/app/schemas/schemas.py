from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ChatRequest(BaseModel):
    message: str
    user_id: str = "guest_student"
    generate_quiz: bool = False
    subject: str = "science"
    language: str = "English"

class QuizCreate(BaseModel):
    subject: str
    question: str
    options: List[str]
    correct_answer: str

class QuizResponse(BaseModel):
    id: int
    teacher_id: str
    subject: str
    question: str
    options: List[str]
    correct_answer: Optional[str] = None

    class Config:
        from_attributes = True
