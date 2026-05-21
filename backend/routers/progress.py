from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.progress import ProgressOut, CompleteRequest, QuizSubmitRequest, QuizSubmitResponse
from dependencies import get_current_user
from models.user import User
import crud.progress as crud_progress
import crud.lessons as crud_lessons
import crud.users as crud_users
from constants import XP_PER_LESSON, XP_PER_QUIZ

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("", response_model=list[ProgressOut])
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await crud_progress.get_user_progress(db, current_user.id)


@router.post("/{lesson_id}", response_model=ProgressOut)
async def complete_lesson(
    lesson_id: int,
    body: CompleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = await crud_lessons.get_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    progress = await crud_progress.upsert_progress(
        db, current_user.id, lesson_id, body.score, body.attempts
    )
    await crud_users.update_streak_and_xp(db, current_user, XP_PER_LESSON)
    return progress


@router.post("/{lesson_id}/quiz", response_model=QuizSubmitResponse)
async def submit_quiz(
    lesson_id: int,
    body: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = await crud_lessons.get_quiz_question_by_id(db, body.question_id)
    if not question or question.lesson_id != lesson_id:
        raise HTTPException(status_code=404, detail="Question not found")

    correct = body.selected_index == question.correct_index

    if correct:
        await crud_users.add_xp(db, current_user, XP_PER_QUIZ)
    else:
        await crud_users.decrement_lives(db, current_user)

    await db.refresh(current_user)
    return QuizSubmitResponse(
        correct=correct,
        correct_index=question.correct_index,
        explanation_en=question.explanation_en,
        explanation_ro=question.explanation_ro,
        lives_remaining=current_user.lives,
        xp=current_user.xp,
    )
