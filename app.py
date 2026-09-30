import uvicorn
from pathlib import Path
from utils.server_utils import turn_off_adb, get_server_ip, is_debug
from database.db import init_db
from routes import module

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.web import router as web_router
from routes.api import router as api_router, router_logs
from routes.module import router as module_router
from modules.android.api import router as android_api
from utils import logger

app = FastAPI()

# Register routers
app.include_router(web_router)
app.include_router(api_router)
app.include_router(router_logs)
app.include_router(module_router)
app.include_router(android_api)
app.include_router(module.router)
app.include_router(logger.router)


# Static folder
BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

app.mount(
    "/modules",
    StaticFiles(directory=BASE_DIR / "modules"),
    name="modules"
)

# Run the web
if __name__ == "__main__":
    init_db()
    ip, port = get_server_ip()
    debug = is_debug()

    print(f"Running on http://{ip}:{port}")
    uvicorn.run(
        "app:app",
        host=ip,
        port=port,
        reload=debug
    )

    turn_off_adb()
    print("")