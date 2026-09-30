import adbutils
import asyncio
from utils.logger import add_log

def checkPort(ip:str) -> str:
    if ":" not in ip:
        ip = f"{ip}:5555"
    return ip

async def connect(ip:str) -> str:
    ip = checkPort(ip)

    try:
        result = await asyncio.to_thread(adbutils.adb.connect, ip)
    except Exception as e:
        await add_log("ADB", "ERROR", str(e))
        return str(e)
    
    if "already connected" in result:
        await add_log("ADB", "INFO", f"Already connected to {ip}")
    elif "connected to" in result:
        await add_log("ADB", "INFO", f"Connected to {ip}")
    elif "10060" in result:
        await add_log("ADB", "ERROR", f"Connection timed out (10060): {ip}")
    else:
        await add_log("ADB", "ERROR", result)

    return result

async def disconnect(ip:str) -> str:
    ip = checkPort(ip)

    try:
        result = await asyncio.to_thread(adbutils.adb.disconnect, ip)
    except Exception as e:
        await add_log("ADB", "ERROR", str(e))
        return str(e)

    if result is None:
        await add_log("ADB", "INFO", f"No such device {ip}")
        return "no such device"

    if "disconnected" in result:
        await add_log("ADB", "INFO", f"Disconnected {ip}")
    elif "none" in result.lower():
        await add_log("ADB", "INFO", f"No such device {ip}")
    else:
        await add_log("ADB", "ERROR", result)

    return result

async def get_devices() -> list:
    devices = await asyncio.to_thread(adbutils.adb.device_list)
    await add_log("ADB", "INFO", f"Found {len(devices)} Connected Devices")

    for d in devices:
        await add_log("ADB", "INFO", f"{d.serial} - {d.state if hasattr(d, 'state') else 'device'}") # type: ignore

    return devices

async def change_resolution(serial:str, res:str) -> str: #add res and serial validation later!
    try:
        device = adbutils.adb.device(serial)
        result = device.shell(f"wm size {res}")
        await add_log("ADB", "INFO", f"changed Resolution to {res} on {serial}")
    except Exception as e:
        await add_log("ADB", "ERROR", f"Failed to change resolution to {res} on {serial}: {e}")
        return str(e)

    return result

# print(type("item").__name__)