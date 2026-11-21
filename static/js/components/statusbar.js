import {getServerUptimeApi, loadDevicesList} from "/static/js/api.js";
import {formatUptime} from "/static/js/core.js";

// STATUSBAR
export async function initServerUptime() {
    const el = document.getElementById("server-uptime");
    let seconds = await getServerUptimeApi();

    setInterval(() => {
        seconds += 1;
        el.textContent = formatUptime(seconds);
    }, 1000);
}

export function initDate() {
    const el = document.getElementById("date")
    const today = new Date();

    // Day, month, year as separate numbers
    const day = today.getDate();          // 1-31
    const month = today.getMonth() + 1;   // 0-11, so add 1
    const year = today.getFullYear();     // e.g. 2026

    // Format: DD/MM/YYYY (with leading zeros)
    const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    el.textContent = formattedDate // 30/10/2026
}

export async function initConnectedDevices() {
    const el = document.getElementById("connected-devices-count")
    const devices = await loadDevicesList()
    const onlineCount = devices.filter(d => d.status === "online").length
    el.textContent = onlineCount
}
