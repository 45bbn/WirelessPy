let currentModule = null;
let currentStyleEl = null;

export async function loadModule(module) {
    const workspace = document.getElementById("workspace");
    const cacheBust = `?v=${Date.now()}`;
    workspace.hidden = true;

    // Destroy previous module
    if (currentModule?.destroy) {
        currentModule.destroy();
    }

    // Remove previous module CSS
    if (currentStyleEl) {
        currentStyleEl.remove();
        currentStyleEl = null;
    }

    // HTML LOADER
    const response = await fetch(`/module/${module}${cacheBust}`);
    workspace.innerHTML = await response.text();

    // CSS LOADER
    currentStyleEl = document.createElement("link");
    currentStyleEl.rel = "stylesheet";
    currentStyleEl.href = `/modules/${module}/static/${module}.css${cacheBust}`;

    document.head.appendChild(currentStyleEl);

    // JS LOADER
    currentModule = await import(`/modules/${module}/static/${module}.js${cacheBust}`);

    // Initialize new module
    if (currentModule?.init) {
        currentModule.init();
    }

    workspace.hidden = false; // show workspace when load done
}

function requireDeviceFields(name, ip, port) {
    if (!name) throw new Error("Device name is required");
    if (!ip) throw new Error("IP address is required");
    if (!port) throw new Error("Port is required");
}

export async function connectDeviceApi(name, ip, port, is_reconnect, device_id) {
    requireDeviceFields(name, ip, port)
    if (is_reconnect && (device_id == null)) {
        throw new Error("device_id is required for reconnect");
    }

    const response = await fetch("/api/devices/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ip, port, is_reconnect, device_id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to connect device");
    }

    return data
}

export async function disconnectDeviceApi(id, name, ip, port) {
    requireDeviceFields(name, ip, port)
    if (id == null || id === "") throw new Error("Device id is required");

    const response = await fetch("/api/devices/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id), name, ip, port: String(port) }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to disconnect device");
    }

    return data;
}

export async function devices() {
    const response = await fetch(`/api/devices`, {
        method: "GET"
    });

    const data = await response.json();
    console.log(data);
}

export async function loadDevicesList() {
    const response = await fetch("/api/devices");
    const devices = await response.json();

    const result = devices.map(device => {
        const [ip, port] = device.ip.split(":");
        return {
            id: device.id,
            name: device.name,
            ip,
            port,
            status: device.status
        };
    });

    return result;
}

export async function getLogsApi() {
    const response = await fetch("/api/logs/");
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to get logs");
    }

    return data;
}

export async function renameDeviceApi(id, name) {
    if (id == null || id === "") throw new Error("Device id is required");
    if (!name || !name.trim()) throw new Error("Device new name is required");

    const response = await fetch("/api/devices/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id), name }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to rename device");
    }

    return data;
}

export async function removeDeviceApi(id, name, ip, port) {
    requireDeviceFields(name, ip, port)
    if (id == null || id === "") throw new Error("Device id is required");


    const response = await fetch("/api/devices/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id), name, ip, port: String(port) }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to remove device");
    }

    return data;
}

let printJS = false;
let multiLine = false;

const origLog = console.log;   // save the original BEFORE overriding

function formatArg(arg) {
    if (arg instanceof Error) return arg.stack || arg.message;
    if (typeof arg === "object" && arg !== null) {
        try {
            return multiLine
                ? JSON.stringify(arg, null, 2)   // multi line
                : JSON.stringify(arg);           // one line
        } catch {
            return String(arg);
        }
    }
    return String(arg);
}

export async function sendConsoleApi(...args) {
    const text = args.map(formatArg).join(" ");
    origLog(...args);   // print locally without triggering the override

    const response = await fetch("/api/logs/console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch { }

    if (!response.ok) {
        throw new Error(data?.detail || `Failed to send console text (HTTP ${response.status})`);
    }

    return data;
}

if (printJS) {
    console.log = (...args) => {
        sendConsoleApi(...args).catch(() => { });
    };
}