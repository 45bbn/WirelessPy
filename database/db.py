import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INSTANCE_DIR = BASE_DIR / "instance"
DB_PATH = INSTANCE_DIR / "wirelesspy.db"



def get_db():
    INSTANCE_DIR.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH, timeout=10)
    db.execute("PRAGMA foreign_keys = ON;")
    return db

def init_db():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ip TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token_hash TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    
    db.commit()
    db.close()

# ------------------- DEVICES ------------------- #
def add_device(name, ip, status):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO devices (name, ip, status)
        VALUES (?, ?, ?)
    """, (name, ip, status))

    db.commit()
    db.close()

def remove_device(device_id: str) -> tuple[bool, str]:
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("DELETE FROM devices WHERE id = ?", (device_id,))
        db.commit()

        if cursor.rowcount == 0:
            return False, f"No device found with id:{device_id}"

        return True, "Device removed"

    except Exception as e:
        return False, str(e)

    finally:
        db.close()

def get_all_devices() -> tuple[bool, list[tuple] | Exception]:
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("SELECT * FROM devices")
        devices = cursor.fetchall()
        return True, devices
    except Exception as e:
        return False, e
    
    finally:
        db.close()

def get_device(device_id) -> tuple[bool, list[dict] | Exception]:
    db = get_db()
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    try:
        cursor.execute("SELECT * FROM devices WHERE id = ?", (device_id,))
        devices = [dict(row) for row in cursor.fetchall()]
        return True, devices

    except Exception as e:
        return False, e

    finally:
        db.close()

def update_device_name(device_id: str, new_name: str) -> tuple[bool, str]:
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "UPDATE devices SET name = ? WHERE id = ?",
            (new_name, device_id)
        )
        db.commit()

        if cursor.rowcount == 0:
            return False, f"No device found with id:{device_id}"

        return True, "Device name updated"

    except Exception as e:
        return False, str(e)

    finally:
        db.close()

def update_device_status(device_id, status):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE devices
        SET status = ?
        WHERE id = ?
    """, (status, device_id))

    db.commit()
    db.close()


# ------------------- USERS ------------------- #
def create_user(username: str, password_hash: str, role: str) -> bool:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            (username, password_hash, role),
        )
        db.commit()
        return True
    except sqlite3.IntegrityError:
        db.rollback()
        return False
    finally:
        db.close()

def change_user_password(username: str, password_hash: str) -> bool:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (password_hash, username),
        )
        db.commit()
        return cursor.rowcount > 0
    finally:
        db.close()


# ------------------- SESSIONS ------------------- #
def create_session(token_hash: str, user_id: int, expires_at: str, ip_address: str | None = None, user_agent: str | None = None) -> bool:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO sessions (token_hash, user_id, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
            (token_hash, user_id, expires_at, ip_address, user_agent),
        )
        db.commit()
        return True
    except sqlite3.IntegrityError:
        db.rollback()
        return False
    finally:
        db.close()

def delete_session(token_hash: str) -> bool:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "DELETE FROM sessions WHERE token_hash = ?",
            (token_hash,),
        )
        db.commit()
        return cursor.rowcount > 0
    finally:
        db.close()

def delete_expired_sessions() -> int:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP")
        db.commit()
        return cursor.rowcount
    finally:
        db.close()

def get_session(token_hash: str) -> dict | None:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            """
            SELECT u.id, u.username, u.role, s.expires_at
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token_hash = ?
            """,
            (token_hash,),
        )
        row = cursor.fetchone()

        if row is None:
            return None  # invalid token
        
        user_id, username, role, expires_at = row
        return {"id": user_id, "username": username, "role": role, "expires_at": expires_at}
    finally:
        db.close()



# create_user("45bbn", "test", "admin")
# print(change_user_password("45bbn", hash_password("45bbn")))
# print(delete_session("828f6e14e2591c5d6dbc5fff9c23e3b56e4cc5d5eb7ad63e68eac927edea2f0d"))