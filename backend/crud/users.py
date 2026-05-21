from datetime import date, datetime, timedelta, timezone
from typing import Optional
from sqlalchemy import select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from models.community import Answer, Question
from models.progress import UserProgress
from core.security import hash_password

MAX_LIVES = 5


async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, username: str, email: str, password: str) -> User:
    user = User(username=username, email=email, hashed_password=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def decrement_lives(db: AsyncSession, user: User) -> User:
    if user.lives > 0:
        user.lives -= 1
        user.last_token_loss_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(user)
    return user


async def apply_token_regen(db: AsyncSession, user: User) -> User:
    """Replenish tokens earned since last_token_loss_at (1 token per 4 hours)."""
    if user.lives >= MAX_LIVES or user.last_token_loss_at is None:
        return user
    now = datetime.now(timezone.utc)
    last = user.last_token_loss_at.replace(tzinfo=timezone.utc)
    tokens_earned = int((now - last).total_seconds() // (4 * 3600))
    if tokens_earned > 0:
        user.lives = min(user.lives + tokens_earned, MAX_LIVES)
        user.last_token_loss_at = last + timedelta(hours=4 * tokens_earned)
        await db.commit()
        await db.refresh(user)
    return user


async def increment_lives(db: AsyncSession, user: User) -> User:
    if user.lives < MAX_LIVES:
        user.lives += 1
        await db.commit()
        await db.refresh(user)
    return user


async def add_xp(db: AsyncSession, user: User, amount: int) -> User:
    user.xp += amount
    await db.commit()
    await db.refresh(user)
    return user


async def update_username(db: AsyncSession, user: User, username: str) -> User:
    user.username = username
    await db.commit()
    await db.refresh(user)
    return user


async def update_password(db: AsyncSession, user: User, new_password: str) -> None:
    user.hashed_password = hash_password(new_password)
    await db.commit()


async def delete_user(db: AsyncSession, user: User) -> None:
    # 1. Answers posted by this user
    await db.execute(sa_delete(Answer).where(Answer.user_id == user.id))
    # 2. Answers on this user's questions
    q_ids_result = await db.execute(select(Question.id).where(Question.user_id == user.id))
    q_ids = q_ids_result.scalars().all()
    if q_ids:
        await db.execute(sa_delete(Answer).where(Answer.question_id.in_(q_ids)))
    # 3. Questions
    await db.execute(sa_delete(Question).where(Question.user_id == user.id))
    # 4. Progress
    await db.execute(sa_delete(UserProgress).where(UserProgress.user_id == user.id))
    # 5. User record
    await db.delete(user)
    await db.commit()


async def update_streak_and_xp(db: AsyncSession, user: User, xp_gain: int) -> User:
    """Called on lesson completion. Updates streak based on last_active date."""
    today = date.today()
    if user.last_active is None:
        user.streak = 1
    elif user.last_active == today:
        pass  # already active today, streak unchanged
    elif (today - user.last_active).days == 1:
        user.streak += 1
    else:
        user.streak = 1  # missed a day — reset

    user.last_active = today
    user.xp += xp_gain
    await db.commit()
    await db.refresh(user)
    return user
