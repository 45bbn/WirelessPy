from fastapi import APIRouter, Depends
from pydantic import BaseModel

import services.device as device
from routes.auth import get_current_user
from utils import logger
from utils.server_utils import get_server_uptime

router = APIRouter(prefix="/api/devices", tags=["devices"])
router_system = APIRouter(prefix="/api/system", tags=["system"])
router_logs = APIRouter(prefix="/api/logs", tags=["logs"])


class ConnectRequest(BaseModel):
    name: str
    ip: str
    port: str = "5555"
    is_reconnect: bool = False
    device_id: int | None = None


class DeviceActionRequest(BaseModel):
    id: str
    name: str
    ip: str
    port: str = "5555"


class RenameRequest(BaseModel):
    id: str
    name: str


class consoleRequest(BaseModel):
    level: str
    text: str



@router.post("/connect")
async def connect_device(data: ConnectRequest, current_user = Depends(get_current_user)):
    result = await device.connect(data.name, data.ip, data.port, data.is_reconnect, data.device_id)
    return {"message": result}


@router.post("/disconnect")
async def disconnect_device(data: DeviceActionRequest, current_user = Depends(get_current_user)):
    result = await device.disconnect(data.id, data.name, data.ip, data.port)
    return {"message": result}


@router.post("/remove")
async def delete_device(data: DeviceActionRequest, current_user = Depends(get_current_user)):
    result = await device.remove(data.id, data.name, data.ip, data.port)
    return {"message": result}


@router.post("/rename")
async def rename_device(data: RenameRequest, current_user = Depends(get_current_user)):
    result = await device.rename(data.id, data.name)
    return {"message": result}


@router.get("/")
async def list_devices(current_user = Depends(get_current_user)):
    result = await device.get_db_devices()
    return result


@router_logs.get("/")
async def get_log_route(current_user = Depends(get_current_user)):
    return logger.get_log()


@router_logs.post("/clear")
async def clear_log_route(current_user = Depends(get_current_user)):
    return logger.clear_log()


@router_logs.post("/console")
async def javascript_console(data: consoleRequest, current_user = Depends(get_current_user)):
    return await logger.js_console(data.level, data.text)

@router_system.get("/uptime")
async def server_uptime(current_user = Depends(get_current_user)):
    return get_server_uptime()