from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EducationBase(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: Optional[bool] = False
    order: Optional[int] = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: Optional[bool] = None
    order: Optional[int] = None


class EducationResponse(EducationBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
