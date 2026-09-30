import { connect, devices, disconnect, changeRes } from "./api.js";
import { bind } from "../../../static/js/core.js";

export function init() {
    console.trace("android.js init() executed");
    console.log("android.js loaded");
    setupNav();
    setupUtility();
    setupBtn();
}

function setupBtn() {
    bind("#changeRes", "click", changeRes);
}

function setupNav() {
    const Input = document.getElementById("nav-data");
    const Output = document.getElementById("navigation-selector");

    Output.innerHTML = Input.innerHTML;

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.container;

            document.querySelectorAll(".content").forEach(container => {
                container.style.display = "none";
            });

            document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
            button.classList.add("active");

            document.getElementById(id).style.display = "block";
        });
    });
}

function setupUtility() {
    const Input = document.getElementById("utility-data");
    const Output = document.getElementById("utility-selector");

    while (Input.firstChild) {
        Output.appendChild(Input.firstChild);
    }

    bind("#adb-connect", "click", connect);
    bind("#adb-disconnect", "click", disconnect);
    bind("#adb-devices", "click", devices);
}

export function destroy() {
    console.log("android.js destroyed");
}