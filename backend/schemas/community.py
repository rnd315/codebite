from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict


class QuestionCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    lesson_id: int
    body: str = Field(min_length=10, max_length=1000)

    @field_validator('body', mode='before')
    @classmethod
    def strip_str(cls, v):
        return v.strip() if isinstance(v, str) else v


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
    model_config = ConfigDict(extra='forbid')

    body: str = Field(min_length=5, max_length=2000)

    @field_validator('body', mode='before')
    @classmethod
    def strip_str(cls, v):
        return v.strip() if isinstance(v, str) else v


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
