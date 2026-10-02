# WirelessPy v2

<p align="center">
  <strong>A modular web-based device management platform built with Python.</strong>
  <br>
  Android-focused today, designed for multi-platform expansion.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue.svg" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/FastAPI-Web%20Backend-009688.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/ADB-Android-green.svg" alt="ADB">
  <img src="https://img.shields.io/badge/SQLite-Database-003B57.svg" alt="SQLite">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange.svg" alt="In Development">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Project Status](#project-status)
- [Goals](#goals)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running WirelessPy](#running-wirelesspy)
- [Connecting an Android Device](#connecting-an-android-device)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Module Architecture](#module-architecture)
- [Database](#database)
- [Logging](#logging)
- [API](#api)
- [Configuration](#configuration)
- [Design Principles](#design-principles)
- [Development Roadmap](#development-roadmap)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**WirelessPy** is an open-source, modular device management platform that simplifies configuring, controlling, and managing devices through a web interface.

WirelessPy v2 is being rebuilt around a **FastAPI backend**, a **vanilla JavaScript frontend**, a **SQLite database**, and a modular architecture.

The current focus is **Android device management through ADB**, while the architecture is designed to make future platform modules possible.

> **v2 is under active development. APIs, architecture, and UI may change.**

For the previous CLI implementation, see the [`main` branch](https://github.com/45bbn/WirelessPy/tree/main).

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="WirelessPy v2 dashboard" width="100%">
  <br>
  <em>WirelessPy v2 dashboard: module tabs, workspace, connected devices, status bar, and real-time log panel.</em>
</p>

> The UI is under active development and may differ from the current version.

---

## Project Status

| Version | Branch | Status |
| ------- | ------ | ------ |
| **v1** | [`main`](https://github.com/45bbn/WirelessPy/tree/main) | Feature-complete / no longer maintained |
| **v2** | `dev` | 🚧 Active development |

---

## Goals

- **Simple**: manage devices from a browser
- **Modular**: platform functionality is separated into modules
- **Extensible**: new device types and tools can be added later
- **Maintainable**: routing, business logic, database access, and system operations are separated
- **Cross-platform**: the server should eventually work on Windows, Linux, Android/Termux, and other environments
- **API-first**: device operations are exposed through structured APIs
- **Configurable**: server configuration should eventually be manageable through JSON, CLI, and GUI

---

## Features

### Device Management

- [x] List connected devices
- [x] Connect to Android devices through ADB
- [x] Disconnect devices
- [x] Reconnect devices
- [x] Rename device aliases
- [x] Remove devices from the database
- [ ] Select active/target device
- [ ] Live device status updates
- [ ] Automatic reconnect on startup

### Web Interface

- [x] Web dashboard
- [x] Dynamic module loading
- [x] Device management UI
- [x] Global navigation
- [x] Utility sidebar
- [x] Real-time log panel
- [ ] Authentication / login
- [ ] Improved responsive/mobile UI
- [ ] UI customization

### Backend

- [x] FastAPI backend
- [x] REST API
- [x] SQLite database
- [x] Service layer
- [x] Modular architecture
- [x] WebSocket logging
- [ ] Authentication
- [ ] User roles
- [ ] API security improvements

### Android

- [ ] Device information
- [ ] Basic device actions
- [ ] Display management
- [ ] File management
- [ ] APK management
- [ ] Network management
- [ ] Media controls
- [ ] Shell interface
- [ ] Battery information

### Planned

- [ ] Basic file explorer
- [ ] Basic SSH support
- [ ] Improved file management
- [ ] Cross-device automation
- [ ] Additional platform modules
- [ ] More device integrations

---

## Requirements

- **Python 3.10+**
- **Android SDK Platform Tools (ADB)**, installed and available in your system `PATH`
- A modern web browser
- Git

Download Android Platform Tools: <https://developer.android.com/tools/releases/platform-tools>

---

## Installation

### 1. Clone the repository

```bash
git clone -b dev https://github.com/45bbn/WirelessPy.git
cd WirelessPy
```

### 2. Install dependencies

Using a virtual environment is recommended.

```bash
python -m venv .venv
```

**Windows**

```powershell
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

**Linux / macOS**

```bash
source .venv/bin/activate
python -m pip install -r requirements.txt
```

---

## Running WirelessPy

Start the server:

```bash
python app.py
```

By default, the web interface is available at:

```text
http://127.0.0.1:5000
```

The server address, port, and other settings can be configured in `server_config.json`.

> Configuration options may change while v2 is under development.

---

## Connecting an Android Device

WirelessPy v2 uses **ADB** for Android device communication.

First, make sure ADB can see your device:

```bash
adb devices
```

For wireless ADB:

```bash
adb connect <IP>:<PORT>
```

Example:

```bash
adb connect 192.168.1.50:5555
```

Once connected, the device can be managed through the WirelessPy web interface.

---

## Architecture

WirelessPy follows a layered architecture:

```text
┌──────────────────────────────┐
│           Browser            │
│       HTML / CSS / JS        │
└──────────────┬───────────────┘
               │ HTTP / WebSocket
               ▼
┌──────────────────────────────┐
│          FastAPI App         │
│            app.py            │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│          Route Layer         │
│     routes/ + module API     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│        Service Layer         │
│ services/ + module services  │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│          Core Layer          │
│      ADB / system APIs       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│         System Layer         │
│ ADB / subprocess / operating │
│        system services       │
└──────────────────────────────┘
```

### Request Flow

```text
User Interaction
      ↓
Frontend JavaScript
      ↓
HTTP API Request
      ↓
FastAPI Route
      ↓
Service Layer
      ↓
Core Wrapper
      ↓
ADB / OS / System Tool
      ↓
Result
      ↓
JSON Response
      ↓
Frontend UI Update
```

---

## Project Structure

```text
WirelessPy/
│
├── app.py                    # FastAPI application entry point
├── config.py                 # Global configuration
├── requirements.txt          # Python dependencies
│
├── core/                     # Low-level system wrappers
│   ├── adb.py                # ADB operations
│   └── scrcpy.py             # Scrcpy integration
│
├── database/                 # Database layer
│   ├── db.py                 # SQLite operations
│   └── models.py             # Database models
│
├── modules/                  # Platform/device modules
│   └── android/
│       ├── api.py            # Android API routes
│       ├── module.json       # Module manifest
│       ├── services/         # Android business logic
│       ├── static/           # Module CSS / JS
│       └── templates/        # Module templates
│
├── routes/                   # Global HTTP routes
│   ├── api.py
│   ├── responses.py
│   └── web.py
│
├── services/                 # Shared business logic
│   └── device.py
│
├── static/                   # Global frontend assets
│   ├── assets/
│   ├── css/
│   └── js/
│
├── templates/                # Global HTML templates
│   ├── base.html
│   └── index.html
│
├── utils/                    # Utility functions
│   ├── logger.py
│   ├── validator.py
│   └── server_utils.py
│
└── instance/                 # Runtime data
    └── wirelesspy.db
```

---

## Module Architecture

WirelessPy is designed around independent modules. A module can provide its own:

- API routes
- Services
- Templates
- JavaScript
- CSS
- Configuration
- Module metadata

Example layout:

```text
modules/
└── android/
     ├── module.json
     ├── routes.py
     ├── api.py
     ├── templates/
     │   └── dashboard.html
     ├── static/
     │   ├── android.css
     │   └── android.js
     └── services/
         └── adb.py
```

This keeps platform-specific functionality isolated from the core application.

---

## Database

WirelessPy uses **SQLite** for local application data, stored in:

```text
instance/wirelesspy.db
```

The database layer handles persistent data such as registered devices. Runtime database files are excluded from version control.

```text
Frontend → API Route → Service → Database Layer → SQLite
```

---

## Logging

WirelessPy provides real-time logging over WebSockets.

```text
[04:06:30] [ADB]    [INFO]  Found 1 connected device
[04:06:30] [ADB]    [INFO]  192.168.1.50:5555  device
[04:06:40] [ADB]    [INFO]  Sent keyevent 26
[04:06:50] [SCRCPY] [INFO]  Started screen mirroring
```

The web interface is designed to support:

- Live logs
- Filtering and searching
- Log levels
- Module filtering
- Auto-scroll
- Clearing logs
- Exporting logs

---

## API

The device API is available under `/api/devices`:

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| `GET`  | `/api/devices`            | List devices        |
| `POST` | `/api/devices/connect`    | Connect to a device |
| `POST` | `/api/devices/disconnect` | Disconnect a device |
| `POST` | `/api/devices/rename`     | Rename a device     |
| `POST` | `/api/devices/remove`     | Remove a device     |

> The API is still under development and may change between releases.

During development, FastAPI provides interactive documentation at:

- Swagger UI: <http://127.0.0.1:5000/docs>
- ReDoc: <http://127.0.0.1:5000/redoc>

---

## Configuration

WirelessPy is intended to support multiple configuration methods. Today, settings are loaded like this:

```text
server_config.json → config.py → Validate settings → Server startup
```

Future versions may provide:

- JSON configuration
- CLI configuration
- Web/GUI configuration

---

## Design Principles

WirelessPy follows a separation of concerns:

| Directory    | Responsibility                                              |
| ------------ | ----------------------------------------------------------- |
| `core/`      | Low-level wrappers around system tools such as ADB          |
| `services/`  | Business logic and application operations                   |
| `routes/`    | HTTP request handling, validation, and response formatting  |
| `modules/`   | Platform-specific functionality, developed independently    |
| `database/`  | Persistent application state and device information         |
| `static/`    | Frontend assets                                             |
| `templates/` | HTML presentation                                           |

---

## Development Roadmap

### v2 — Android Foundation

Create a stable foundation around Android device management. Planned areas:

- Android configuration
- Authentication
- SQLite integration
- File explorer
- Basic SSH
- Server configuration system
- Modular architecture
- Improved UI/UX

The long-term goal is to keep the architecture flexible enough for additional platforms.

### v3 — Multi-Platform

Expand WirelessPy beyond Android. Potential modules:

- Windows
- Linux
- Router management
- Advanced file management
- Cross-device automation
- Android sensor information
- Computer vision tools
- AI-assisted command dispatching

### v4 — Advanced Device Platform

Long-term ideas:

- Stronger compatibility
- AI assistant
- Vision module
- Smart-home functionality
- Sensor-based video stabilization
- Additional automation features

> These future plans are experimental and may change significantly.

---

## Development

WirelessPy v2 is currently a **solo project under active development**.

The `dev` branch may contain:

- Experimental features
- Breaking API changes
- Incomplete modules
- Temporary UI components
- Architectural changes

If you want to experiment with WirelessPy v2, use the `dev` branch.

---

## Contributing

Feedback, ideas, bug reports, and suggestions are welcome. Because v2 is still under active development, major architectural changes may occur before the first stable release.

For bugs or feature requests, please open a GitHub Issue.

---

## License

WirelessPy is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for the full text.

---

<p align="center">
  <strong>WirelessPy v2</strong><br>
  Modular device management, built to grow.
</p>
