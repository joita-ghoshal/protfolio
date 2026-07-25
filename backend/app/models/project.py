from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    github_link = Column(String(500), nullable=True)
    live_demo = Column(String(500), nullable=True)
    technologies = Column(Text, nullable=True)
    featured = Column(Boolean, default=False)
    status = Column(String(20), default="published")
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")


class ProjectImage(Base):
    __tablename__ = "project_images"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="images")
