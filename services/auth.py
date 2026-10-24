import re
from datetime import datetime, timezone
from utils import security, session, logger
from database import db

DUMMY_HASH = security.hash_password("dummy-password") 
ALLOWED_ROLES = {"admin", "viewer"}
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128


USERNAME_RULES = [
    (re.compile(r".{3,32}", re.DOTALL), "Username must be 3-32 characters long"),
    (re.compile(r"[a-z0-9_.-]*"),       "Username may only contain lowercase letters (a-z), digits, dots, underscores, or hyphens"),
    (re.compile(r"[a-z0-9].*", re.DOTALL), "Username must start with a letter or a digit"),
]

PASSWORDS_LIST = ["12345678", "1234"] # add more later
PASSWORDS_RULES = [
    (re.compile(r".{8,128}", re.DOTALL), "Password must be 8-128 characters long"),
    # (re.compile(r".*[a-z].*", re.DOTALL), "Password must contain at least one lowercase letter (a-z)"),
    # (re.compile(r".*[A-Z].*", re.DOTALL), "Password must contain at least one uppercase letter (A-Z)"),
    # (re.compile(r".*[0-9].*", re.DOTALL), "Password must contain at least one digit (0-9)"),
    # (re.compile(r".*[^A-Za-z0-9].*", re.DOTALL), "Password must contain at least one special character (e.g. ! @ # $ % ^ & *)"),
    # (re.compile(r"\S*", re.DOTALL), "Password may not contain spaces or other whitespace"),
    # (re.compile(r"[\x21-\x7E]*", re.DOTALL), "Password may only contain printable ASCII characters"),
]


def check_username(username: str) -> str:
    if not isinstance(username, str):
        raise ValueError("Username must text")

    username = username.strip().lower()

    if not username:
        raise ValueError("Username cant be empty")

    for pattern, message in USERNAME_RULES:
        if not pattern.fullmatch(username):
            raise ValueError(message)

    return username


def check_password(username: str, password: str) -> str:
    if password in username:
        raise ValueError("Weak password: Dont make password same as username")

    if password in PASSWORDS_LIST:
        raise ValueError("Weak password: Password are too easy")

    for pattern, message in PASSWORDS_RULES:
        if not pattern.fullmatch(password):
            raise ValueError(message)
    
    return password


def register_user(username: str, password: str, role: str) -> bool:
    username = check_username(username)
    password = check_password(username, password)

    if role not in ALLOWED_ROLES:
        raise ValueError("Invalid Role")

    password_hash = security.hash_password(password)

    if not db.create_user(username, password_hash, role):
        raise ValueError("Username must be unique")

    return True

def login_user(username: str, password: str) -> dict | None:
    clean_username = username.strip().lower() 

    user = db.get_user_for_login(clean_username)

    if user is None:
        security.verify_password(password, DUMMY_HASH)
        return None

    user_id, username_db, password_hash = user
    if not security.verify_password(password, password_hash):
        return None

    if security.check_needs_rehash(password_hash):
        new_hash = security.hash_password(password)
        db.update_user_password(user_id, new_hash)

    raw_token = session.generate_token()
    token_hash_val = session.hash_token(raw_token)
    expires = session.get_expiry_time(days=7)
    
    db.create_session(token_hash_val, user_id, expires)

    return {
        "username": username_db,
        "token": raw_token
    }

def get_user_from_session(token: str):
    if not token:
        return None
        
    token_hash = session.hash_token(token)
    session_data = db.get_session(token_hash)
    
    if not session_data:
        return None
        
    expires_at_str = session_data["expires_at"] 
    
    expires_at = datetime.fromisoformat(expires_at_str)
    
    if datetime.now(timezone.utc).replace(tzinfo=None) > expires_at:
        db.delete_session(token_hash) 
        return None
    
    user_id = session_data["id"]
    return db.get_user_by_id(user_id)


def logout_user(raw_token: str) -> bool:
    if not raw_token:
        return False
        
    token_hash = session.hash_token(raw_token)
    
    deleted = db.delete_session(token_hash)
    return deleted

# print(register_user("45bbn", "1234567890", "admin"))
# print(login_user("45bbn", "1234"))