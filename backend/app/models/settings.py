from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    site_title = Column(String(200), default="Portfolio")
    site_logo = Column(String(500), nullable=True)
    favicon = Column(String(500), nullable=True)
    footer_text = Column(String(500), nullable=True)
    meta_description = Column(String(500), nullable=True)
    meta_keywords = Column(String(500), nullable=True)
    theme_color = Column(String(50), default="#1E3A8A")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
