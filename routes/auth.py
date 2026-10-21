from fastapi import APIRouter
from pydantic import BaseModel, Field

from services import auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8)

# @router.post("/login")
# async def login(data: LoginRequest):



# @router.post("/connect")
# async def connect_device(data: ConnectRequest):
#     result = await device.connect(data.name, data.ip, data.port, data.is_reconnect, data.device_id)
#     return {"message": result}