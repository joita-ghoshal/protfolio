from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class VisitorResponse(BaseModel):
    id: int
    ip_address: Optional[str] = None
    page: Optional[str] = None
    referrer: Optional[str] = None
    visited_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    total_visitors: int
    total_views: int
    today_visitors: int
    weekly_visitors: int
    monthly_visitors: int
    most_viewed_page: Optional[str] = None
    recent_visitors: List[VisitorResponse] = []
