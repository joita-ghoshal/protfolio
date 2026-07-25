from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    page = Column(String(200), nullable=True)
    referrer = Column(String(500), nullable=True)
    visited_at = Column(DateTime(timezone=True), server_default=func.now())
