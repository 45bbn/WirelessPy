from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError

ph = PasswordHasher(time_cost=4, memory_cost=65536, parallelism=4, hash_len=32, salt_len=16, encoding="utf-8")

def hash_password(user_password: str) -> str:
    return ph.hash(user_password)

def verify_password(password_hash: str, user_password: str) -> bool:
    try:
        ph.verify(password_hash, user_password)
        return True
    except (VerifyMismatchError, InvalidHashError):
        return False

def needs_rehash(password_hash: str) -> bool:
    return ph.check_needs_rehash(password_hash)
