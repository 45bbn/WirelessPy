from fastapi import APIRouter, WebSocket
from datetime import datetime

router = APIRouter(prefix="/api", tags=["logs"])

clients = set()


def save_log(text: str):
    with open("console.log", "a", encoding="utf-8") as f:
        f.write(text.rstrip() + "\n")

    return {"success": True}


def get_log():
    try:
        with open("console.log", "r", encoding="utf-8") as f:
            lines = f.readlines()

        return {
            "success": True,
            "log": "".join(lines)
        }

    except FileNotFoundError:
        return {
            "success": False,
            "log": ""
        }


def clear_log():
    with open("console.log", "w", encoding="utf-8") as f:
        pass

    return {"success": True}


async def broadcast_log(log):
    for websocket in clients.copy():
        try:
            await websocket.send_text(log)
        except Exception:
            clients.discard(websocket)


async def add_log(module, level, message):
    time = datetime.now().strftime("%H:%M:%S")
    log = f"[{time}] [{module}] [{level}] {message}"

    save_log(log)

    await broadcast_log(log)
    return log


@router.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)

    try:
        # await add_log("SYSTEM", "INFO", "Connected to logs websocket")
        while True:
            await websocket.receive_text()

    except Exception:
        clients.discard(websocket)