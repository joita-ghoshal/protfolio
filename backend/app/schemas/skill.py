from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SkillBase(BaseModel):
    name: str
    percentage: Optional[int] = None
    category: str
    icon: Optional[str] = None
    order: Optional[int] = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    percentage: Optional[int] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None


class SkillResponse(SkillBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
