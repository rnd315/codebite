from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, UpdateProfileRequest, ChangePasswordRequest
from dependencies import get_current_user
from models.user import User
import crud.users as crud_users
from core.security import verify_password, create_access_token
from core.limiter import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
@limiter.limit("5/minute")
async def register(request: Request, body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    if await crud_users.get_by_email(db, body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await crud_users.get_by_username(db, body.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    user = await crud_users.create_user(db, body.username, body.email, body.password)
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await crud_users.get_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
@limiter.limit("60/minute")
async def me(request: Request, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = await crud_users.apply_token_regen(db, current_user)
    return user


@router.patch("/me", response_model=UserResponse)
@limiter.limit("30/minute")
async def update_me(
    request: Request,
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.username != current_user.username:
        existing = await crud_users.get_by_username(db, body.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
    user = await crud_users.update_username(db, current_user, body.username)
    return user


@router.patch("/me/password", status_code=204)
@limiter.limit("10/minute")
async def change_password(
    request: Request,
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Parola curentă este greșită.")
    await crud_users.update_password(db, current_user, body.new_password)


@router.post("/me/deduct-token", response_model=UserResponse)
@limiter.limit("30/minute")
async def deduct_token(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Called by file-based curriculum quiz on wrong answer to keep lives in sync."""
    user = await crud_users.decrement_lives(db, current_user)
    return user


@router.delete("/me", status_code=204)
@limiter.limit("3/minute")
async def delete_me(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await crud_users.delete_user(db, current_user)
