import { registerSettingsHandler } from "./settings/storage.js";
const root = document.documentElement;
const canvas = document.getElementById("geo");
const spotlight = document.querySelector(".spot");
const ctx = canvas.getContext("2d", { alpha: true });

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let mode = "full";
try {
    mode = localStorage.getItem("wp-fx") || (reduceMotion ? "off" : "full");
} catch (_) {
    mode = reduceMotion ? "off" : "full";
}

// ---------- Palette ----------
const THEME_COLORS = ["--accent-1", "--accent-2", "--accent-3", "--accent-4"];
let palette = [];

function readPalette() {
    const cs = getComputedStyle(root);
    palette = THEME_COLORS
        .map(v => cs.getPropertyValue(v).trim())
        .filter(Boolean);
}

// ---------- Canvas ----------
let W = 0, H = 0, DPR = 1;

let quality = 1.0;
let maxGeometry = 20;
let spotlightEnabled = true;

registerSettingsHandler((settings) => {
    quality = settings.render_quality ?? 1.0;
    maxGeometry = settings.max_geometry ?? 20;
    spotlightEnabled = settings.cursor_spotlight ?? true;

    spotlight?.classList.toggle("hidden", !settings.cursor_spotlight);

    resize();
    makeShapes();

    if (mode === "off") draw();
});

function resize() {
    W = innerWidth;
    H = innerHeight;

    DPR = Math.min(devicePixelRatio || 1, quality);

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

// ---------- Shapes ----------
const SIDES = [3, 4, 5, 6, 8, 40];

let shapes = [];

function makeShapes() {
    if (maxGeometry > 100) {
        maxGeometry = 100
    }
    shapes = Array.from({ length: maxGeometry }, () => ({
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

        px: 0,
        py: 0
    }));
}

// ---------- Pointer ----------
let tx = 0, ty = 0;
let mx = 0, my = 0;
let lastMove = 0;

const R = 300;
const R2 = R * R;
const LINK_DISTANCE = 230;
const LINK_DISTANCE2 = LINK_DISTANCE * LINK_DISTANCE;

addEventListener("pointermove", e => {
    tx = e.clientX;
    ty = e.clientY;
    lastMove = performance.now();
}, { passive: true });

function buildPath(s, x, y) {
    const sides = s.sides;
    const step = (Math.PI * 2) / sides;

    ctx.beginPath();

    for (let i = 0; i < sides; i++) {
        const a = s.rot + i * step;
        const px = x + Math.cos(a) * s.r;
        const py = y + Math.sin(a) * s.r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }

    ctx.closePath();
}

// ---------- Update ----------
function step(dt, now) {
    // Idle pointer movement
    if (now - lastMove > 4000) {
        tx = W * (0.5 + 0.32 * Math.cos(now * 0.00035));
        ty = H * (0.5 + 0.28 * Math.sin(now * 0.00052));
    }

    mx += (tx - mx) * 0.12;
    my += (ty - my) * 0.12;

    root.style.setProperty("--mx", `${mx.toFixed(1)}px`);
    root.style.setProperty("--my", `${my.toFixed(1)}px`);

    for (const s of shapes) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.vr * dt;

        const m = s.r + 40;

        if (s.x < -m) s.x = W + m;
        else if (s.x > W + m) s.x = -m;

        if (s.y < -m) s.y = H + m;
        else if (s.y > H + m) s.y = -m;
    }
}

// ---------- Rendering ----------
function draw() {
    ctx.clearRect(0, 0, W, H);

    const offsetX = (mx - W * 0.5) * 0.03;
    const offsetY = (my - H * 0.5) * 0.03;

    // Calculate final positions without creating an array
    for (const s of shapes) {
        s.px = s.x + offsetX * s.depth;
        s.py = s.y + offsetY * s.depth;
    }

    // ---------- Links ----------
    ctx.lineWidth = 1;
    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < shapes.length; i++) {
        const a = shapes[i];

        for (let j = i + 1; j < shapes.length; j++) {
            const b = shapes[j];

            const dx = a.px - b.px;
            const dy = a.py - b.py;
            const d2 = dx * dx + dy * dy;

            // Avoid sqrt for pairs that are too far away
            if (d2 > LINK_DISTANCE2) continue;

            const d = Math.sqrt(d2);
            const cx = (a.px + b.px) * 0.5 - mx;
            const cy = (a.py + b.py) * 0.5 - my;

            const pointerD2 = cx * cx + cy * cy;

            const k = pointerD2 < R2
                ? 1 - Math.sqrt(pointerD2) / R
                : 0;

            ctx.globalAlpha =
                (1 - d / LINK_DISTANCE) * (0.16 + 0.6 * k);

            ctx.strokeStyle = a.color;

            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
        }
    }

    // ---------- Shapes ----------
    ctx.globalCompositeOperation = "source-over";

    for (const s of shapes) {
        const dx = s.px - mx;
        const dy = s.py - my;
        const d2 = dx * dx + dy * dy;

        const k = spotlightEnabled && d2 < R2
            ? 1 - Math.sqrt(d2) / R
            : 0;

        const k2 = k * k;

        buildPath(s, s.px, s.py);

        ctx.globalAlpha = 0.24 + 0.7 * k * Math.sqrt(k);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.3 + 1.6 * k2;
        ctx.stroke();

        if (k > 0.08) {
            ctx.globalCompositeOperation = "lighter";

            ctx.globalAlpha = 0.16 * k;
            ctx.lineWidth = 6 + 10 * k;
            ctx.strokeStyle = s.color;
            ctx.stroke();

            ctx.globalCompositeOperation = "source-over";
        }
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
}

const FPS = {
    full: 0,
    saver: 24
};

let raf = 0;
let last = 0;

function tick(now) {
    raf = requestAnimationFrame(tick);

    const fps = FPS[mode];
    const interval = fps ? 1000 / fps : 0;
    const elapsed = now - last;

    if (elapsed < interval - 1) return;

    const dt = Math.min(0.05, elapsed / 1000 || 0.016);

    last = interval
        ? now - (elapsed % interval)
        : now;

    step(dt, now);
    draw();
}

function start() {
    stop();

    if (mode !== "off" && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
    }
}

function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
}

function applyMode(m) {
    mode = m;

    try {
        localStorage.setItem("wp-fx", m);
    } catch (_) { }

    document.querySelectorAll(".fx button").forEach(b => {
        b.setAttribute("aria-pressed", String(b.dataset.mode === m));
    });

    if (m === "off") {
        stop();

        tx = mx = W * 0.5;
        ty = my = H * 0.5;

        root.style.setProperty("--mx", `${mx}px`);
        root.style.setProperty("--my", `${my}px`);

        lastMove = performance.now();
        draw();
    } else {
        start();
    }
}

document.querySelector(".fx")?.addEventListener("click", e => {
    const b = e.target.closest("button[data-mode]");
    if (b) applyMode(b.dataset.mode);
});

document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
});

let resizeTimer = 0;

addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        resize();

        for (const s of shapes) {
            s.x = Math.min(s.x, W);
            s.y = Math.min(s.y, H);
        }

        if (mode === "off") draw();
    }, 150);
});

const THEMES = ["blue", "aurora", "sunset", "ember", "graphite"];

function applyTheme(name) {
    if (!THEMES.includes(name)) name = "blue";

    root.dataset.theme = name;

    try {
        localStorage.setItem("wp-theme", name);
    } catch (_) { }

    readPalette();

    for (const s of shapes) {
        s.color = palette[(Math.random() * palette.length) | 0] || "#6668F5";
    }

    if (mode === "off") draw();
}

resize();
readPalette();
makeShapes();

tx = mx = W * 0.5;
ty = my = H * 0.5;

let savedTheme = "blue";

try {
    savedTheme = localStorage.getItem("wp-theme") || "blue";
} catch (_) { }

applyTheme(savedTheme);
applyMode(mode);