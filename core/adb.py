import adbutils
import asyncio
from utils.logger import add_log

async def connect(ip: str) -> tuple[bool, str]:
    result = await asyncio.to_thread(adbutils.adb.connect, ip)
    
    result_lower = result.lower()
    if "connected to" in result_lower or "already connected" in result_lower:
        return True, result
    
    return False, result

async def disconnect(ip: str) -> tuple[bool, str]:
    result = await asyncio.to_thread(adbutils.adb.disconnect, ip)

    if result is None:
        return True, f"Device {ip} was already disconnected or not found"

    if "disconnected" in result.lower():
        return True, result

    return False, result

async def devices() -> tuple[bool, list]:
    try:
        result = await asyncio.to_thread(adbutils.adb.device_list)
        return True, result
    except Exception as e:
        await add_log("SYSTEM", "ERROR", str(e))
        return False, []

# print(asyncio.run(devices()))


# def test():
#     success = True
#     if not success:
#         err = "error"
#         return err

# print(test())