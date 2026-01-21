from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.event import EventCreate, EventOut
from app.models.event import Event
from app.deps import get_db

router = APIRouter(prefix="/events", tags=["Events"])

@router.post('/', response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get('/', response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.datetime).all()