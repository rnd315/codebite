from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.lesson import LessonSummary, LessonDetail, QuizQuestionOut
from dependencies import get_current_user
from models.user import User
import crud.lessons as crud_lessons

router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.get("", response_model=list[LessonSummary])
async def list_lessons(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await crud_lessons.get_all_ordered(db)


@router.get("/{slug}", response_model=LessonDetail)
async def get_lesson(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    lesson = await crud_lessons.get_by_slug(db, slug)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    questions = await crud_lessons.get_quiz_questions(db, lesson.id)
    return LessonDetail(
        **{c.name: getattr(lesson, c.name) for c in lesson.__table__.columns},
        quiz_questions=[QuizQuestionOut.model_validate(q) for q in questions],
    )
