import adbutils
import asyncio
from utils.logger import add_log

async def change_resolution(serial:str, res:str) -> str: #add res and serial validation later!
    try:
        device = adbutils.adb.device(serial)
        result = device.shell(f"wm size {res}")
        await add_log("ADB", "INFO", f"changed Resolution to {res} on {serial}")
    except Exception as e:
        await add_log("ADB", "ERROR", f"Failed to change resolution to {res} on {serial}: {e}")
        return str(e)

    return result

keyevent_list = {
    24 : "volume up",
    25 : "volume down",
    26 : "toggle screen",
    66 : "enter"
}

async def keyevent(id:int, key: int) -> str:
    result = f"{id}:{key}"
    return result

# asyncio.run(keyevent(26))