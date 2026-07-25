from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectImageSchema(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    github_link: Optional[str] = None
    live_demo: Optional[str] = None
    technologies: Optional[str] = None
    featured: Optional[bool] = False
    status: Optional[str] = "published"
    order: Optional[int] = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    github_link: Optional[str] = None
    live_demo: Optional[str] = None
    technologies: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    order: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int
    thumbnail: Optional[str] = None
    images: List[ProjectImageSchema] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
