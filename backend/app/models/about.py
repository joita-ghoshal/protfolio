from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class About(Base):
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    headline = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    career_objective = Column(Text, nullable=True)
    profile_image = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    location = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
