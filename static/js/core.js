export function bind(selector, event, handler) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener(event, handler);
}