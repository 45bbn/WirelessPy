// ---------- Selector Renderer ----------

export function renderSelector(item, draft, renderInfo) {
    const row = document.createElement("div");

    row.className = "settings-row";
    row.dataset.id = item.id;
    row.dataset.title = item.label;
    row.dataset.info = item.info;

    row.innerHTML = `
        <label></label>

        <div class="setting-selector">
            <svg width="24" height="24">
                <use href="#icon-chevron-left"></use>
            </svg>

            <div class="selector-content">
                <span class="setting-value"></span>
                <div class="underline"></div>
            </div>

            <svg width="24" height="24">
                <use href="#icon-chevron-right"></use>
            </svg>
        </div>
    `;

    attachUnderline(row, item, draft);
    renderInfo(row);
    return row;
}

function attachUnderline(row, item, draft) {
    const label = row.querySelector("label");
    const value = row.querySelector(".setting-value");
    const underline = row.querySelector(".underline");

    label.textContent = item.label;

    // Create underline segments
    for (const option of item.options) {
        const span = document.createElement("span");
        span.classList.add("inactive");
        underline.appendChild(span);
    }

    // Indicator
    const indicator = document.createElement("div");
    indicator.className = "indicator";
    underline.appendChild(indicator);

    // CSS variables
    row.style.setProperty("--count", item.options.length);

    attachUnderlineHandle(row, item, draft, value);
}

function attachUnderlineHandle(row, item, draft, value) {
    let index = item.options.findIndex(
        option => option.value === draft[item.id]
    );

    if (index === -1) {
        index = 0;
    }

    const [leftHandle, rightHandle] =
        row.querySelectorAll(".setting-selector > svg");

    function selectOption(nextIndex) {
        index = nextIndex;

        const selectedOption = item.options[index];
        draft[item.id] = selectedOption.value;

        updateVisual(row, selectedOption, value, index);
    }

    // option navigation (Left - Right)
    leftHandle.addEventListener("click", () => {
        index = (
            index - 1 + item.options.length
        ) % item.options.length;

        selectOption(index);
    });

    rightHandle.addEventListener("click", () => {
        index = (
            index + 1
        ) % item.options.length;

        selectOption(index);
    });

    updateVisual(row, item.options[index], value, index);
}

function updateVisual(row, option, value, index) {
    value.textContent = option.label;

    row.style.setProperty(
        "--index",
        index
    );
}

function renderInfo(row) {
    const info = document.querySelector(
        ".settings-info p"
    );

    if (!info) {
        return;
    }

    // Hover
    let selectedRow = null;
    const defaultInfo = "Hover over an option to see the details here.";
    row.addEventListener("mouseenter", () => {
        info.textContent = row.dataset.info;
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

        info.textContent = selectedRow.dataset.info;
    });
}