from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from backend.app.models.user import User
from backend.app.schemas.auth import LoginIn, LoginOut
from backend.app.core.security import verify_password
from backend.app.core.jwt import create_access_token
from backend.app.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginOut)
def login(
    data: LoginIn,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, str(user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
        }
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # make true in prod (HTTPS)
    )

    return {"access_token": token}  # optional, can remove later


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"detail": "logged out"}
