import secrets
import hashlib
from datetime import datetime, timezone, timedelta

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def hash_token(raw_token) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()

def get_expiry_time(days=7) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(days)

    sql_time = expires_at.strftime("%Y-%m-%d %H:%M:%S")
    return sql_time
