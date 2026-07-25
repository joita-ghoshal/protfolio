from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from app.database import get_db
from app.models.analytics import Visitor
from app.models.admin import Admin
from app.schemas.analytics import AnalyticsSummary, VisitorResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.post("/track")
def track_visitor(request: Request, db: Session = Depends(get_db)):
    visitor = Visitor(
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        page=request.headers.get("referer"),
        referrer=request.headers.get("referer"),
    )
    db.add(visitor)
    db.commit()
    return {"message": "Tracked"}


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = today_start.replace(day=1)

    total_visitors = db.query(func.count(func.distinct(Visitor.ip_address))).scalar() or 0
    total_views = db.query(func.count(Visitor.id)).scalar() or 0
    today_visitors = db.query(func.count(func.distinct(Visitor.ip_address))).filter(Visitor.visited_at >= today_start).scalar() or 0
    weekly_visitors = db.query(func.count(func.distinct(Visitor.ip_address))).filter(Visitor.visited_at >= week_start).scalar() or 0
    monthly_visitors = db.query(func.count(func.distinct(Visitor.ip_address))).filter(Visitor.visited_at >= month_start).scalar() or 0

    most_viewed = db.query(Visitor.page, func.count(Visitor.id).label("count")).group_by(Visitor.page).order_by(func.count(Visitor.id).desc()).first()
    most_viewed_page = most_viewed[0] if most_viewed else None

    recent = db.query(Visitor).order_by(Visitor.visited_at.desc()).limit(10).all()

    return AnalyticsSummary(
        total_visitors=total_visitors,
        total_views=total_views,
        today_visitors=today_visitors,
        weekly_visitors=weekly_visitors,
        monthly_visitors=monthly_visitors,
        most_viewed_page=most_viewed_page,
        recent_visitors=[VisitorResponse.model_validate(v) for v in recent],
    )
