from sqlalchemy import Column, Integer, String, DateTime
from backend.app.db.base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key = True, index=True)
    title = Column(String, nullable = False)
    city = Column(String, nullable=False)
    venue = Column(String, nullable=False)
    performers = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False)

