import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils import security, session, logger
from database.db import create_user, change_user_password, create_session, get_session, delete_session, delete_expired_sessions

def register_user(username: str, password: str):
    password_hash = security.hash_password(password)
    return password_hash

def login_user(username: str, user_password: str, password_hash: str):
    result = security.verify_password(user_password, password_hash)
    return result

print(register_user("45bbn", "1234"))
print(login_user("45bbn", "1234", "$argon2id$v=19$m=65536,t=4,p=4$3IGr+QGZaqZOF5pzXPr40g$ddcetR3mva1aHuHMb81cTCSGrd1s7OnBYM3u/C+nwrE"))