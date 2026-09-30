````markdown
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

## Overview

**WirelessPy** is an open-source, modular device management platform designed to simplify configuring, controlling, and managing devices through a web interface.

WirelessPy v2 is being rebuilt around a **FastAPI backend**, **vanilla JavaScript frontend**, **SQLite database**, and a modular architecture.

The current focus is **Android device management through ADB**, while the architecture is designed to make future platform modules possible.

> **v2 is currently in active development. APIs, architecture, and UI may change.**

For the previous CLI implementation, see the [`main` branch](https://github.com/45bbn/WirelessPy/tree/main).

---

## Project Status

| Version | Branch | Status |
|---|---|---|
| **v1** | [`main`](https://github.com/45bbn/WirelessPy/tree/main) | Feature-complete / no longer maintained |
| **v2** | `dev` | 🚧 Active development |

---

## Goals

WirelessPy v2 is being developed around a few core goals:

- **Simple** — manage devices from a browser
- **Modular** — platform functionality is separated into modules
- **Extensible** — new device types and tools can be added later
- **Maintainable** — routing, business logic, database access, and system operations are separated
- **Cross-platform** — the server should eventually work across Windows, Linux, Android/Termux, and other environments
- **API-first** — device operations are exposed through structured APIs
- **Configurable** — server configuration should eventually be manageable through JSON, CLI, and GUI interfaces

---

# Features

## Device Management

- [x] List connected devices
- [x] Connect to Android devices through ADB
- [x] Disconnect devices
- [x] Reconnect devices
- [x] Rename device aliases
- [x] Remove devices from the database
- [ ] Select active/target device
- [ ] Live device status updates
- [ ] Automatic reconnect on startup

## Web Interface

- [x] Web dashboard
- [x] Dynamic module loading
- [x] Device management UI
- [x] Global navigation
- [x] Utility sidebar
- [x] Real-time log panel
- [ ] Authentication / login
- [ ] Improved responsive/mobile UI
- [ ] UI customization

## Backend

- [x] FastAPI backend
- [x] REST API
- [x] SQLite database
- [x] Service layer
- [x] Modular architecture
- [x] WebSocket logging
- [ ] Authentication
- [ ] User roles
- [ ] API security improvements

## Android

- [x] ADB connection management
- [x] Device information
- [x] Basic device actions
- [ ] Display management
- [ ] File management
- [ ] APK management
- [ ] Network management
- [ ] Media controls
- [ ] Shell interface
- [ ] Battery information

## Planned

- [ ] Basic file explorer
- [ ] Basic SSH support
- [ ] Improved file management
- [ ] Cross-device automation
- [ ] Additional platform modules
- [ ] More device integrations

---

# Requirements

### Software

- **Python 3.10+**
- **Android SDK Platform Tools (ADB)**
- A modern web browser
- Git

ADB must be installed and available through your system `PATH`.

Download Android Platform Tools:

https://developer.android.com/tools/releases/platform-tools

---

# Installation

## 1. Clone the repository

```bash
git clone -b dev https://github.com/45bbn/WirelessPy.git
cd WirelessPy
````

## 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

Using a virtual environment is recommended:

```bash
python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

### Linux / macOS

```bash
source .venv/bin/activate
python -m pip install -r requirements.txt
```

---

# Running WirelessPy

Start the server with:

```bash
python app.py
```

By default, the web interface is available at:

```text
http://127.0.0.1:5000
```

The server address, port, and other settings can be configured through:

```text
server_config.json
```

> Configuration options may change while v2 is under development.

---

# Connecting an Android Device

WirelessPy v2 currently uses **ADB** for Android device communication.

First make sure ADB can see your device:

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

After the device is connected, it can be managed through the WirelessPy web interface.

---

# Architecture

WirelessPy follows a layered architecture:

```text
┌──────────────────────────────┐
│          Browser             │
│       HTML / CSS / JS        │
└──────────────┬───────────────┘
               │
               │ HTTP / WebSocket
               ▼
┌──────────────────────────────┐
│        FastAPI App           │
│          app.py              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Route Layer           │
│     routes/ + module API     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Service Layer          │
│ services/ + module services  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Core Layer            │
│      ADB / system APIs       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        System Layer          │
│ ADB / subprocess / operating │
│ system services              │
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

# Project Structure

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
│       ├── static/            # Module CSS / JS
│       └── templates/         # Module templates
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

# Module Architecture

WirelessPy is designed around independent modules.

A module can provide its own:

* API routes
* Services
* Templates
* JavaScript
* CSS
* Configuration
* Module metadata

Example:

```text
modules/
│
├── android/
│   ├── module.json
│   ├── api.py
│   ├── routes.py
│   ├── services/
│   ├── templates/
│   └── static/
│
├── windows/
├── linux/
└── ssh/
```

This allows platform-specific functionality to remain isolated from the core application.

---

# Database

WirelessPy uses **SQLite** for local application data.

The database is stored in:

```text
instance/wirelesspy.db
```

The database layer is responsible for persistent application data such as registered devices.

```text
Frontend
   ↓
API Route
   ↓
Service
   ↓
Database Layer
   ↓
SQLite
```

Runtime database files are excluded from version control.

---

# Logging

WirelessPy provides a real-time logging system using WebSockets.

Example:

```text
[04:06:30] [ADB]    [INFO]  Found 1 connected device
[04:06:30] [ADB]    [INFO]  192.168.1.50:5555  device
[04:06:40] [ADB]    [INFO]  Sent keyevent 26
[04:06:50] [SCRCPY] [INFO]  Started screen mirroring
```

The web interface is designed to support:

* Live logs
* Filtering
* Searching
* Log levels
* Module filtering
* Auto-scroll
* Clearing logs
* Exporting logs

---

# API

The device API is currently available under:

```text
/api/devices
```

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| `GET`  | `/api/devices`            | List devices        |
| `POST` | `/api/devices/connect`    | Connect to a device |
| `POST` | `/api/devices/disconnect` | Disconnect a device |
| `POST` | `/api/devices/rename`     | Rename a device     |
| `POST` | `/api/devices/remove`     | Remove a device     |

> The API is still under development and may change between releases.

For interactive API documentation during development, FastAPI normally provides:

```text
http://127.0.0.1:5000/docs
```

and:

```text
http://127.0.0.1:5000/redoc
```

---

# Configuration

WirelessPy is intended to support multiple configuration methods:

```text
             ┌───────────────┐
             │ server_config  │
             │     .json      │
             └───────┬───────┘
                     │
             ┌───────▼───────┐
             │    config.py   │
             └───────┬───────┘
                     │
             ┌───────▼───────┐
             │    Validate    │
             │    Settings    │
             └───────┬───────┘
                     │
             ┌───────▼───────┐
             │ Server Startup │
             └───────────────┘
```

Future versions may provide:

* JSON configuration
* CLI configuration
* Web/GUI configuration

---

# Development Roadmap

## v2 — Android Foundation

The primary goal of v2 is to create a stable foundation around Android device management.

Planned areas include:

* Android configuration
* Authentication
* SQLite integration
* File explorer
* Basic SSH
* Server configuration system
* Modular architecture
* Improved UI/UX

The long-term goal is to keep the architecture flexible enough for additional platforms.

---

## v3 — Multi-Platform

The planned v3 direction expands WirelessPy beyond Android.

Potential modules include:

* Windows
* Linux
* Router management
* Advanced file management
* Cross-device automation
* Android sensor information
* Computer vision tools
* AI-assisted command dispatching

---

## v4 — Advanced Device Platform

Long-term ideas include:

* Stronger compatibility
* AI assistant
* Vision module
* Smart-home functionality
* Sensor-based video stabilization
* Additional automation features

> These future plans are experimental and may change significantly.

---

# Design Principles

### Separation of concerns

```text
core/
    Low-level system operations

services/
    Business logic

routes/
    HTTP/API layer

modules/
    Platform-specific functionality

database/
    Persistent application data

static/
    Frontend assets

templates/
    HTML presentation
```

### Core

Low-level wrappers around system tools such as ADB.

### Services

Business logic and application operations.

### Routes

HTTP request handling, validation, and response formatting.

### Modules

Platform-specific functionality that can be developed independently.

### Database

Persistent application state and device information.

---

# Development

WirelessPy v2 is currently a **solo project under active development**.

The `dev` branch may contain:

* Experimental features
* Breaking API changes
* Incomplete modules
* Temporary UI components
* Architectural changes

If you want to experiment with WirelessPy, the `dev` branch is the appropriate branch.

---

# Contributing

Feedback, ideas, bug reports, and suggestions are welcome.

Because v2 is still under active development, major architectural changes may occur before the first stable release.

For bugs or feature requests, please open a GitHub Issue.

---

# License

WirelessPy is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for the full license text.

---

<p align="center">
  <strong>WirelessPy v2</strong><br>
  Modular device management, built to grow.
</p>
