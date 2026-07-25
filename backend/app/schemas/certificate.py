from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class CertificateBase(BaseModel):
    title: str
    issuer: Optional[str] = None
    issue_date: Optional[date] = None
    credential_url: Optional[str] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    issue_date: Optional[date] = None
    credential_url: Optional[str] = None


class CertificateResponse(CertificateBase):
    id: int
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
