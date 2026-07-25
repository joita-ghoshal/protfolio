from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.admin import Admin
from app.utils.auth import hash_password
from app.middleware.security import security_headers_middleware
from app.routers import auth, about, skills, projects, certificates, education, experience, contact, analytics, settings as settings_router

app = FastAPI(title=settings.APP_NAME, version=settings.VERSION)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(security_headers_middleware)

app.include_router(auth.router)
app.include_router(about.router)
app.include_router(skills.router)
app.include_router(projects.router)
app.include_router(certificates.router)
app.include_router(education.router)
app.include_router(experience.router)
app.include_router(contact.router)
app.include_router(analytics.router)
app.include_router(settings_router.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    admin = db.query(Admin).first()
    if not admin:
        admin = Admin(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()
    db.close()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "version": settings.VERSION}
