import {getUsernameApi} from "/static/js/api.js";

// USERPROFILE
export function initProfileMenu() {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    // Guard so we get a clear error instead of a null crash
    if (!profileBtn || !profileMenu) {
        console.error("Profile menu elements not found");
        return;
    }

    function closeMenu() {
        profileMenu.classList.remove('show');
    }

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the document click from closing it immediately
        profileMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

export async function initUser() {
    const username = await getUsernameApi();
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('userNameMenu').textContent = username;
}

export async function logout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', async () => {
        if (!confirm("Are you sure you want to log out?")) return;

        logoutBtn.disabled = true;
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) {
                throw new Error(`Logout failed: ${response.status}`);
            }
            window.location.replace('/login');
        } catch (err) {
            console.error("Error logout", err);
            alert("Logout failed, please try again.");
            logoutBtn.disabled = false;
        }
    });
}
