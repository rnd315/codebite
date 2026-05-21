from datetime import datetime
from sqlalchemy import Integer, Boolean, Text, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id: Mapped[int] = mapped_column(Integer, ForeignKey("lessons.id"), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    # Accepting gives the answerer +1 life — the core gamification hook
    accepted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


Index("ix_questions_lesson_id", Question.lesson_id)
Index("ix_answers_question_id", Answer.question_id)
