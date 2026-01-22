from backend.app.db.session import SessionLocal
from backend.app.models.user import User
from backend.app.core.security import hash_password


def run():
    db = SessionLocal()

    admins = [
        User(
            email="pichkhaianikoloz@gmail.com",
            role="admin",
            hashed_password=hash_password("CHANGE_THIS_PASSWORD_1")
        ),
        User(
            email="danelia.gocha.1998@gmail.com",
            role="admin",
            hashed_password=hash_password("CHANGE_THIS_PASSWORD_2")
        ),
    ]

    db.add_all(admins)
    db.commit()
    db.close()

    print("Admin users created successfully")


if __name__ == "__main__":
    run()