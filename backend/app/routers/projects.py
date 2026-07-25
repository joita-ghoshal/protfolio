from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import tempfile, os, json
from app.database import get_db
from app.models.project import Project, ProjectImage
from app.models.admin import Admin
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.utils.auth import get_current_admin
from app.utils.cloudinary import upload_image

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("/", response_model=List[ProjectResponse])
def get_projects(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Project).order_by(Project.order, Project.created_at.desc())
    if status:
        query = query.filter(Project.status == status)
    return query.all()


@router.get("/featured", response_model=List[ProjectResponse])
def get_featured_projects(db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.featured == True, Project.status == "published").order_by(Project.order).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


@router.post("/{project_id}/upload-thumbnail", response_model=ProjectResponse)
def upload_thumbnail(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    image_url = upload_image(tmp_path, folder="portfolio/projects")
    os.unlink(tmp_path)
    project.thumbnail = image_url
    db.commit()
    db.refresh(project)
    return project


@router.post("/{project_id}/images", response_model=ProjectResponse)
def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    image_url = upload_image(tmp_path, folder="portfolio/projects")
    os.unlink(tmp_path)
    image = ProjectImage(project_id=project_id, image_url=image_url)
    db.add(image)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}/images/{image_id}")
def delete_project_image(
    project_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    image = db.query(ProjectImage).filter(ProjectImage.id == image_id, ProjectImage.project_id == project_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return {"message": "Image deleted successfully"}
