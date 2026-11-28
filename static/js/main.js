import {loadModule} from "./api.js";
import {bind, refresh, show_wireframe} from "./core.js";
import {initModuleTabs} from "./components/modules.js"
import {loadLog, clearlog, connectLogSocket} from "./console.js";
import {closeDeviceMenu, renderDeviceList} from "./components/utility.js"
import {initUser, initProfileMenu, logout} from "./components/profile.js"
import {initServerUptime, initDate, initConnectedDevices} from "./components/statusbar.js"
import {submitConnectDevice, toggleAddDeviceModal, initConnectionType, 
    toggleAddSettingsModal, initSettingsSubmenu
} from "./components/modals.js"


// bind(".module-android", "click", () => loadModule("android"));
// bind(".module-windows", "click", () => loadModule("windows"));

bind("#load-logs", "click", loadLog);
bind("#clear-logs", "click", async () => {
    await clearlog();
    loadLog()
});

bind(".refresh", "click", refresh)
bind(".module-btn", "click", initModuleTabs);
bind("#logoutBtn", "click", logout())

bind(".settings", "click", toggleAddSettingsModal);
bind("#close-settings-modal", "click", toggleAddSettingsModal)


bind(".add-device", "click", toggleAddDeviceModal)
bind("#close-connect-device-modal", "click", toggleAddDeviceModal)
bind("#connect-cancel", "click", toggleAddDeviceModal)
bind("#connect-submit", "click", submitConnectDevice)

// autorun function
window.addEventListener("DOMContentLoaded", () => {
    initUser();
    initProfileMenu();
    initServerUptime();
    initDate();
    initConnectedDevices();
    initModuleTabs();
    loadModule("android")
    loadLog();
    connectLogSocket();
    initConnectionType();
    renderDeviceList();
    initSettingsSubmenu();
    document.addEventListener('click', closeDeviceMenu);

    dev()
});



// Temp code when development
function dev() {
    toggleAddSettingsModal();

    const defaultTab = document.querySelector('.submenu-btn[data-type="graphics"]');
    if (defaultTab) defaultTab.click();
}

// window.addEventListener("wp:setting-changed", e => {
//     const { id, value } = e.detail;
//     console.log(id, value)

//     switch (id) {
//         case "render_quality":
//             quality = Number(value);
//             console.log(quality)
//             break;

//         case "max_geometry":
//             maxGeometry = Number(value);
//             console.log(maxGeometry)
//             break;
//     }
// });
