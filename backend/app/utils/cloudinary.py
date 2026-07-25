from typing import Optional
import cloudinary
import cloudinary.uploader
from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_image(file_path: str, folder: str = "portfolio", public_id: Optional[str] = None) -> str:
    result = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        public_id=public_id,
        resource_type="image",
    )
    return result.get("secure_url", "")


def upload_file(file_path: str, folder: str = "portfolio", resource_type: str = "raw") -> str:
    result = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        resource_type=resource_type,
    )
    return result.get("secure_url", "")


def delete_file(public_id: str) -> bool:
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"
