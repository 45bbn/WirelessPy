import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from database.db import init_db
from modules.android.api import router as android_api
from routes.api import router as api_router, router_logs
from routes.module import router as module_router
from routes.web import router as web_router
from services.device import init_devices
from utils import logger
from utils.server_utils import get_server_ip, init_adb, is_debug, kill_adb

BASE_DIR = Path(__file__).resolve().parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(init_devices())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)

# Register routers
app.include_router(web_router)
app.include_router(api_router)
app.include_router(router_logs)
app.include_router(module_router)
app.include_router(android_api)
app.include_router(logger.router)

# Static folder
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.mount("/modules", StaticFiles(directory=BASE_DIR / "modules"), name="modules")


if __name__ == "__main__":
    init_db()
    ip, port = get_server_ip()
    debug = is_debug()
    init_adb()

    print(f"Running on http://{ip}:{port}")
    try:
        uvicorn.run("app:app", host=ip, port=port, reload=debug)
    finally:
        kill_adb()
        print("Server stopped")
