import subprocess
import time
import getpass
import os
import json
from colorama import init, Fore as Fore
init(autoreset=True)

#------------------SYSTEM--FUCTION---------------------#
default_settings = {
    "tailscale_ip": "",
    "aspect_ratio_w": "",
    "aspect_ratio_h": ""}

if not os.path.exists("wirelesspy_settings.json"):
    with open("wirelesspy_settings.json", "w") as f: #write if no settings.json
        json.dump(default_settings, f, indent=4)

with open("wirelesspy_settings.json", "r")  as f: #read
    settings = json.load(f)

def save_adb_settings(): #save adb settings.json
    with open("wirelesspy_settings.json", "w") as f:
        json.dump(settings, f, indent=4)

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')
#------------------------------------------------------#

def Devices():
    try:
        subprocess.run(["adb","devices"])
    except FileNotFoundError:
        print("ADB is not installed.")

def KILL_SERVER():
    subprocess.run(["adb", "kill-server"])

def Connect():
    clear_screen()
    Devices()
    print(Fore.GREEN + "Connect")
    print("c  = Connect With Tailscale Ip")
    print("cc = Change Tailscale Ip")
    user_input = input("type (ip:port)>")
    clear_screen()
    if user_input == "c":
        subprocess.run(["adb", "connect", settings["tailscale_ip"]])
        input("Press Enter To Continue")

    elif user_input == "cc":
        user_input = input("Input Ip> ")
        settings["tailscale_ip"] = user_input
        save_adb_settings()

    else:
        subprocess.run(["adb", "connect", user_input])
        input("Press Enter To Continue")

def Disconnect():
    while True:
        clear_screen()
        Devices()
        print(Fore.RED + "Disconnect")
        print("Press Enter To Disconnect All")

        user_input = input("type (ip:port)>")
        clear_screen()
        subprocess.run(["adb", "disconnect", user_input])
        input("Press Enter To Continue")
        break

def CMD():
    clear_screen()
    print("""
Type Exit To back
Only adb Allowed
""")

    while True:
        user_input = input("Type> adb ")
        if user_input.lower() == "exit":
            break
        Commands = user_input.split()
        result = subprocess.run(["adb"] + Commands, capture_output=True, text=True)
        print(result.stdout)
        print(result.stderr)

def ToggleScreen_OnOff():
    subprocess.run(["adb", "shell", "input", "keyevent", "26"])

def Open_Phone():
    user_input = getpass.getpass("Enter Phone Password> ")

    result = subprocess.run(["adb", "shell", "dumpsys", "display"], capture_output=True)
    info = result.stdout.decode(errors="ignore")

    if "mScreenState=OFF" in info:
        clear_screen()
        print("Turn On...")
        subprocess.run(["adb", "shell", "input", "keyevent", "26"])
        time.sleep(1)
    elif "mScreenState=DOZE" in info:
        print("Turn On...")
        subprocess.run(["adb", "shell", "input", "keyevent", "26"])
        time.sleep(1)
    else:
        print("Phone Already On")

    clear_screen()
    print("Entering Keypad...")
    subprocess.run(["adb", "shell", "input", "keyevent", "66"])
    time.sleep(0.5)

    print("Writing Password...")
    hidden_input = user_input.replace(" ", "%s")
    subprocess.run(["adb", "shell", "input", "text", hidden_input])
    time.sleep(0.25)

    subprocess.run(["adb", "shell", "input", "keyevent", "66"])
    print("Done!")
    input("Press Enter To Continue")

def change_display_resolution():
    while True:
        clear_screen()
        subprocess.run(["adb", "shell", "wm", "size"])
        subprocess.run(["adb", "shell", "wm", "density"])
        print(f"Current Ratio: {settings['aspect_ratio_h']}:{settings['aspect_ratio_w']}")
        print("")
        print("1 = Change Resolution/Size In Width (W)")
        print("2 = Change DPI/Density")
        print("3 = Change Used Aspect Ratio")
        print("4 = Change Resolution And DPI To Default")
        print("5 = Back")

        choice = input("Pick> ")
        
        if choice == "1":  # change resolution
            clear_screen()
            check_display_settings()
            print(f"Current Ratio: {settings['aspect_ratio_h']}:{settings['aspect_ratio_w']}")

            try:
                width = int(input("Enter Screen Width> "))
                height = width * int(settings["aspect_ratio_h"]) // int(settings["aspect_ratio_w"])
                resolution = f"{width}x{height}"
                print("adb shell wm size", resolution)
                subprocess.run(["adb", "shell", "wm", "size", resolution])
                input("Press Enter To Continue")
            except ValueError:
                print("Invalid Height")
                input("Press Enter To Continue")

        elif choice == "2":  # change dpi/density
            clear_screen()
            print(f"Current Ratio: {settings['aspect_ratio_h']}:{settings['aspect_ratio_w']}")

            dpi = input("Enter density value> ")
            if not dpi.isdigit():
                print("Invalid dpi")
                input("Press Enter To Continue")
                continue
            subprocess.run(["adb", "shell", "wm", "density", dpi])
            print("adb shell wm density " + dpi)
            input("Press Enter To Continue")

        elif choice == "3": # change used aspect ratio
            while True:
                clear_screen()
                try:
                    print(f"Current Ratio: {settings['aspect_ratio_h']}:{settings['aspect_ratio_w']}")
                    height = int(input(f"Input Height ?:{settings['aspect_ratio_h']}> "))
                    width = int(input(f"Input Width {settings['aspect_ratio_w']}:?> "))
                except ValueError:
                    clear_screen()
                    print("Invalid Value!")
                    continue

                print(f"New Ratio: {height}:{width}")
                choice = input("Save? (Y/N/EXIT)> ").lower()
                if choice == "n":
                    clear_screen()
                elif choice == "y":
                    settings["aspect_ratio_h"] = height
                    settings["aspect_ratio_w"] = width
                    save_adb_settings()
                    break
                elif choice == "exit":
                    break
                else:
                    print("Invalid Pick!")

        elif choice == "4":# use default settings (RESET)
            subprocess.run(["adb", "shell", "wm", "size", "reset"])
            subprocess.run(["adb", "shell", "wm", "density", "reset"])

        elif choice == "5":# exit
            break
        else:
            print("Invalid Pick!")
            input("Press Enter To Continue")

def check_display_settings():
    clear_screen()
    if not settings["aspect_ratio_w"] or not settings["aspect_ratio_h"]:
        print("Aspect ratio not set yet.")

        while True:
            try:
                print(f"Current Ratio: {settings['aspect_ratio_w']}:{settings['aspect_ratio_h']}")
                height = int(input(f"Input Height ?:{settings['aspect_ratio_h']}> "))
                width = int(input(f"Input Width {settings['aspect_ratio_w']}:?> "))
            except ValueError:
                clear_screen()
                print("Invalid Value!")
                continue

            print(f"New Ratio: {height}:{width}")
            choice = input("Save? (Y/N/EXIT)> ").lower()
            if choice == "n":
                clear_screen()
            elif choice == "y":
                settings["aspect_ratio_h"] = height
                settings["aspect_ratio_w"] = width
                save_adb_settings()
                clear_screen()
                break
            elif choice == "exit":
               clear_screen()
               break
            else:
                clear_screen()
                print("Invalid Pick!")
        input("Press Enter To Continue")
        return
    else:
        return

def send_intent():
    while True:
        clear_screen()
        print("C = back")
        package_name = input("Enter Destination Package Name> ")
        if package_name.lower() == "c":
            break
        print("Leave blank if no extra code")
        code1 = input("Enter Code1 > ")
        code2 = input("Enter Code2 > ")
        code3 = input("Enter Code3 > ")
        subprocess.run(["adb", "shell", "monkey", "-p", package_name, "-c", "android.intent.category.LAUNCHER", "1"])
        time.sleep(2)
        if code1:
            subprocess.run(["adb", "shell", "am", "broadcast", "-a", code1, "--es", code2, code3])

def show_running_apps():
    clear_screen()
    print("List Of Opened App")
    result = subprocess.run(
        ["adb", "shell", "dumpsys", "activity", "activities"],
        capture_output=True)

    output = result.stdout.decode(errors="ignore")

    seen = set()
    for line in output.splitlines():
        if "packageName=" in line:
            pkg = line.split("packageName=")[1].split()[0]
            if pkg not in seen:
                seen.add(pkg)
                print("packageName=" + pkg)

    input("Press Enter To Continue")

def transfer_file():
    while True:
        clear_screen()
        print("")
        print("1 = You    --> Target (Push)")
        print("2 = Target --> You    (Pull)")
        print("3 = Exit")

        choice = input("Input> ")
        if choice == "1":
            location    = input("File Location >")
            destination = input("Destination >")
            subprocess.run(["adb","push",location,destination])
            input("Press Enter To Continue")

        elif choice == "2":
            location    = input("File Location >")
            destination = input("Destination >")
            print(["adb","pull",location,destination])
            subprocess.run(["adb","pull",location,destination])
            input("Press Enter To Continue")

        elif choice == "3":
            break

        else:
            print("Invalid Input")
            input("Press Enter To Continue")

def screen_shot():
    clear_screen()

    BASE = os.path.join(os.path.expanduser("~"), "Downloads")
    os.makedirs(BASE, exist_ok=True)

    file = os.path.join(BASE, f"Screenshot_{time.strftime('%Y-%m-%d_%H-%M-%S')}.png")

    with open(file, "wb") as f:
        subprocess.run(["adb", "exec-out", "screencap", "-p"], stdout=f)

    print("saved in", file)
    input("Press Enter To Continue")