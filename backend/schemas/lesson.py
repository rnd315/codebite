from pydantic import BaseModel
import json


class QuizQuestionOut(BaseModel):
    id: int
    lesson_id: int
    question_en: str
    question_ro: str
    options_json: str  # raw JSON string; frontend parses
    explanation_en: str
    explanation_ro: str
    # correct_index intentionally omitted from response — validated server-side

    class Config:
        from_attributes = True


class LessonSummary(BaseModel):
    id: int
    slug: str
    order_index: int
    title_en: str
    title_ro: str
    category: str
    macro: str
    difficulty: int
    has_visualizer: bool

    class Config:
        from_attributes = True


class LessonDetail(LessonSummary):
    content_en: str
    content_ro: str
    quiz_questions: list[QuizQuestionOut] = []
