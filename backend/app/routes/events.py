from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.schemas.event import EventCreate, EventOut
from backend.app.models.event import Event
from backend.app.deps import get_db

# events routes

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

@router.delete('/{event_id}')
def delete_event(event_id: int,db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event:
        db.delete(event)
        db.commit()
        return {"detail": "ივენთი წაიშალა"}
    raise  HTTPException(status_code=404, detail="ივენთი ვერ მოიძებნა")

# auth routes

router = APIRouter(prefix="/auth", tags=["Auth"])

# auth logic...