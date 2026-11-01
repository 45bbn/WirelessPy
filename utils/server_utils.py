import socket
import subprocess
import time

SERVER_START_TIME = time.time()
def get_server_uptime() -> int:
    return int(time.time() - SERVER_START_TIME)


def get_local_ip() -> str:  # get local ip automaticaly
    print("Obtaining server IP...")
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]

    except Exception as e:
        print(f"Error when obtaining server IP: {e}")
        print("using localhost...")
        return "127.0.0.1"

    finally:
        s.close()
