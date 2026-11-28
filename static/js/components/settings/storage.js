import { SETTINGS_SCHEMA } from "./schema.js";
export let draft = {};
export const storage = [];
const handlers = [];
const STORAGE_KEY = "wp-settings";

export function isValidSetting(item, value) {
    switch (item.type) {

        case "selector":
            return item.options.some(
                option => option.value === value
            );

        case "toggle":
            return typeof value === "boolean";

        case "slider":
            return (
                typeof value === "number" &&
                Number.isFinite(value) &&
                value >= item.min &&
                value <= item.max
            );

        default:
            return false;
    }
}

export function loadSettings() {
    let saved = {};

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored !== null) {
            saved = JSON.parse(stored);
        }

        if (
            typeof saved !== "object" ||
            saved === null ||
            Array.isArray(saved)
        ) {
            saved = {};
        }
    
    } catch (error) {
        console.error("Failed to load settings:", error);
        saved = {};
    }

    draft = {};

    for (const item of SETTINGS_SCHEMA) {
        const value = saved[item.id];

        draft[item.id] = isValidSetting(item, value)
            ? value
            : item.default;
    }

    applySettings(saved);
    return draft;
}

export function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));

        Object.assign(storage, draft);
        applySettings(storage)
        return true;

    } catch (error) {
        console.error("Failed to save settings:", error);
        return false;
    }
}

export function registerSettingsHandler(handler) {
    handlers.push(handler);
}

export function applySettings(settings) {
    for (const handler of handlers) {
        handler(settings);
    }
}

registerSettingsHandler((settings) => {
    const root = document.documentElement;

    root.style.setProperty("--blur", `${settings.blur_intensity}px`);
});