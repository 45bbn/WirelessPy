export function renderSlider(item, draft, renderInfo) {
    const row = document.createElement("div");

    row.className = "settings-row";
    row.dataset.id = item.id;
    row.dataset.title = item.label;
    row.dataset.info = item.info;
    row.dataset.style = item.style ?? "default";

    row.innerHTML = `
        <label></label>

        <div class="setting-slinder">
            <div class="slinder-content">

                <span class="setting-value"></span>

                <div class="slider-track">
                    <div class="slider-fill"></div>
                    <div class="slider-thumb"></div>
                </div>

            </div>
        </div>
    `;

    const label = row.querySelector("label");
    const value = row.querySelector(".setting-value");
    const track = row.querySelector(".slider-track");
    const fill = row.querySelector(".slider-fill");
    const thumb = row.querySelector(".slider-thumb");

    label.textContent = item.label;

    let currentValue = draft[item.id];
    const min = item.min;
    const max = item.max;
    const step = item.step ?? 1;
    const unit = item.unit ?? "";
    const style = item.style ?? "default";

    row.classList.add(`slider-style-${style}`);
    thumb.setAttribute("role", "slider");
    thumb.setAttribute("tabindex", "0");
    thumb.setAttribute("aria-label", item.label);
    thumb.setAttribute("aria-valuemin", min);
    thumb.setAttribute("aria-valuemax", max);

    function updateVisual() {
        const percentage = max === min
            ? 0
            : ((currentValue - min) / (max - min)) * 100;

        track.style.setProperty("--value", `${percentage}%`);
        value.textContent = `${currentValue}${unit}`;
        thumb.setAttribute("aria-valuenow",currentValue);
    }

    function setValue(value) {
        let nextValue = Number(value);

        if (!Number.isFinite(nextValue)) {
            return;
        }

        // Clamp to range
        nextValue = Math.max(min, Math.min(max, nextValue));
        nextValue = min + Math.round((nextValue - min) / step) * step;
        nextValue = Math.max(min, Math.min(max, nextValue));

        if (nextValue === currentValue) {
            return;
        }

        currentValue = nextValue;
        draft[item.id] = currentValue;
        updateVisual();
    }

    function updateFromPointer(event) {
        const rect = track.getBoundingClientRect();

        if (rect.width <= 0) {
            return;
        }

        const percentage = Math.max(
            0,
            Math.min(1, (event.clientX - rect.left) / rect.width));

        const rawValue = min + percentage * (max - min);
        setValue(rawValue);
    }

    track.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        track.setPointerCapture(event.pointerId);
        updateFromPointer(event);
    });

    track.addEventListener("pointermove", (event) => {
        if (!track.hasPointerCapture(event.pointerId)) {
            return;
        }

        updateFromPointer(event);
    });

    track.addEventListener("pointerup", (event) => {
        if (track.hasPointerCapture(event.pointerId)) {
            track.releasePointerCapture(event.pointerId);
        }
    });

    track.addEventListener("pointercancel", (event) => {
        if (track.hasPointerCapture(event.pointerId)) {
            track.releasePointerCapture(event.pointerId);
        }
    });

    thumb.addEventListener("keydown", (event) => {
        let nextValue = currentValue;

        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                nextValue += step;
                break;

            case "ArrowLeft":
            case "ArrowDown":
                nextValue -= step;
                break;

            case "Home":
                nextValue = min;
                break;

            case "End":
                nextValue = max;
                break;

            default:
                return;
        }

        event.preventDefault();
        setValue(nextValue);
    });

    updateVisual();
    renderInfo(row);
    return row;
}