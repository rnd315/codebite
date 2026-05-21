"""initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String, unique=True, nullable=False),
        sa.Column("email", sa.String, unique=True, nullable=False),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("lives", sa.Integer, default=5, nullable=False, server_default="5"),
        sa.Column("streak", sa.Integer, default=0, nullable=False, server_default="0"),
        sa.Column("last_active", sa.Date, nullable=True),
        sa.Column("xp", sa.Integer, default=0, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "lessons",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String, unique=True, nullable=False),
        sa.Column("order_index", sa.Integer, nullable=False),
        sa.Column("title_en", sa.String, nullable=False),
        sa.Column("title_ro", sa.String, nullable=False),
        sa.Column("category", sa.String, nullable=False),
        sa.Column("difficulty", sa.Integer, nullable=False),
        sa.Column("content_en", sa.Text, nullable=False),
        sa.Column("content_ro", sa.Text, nullable=False),
        sa.Column("has_visualizer", sa.Boolean, default=False, server_default="0"),
    )

    op.create_table(
        "quiz_questions",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("lesson_id", sa.Integer, sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("question_en", sa.Text, nullable=False),
        sa.Column("question_ro", sa.Text, nullable=False),
        sa.Column("options_json", sa.Text, nullable=False),
        sa.Column("correct_index", sa.Integer, nullable=False),
        sa.Column("explanation_en", sa.Text, nullable=False),
        sa.Column("explanation_ro", sa.Text, nullable=False),
    )
    op.create_index("ix_quiz_questions_lesson_id", "quiz_questions", ["lesson_id"])

    op.create_table(
        "user_progress",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("lesson_id", sa.Integer, sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("completed", sa.Boolean, default=False, server_default="0"),
        sa.Column("score", sa.Integer, default=0, server_default="0"),
        sa.Column("attempts", sa.Integer, default=0, server_default="0"),
        sa.Column("completed_at", sa.DateTime, nullable=True),
        sa.UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson"),
    )
    op.create_index("ix_user_progress_user_id", "user_progress", ["user_id"])
    op.create_index("ix_user_progress_lesson_id", "user_progress", ["lesson_id"])

    op.create_table(
        "questions",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("lesson_id", sa.Integer, sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index("ix_questions_lesson_id", "questions", ["lesson_id"])

    op.create_table(
        "answers",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("question_id", sa.Integer, sa.ForeignKey("questions.id"), nullable=False),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("accepted", sa.Boolean, default=False, server_default="0"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index("ix_answers_question_id", "answers", ["question_id"])


def downgrade() -> None:
    op.drop_table("answers")
    op.drop_table("questions")
    op.drop_table("user_progress")
    op.drop_table("quiz_questions")
    op.drop_table("lessons")
    op.drop_table("users")
