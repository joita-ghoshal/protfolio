from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Contact(Base):
    __tablename__ = "contact"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(300), nullable=True)
    linkedin = Column(String(500), nullable=True)
    github = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    twitter = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
