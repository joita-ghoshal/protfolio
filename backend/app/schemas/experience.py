from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExperienceBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: Optional[bool] = False
    type: Optional[str] = "work"
    order: Optional[int] = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: Optional[bool] = None
    type: Optional[str] = None
    order: Optional[int] = None


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
