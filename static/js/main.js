import {bind} from "./core.js";
import {loadModule} from "./api.js";
import { loadLog, clearlog, connectLogSocket } from "./console.js";
import {
    select_platform, show_wireframe, refresh, 
    toggle_add_device_modal, connect_device, 
    initConnectionTypeToggle, renderDeviceList, closeDeviceMenu,
    initServerUptime, initDate, initConnectedDevices, initUser, initProfileMenu, logout
} from "./ui.js";


// bind(".module-android", "click", () => loadModule("android"));
// bind(".module-windows", "click", () => loadModule("windows"));

bind("#load-logs", "click", loadLog);
bind("#clear-logs", "click", async() => {
    await clearlog();
    loadLog()
});

bind(".refresh", "click", refresh)
bind(".settings", "click", show_wireframe);
bind(".module-btn", "click", select_platform);
bind("#logoutBtn", "click", logout())
bind(".add-device", "click", toggle_add_device_modal)
bind(".modal-close", "click", toggle_add_device_modal)
bind("#connect-cancel", "click", toggle_add_device_modal)
bind("#connect-submit", "click", connect_device)


// autorun function
window.addEventListener("DOMContentLoaded", () => {
    initUser();
    initProfileMenu();
    initServerUptime();
    initDate();
    initConnectedDevices();
    select_platform();
    loadModule("android")
    loadLog();
    connectLogSocket();
    initConnectionTypeToggle();
    renderDeviceList();
    document.addEventListener('click', closeDeviceMenu);
});



