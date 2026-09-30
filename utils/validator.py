import ipaddress


def checkPort(raw_port: str | None) -> tuple[bool, str | Exception]:
    if raw_port is None:
        return False, ValueError("Port is None")

    port = raw_port.strip()
    if not port:
        return False, ValueError("Port is empty")

    if not port.isdigit():
        return False, ValueError("Port is not digit")

    try:
        port_num = int(port)
    except (ValueError, OverflowError) as e:
        return False, e

    if not (1 <= port_num <= 65535):
        return False, ValueError("Port is invalid")

    return True, port


def checkIP(raw_ip: str | None) -> tuple[bool, str | Exception]:
    if raw_ip is None:
        return False, ValueError("IP address is None")

    ip = raw_ip.strip()
    if not ip:
        return False, ValueError("IP address is empty")

    try:
        ipaddress.ip_address(ip)
        return True, ip
    except Exception as e:
        return False, e


def buildIP(raw_ip: str | None, raw_port: str | None) -> tuple[bool, str | Exception]:
    ok_ip, ip = checkIP(raw_ip)
    if not ok_ip:
        return False, ip

    ok_port, port = checkPort(raw_port)
    if not ok_port:
        return False, port

    return True, f"{ip}:{port}"


# raw_port = "5555"
# raw_ip = "192.168.1.50"

# success, ip = buildIP(raw_ip, raw_port)
# if not success:
#     print(ip)
# else:
#     print(ip)
