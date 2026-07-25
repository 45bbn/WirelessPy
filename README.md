# WirelessPy

A CLI-based Android remote control tool built with Python and ADB.

> WirelessPy is my first open-source Python project.

## Features

- Connect/Disconnect Android devices
- Open and unlock devices
- Send Android intents
- Change display resolution and density
- Show running applications
- Transfer files (ADB Push/Pull)
- Take screenshots
- Launch Scrcpy & Sndcpy (Windows only)
- Save settings using JSON

## Requirements

- Python 3.10 or newer
- ADB installed and added to PATH
- Scrcpy (optional)
- Sndcpy (optional)

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
- Initial release

## Future

🚧 WirelessPy v2 is currently in development.

Planned improvements include:

- FastAPI web interface
- Modular architecture
- Authentication
- SQLite database
- Improved UI/UX

## License

This project is licensed under the MIT License.
