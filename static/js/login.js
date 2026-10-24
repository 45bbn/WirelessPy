document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Tahan biar halaman nggak reload
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Kasih efek loading
    loginBtn.innerText = "Authenticating...";
    loginBtn.disabled = true;
    errorMsg.style.display = "none";

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            // Kalau sukses (200 OK), lempar ke dashboard
            window.location.href = '/';
        } else {
            // Kalau gagal (401), tampilkan error
            errorMsg.innerText = "Username atau password salah!";
            errorMsg.style.display = "block";
            loginBtn.innerText = "Login";
            loginBtn.disabled = false;
        }
    } catch (err) {
        errorMsg.innerText = "Server error, coba lagi nanti.";
        errorMsg.style.display = "block";
        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
    }
});