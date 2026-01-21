from pydantic import BaseModel
from datetime import datetime

class EventCreate(BaseModel):
    title: str
    city: str
    venue: str
    performers: str
    datetime: datetime


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True
