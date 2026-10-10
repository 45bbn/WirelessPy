from utils.logger import add_log
import database.db as db
from . import adb

KEYEVENTS = {
    # System & Navigation
    "home": 3,
    "back": 4,
    "power": 26,
    "menu": 82,
    "app_switch": 187,
    "all_apps": 284,
    "search": 84,
    "voice_assist": 231,
    "notification": 83,
    "settings": 176,
    "sleep": 223,
    "wakeup": 224,

    # Volume
    "volume_up": 24,
    "volume_down": 25,
    "volume_mute": 164,

    # Media Control
    "media_play_pause": 85,
    "media_play": 126,
    "media_pause": 127,
    "media_stop": 86,
    "media_next": 87,
    "media_previous": 88,
    "media_fast_forward": 90,
    "media_rewind": 89,

    # Directional Pad (D-Pad)
    "dpad_up": 19,
    "dpad_down": 20,
    "dpad_left": 21,
    "dpad_right": 22,
    "dpad_center": 23,

    # Basic Input
    "enter": 66,
    "del": 67,
    "space": 62,
    "tab": 61,
    "escape": 111,
    "shift_left": 59,
    "shift_right": 60,
    "alt_left": 57,
    "alt_right": 58,
    "ctrl_left": 113,
    "ctrl_right": 114,
    "meta_left": 117,
    "meta_right": 118,
    "caps_lock": 115,
    "scroll_lock": 116,
    "break": 121,
    "sysrq": 120,
    "function": 119,

    # Numbers
    "0": 7,
    "1": 8,
    "2": 9,
    "3": 10,
    "4": 11,
    "5": 12,
    "6": 13,
    "7": 14,
    "8": 15,
    "9": 16,

    # Letters
    "a": 29,
    "b": 30,
    "c": 31,
    "d": 32,
    "e": 33,
    "f": 34,
    "g": 35,
    "h": 36,
    "i": 37,
    "j": 38,
    "k": 39,
    "l": 40,
    "m": 41,
    "n": 42,
    "o": 43,
    "p": 44,
    "q": 45,
    "r": 46,
    "s": 47,
    "t": 48,
    "u": 49,
    "v": 50,
    "w": 51,
    "x": 52,
    "y": 53,
    "z": 54,

    # Call & Communication
    "call": 5,
    "endcall": 6,
    "contacts": 207,

    # TV & Remote Control
    "tv_power": 177,
    "tv_input": 178,
    "guide": 172,
    "channel_up": 166,
    "channel_down": 167,
    "tv_input_hdmi_1": 243,
    "tv_input_hdmi_2": 244,
    "tv_input_hdmi_3": 245,
    "tv_input_hdmi_4": 246,
    "avr_power": 181,
    "avr_input": 182,

    # Gamepad & Joystick
    "button_a": 96,
    "button_b": 97,
    "button_c": 98,
    "button_x": 99,
    "button_y": 100,
    "button_z": 101,
    "button_l1": 102,
    "button_r1": 103,
    "button_l2": 104,
    "button_r2": 105,
    "button_thumbl": 106,
    "button_thumbr": 107,
    "button_start": 108,
    "button_select": 109,
    "button_mode": 110,

    # Miscellaneous
    "camera": 27,
    "clear": 28,
    "envelope": 65,
    "explorer": 64,
    "calendar": 208,
    "music": 209,
    "calculator": 210,
    "brightness_down": 220,
    "brightness_up": 221,
}

async def keyevent(ip: str, key: str, id: int):
    device = await adb.get_device(ip)
    keyevent = KEYEVENTS[key]
    ok, devices = db.get_device(id)
    print(devices)
    print(ok)

    device.shell(f"input keyevent {keyevent}")
    await add_log("ADB", "INFO", f"Keyevent: {key}({keyevent}) target: {ip}")
    await add_log("ADB", "INFO", devices)
    return (ip, keyevent)