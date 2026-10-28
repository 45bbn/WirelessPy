/*
 * login.js
 * Login page behaviour: geometry wallpaper (canvas), mouse spotlight/bloom,
 * effect mode switch (full / saver / off) and the sign-in form.
 * Loaded as an ES module: <script type="module" src="/static/js/login.js">
 */

const root = document.documentElement;
const canvas = document.getElementById("geo");
const ctx = canvas.getContext("2d");

// ---------- Settings: effect mode (full / saver / off) ----------
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let mode = "full";
try { mode = localStorage.getItem("wp-fx") || (reduceMotion ? "off" : "full"); }
catch (_) { mode = reduceMotion ? "off" : "full"; }

// ---------- Theme colors come from the CSS variables ----------
let palette = [];
function readPalette() {
    const cs = getComputedStyle(root);
    palette = ["--accent-1", "--accent-2", "--accent-3", "--accent-4"]
        .map(v => cs.getPropertyValue(v).trim()).filter(Boolean);
}
readPalette();

// ---------- Canvas sizing (DPR is capped to keep it light on weak GPUs) ----------
let W = 0, H = 0;
function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---------- Shapes ----------
const SIDES = [3, 4, 5, 6, 8, 40];
let shapes = [];
function makeShapes() {
    // Fewer shapes on small screens and low core counts
    const lowEnd = (navigator.hardwareConcurrency || 4) <= 4;
    let n = Math.round((W * H) / 45000);
    n = Math.max(8, Math.min(lowEnd ? 20 : 36, n));
    shapes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 26 + Math.random() * 64,
        sides: SIDES[(Math.random() * SIDES.length) | 0],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.25,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        depth: 0.4 + Math.random() * 0.9,
        color: palette[(Math.random() * palette.length) | 0] || "#6668F5",
    }));
}

// ---------- Pointer (smoothed) + idle drift when nobody is moving the mouse ----------
let tx = 0, ty = 0, mx = 0, my = 0, lastMove = 0;
addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; lastMove = performance.now(); }, { passive: true });

const R = 300; // radius of the bloom around the pointer

function polygonPath(s, px, py) {
    ctx.beginPath();
    for (let i = 0; i < s.sides; i++) {
        const a = s.rot + (i / s.sides) * Math.PI * 2;
        const x = px + Math.cos(a) * s.r, y = py + Math.sin(a) * s.r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
}

function step(dt, now) {
    // Idle drift: slow Lissajous path (also covers touch devices without a hover pointer)
    if (now - lastMove > 4000) {
        tx = W * (0.5 + 0.32 * Math.cos(now * 0.00035));
        ty = H * (0.5 + 0.28 * Math.sin(now * 0.00052));
    }
    mx += (tx - mx) * 0.12;
    my += (ty - my) * 0.12;
    root.style.setProperty("--mx", mx.toFixed(1) + "px");
    root.style.setProperty("--my", my.toFixed(1) + "px");

    for (const s of shapes) {
        s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt;
        const m = s.r + 40;
        if (s.x < -m) s.x = W + m; else if (s.x > W + m) s.x = -m;
        if (s.y < -m) s.y = H + m; else if (s.y > H + m) s.y = -m;
    }
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    const px = (mx - W / 2), py = (my - H / 2);
    const pos = shapes.map(s => ({
        x: s.x + px * 0.03 * s.depth,
        y: s.y + py * 0.03 * s.depth,
    }));

    // Soft links between nearby shapes (reads like linked devices)
    ctx.lineWidth = 1;
    for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
            const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
            const d = Math.hypot(dx, dy);
            if (d > 230) continue;
            const cx = (pos[i].x + pos[j].x) / 2, cy = (pos[i].y + pos[j].y) / 2;
            const k = Math.max(0, 1 - Math.hypot(cx - mx, cy - my) / R);
            ctx.globalAlpha = (1 - d / 230) * (0.16 + 0.6 * k);
            ctx.strokeStyle = shapes[i].color;
            ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y); ctx.lineTo(pos[j].x, pos[j].y); ctx.stroke();
        }
    }

    // Outlines, brighter near the pointer, plus a cheap bloom pass (wide, faint, additive)
    for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i], p = pos[i];
        const k = Math.max(0, 1 - Math.hypot(p.x - mx, p.y - my) / R);
        const k2 = k * k;

        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.24 + 0.7 * Math.pow(k, 1.5);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.3 + 1.6 * k2;
        polygonPath(s, p.x, p.y); ctx.stroke();

        if (k > 0.05) {
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.22 * k;
            ctx.lineWidth = 8 + 14 * k;
            polygonPath(s, p.x, p.y); ctx.stroke();
            ctx.globalAlpha = 0.07 * k;
            ctx.fillStyle = s.color;
            ctx.fill();
        }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
}

// ---------- Loop: 60 fps in full mode, 30 fps in saver mode, paused when the tab is hidden ----------
let raf = 0, last = 0;
function tick(now) {
    raf = requestAnimationFrame(tick);
    const interval = mode === "saver" ? 1000 / 30 : 0;
    if (now - last < interval) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt, now);
    draw();
}
function start() { stop(); if (mode !== "off" && !document.hidden) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

function applyMode(m) {
    mode = m;
    try { localStorage.setItem("wp-fx", m); } catch (_) { }
    document.querySelectorAll(".fx button").forEach(b =>
        b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    if (m === "off") {
        // Static frame: shapes at rest, spotlight parked in the centre
        stop();
        tx = mx = W / 2; ty = my = H / 2;
        root.style.setProperty("--mx", mx + "px"); root.style.setProperty("--my", my + "px");
        lastMove = performance.now(); draw();
    } else { start(); }
}

document.querySelector(".fx").addEventListener("click", e => {
    const b = e.target.closest("button[data-mode]");
    if (b) applyMode(b.dataset.mode);
});
document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

let resizeTimer = 0;
addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); makeShapes(); if (mode === "off") draw(); }, 150);
});

resize(); makeShapes();
tx = mx = W / 2; ty = my = H / 2;
applyMode(mode);