from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    issuer = Column(String(200), nullable=True)
    image_url = Column(String(500), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    issue_date = Column(DateTime, nullable=True)
    credential_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
