export function bind(selector, event, handler) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener(event, handler);
}

// HELPER
export function formatUptime(totalSeconds) {
    // Clamp invalid or negative input to 0
    const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h || d) parts.push(`${h}h`);
    if (m || h || d) parts.push(`${m}m`);
    parts.push(`${sec}s`);
    return parts.join(" ");
}

export function show_wireframe() {
    document.body.classList.toggle("wireframe-enabled");
}

export function refresh() {
    location.reload();
}