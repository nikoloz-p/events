from fastapi.templating import Jinja2Templates
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)

