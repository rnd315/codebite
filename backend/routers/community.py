from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.community import QuestionCreate, QuestionOut, AnswerCreate, AnswerOut
from dependencies import get_current_user
from models.user import User
import crud.community as crud_community
import crud.users as crud_users
from constants import XP_PER_ACCEPTED, XP_PER_BOUNTY, MAX_LIVES
from core.limiter import limiter

router = APIRouter(prefix="/community", tags=["community"])


@router.post("/tokens/earn")
@limiter.limit("30/minute")
async def earn_token(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.lives >= MAX_LIVES:
        raise HTTPException(status_code=400, detail="TOKENS_FULL")
    updated = await crud_users.increment_lives(db, current_user)
    updated = await crud_users.add_xp(db, updated, XP_PER_BOUNTY)
    return {"lives": updated.lives, "xp": updated.xp}


@router.get("/questions", response_model=list[QuestionOut])
@limiter.limit("60/minute")
async def list_questions(
    request: Request,
    lesson_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = await crud_community.get_questions(db, lesson_id)
    return [QuestionOut(**r) for r in rows]


@router.post("/questions", response_model=QuestionOut, status_code=201)
@limiter.limit("20/minute")
async def ask_question(
    request: Request,
    body: QuestionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await crud_community.create_question(db, current_user.id, body.lesson_id, body.body)
    return QuestionOut(
        id=q.id,
        user_id=q.user_id,
        lesson_id=q.lesson_id,
        body=q.body,
        created_at=q.created_at,
        author_username=current_user.username,
        answer_count=0,
    )


@router.get("/questions/{question_id}/answers", response_model=list[AnswerOut])
@limiter.limit("60/minute")
async def list_answers(
    request: Request,
    question_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = await crud_community.get_answers(db, question_id)
    return [AnswerOut(**r) for r in rows]


@router.post("/answers/{question_id}", response_model=AnswerOut, status_code=201)
@limiter.limit("20/minute")
async def post_answer(
    request: Request,
    question_id: int,
    body: AnswerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = await crud_community.get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    a = await crud_community.create_answer(db, question_id, current_user.id, body.body)
    return AnswerOut(
        id=a.id,
        question_id=a.question_id,
        user_id=a.user_id,
        body=a.body,
        accepted=a.accepted,
        created_at=a.created_at,
        author_username=current_user.username,
    )


@router.patch("/answers/{answer_id}/accept", response_model=AnswerOut)
@limiter.limit("30/minute")
async def accept_answer(
    request: Request,
    answer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    answer = await crud_community.get_answer_by_id(db, answer_id)
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    question = await crud_community.get_question_by_id(db, answer.question_id)
    if question.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the question author can accept answers")

    if answer.accepted:
        raise HTTPException(status_code=400, detail="Answer already accepted")

    answer = await crud_community.accept_answer(db, answer_id)

    # Reward the answerer with +1 life and XP
    from crud.users import get_by_id
    answerer = await get_by_id(db, answer.user_id)
    if answerer:
        await crud_users.increment_lives(db, answerer)
        await crud_users.add_xp(db, answerer, XP_PER_ACCEPTED)

    return AnswerOut(
        id=answer.id,
        question_id=answer.question_id,
        user_id=answer.user_id,
        body=answer.body,
        accepted=answer.accepted,
        created_at=answer.created_at,
        author_username=answerer.username if answerer else "",
    )
