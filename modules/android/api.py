from fastapi import APIRouter
from pydantic import BaseModel
from .services import adb

class keyevent(BaseModel):
    id: int
    key: int

    
router = APIRouter(prefix="/api/android")

@router.get("/changeRes/{serial}/{res}")
async def changeRes(serial, res):
    await adb.change_resolution(serial, res)
    return {"success": True}

@router.post("/keyevent")
async def send_keyevent(data: keyevent):
    result = await adb.keyevent(data.id, data.key)
    return {"message": result}