from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from backend.app.schemas.event import EventCreate, EventOut, EventUpdate
from backend.app.models.event import Event
from backend.app.deps import get_db, get_current_user

from uuid import uuid4
from pathlib import Path
from datetime import datetime as dt

from PIL import Image
import io

router = APIRouter(prefix="/api/events", tags=["Events"])

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


# img settings

MAX_IMAGE_SIZE = (1200, 1200)
JPEG_QUALITY = 80
MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post("/", response_model=EventOut)
async def create_event(
    title: str = Form(...),
    city: str = Form(...),
    venue: str = Form(...),
    performers: str = Form(...),
    datetime: str = Form(...),
    description: str = Form(None),

    image: UploadFile | None = File(None),

    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    image_url = None

    if image:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        contents = await image.read()

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

        filename = f"{uuid4()}.jpg"
        file_path = UPLOAD_DIR / filename

        try:
            img = Image.open(io.BytesIO(contents))
            img = img.convert("RGB")        
            img.thumbnail(MAX_IMAGE_SIZE)   

            img.save(
                file_path,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True
            )
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")

        image_url = f"/uploads/{filename}"

    db_event = Event(
        title=title,
        city=city,
        venue=venue,
        performers=performers,
        datetime=dt.fromisoformat(datetime),
        description=description,
        image_url=image_url,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    print("IMAGE RECEIVED:", image)

    return db_event



@router.get("/", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.datetime).all()


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=EventOut)
async def update_event(
    event_id: int,
    title: str | None = Form(None),
    city: str | None = Form(None),
    venue: str | None = Form(None),
    performers: str | None = Form(None),
    datetime: str | None = Form(None),
    description: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: None = Depends(get_current_user),
):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if image:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        contents = await image.read()

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

        filename = f"{uuid4()}.jpg"
        file_path = UPLOAD_DIR / filename

        try:
            img = Image.open(io.BytesIO(contents))
            img = img.convert("RGB")
            img.thumbnail(MAX_IMAGE_SIZE)

            img.save(
                file_path,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
            )
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")

        db_event.image_url = f"/uploads/{filename}"

    # update provided fields
    if title is not None:
        db_event.title = title
    if city is not None:
        db_event.city = city
    if venue is not None:
        db_event.venue = venue
    if performers is not None:
        db_event.performers = performers
    if datetime is not None:
        db_event.datetime = dt.fromisoformat(datetime)
    if description is not None:
        db_event.description = description

    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: None = Depends(get_current_user),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="ივენთი ვერ მოიძებნა")

    db.delete(event)
    db.commit()
    return {"detail": "ივენთი წაიშალა"}