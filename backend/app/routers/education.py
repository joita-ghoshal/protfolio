from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.education import Education
from app.models.admin import Admin
from app.schemas.education import EducationCreate, EducationUpdate, EducationResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/education", tags=["Education"])


@router.get("/", response_model=List[EducationResponse])
def get_education(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.order, Education.start_date.desc().nullslast()).all()


@router.post("/", response_model=EducationResponse, status_code=201)
def create_education(data: EducationCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    edu = Education(**data.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.put("/{edu_id}", response_model=EducationResponse)
def update_education(edu_id: int, data: EducationUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(edu, key, value)
    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/{edu_id}")
def delete_education(edu_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(edu)
    db.commit()
    return {"message": "Education deleted successfully"}
