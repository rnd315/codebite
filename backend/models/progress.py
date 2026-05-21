from datetime import datetime
from sqlalchemy import Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson"),
        Index("ix_user_progress_user_id", "user_id"),
        Index("ix_user_progress_lesson_id", "lesson_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id: Mapped[int] = mapped_column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
