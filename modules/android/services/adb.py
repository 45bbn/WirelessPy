import adbutils

async def get_device(target: str):
    adb = adbutils.AdbClient()
    device = adb.device(target)
    return device