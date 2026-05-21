from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.lesson import Lesson, QuizQuestion


async def get_all_ordered(db: AsyncSession) -> list[Lesson]:
    result = await db.execute(select(Lesson).order_by(Lesson.order_index))
    return list(result.scalars().all())


async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Lesson]:
    result = await db.execute(select(Lesson).where(Lesson.slug == slug))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, lesson_id: int) -> Optional[Lesson]:
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    return result.scalar_one_or_none()


async def get_quiz_questions(db: AsyncSession, lesson_id: int) -> list[QuizQuestion]:
    result = await db.execute(
        select(QuizQuestion).where(QuizQuestion.lesson_id == lesson_id)
    )
    return list(result.scalars().all())


async def get_quiz_question_by_id(db: AsyncSession, question_id: int) -> Optional[QuizQuestion]:
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == question_id))
    return result.scalar_one_or_none()
