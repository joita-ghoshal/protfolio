from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.experience import Experience
from app.models.admin import Admin
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/experience", tags=["Experience"])


@router.get("/", response_model=List[ExperienceResponse])
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order, Experience.start_date.desc().nullslast()).all()


@router.post("/", response_model=ExperienceResponse, status_code=201)
def create_experience(data: ExperienceCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    exp = Experience(**data.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=ExperienceResponse)
def update_experience(exp_id: int, data: ExperienceUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(exp, key, value)
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{exp_id}")
def delete_experience(exp_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Experience deleted successfully"}
