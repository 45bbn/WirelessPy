export async function connect() {
    const ip = document.getElementById("adb-ip").value;

    const response = await fetch(`/api/android/connect/${ip}`, {
        method: "POST"});

    const data = await response.json();
    console.log(data);
}

export async function disconnect() {
    const ip = document.getElementById("adb-ip").value;

    const response = await fetch(`/api/android/disconnect/${ip}`, {
        method: "POST"});

    const data = await response.json();
    console.log(data);
}

export async function devices() {
    const response = await fetch(`/api/android/devices`, {
        method: "GET"});

    const data = await response.json();
    console.log(data);
}

export async function changeRes() {
    const serial = document.getElementById("inputSerial").value;
    const res = document.getElementById("inputRes").value;

    const response = await fetch(`/api/android/changeRes/${serial}/${res}`, {
        method: "GET"});

    const data = await response.json();
    console.log(data);
}