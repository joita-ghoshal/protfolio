from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SiteSettingUpdate(BaseModel):
    site_title: Optional[str] = None
    site_logo: Optional[str] = None
    favicon: Optional[str] = None
    footer_text: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    theme_color: Optional[str] = None


class SiteSettingResponse(BaseModel):
    id: int
    site_title: Optional[str] = None
    site_logo: Optional[str] = None
    favicon: Optional[str] = None
    footer_text: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    theme_color: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
