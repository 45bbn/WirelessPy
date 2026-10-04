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
    const key = document.getElementById("inputKeyevent").value;
    const device = getCurrentTarget();

    console.log(key)
    console.log(device)
    // if (key == null || key === "") throw new Error("Keyevent is required");

    // const response = await fetch("/api/android/keyevent", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json"},
    //     body: JSON.stringify({device.id, key}),
    // });

    // const data = await response.json();

    // if (!response.ok) {
    //     throw new Error(data.detail || "Failed to send KeyEvent to device");
    // }

    // return data;
}