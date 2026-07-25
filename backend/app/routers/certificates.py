from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import tempfile, os
from app.database import get_db
from app.models.certificate import Certificate
from app.models.admin import Admin
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse
from app.utils.auth import get_current_admin
from app.utils.cloudinary import upload_image, upload_file

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


@router.get("/", response_model=List[CertificateResponse])
def get_certificates(db: Session = Depends(get_db)):
    return db.query(Certificate).order_by(Certificate.issue_date.desc().nullslast()).all()


@router.get("/{cert_id}", response_model=CertificateResponse)
def get_certificate(cert_id: int, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.post("/", response_model=CertificateResponse, status_code=201)
def create_certificate(data: CertificateCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cert = Certificate(**data.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.put("/{cert_id}", response_model=CertificateResponse)
def update_certificate(cert_id: int, data: CertificateUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(cert, key, value)
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/{cert_id}")
def delete_certificate(cert_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(cert)
    db.commit()
    return {"message": "Certificate deleted successfully"}


@router.post("/{cert_id}/upload-image", response_model=CertificateResponse)
def upload_certificate_image(
    cert_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    image_url = upload_image(tmp_path, folder="portfolio/certificates")
    os.unlink(tmp_path)
    cert.image_url = image_url
    db.commit()
    db.refresh(cert)
    return cert


@router.post("/{cert_id}/upload-pdf", response_model=CertificateResponse)
def upload_certificate_pdf(
    cert_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    pdf_url = upload_file(tmp_path, folder="portfolio/certificates", resource_type="raw")
    os.unlink(tmp_path)
    cert.pdf_url = pdf_url
    db.commit()
    db.refresh(cert)
    return cert
