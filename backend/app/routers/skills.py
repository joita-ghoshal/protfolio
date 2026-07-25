from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.skill import Skill
from app.models.admin import Admin
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/skills", tags=["Skills"])


@router.get("/", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.order, Skill.name).all()


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    categories = {}
    for skill in skills:
        cat = skill.category or "Other"
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(SkillResponse.model_validate(skill))
    return categories


@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill(data: SkillCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    skill = Skill(**data.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, data: SkillUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(skill, key, value)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully"}
