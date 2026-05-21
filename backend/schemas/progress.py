from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProgressOut(BaseModel):
    lesson_id: int
    completed: bool
    score: int
    attempts: int
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class CompleteRequest(BaseModel):
    score: int = 0
    attempts: int = 1


class QuizSubmitRequest(BaseModel):
    question_id: int
    selected_index: int


class QuizSubmitResponse(BaseModel):
    correct: bool
    correct_index: int
    explanation_en: str
    explanation_ro: str
    lives_remaining: int
    xp: int
