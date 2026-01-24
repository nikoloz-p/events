from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from backend.app.db.session import SessionLocal
from backend.app.models.event import Event
from backend.app.deps import get_current_user, get_current_user_optional, get_db

from backend.app.core.templates import templates

router = APIRouter()

# index page

@router.get("/")
def index_page(
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_optional),
):
    events = db.query(Event).order_by(Event.datetime).all()

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "events": events,
            "user": user,
        },
    )


# login page

@router.get("/auth/login")
def login_page(
    request: Request,
    user = Depends(get_current_user_optional),
):
    # If already logged in → go home
    if user:
        return RedirectResponse(url="/", status_code=302)

    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "user": None,
        },
    )

# create event page

@router.get("/events/create")
def create_event_page(
    request: Request,
    user = Depends(get_current_user),
):
    return templates.TemplateResponse(
        "create_event.html",
        {
            "request": request,
            "user": user,
        },
    )

# edit event page 

@router.get("/events/{event_id}/edit")
def edit_event_page(
    event_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404)

    return templates.TemplateResponse(
        "edit_event.html",
        {
            "request": request,
            "event": event,
            "user": user,
        },
    )