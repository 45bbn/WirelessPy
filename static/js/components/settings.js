// ---------- Schema: one object per option ----------
// id must be unique, default must match one of the option values,
// tab must match the id of a tab container in the HTML
const SETTINGS_SCHEMA = [
    {
        id: "reduce_motion",
        tab: "graphics",
        section: "Visual Effects",
        type: "selector",
        label: "Reduce Motion",
        info: "Reduce animations and motion effects throughout the app",
        options: [
            { value: false, label: "OFF" }, 
            { value: true, label: "ON" }],
        default: false,
    },
    {
        id: "cursor_spotlight",
        tab: "graphics",
        section: "Visual Effects",
        type: "selector",
        label: "Cursor Spotlight",
        info: "Toggle the Spotlight on Cursor Effect",
        options: [
            { value: false, label: "OFF" }, 
            { value: true, label: "ON" }],
        default: true,
    },
    {
        id: "max_geometry",
        tab: "graphics",
        section: "Visual Effects",
        type: "selector",
        label: "Max Geometry Object",
        info: "Limit how many shapes the wallpaper draws",
        options: [
            { value: 10, label: "LOW" },
            { value: 20, label: "MEDIUM" },
            { value: 40, label: "HIGH" },
        ],
        default: 20,
    },
];



// ---------- Renderer: builds one selector row from one schema object ----------
let draft = {};
let lastSection = null;
let selectedRow = null;

function renderSelector(item) {
    const row = document.createElement('div');
    row.className = 'settings-row';
    row.dataset.id = item.id;
    row.dataset.title = item.label;
    row.dataset.info = item.info;

    row.innerHTML = `
        <label></label>
        <div class="setting-selector">
            <svg width="24" height="24"><use href="#icon-chevron-left"/></svg>
            <div class="selector-content">
                <span class="setting-value"></span>
                <div class="underline"></div>
            </div>
            <svg width="24" height="24"><use href="#icon-chevron-right"/></svg>
        </div>
    `;

    attachUnderline(row, item);
    renderInfo(row);
    return row;
}

function attachUnderline(row, item) {
    row.querySelector('label').textContent = item.label;

    const value = row.querySelector('.setting-value');
    const underline = row.querySelector('.underline');

    item.options.forEach(() => {
        const span = document.createElement('span');
        span.classList.add('inactive');
        underline.appendChild(span);
    });

    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    underline.appendChild(indicator);

    // CSS reads --count (how many segments) and --index (which one is selected)
    row.style.setProperty('--count', item.options.length);

    attachUnderlineHandle(row, item, value)
}

function attachUnderlineHandle(row, item, value) {
    let index = item.options.findIndex(o => o.value === draft[item.id]);
    if (index === -1) index = 0;
    const [leftHandle, rightHandle] = row.querySelectorAll('.setting-selector > svg');

    leftHandle.addEventListener('click', () => {
        index = (index - 1 + item.options.length) % item.options.length;

        draft[item.id] = item.options[index].value;
        updateVisual(row, item, value, index);
    });

    rightHandle.addEventListener('click', () => {
        index = (index + 1) % item.options.length;

        draft[item.id] = item.options[index].value;
        updateVisual(row, item, value, index);
    });

    updateVisual(row, item, value, index);
}

function updateVisual(row, item, value, index) {
    value.textContent = item.options[index].label;
    row.style.setProperty('--index', index);
}

function updateSetting(item, index) {
    draft[item.id] = item.options[index].value;
}

function initSaveSettings() {
    const saveHandle = document.getElementById('save-settings');
    const saved = JSON.parse(localStorage.getItem("wp-settings") || "{}");
    const settings = {};

    for (const item of SETTINGS_SCHEMA) {
        settings[item.id] = item.default;

        const value = saved[item.id];
        const isValid = item.options.some(option => option.value === value);

        draft[item.id] = isValid ? value : item.default;
    };

    // Merge defaults with saved settings
    draft = { ...settings, ...saved };
    localStorage.setItem("wp-settings", JSON.stringify(draft));

    saveHandle.addEventListener('click', () => {
        localStorage.setItem("wp-settings",JSON.stringify(draft));

        console.log("Settings saved!", draft);
    });
}

initSaveSettings();

function renderInfo(row) {
    const info = document.querySelector(".settings-info p")
    const defaultInfo = "Hover over an option to see the details here."

    row.addEventListener("mouseenter", () => {
        info.textContent = row.dataset.info
    });

    row.addEventListener("click", () => {
        selectedRow = row;
        info.textContent = row.dataset.info;
    });

    row.addEventListener("mouseleave", () => {
        if (!selectedRow) {
            info.textContent = defaultInfo;
            return;
        }
        info.textContent = selectedRow.dataset.info
    });
}

for (const item of SETTINGS_SCHEMA) {
    const container = document.getElementById(item.tab);
    if (!container) continue; // unknown tab, skip instead of crashing

    if (item.section !== lastSection) {
        const title = document.createElement('div');
        title.className = 'settings-title';
        title.textContent = item.section;
        container.appendChild(title);
        lastSection = item.section;
    }

    container.appendChild(renderSelector(item));
}