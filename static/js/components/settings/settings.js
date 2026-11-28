import { SETTINGS_SCHEMA } from "./schema.js";
import { draft, loadSettings, saveSettings, applySettings } from "./storage.js";
import { renderSelector } from "./renderers/selector.js";
import { renderSlider } from "./renderers/slider.js";

const SETTING_TYPES = {
    selector: renderSelector,
    slider: renderSlider,
    // dropdown: renderDropdown
};

let selectedRow = null;

function renderInfo(row) {
    const info = document.querySelector(".settings-info p");

    if (!info) {
        return;
    }

    const defaultInfo = "Hover over an option to see the details here.";

    // Select
    row.addEventListener("click", () => {
        selectedRow = row;
        info.textContent = row.dataset.info;
    });

    // Hover
    row.addEventListener("mouseenter", () => {
        info.textContent = row.dataset.info;
    });

    // Hover exit
    row.addEventListener("mouseleave", () => {
        if (!selectedRow) {
            info.textContent = defaultInfo;
            return;
        }

        info.textContent = selectedRow.dataset.info;
    });
}

function renderSettings() {
    const lastSections = new Map();

    for (const item of SETTINGS_SCHEMA) {
        const renderer = SETTING_TYPES[item.type];

        if (!renderer) {
            console.warn(`Unsupported setting type: ${item.type}`);
            continue;
        }

        const container = document.getElementById(item.tab);

        if (!container) {
            console.warn(`Settings tab not found: ${item.tab}`);
            continue;
        }

        const lastSection = lastSections.get(item.tab);

        if (item.section !== lastSection) {
            const title = document.createElement("div");

            title.className = "settings-title";
            title.textContent = item.section;

            container.appendChild(title);
            lastSections.set(item.tab, item.section);
        }

        // Render setting
        try {
            const element = renderer(item, draft, renderInfo);

            if (!(element instanceof Node)) {
                console.warn(`Invalid setting element: ${item.id}`);
                continue;
            }

            container.appendChild(element);

        } catch (error) {
            console.error(`Failed to render setting: ${item.id}`, error);
        }
    }
}

export function initSettings() {
    loadSettings();
    renderSettings();

    const saveHandle = document.getElementById("save-settings");

    if (saveHandle) {
        saveHandle.addEventListener("click", saveSettings);
    } else {
        console.warn("Save settings button not found.");
    }
}

initSettings();