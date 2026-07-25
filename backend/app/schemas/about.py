from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AboutBase(BaseModel):
    name: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    career_objective: Optional[str] = None
    location: Optional[str] = None


class AboutUpdate(AboutBase):
    pass


class AboutResponse(AboutBase):
    id: int
    profile_image: Optional[str] = None
    resume_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
