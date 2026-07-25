# WirelessPy

A CLI-based Android remote control tool built with Python and ADB.

WirelessPy simplifies common Android management tasks through ADB, including device control, file transfer, screenshots, and display configuration.

> WirelessPy is my first open-source Python project.

## Status

WirelessPy v1 is feature-complete and is no longer under active development.

Development continues with **WirelessPy v2**, a complete rewrite featuring a modern web interface built with FastAPI.

## Features

- Connect and disconnect Android devices
- Send Android intents
- Change display resolution and density
- Unlock the device
- Toggle the screen on/off
- Execute custom ADB commands
- View running applications
- Transfer files (ADB Push/Pull)
- Capture screenshots
- Save configuration using JSON
- Launch Scrcpy & Sndcpy (Windows only)

## Requirements

- [Python](https://www.python.org/) 3.10 or newer
- [Android SDK Platform Tools (ADB)](https://developer.android.com/tools/releases/platform-tools) installed and added to your PATH
- [Scrcpy](https://github.com/Genymobile/scrcpy) (optional)
- [Sndcpy](https://github.com/rom1v/sndcpy) (optional)

## Installation

Clone the repository:

```bash
git clone https://github.com/45bbn/WirelessPy.git
```

Install the required Python package:

```bash
pip install -r requirements.txt
```

## Usage

Run the program:

```bash
python WirelessPy.py
```

## Screenshots

*Coming soon.*

## Changelog

### v1.2
- Fixed various bugs

### v1.1
- Added Android-to-Android control support
- Added file transfer (ADB Push/Pull)
- Added settings file
- Added screenshot feature
- Improved existing functions
- Fixed multiple bugs

### v1.0
- Initial release :3

## 🚧 WirelessPy v2 (In Development)

WirelessPy v2 is a complete rewrite of the original WirelessPy, transitioning from a command-line application to a modern web-based platform built with FastAPI.

### Planned Features

- Modern web dashboard
- Android device management via ADB
- Authentication and user security
- SQLite database integration
- Real-time logging system
- Basic file explorer
- REST API
- Modular architecture
- Modern UI/UX

> WirelessPy v2 serves as the foundation for future versions of the project.

## License

This project is licensed under the [MIT License](LICENSE).
