from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settings import SiteSetting
from app.models.admin import Admin
from app.schemas.settings import SiteSettingUpdate, SiteSettingResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("/", response_model=SiteSettingResponse)
def get_settings(db: Session = Depends(get_db)):
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting(site_title="Portfolio")
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


@router.put("/{setting_id}", response_model=SiteSettingResponse)
def update_settings(
    setting_id: int,
    data: SiteSettingUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Settings not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(setting, key, value)
    db.commit()
    db.refresh(setting)
    return setting
