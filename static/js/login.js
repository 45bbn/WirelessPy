const form = document.getElementById("login-form");
const errorEl = document.getElementById("error");
const submit = document.getElementById("submit");

form.addEventListener("submit", async e => {
    e.preventDefault();
    errorEl.textContent = "";
    const username = form.username.value.trim(), password = form.password.value;
    
    if (!username || !password) { 
        errorEl.textContent = "Enter your username and password."; 
        return; 
    }
    
    submit.disabled = true;
    
    try {
        // 1. TAMBAHKAN "const" DI SINI
        const response = await fetch("/api/auth/login", { 
            method: "POST", 
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ username, password }) 
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            errorEl.textContent = "Invalid username or password.";
        }
        
    } catch (error) {
        console.error(error);
        errorEl.textContent = "Network error. Please try again.";
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

    // SVG elements have no .hidden property, so toggle the attribute directly.
    // The CSS rule .toggle-pass svg[hidden] { display: none } does the hiding.
    eyeShow.toggleAttribute("hidden", reveal);
    eyeClose.toggleAttribute("hidden", !reveal);

    toggleBtn.setAttribute("aria-pressed", String(reveal));
    toggleBtn.setAttribute("aria-label", reveal ? "Hide password" : "Show password");

    passInput.focus();
});