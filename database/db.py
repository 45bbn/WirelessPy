import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INSTANCE_DIR = BASE_DIR / "instance"
DB_PATH = INSTANCE_DIR / "wirelesspy.db"



def get_db():
    INSTANCE_DIR.mkdir(parents=True, exist_ok=True)
    return sqlite3.connect(DB_PATH)

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

    db.commit()
    db.close()

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

import sqlite3

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




# print(update_device_name("3", "test"))
# print(update_device_status("1", "pending"))

# init_db()
# print(get_devices())
# db_delete_device("5")
# print(get_devices())


# add_device("Redmagic", "192.168.1.10", "online")
# print(get_devices())
# update_device_name(3, "Redmi")


