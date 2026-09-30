from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import APIRouter

import services.device as device
import utils.logger as logger

router = APIRouter(prefix="/api/devices", tags=["devices"])
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


@router.post("/connect")
async def connect_device(data: ConnectRequest):
    result = await device.connect(
        data.name, data.ip, data.port, data.is_reconnect, data.device_id
    )
    return {"message": result}


@router.post("/disconnect")
async def disconnect_device(data: DeviceActionRequest):
    result = await device.disconnect(data.id, data.name, data.ip, data.port)
    return {"message": result}


@router.post("/remove")
async def delete_device(data: DeviceActionRequest):
    result = await device.remove(data.id, data.name, data.ip, data.port)
    return {"message": result}


@router.post("/rename")
async def rename_device(data: RenameRequest):
    result = await device.rename(data.id, data.name)
    return {"message": result}


@router.get("/")
async def list_devices():
    result = await device.get_db_devices()
    return result


@router_logs.get("/")
async def get_log_route():
    return logger.get_log()


@router_logs.post("/clear")
async def clear_log_route():
    return logger.clear_log()
