import os
import subprocess
import Module.adb as adb

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def Scrcpy(bitrate=8,resolution=2400,fps=60,AUDIO="--no-audio"):
    while True:
        clear_screen()
        adb.Devices()
        print("1 = Default")
        print("2 = Change Settings")
        print("3 = Exit")
        choice = input("Type> ")

        if choice == "1":
            subprocess.Popen(
            ["cmd", "/k", "scrcpy"],
            creationflags=subprocess.CREATE_NEW_CONSOLE)

        elif choice == "2":
            while True:
                clear_screen()
                print("scrcpy settings", "--max-fps=" + str(fps) ,"-b", str(bitrate) + "M", "-m", str(resolution), AUDIO)
                print("1 = Bit-Rate")
                print("2 = Resolution")
                print("3 = FPS")
                print("4 = tonggle audio")
                print("5 = Done")
                print("6 = Cancel")
                choice = input("Enter Value> ")

                if choice == "1": #bitrate
                    try:
                        user_input = int(input("Value> "))
                        bitrate = user_input
                    except ValueError:
                        print("error")

                elif choice == "2": #resolution
                    try:
                        user_input = int(input("Value> "))
                        resolution = user_input
                    except ValueError:
                        print("error")

                elif choice == "3": #fps
                        try:
                            user_input = int(input("Value> "))
                            fps = user_input
                        except ValueError:
                            print("error")

                elif choice == "4": #audio
                    print("1 = True")
                    print("2 = False")
                    choice = input("Pick> ")
                    if choice == "1":
                        AUDIO = ""
                    elif choice == "2":
                        AUDIO = "--no-audio"
                    else:
                        print("invalid input")
                        input("Press Enter to continue...")
                        
                elif choice == "5": #run
                    print("scrcpy", "--max-fps="+str(fps) ,"-b", str(bitrate) + "M", "-m", str(resolution), AUDIO)
                    subprocess.run(["scrcpy", "--max-fps="+str(fps) ,"-b", str(bitrate) + "M", "-m", str(resolution), "--no-audio"],
                                   creationflags=subprocess.CREATE_NEW_CONSOLE)
                    input("Press Enter to continue...")
                        
                elif choice == "6": #exit
                    break
                else:
                    clear_screen()
                    print("Try Again")
                    input("Press Enter to continue...")

        elif choice == "3":
            break
        else:
            clear_screen()
            print("Try Again")
            input("Press Enter to continue...")

def Sndcpy():
    clear_screen()
    subprocess.Popen(
    ["cmd", "/k", "sndcpy"],
    creationflags=subprocess.CREATE_NEW_CONSOLE
    )