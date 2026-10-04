import asyncio
from utils.logger import add_log
from utils.validator import buildIP
import database.db as db
import core.adb as adb


async def add_device(name: str, ip: str, status: str) -> bool:
    try:
        db.add_device(name, ip, status)
        return True
    except Exception as e:
        await add_log("SYSTEM", "ERROR", str(e))
        return False


async def update_device_status(id: str | None, status: str) -> bool:
    if not id:
        await add_log("SYSTEM", "ID", "Cannot update device status because id is None")
        return False
    try:
        db.update_device_status(id, status)
        return True
    except Exception as e:
        await add_log("SYSTEM", "ERROR", str(e))
        return False


async def connect(name: str, raw_ip: str, raw_port: str, is_reconnect: bool = False, device_id: int | None = None) -> str:
    if is_reconnect and device_id is None: #GUARD
        error = "Reconnect requested but device_id is missing"
        await add_log("SYSTEM", "ERROR", error)
        return error
    
    success, ip_or_err = buildIP(raw_ip, raw_port) #VALIDATOR
    if not success: #ADB CONNECT
        error = str(ip_or_err)
        await add_log("SYSTEM", "ERROR", error)
        return error

    ip = str(ip_or_err)
    try:
        connected, result = await adb.connect(ip)
    except Exception as e:
        await add_log("ADB", "ERROR", str(e))
        return str(e)
    #-----------------Logic------------------\/

    if is_reconnect: #If Reconnect (update device status in db)
        if connected:
            await add_log("ADB", "INFO", result)
            
            if not await update_device_status(str(device_id), "online"):
                await add_log("SYSTEM", "ERROR", f"Reconnected {ip}, but device:{name} status could not be updated in database with id:{device_id}")
            return result

        if not await update_device_status(str(device_id), "disconnected"):
            await add_log("SYSTEM", "ERROR", f"Reconnect to {ip} failed, and status could not be updated for device:{name} with id:{device_id}")
        await add_log("ADB", "ERROR", result)
        return result

    if connected: #Default Connect (add new device in db)
        await add_log("ADB", "INFO", result)

        if not await add_device(name, ip, "online"):
            await add_log("SYSTEM", "ERROR", f"Connected to {ip}, but device:{name} could not be saved in database")
        return result

    await add_device(name, ip, "disconnected") #save device if failed to connect
    await add_log("ADB", "ERROR", result)
    return result


async def disconnect(device_id: str, name: str, raw_ip: str, raw_port: str) -> str:
    success, ip_or_err = buildIP(raw_ip, raw_port) #VALIDATOR
    if not success:
        error = str(ip_or_err)
        await add_log("SYSTEM", "ERROR", error)
        return error

    ip = str(ip_or_err)
    try:
        disconnected, result = await adb.disconnect(ip)
    except Exception as e:
        await add_log("ADB", "ERROR", str(e))
        return str(e)

    if disconnected:
        await add_log("ADB", "INFO", result)

        if not await update_device_status(device_id, "disconnected"):
            await add_log("SYSTEM", "ERROR", f"disconnected {ip}, but device:{name} status could not be updated in database",)

        return result

    await add_log("ADB", "ERROR", result)
    return result


async def devices_list() -> list:
    success, devices = await adb.devices()
    if not success:
        return []
    
    await add_log("ADB", "INFO", f"Found {len(devices)} Connected Devices")

    for d in devices:
        await add_log("ADB", "INFO", f"{d.serial} - {d.state if hasattr(d, 'state') else 'device'}")  # type: ignore

    return devices


async def get_db_devices() -> list[dict]:
    success, msg = db.get_all_devices()

    if not success:
        error = str(msg)
        print(error)

        if "no such table: devices" in error:
            await add_log("SYSTEM", "ERROR", error)  # DEBUG/VARBOSE
            await add_log("SYSTEM", "INFO", "Creating a new devices database")
            db.init_db()
            return []

        await add_log("SYSTEM", "ERROR", error)
        return []

    if not isinstance(msg, list):
        await add_log("SYSTEM", "ERROR", f"Invalid database result: {msg}")
        return []

    return [
        {"id": device[0], "name": device[1], "ip": device[2], "status": device[3]}
        for device in msg
    ]


async def rename(device_id: str, new_name: str) -> str:
    renamed = False
    result = "Unknown error during rename"
    try:
        renamed, result = db.update_device_name(device_id, new_name)
    except Exception as e:
        result = str(e)

    if renamed:
        await add_log("SYSTEM", "INFO", result)
    else:
        await add_log("SYSTEM", "ERROR", result)

    return result


async def remove(device_id: str, name: str, raw_ip: str, raw_port: str) -> str:
    disconnect_result = "Unknown error during disconnect"
    try:
        disconnect_result = await disconnect(device_id, name, raw_ip, raw_port)
        await add_log("ADB", "INFO", disconnect_result)
    except Exception as e:
        disconnect_result = str(e)
        await add_log("SYSTEM", "ERROR", disconnect_result)

    removed = False
    remove_message = "Unknown error during database removal"
    try:
        removed, remove_message = db.remove_device(device_id)
    except Exception as e:
        remove_message = str(e)
        await add_log("SYSTEM", "ERROR", remove_message)

    if not removed:
        await add_log("SYSTEM", "ERROR", f"Cant remove '{name}' from database with id:{device_id}: {remove_message}")
        return remove_message

    return f"Device '{name}' removed. {disconnect_result}"

