from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import tempfile, os
from app.database import get_db
from app.models.about import About
from app.models.admin import Admin
from app.schemas.about import AboutUpdate, AboutResponse
from app.utils.auth import get_current_admin
from app.utils.cloudinary import upload_image

router = APIRouter(prefix="/api/about", tags=["About"])


@router.get("/", response_model=List[AboutResponse])
def get_about(db: Session = Depends(get_db)):
    about = db.query(About).all()
    if not about:
        about = [About(name="Your Name", headline="Developer", bio="Welcome")]
        db.add(about[0])
        db.commit()
        db.refresh(about[0])
    return about


@router.get("/{about_id}", response_model=AboutResponse)
def get_about_item(about_id: int, db: Session = Depends(get_db)):
    about = db.query(About).filter(About.id == about_id).first()
    if not about:
        raise HTTPException(status_code=404, detail="About not found")
    return about


@router.put("/{about_id}", response_model=AboutResponse)
def update_about(
    about_id: int,
    data: AboutUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    about = db.query(About).filter(About.id == about_id).first()
    if not about:
        raise HTTPException(status_code=404, detail="About not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(about, key, value)
    db.commit()
    db.refresh(about)
    return about


@router.post("/{about_id}/upload-image", response_model=AboutResponse)
def upload_profile_image(
    about_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    about = db.query(About).filter(About.id == about_id).first()
    if not about:
        raise HTTPException(status_code=404, detail="About not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    image_url = upload_image(tmp_path, folder="portfolio/profile")
    os.unlink(tmp_path)
    about.profile_image = image_url
    db.commit()
    db.refresh(about)
    return about


@router.post("/{about_id}/upload-resume", response_model=AboutResponse)
def upload_resume(
    about_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    about = db.query(About).filter(About.id == about_id).first()
    if not about:
        raise HTTPException(status_code=404, detail="About not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    from app.utils.cloudinary import upload_file
    pdf_url = upload_file(tmp_path, folder="portfolio/resume", resource_type="raw")
    os.unlink(tmp_path)
    about.resume_url = pdf_url
    db.commit()
    db.refresh(about)
    return about
