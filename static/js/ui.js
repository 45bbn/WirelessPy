import { connectDeviceApi, disconnectDeviceApi, loadDevicesList, removeDeviceApi, renameDeviceApi } from "./api.js";



function get_active_module() {
    const active = document.querySelector(".btn.active");
    return active?.dataset.module ?? null;
}

export function select_platform() {
    const buttons = document.querySelectorAll(".module-btn");

    buttons.forEach((button, index) => {
        if (index === 0) {
            button.classList.add("active");
            console.log("Active module init:", get_active_module());
        }

        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            console.log("Active module:", get_active_module());
        });
    });
}

export function show_wireframe() {
    const wireframe = document.body.classList.toggle("wireframe-enabled");
}

export function refresh() {
    location.reload();
}

export function toggle_add_device_modal() {
    const backdrop = document.querySelector(".modal-backdrop");
    const connectDeviceModal = document.getElementById("connect-device-modal");

    if (backdrop.hidden && backdrop.hidden) {
        backdrop.hidden = false;
        connectDeviceModal.hidden = false;
    } else {
        backdrop.hidden = true;
        connectDeviceModal.hidden = true;
    }

    console.log("backdrop:", backdrop.hidden);
    console.log("modal:", connectDeviceModal.hidden);
}

export function initConnectionTypeToggle() {
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



export async function connect_device() {
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


function createDeviceItem(device) {
    const item = document.createElement('div');
    item.className = 'device-item';
    item.dataset.id = device.id;

    item.innerHTML = `
        <span class="status-dot" data-status="">
            <span class="core"></span>
            <span class="ring"></span>
        </span>
        <div class="device-info">
            <p class="device-name"></p>
            <p class="device-address"></p>
        </div>
        <img class="utility-vertical-dots" src="/static/assets/icon/three_dot_vertical.webp" draggable="false">
    `;

    item.querySelector('.device-name').textContent = device.name;
    item.querySelector('.device-address').textContent = `${device.ip}:${device.port}`;
    item.querySelector('.status-dot').dataset.status = device.status;

    item.querySelector('.utility-vertical-dots').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    item.addEventListener('click', () => {
        document.querySelectorAll('.device-item.active')
            .forEach(el => el.classList.remove('active'));

        item.classList.add('active');
        console.log(`device ${device.ip}:${device.port} is selected with id: ${device.id}`);
    });

    attachDeviceMenu(item, device);
    return item;
}

function openDeviceMenu(anchorEl, device) {
    closeDeviceMenu(); // close any existing one first
    console.log(device)


    const menu = document.createElement('div');
    const isOnline = device.status === 'online';
    menu.className = 'device-menu';
    menu.innerHTML = `
        <button class="device-menu-item" data-action="rename">Rename</button>
        <button class="device-menu-item" data-action="${isOnline ? 'disconnect' : 'reconnect'}">
        ${isOnline ? 'Disconnect' : 'Reconnect'}
        </button>
        <div class="device-menu-separator"></div>
        <button class="device-menu-item danger" data-action="remove">Remove</button>
    `;

    document.getElementById('overlay-root').appendChild(menu);

    // position it relative to the dots icon using real screen coordinates

    const rect = anchorEl.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;

    menu.querySelectorAll('.device-menu-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeviceMenuAction(btn.dataset.action, device);
            closeDeviceMenu();
        });
    });
}

function attachDeviceMenu(item, device) {
    const dots = item.querySelector('.utility-vertical-dots');

    dots.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeviceMenu(dots, device);
    });
}


function startRename(item, device) {
    const nameEl = item.querySelector('.device-name');
    const oldName = nameEl.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldName;
    input.className = 'device-name-input';

    nameEl.replaceWith(input);
    input.focus();
    input.select();

    async function commit() {
        const newName = input.value.trim();
        if (!newName || newName === oldName) {
            input.replaceWith(nameEl); // batal, balikin ke <p> lama
            return;
        }

        try {
            const result = await renameDeviceApi(device.id, newName);
            nameEl.textContent = newName;
            console.log('Renamed:', result.message);
        } catch (err) {
            console.error('Failed to rename:', err.message);
            nameEl.textContent = oldName; // rollback tampilan kalau gagal
        }
        input.replaceWith(nameEl);
    }

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') { input.value = oldName; input.blur(); }
    });
}
async function handleDeviceMenuAction(action, device) { // add function here!
    switch (action) {
        case 'rename':
            const item = document.querySelector(`.device-item[data-id="${device.id}"]`);
            if (item) startRename(item, device);
            break;

        case 'disconnect':
            try {
                const result = await disconnectDeviceApi(device.id, device.name, device.ip, device.port);
                console.log('Disconnected:', result.message);
                await renderDeviceList();
            } catch (err) {
                console.error('Failed to disconnect:', err.message);
            }
            break;

        case "reconnect":
            try {
                const result = await connectDeviceApi(device.name, device.ip, device.port, true, device.id);
                console.log('Reconnected:', result.message);
                await renderDeviceList();
            } catch (err) {
                console.error('Failed to reconnect:', err.message);
            }
            break;

        case 'remove':
            try {
                const result = await removeDeviceApi(device.id, device.name, device.ip, device.port);
                console.log('Removed:', result.message);
                await renderDeviceList();
            } catch (err) {
                console.error('Failed to remove:', err.message);
            }
            break;
    }
}

export function closeDeviceMenu() {
    document.querySelectorAll('.device-menu').forEach(m => m.remove());
}

export async function renderDeviceList() {
    const devices = await loadDevicesList();
    const list = document.querySelector('.list');
    list.innerHTML = '';

    devices.forEach(device => {
        const item = createDeviceItem(device);
        console.log("Avalable devices:", device);
        list.appendChild(item);
    });
}
