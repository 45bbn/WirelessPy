import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils import security, session, logger
from database import db

def register_user(username: str, password: str, role: str):
    password_hash = security.hash_password(password)
    db.create_user(username, password_hash, role)

    return password_hash

DUMMY_HASH = security.hash_password("dummy-password")  

def login_user(username: str, password: str) -> str | None:
    username = username.strip().lower()

    if not username or not password or len(password) > 128:
        return None

    user = db.get_user_for_login(username)

    if user is None:
        security.verify_password(password, DUMMY_HASH)
        return None

    user_id, password_hash = user

    if not security.verify_password(password, password_hash):
        return None

    return user_id

# print(register_user("45bbn", "1234", "admin"))
print(login_user("Test", "1234"))