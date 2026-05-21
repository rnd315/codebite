from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    lives: int
    streak: int
    xp: int
    last_token_loss_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
