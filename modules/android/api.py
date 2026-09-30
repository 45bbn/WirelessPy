from fastapi import APIRouter
from .services import adb


router = APIRouter(prefix="/api/android")

@router.get("/changeRes/{serial}/{res}")
async def changeRes(serial, res):
    await adb.change_resolution(serial, res)
    return {"success": True}