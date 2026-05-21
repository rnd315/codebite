from datetime import datetime
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from models.progress import UserProgress


async def get_user_progress(db: AsyncSession, user_id: int) -> list[UserProgress]:
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == user_id)
    )
    return list(result.scalars().all())


async def get_lesson_progress(
    db: AsyncSession, user_id: int, lesson_id: int
) -> Optional[UserProgress]:
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.lesson_id == lesson_id,
        )
    )
    return result.scalar_one_or_none()


async def upsert_progress(
    db: AsyncSession, user_id: int, lesson_id: int, score: int, attempts: int
) -> UserProgress:
    existing = await get_lesson_progress(db, user_id, lesson_id)
    if existing:
        existing.completed = True
        existing.score = max(existing.score, score)
        existing.attempts += attempts
        existing.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing)
        return existing
    else:
        progress = UserProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            completed=True,
            score=score,
            attempts=attempts,
            completed_at=datetime.utcnow(),
        )
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
        return progress


async def count_completed(db: AsyncSession, user_id: int) -> int:
    result = await db.execute(
        select(func.count()).where(
            UserProgress.user_id == user_id,
            UserProgress.completed == True,
        )
    )
    return result.scalar_one()
