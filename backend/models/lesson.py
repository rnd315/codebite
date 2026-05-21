from sqlalchemy import Integer, String, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    title_en: Mapped[str] = mapped_column(String, nullable=False)
    title_ro: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    macro: Mapped[str] = mapped_column(String, nullable=False, default="")
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)  # 1=easy 2=medium 3=hard
    content_en: Mapped[str] = mapped_column(Text, nullable=False)
    content_ro: Mapped[str] = mapped_column(Text, nullable=False)
    has_visualizer: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(Integer, ForeignKey("lessons.id"), nullable=False)
    question_en: Mapped[str] = mapped_column(Text, nullable=False)
    question_ro: Mapped[str] = mapped_column(Text, nullable=False)
    # JSON array of {en, ro} objects; correct_index is zero-based
    options_json: Mapped[str] = mapped_column(Text, nullable=False)
    correct_index: Mapped[int] = mapped_column(Integer, nullable=False)
    explanation_en: Mapped[str] = mapped_column(Text, nullable=False)
    explanation_ro: Mapped[str] = mapped_column(Text, nullable=False)


Index("ix_quiz_questions_lesson_id", QuizQuestion.lesson_id)
