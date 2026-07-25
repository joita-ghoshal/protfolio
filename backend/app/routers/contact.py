from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contact import Contact
from app.models.admin import Admin
from app.schemas.contact import ContactUpdate, ContactResponse
from app.utils.auth import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.get("/", response_model=ContactResponse)
def get_contact(db: Session = Depends(get_db)):
    contact = db.query(Contact).first()
    if not contact:
        contact = Contact(email="", phone="")
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact


@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    data: ContactUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact
