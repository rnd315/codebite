from datetime import datetime
from pydantic import BaseModel


class QuestionCreate(BaseModel):
    lesson_id: int
    body: str


class QuestionOut(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    body: str
    created_at: datetime
    author_username: str = ""
    answer_count: int = 0

    class Config:
        from_attributes = True


class AnswerCreate(BaseModel):
    body: str


class AnswerOut(BaseModel):
    id: int
    question_id: int
    user_id: int
    body: str
    accepted: bool
    created_at: datetime
    author_username: str = ""

    class Config:
        from_attributes = True
