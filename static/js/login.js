import {bind} from "./core.js";
import {loginUserAPI, registerUserAPI} from "./api.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("error");
const submit = document.getElementById("submit");

const formTitle = document.getElementById("form-title")
const sub = document.querySelector(".sub");
const submitLabel = document.querySelector(".btn-label")
const formToggle = document.getElementById("toggle-form")

const formState = {
    mode: "login"   // login | register
}

function formRender() {
    let titleText
    let subText
    let labelText
    let toggleText

    if (formState.mode === "login") {
        titleText = "Welcome back :D"
        subText = "Login to your WirelessPy account"
        labelText = "Login"
        toggleText = "Register here"
    } else {
        titleText = "Create your account"
        subText = "Register your WirelessPy account"
        labelText = "Register"
        toggleText = "Login here"
    }

    formTitle.textContent = titleText
    sub.textContent = subText
    submitLabel.textContent = labelText
    formToggle.textContent = toggleText
}

function toggleForm(e) {
    e.preventDefault();
    if (formState.mode === "login") {
        formState.mode = "register"
    } else {
        formState.mode = "login"
    }
    formRender()
}
bind("#toggle-form", "click", toggleForm);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const username = form.username.value.trim();
    const password = form.password.value;

    if (!username || !password) {
        errorEl.textContent = "Enter your username and password.";
        return;
    }

    const action = formState.mode;
    if (action !== "login" && action !== "register") {
        errorEl.textContent = "Form state error.";
        return;
    }

    submit.disabled = true;

    try {
        // Pick the API function based on the current mode
        const apiCall = action === "login" ? loginUserAPI : registerUserAPI;
        const response = await apiCall(username, password);

        if (response.success) {
            window.location.href = "/";
        } else {
            errorEl.textContent =
                response.detail ||
                (action === "login"
                    ? "Invalid username or password."
                    : "Registration failed.");
        }
    } catch (err) {
        console.error(err);
        errorEl.textContent = "Something went wrong. Please try again.";
    } finally {
        submit.disabled = false;
    }
});



// Show / hide password
const passInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggle-pass");
const eyeShow = toggleBtn.querySelector(".eye-show");
const eyeClose = toggleBtn.querySelector(".eye-close");

toggleBtn.addEventListener("click", () => {
    const reveal = passInput.type === "password";
    passInput.type = reveal ? "text" : "password";

    eyeShow.toggleAttribute("hidden", reveal);
    eyeClose.toggleAttribute("hidden", !reveal);

    toggleBtn.setAttribute("aria-pressed", String(reveal));
    toggleBtn.setAttribute("aria-label", reveal ? "Hide password" : "Show password");

    passInput.focus();
});
