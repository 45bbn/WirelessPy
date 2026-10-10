from fastapi import APIRouter
from pydantic import BaseModel
from .services import screen, input

class keyeventRequestApi(BaseModel):
    ip: str
    keyevent: str
    id: int


router = APIRouter(prefix="/api/android")

@router.get("/changeRes/{serial}/{res}")
async def changeRes(serial, res):
    await screen.change_resolution(serial, res)
    return {"success": True}

@router.post("/keyevent")
async def send_keyevent(data: keyeventRequestApi):
    result = await input.keyevent(data.ip, data.keyevent, data.id)
    return {"message": result}