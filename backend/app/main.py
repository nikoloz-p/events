from fastapi import FastAPI
from app.routes import events

app = FastAPI(title = "Events API")

app.include_router(events.router)