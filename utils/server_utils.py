import os
import json
import socket
import ipaddress
import subprocess

#-------------------- JSON CODE --------------------#
CONFIG_FILE = "server_config.json"
default_server_config = {
    "server": {
        "ip_mode": "auto",
        "manual_ip": "",
        "port": 5000
    },
    "development": {
        "debug": False
    },
    "note-1": "use auto/manual for ip mode",
    "note-2": "use True/False for debug"
}

def save_server_config():
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(server_config, f, indent=4)

if not os.path.exists(CONFIG_FILE): # Create config if missing
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(default_server_config, f, indent=4)
    print("server_config.json not found, creating default config...")


try: #load config
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        server_config = json.load(f)
except (json.JSONDecodeError, OSError) as e:
    print(f"Config load error: {e}. Using defaults.")
    server_config = default_server_config.copy()
    save_server_config()
#-------------------------------------------------#


def get_local_ip(): #get local ip automaticaly
    print("getting server ip...")
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]

    except Exception as e:
        print(f"get local ip error: {e}")
        print("using localhost...")
        return "127.0.0.1"

    finally:
        s.close()

def is_valid_ip(ip): #check ip are valid or not
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

def is_valid_port(port): #check port are valid or not
    return isinstance(port, int) and 1 <= port <= 65535

def get_server_ip():
    server = server_config.get("server", {})

    ip_mode = server.get("ip_mode", "auto")
    manual_ip = server.get("manual_ip", "")
    port = server.get("port", 5000)

    if not is_valid_port(port):
        print(f"Invalid port:{port}, using port 5000...")
        port = 5000
        
    try:
        if ip_mode == "auto":
            ip = get_local_ip()

        elif ip_mode == "manual":
            if manual_ip and is_valid_ip(manual_ip):
                ip = manual_ip
            else:
                ip = "127.0.0.1"
                print(f"manual_ip:{manual_ip} is invalid/empty, using localhost...")

        else:
            ip = get_local_ip()
            print("Incorrect settings, auto will be used!")

    except Exception as e:
        print(f"IP Configuration error: {e}")
        print("Using localhost...")
        ip = "127.0.0.1"

    return ip, port

def is_debug():
    development = server_config.get("development", {})

    debug = development.get("debug", False)
    print(f"Debug is {debug}")

    return debug

def turn_off_adb():
    print("Turning off adb...")
    result = subprocess.run(["adb", "kill-server"],
        capture_output=True,
        text=True)

    if result.returncode == 0:
        print("Success")
    else:
        print("adb already off")
        print(result)