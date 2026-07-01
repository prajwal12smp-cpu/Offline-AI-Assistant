from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="student")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, index=True)
    role = Column(String)
    content = Column(Text)
    subject = Column(String, default="science")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class UserStats(Base):
    __tablename__ = "user_stats"
    user_id = Column(String, primary_key=True, index=True)
    questions_asked = Column(Integer, default=0)
    quizzes_passed = Column(Integer, default=0)
    physics_points = Column(Integer, default=0)
    maths_points = Column(Integer, default=0)
    chemistry_points = Column(Integer, default=0)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    teacher_id = Column(String)
    subject = Column(String)
    question = Column(String)
    options = Column(Text)  # JSON string
    correct_answer = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
