import { getCurrentTarget } from "/static/js/ui.js";

export async function changeRes() {
    const serial = document.getElementById("inputSerial").value;
    const res = document.getElementById("inputRes").value;

    const response = await fetch(`/api/android/changeRes/${serial}/${res}`, {
        method: "GET"});

    const data = await response.json();
    console.log(data);
}

export async function sendKeyevent() {
    const keyevent = document.getElementById("inputKeyevent").value;
    const device = getCurrentTarget();
    const ip = `${device.ip}:${device.port}`;
    const id = device.id

    if (keyevent == null || keyevent === "") throw new Error("Keyevent is required");

    const response = await fetch("/api/android/keyevent", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ip, keyevent, id}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to send KeyEvent to device");
    }

    return data;
}