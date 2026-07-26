import os
import sys
import Module.adb as adb
from colorama import init, Fore as Fore
import Module.Scrcpy as scrcpy
import platform

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def MainMenu():
    while True:
        clear_screen()
        print("--------------- WirelessPy v1.2.0 ---------------")
        adb.Devices()

        print("1 =", Fore.LIGHTCYAN_EX  + "Adb Menu")
        print("2 =", Fore.LIGHTGREEN_EX + "Scrcpy Menu")
        print("3 =", Fore.LIGHTYELLOW_EX  + "Info")
        print("4 =", Fore.LIGHTRED_EX   + "Exit")
        choice = input("Pick> " + Fore.LIGHTCYAN_EX + Fore.RESET).strip().lower()
        if choice == "1":
            adbmenu()
        elif choice == "2":
            if "ANDROID_ROOT" in os.environ:
                print("Scrcpy not work in Android")
            else:
                scrcpymenu()
        elif choice == "3":
            Script_Info()
        elif choice == "4":
            clear_screen()
            print("Saving Config...")
            adb.save_adb_settings()
            print("Shutting Down Adb...")
            adb.KILL_SERVER()
            sys.exit()
        else:
            clear_screen()
            print(Fore.LIGHTRED_EX + "Invalid Pick")
            input("Press Enter To Continue")

def adbmenu():
    while True:
        clear_screen()
        adb.Devices()
        print("1 =", Fore.CYAN            + "Open Phone Lock","           C   =", Fore.GREEN           + "Connect")
        print("2 =", Fore.LIGHTYELLOW_EX  + "Change Display Settings","   D   =", Fore.LIGHTRED_EX     + "Disconnect")
        print("3 =", Fore.LIGHTBLUE_EX    + "Send Intents","              CMD =", Fore.LIGHTBLACK_EX   + "Open Cmd")
        print("4 =", Fore.LIGHTGREEN_EX   + "Show Running Apps")
        print("5 =", Fore.LIGHTMAGENTA_EX + "Tonggle Screen")
        print("6 =", Fore.LIGHTCYAN_EX    + "Transfer File")
        print("7 =",  Fore.YELLOW         + "Screenshot")
        print("8 =", Fore.RED + "Back")

        choice = input("Pick> ").strip().lower()
        if   choice == "c":
            adb.Connect()
        elif choice == "d":
            adb.Disconnect()
        elif choice == "cmd":
            adb.CMD()
        elif choice == "1":
            adb.Open_Phone()
        elif choice == "2":
            display_warn()
            adb.change_display_resolution()
        elif choice == "3":
            adb.send_intent()
        elif choice == "4":
            adb.show_running_apps()
        elif choice == "5":
            adb.ToggleScreen_OnOff()
        elif choice == "6":
            adb.transfer_file()
        elif choice == "7":
            adb.screen_shot()
        elif choice == "8":
            break
        else:
            print("Invalid Input")
            input("Press Enter To Continue")

def scrcpymenu():
    while True:
        clear_screen()
        adb.Devices()
        print("1 =", Fore.BLUE   + "Open Scrcpy")
        print("2 =", Fore.GREEN  + "Open Sndcpy")
        print("3 =", Fore.YELLOW + "Back")
        choice = input("Type> ").strip().lower()
        if choice == "1":
            scrcpy.Scrcpy()
        elif choice == "2":
            scrcpy.Sndcpy()
        elif choice == "3":
            break
        else:
            print("Invalid Input")
            input("Press Enter To Continue")

warning_shown = False

def display_warn():
    clear_screen()

    global warning_shown
    if warning_shown:
        return 
    
    print(Fore.YELLOW + "⚠ Warning")
    print(Fore.LIGHTRED_EX + "Changing the display resolution or density may cause display issues.")
    print(Fore.LIGHTRED_EX + "If something goes wrong, restore the default values with:")
    print()
    print(Fore.LIGHTGREEN_EX + "adb shell wm size reset")
    print(Fore.LIGHTGREEN_EX + "adb shell wm density reset")
    print()

    confirm = input(Fore.RESET + "Continue? (y/N): ").strip().lower()
    if confirm == "y":
        warning_shown = True
        return
    else:
        adbmenu()

def Script_Info():
    clear_screen()
    print("""
--------------- WirelessPy V1.2.0 ---------------
A CLI-based Android remote control tool built with Python and ADB.

--- Available Features ---
 1. Connect/Disconnect Android Devices
 2. Send Android Intents
 3. Change Display Resolution And Density
 4. Unlock Phone
 5. Toggle Screen On/Off
 6. ADB Command Prompt
 7. Show Running Apps
 8. Transfer Files (ADB Push/Pull)
 9. Take Screenshot
10. Save Some Settings With JSON
11. Scrcpy & Sndcpy (Windows Only)
""")
    
    input("Press Enter To Continue")
    Changelog_Info()

def Changelog_Info():
    clear_screen()
    print("""
--------------- Changelog ---------------

Version 1.2.0
 • Fixed various bugs

Version 1.1.0
 • Added Android-to-Android control support
 • Added file transfer (ADB Push/Pull)
 • Added settings file
 • Added screenshot feature
 • Improved existing functions
 • Fixed multiple bugs

Version 1.0.0
 • Initial release
 :3
""")
    
    input("Press Enter To Continue")
    Device_Info()

def Device_Info():
    clear_screen()
    print("--------------- Device Info ---------------")
    print("Running On>", platform.system(), platform.release(), platform.machine())
    print("")
    print("Settings:", adb.settings)
    print("")
    input("Press Enter To Continue")

MainMenu()