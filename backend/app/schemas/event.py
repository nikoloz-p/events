from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class EventCreate(BaseModel):
    title: str
    city: str
    venue: str
    performers: str
    datetime: datetime
    description: Optional[str]
    image_url: Optional[str]


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True


class EventUpdate(BaseModel):
    title: Optional[str]
    city: Optional[str]
    venue: Optional[str]
    performers: Optional[str]
    datetime: Optional[datetime]
    description: Optional[str]
    image_url: Optional[str]