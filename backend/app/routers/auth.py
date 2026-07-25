from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse, PasswordChange
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_admin

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == request.username).first()
    if not admin or not verify_password(request.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": str(admin.id)})
    return TokenResponse(
        access_token=access_token,
        admin={"id": admin.id, "username": admin.username, "email": admin.email},
    )


@router.post("/change-password")
def change_password(
    data: PasswordChange,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, admin.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    admin.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/verify")
def verify_token(admin: Admin = Depends(get_current_admin)):
    return {"valid": True, "admin": {"id": admin.id, "username": admin.username, "email": admin.email}}
