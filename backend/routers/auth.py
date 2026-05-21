from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from dependencies import get_current_user
from models.user import User
import crud.users as crud_users
from core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    if await crud_users.get_by_email(db, body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await crud_users.get_by_username(db, body.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    user = await crud_users.create_user(db, body.username, body.email, body.password)
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await crud_users.get_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = await crud_users.apply_token_regen(db, current_user)
    return user
