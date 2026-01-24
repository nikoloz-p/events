from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from backend.app.core.templates import BASE_DIR
from backend.app.routes import events, auth, pages


class CORSMiddlewareOverride(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)

        origin = request.headers.get("origin")

        allowed_origins = {
            "http://127.0.0.1:8000",
            "http://localhost:8000",
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://web-production-4a553.up.railway.app",
        }

        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Vary"] = "Origin"

        return response


app = FastAPI(title="Events API")

app.add_middleware(CORSMiddlewareOverride)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://web-production-4a553.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

app.include_router(events.router)
app.include_router(auth.router)
app.include_router(pages.router)