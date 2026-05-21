from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    username: str = Field(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator('username', 'email', mode='before')
    @classmethod
    def strip_str(cls, v):
        return v.strip() if isinstance(v, str) else v


class UpdateProfileRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    username: str = Field(min_length=3, max_length=30, pattern=r'^[a-zA-Z0-9_]+$')

    @field_validator('username', mode='before')
    @classmethod
    def strip_str(cls, v):
        return v.strip() if isinstance(v, str) else v


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator('email', mode='before')
    @classmethod
    def strip_str(cls, v):
        return v.strip() if isinstance(v, str) else v


class ChangePasswordRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    current_password: str
    new_password: str = Field(min_length=4, max_length=72)


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
