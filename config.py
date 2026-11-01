import copy
import json
import os

from utils.server_utils import get_local_ip

CONFIG_FILE = "server_config.json"
DEFAULT_SERVER_CONFIG = {
    "config_version": 1,  # Do not edit, used for config migration
    "server": {
        "ip_mode": "manual",  # auto | manual
        "manual_ip": "127.0.0.1",
        "port": 5000,
    },
    "development": {
        "debug": False,  # True | False (keep False in production)
    },
    "security": {
        "allow_registration": False,  # True | False
        "session_expire_days": 7,  # Days a login session stays valid
        "max_login_attempts": 5,
        "lockout_minutes": 10,  # Lockout duration in minutes
        "cookie_secure": False,  # True only when served over HTTPS
        "cookie_samesite": "lax",  # lax | strict | none
    },
    "ui": {"default_theme": "blue"},  # blue | aurora | sunset | ember | graphite
}

server_config = copy.deepcopy(DEFAULT_SERVER_CONFIG)


def deep_merge(base: dict, override: dict) -> dict:
    result = copy.deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def save_server_config():
    tmp_file = CONFIG_FILE + ".tmp"
    with open(tmp_file, "w", encoding="utf-8") as f:
        json.dump(server_config, f, indent=4)
    os.replace(tmp_file, CONFIG_FILE)


def init_config() -> dict:
    global server_config

    # Create config file if missing
    if not os.path.exists(CONFIG_FILE):
        print("server_config.json not found, creating default config...")
        server_config = copy.deepcopy(DEFAULT_SERVER_CONFIG)
        save_server_config()
        return server_config

    # Load existing config
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            loaded = json.load(f)
        if not isinstance(loaded, dict):
            raise ValueError("Config root must be a JSON object")
    except (json.JSONDecodeError, OSError, ValueError) as e:
        print(f"Config load error: {e}. Using defaults.")
        server_config = copy.deepcopy(DEFAULT_SERVER_CONFIG)
        save_server_config()
        return server_config

    # Merge with defaults so newly added keys always exist
    server_config = deep_merge(DEFAULT_SERVER_CONFIG, loaded)
    # Write back so the file gets any new default keys
    save_server_config()
    return server_config


def resolve_host(config: dict) -> str:
    server = config["server"]
    if str(server.get("ip_mode", "manual")).lower() == "auto":
        return get_local_ip()
    return server.get("manual_ip", "127.0.0.1")


CONFIG = init_config()

HOST = resolve_host(CONFIG)
PORT = CONFIG["server"]["port"]
DEBUG = CONFIG["development"]["debug"]