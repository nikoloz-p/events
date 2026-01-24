from backend.app.db.session import SessionLocal
from backend.app.models.user import User
from backend.app.core.security import hash_password

db = SessionLocal()

users = [
    ("pichkhaianikoloz@gmail.com", "Nikasandro!123"),
    ("danelia.gocha.1998@gmail.com", "GochaD!123"),
]

for email, password in users:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"❌ User not found: {email}")
        continue

    user.hashed_password = hash_password(password)
    print(f"✅ Password updated for {email}")

db.commit()
db.close()