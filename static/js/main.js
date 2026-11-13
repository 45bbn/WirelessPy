import {bind} from "./core.js";
import {loadModule} from "./api.js";
import { loadLog, clearlog, connectLogSocket } from "./console.js";
import {
    select_platform, show_wireframe, refresh, 
    toggleAddDeviceModal, connect_device, 
    initConnectionType, renderDeviceList, closeDeviceMenu,
    initServerUptime, initDate, initConnectedDevices, initUser, initProfileMenu, logout,
    toggleAddSettingsModal, initSettingsSubmenu
} from "./ui.js";


// bind(".module-android", "click", () => loadModule("android"));
// bind(".module-windows", "click", () => loadModule("windows"));

bind("#load-logs", "click", loadLog);
bind("#clear-logs", "click", async() => {
    await clearlog();
    loadLog()
});

bind(".refresh", "click", refresh)
bind(".module-btn", "click", select_platform);
bind("#logoutBtn", "click", logout())

bind(".settings", "click", toggleAddSettingsModal);
bind("#close-settings-modal", "click", toggleAddSettingsModal)


bind(".add-device", "click", toggleAddDeviceModal)
bind("#close-connect-device-modal", "click", toggleAddDeviceModal)
bind("#connect-cancel", "click", toggleAddDeviceModal)
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
    initConnectionType();
    renderDeviceList();
    initSettingsSubmenu();
    document.addEventListener('click', closeDeviceMenu);
});



