// SYSTEM
function setActiveModule() {
    const active = document.querySelector(".btn.active");
    return active?.dataset.module ?? null;
}

export function initModuleTabs() {
    const buttons = document.querySelectorAll(".module-btn");

    buttons.forEach((button, index) => {
        if (index === 0) {
            button.classList.add("active");
            console.log("Active module init:", setActiveModule());
        }

        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            console.log("Active module:", setActiveModule());
        });
    });
}