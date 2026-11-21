// MODAL
export function toggleAddDeviceModal() {
    const backdrop = document.querySelector(".modal-backdrop");
    const connectDeviceModal = document.getElementById("connect-device-modal");

    const isHidden = !connectDeviceModal.classList.contains("active");

    if (isHidden) {
        // OPEN MODAL
        backdrop.classList.add("active");
        connectDeviceModal.classList.add("active");
    } else {
        // CLOSE MODAL
        backdrop.classList.remove("active");
        connectDeviceModal.classList.remove("active");
    }
}

export function toggleAddSettingsModal() {
    const backdrop = document.querySelector(".modal-backdrop");
    const settingsModal = document.getElementById("settings-modal");

    const isHidden = !settingsModal.classList.contains("active");

    if (isHidden) {
        backdrop.classList.add("active");
        settingsModal.classList.add("active");
    } else {
        backdrop.classList.remove("active");
        settingsModal.classList.remove("active");
    }
}

export function initConnectionType() {
    const toggle = document.querySelector('.connection-type-toggle');
    const buttons = toggle.querySelectorAll('.type-btn');
    const portInput = document.getElementById('connect-port');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.type;
            toggle.dataset.active = type;
            portInput.placeholder = type === 'ssh' ? '22' : '5555';
        });
    });
}

export function initSettingsSubmenu() {
    const toggle = document.querySelector('.settings-submenu-toggle');
    const buttons = toggle.querySelectorAll('.submenu-btn');
    const panels = document.querySelectorAll('.settings-list > div');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.dataset.type;
            toggle.dataset.active = type;

            // Hide all panels, then show only the selected one
            panels.forEach(p => p.hidden = p.id !== type);
        });
    });
}

export async function submitConnectDevice() { // need to show error in ui
    const alias = document.getElementById("connect-alias").value.trim();
    const ip = document.getElementById("connect-address").value.trim();
    let port = document.getElementById("connect-port").value.trim();

    if (!alias) {
        console.log("Alias is required");
        return;
    }
    if (!ip) {
        console.log("IP address is required");
        return;
    }
    if (!port) {
        const type = document.querySelector('.connection-type-toggle').dataset.active;
        port = type === 'ssh' ? '22' : '5555';
        console.log(`Using default port: ${port}`);
    }

    const result = await connectDeviceApi(alias, ip, port);

    console.log(`${ip}:${port}`);
    console.log(result)
}