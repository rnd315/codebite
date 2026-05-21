from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.community import Question, Answer
from models.user import User


async def get_questions(db: AsyncSession, lesson_id: Optional[int] = None) -> list[dict]:
    q = select(
        Question,
        User.username.label("author_username"),
        func.count(Answer.id).label("answer_count"),
    ).join(User, User.id == Question.user_id).outerjoin(
        Answer, Answer.question_id == Question.id
    ).group_by(Question.id)

    if lesson_id is not None:
        q = q.where(Question.lesson_id == lesson_id)

    q = q.order_by(Question.created_at.desc())
    result = await db.execute(q)
    rows = result.all()

    out = []
    for row in rows:
        q_obj = row[0]
        out.append({
            "id": q_obj.id,
            "user_id": q_obj.user_id,
            "lesson_id": q_obj.lesson_id,
            "body": q_obj.body,
            "created_at": q_obj.created_at,
            "author_username": row[1],
            "answer_count": row[2],
        })
    return out


async def create_question(db: AsyncSession, user_id: int, lesson_id: int, body: str) -> Question:
    q = Question(user_id=user_id, lesson_id=lesson_id, body=body)
    db.add(q)
    await db.commit()
    await db.refresh(q)
    return q


async def get_answers(db: AsyncSession, question_id: int) -> list[dict]:
    q = select(
        Answer,
        User.username.label("author_username"),
    ).join(User, User.id == Answer.user_id).where(
        Answer.question_id == question_id
    ).order_by(Answer.created_at.asc())

    result = await db.execute(q)
    rows = result.all()

    return [
        {
            "id": row[0].id,
            "question_id": row[0].question_id,
            "user_id": row[0].user_id,
            "body": row[0].body,
            "accepted": row[0].accepted,
            "created_at": row[0].created_at,
            "author_username": row[1],
        }
        for row in rows
    ]


async def create_answer(db: AsyncSession, question_id: int, user_id: int, body: str) -> Answer:
    a = Answer(question_id=question_id, user_id=user_id, body=body)
    db.add(a)
    await db.commit()
    await db.refresh(a)
    return a


async def get_answer_by_id(db: AsyncSession, answer_id: int) -> Optional[Answer]:
    result = await db.execute(select(Answer).where(Answer.id == answer_id))
    return result.scalar_one_or_none()


async def get_question_by_id(db: AsyncSession, question_id: int) -> Optional[Question]:
    result = await db.execute(select(Question).where(Question.id == question_id))
    return result.scalar_one_or_none()


async def accept_answer(db: AsyncSession, answer_id: int) -> Optional[Answer]:
    answer = await get_answer_by_id(db, answer_id)
    if not answer:
        return None
    answer.accepted = True
    await db.commit()
    await db.refresh(answer)
    return answer
