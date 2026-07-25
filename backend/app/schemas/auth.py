from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: dict


class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
