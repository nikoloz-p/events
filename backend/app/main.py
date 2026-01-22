from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import events

app = FastAPI(title="Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)