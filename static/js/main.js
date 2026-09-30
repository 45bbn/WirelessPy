import {bind} from "./core.js";
import {loadModule} from "./api.js";
import { loadLog, clearlog, connectLogSocket } from "./console.js";
import {
    select_platform, show_wireframe, refresh, 
    toggle_add_device_modal, connect_device, 
    initConnectionTypeToggle, renderDeviceList, closeDeviceMenu
} from "./ui.js";

bind(".refresh", "click", refresh)
bind(".settings", "click", show_wireframe);
bind(".module-btn", "click", select_platform);


// bind(".module-android", "click", () => loadModule("android"));
// bind(".module-windows", "click", () => loadModule("windows"));

bind("#load-logs", "click", loadLog);
bind("#clear-logs", "click", async() => {
    await clearlog();
    loadLog()
});

bind(".add-device", "click", toggle_add_device_modal)
bind(".modal-close", "click", toggle_add_device_modal)
bind("#connect-cancel", "click", toggle_add_device_modal)
bind("#connect-submit", "click", connect_device)

// autorun function
window.addEventListener("DOMContentLoaded", () => {
    select_platform();
    loadModule("android")
    loadLog();
    connectLogSocket();
    initConnectionTypeToggle();
    renderDeviceList();
    document.addEventListener('click', closeDeviceMenu  );
});


