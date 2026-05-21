// 1. Multi-User Database (Admin aur Worker)
const USERS_DB = {
    admin: {
        username: "admin",
        password: "123",
        expiryDate: "2027-01-01" // TEST KE LIYE: Is date ko past date kar ke expiry check kar sakte hain
    },
    worker: {
        username: "worker",
        password: "456",
        expiryDate: "2026-12-31"
    }
};

// ==========================================
// 🚨 SAAS SECURITY & ROLE-BASED ACCESS
// ==========================================

const currentUserRole = localStorage.getItem('currentUserRole');

// Agar koi bina login kiye direct aaya hai
if (!currentUserRole) {
    // Window load hote hi hamara custom modal show ho jaye
    window.addEventListener('DOMContentLoaded', () => {
        const secModal = document.getElementById('securityModal');
        if (secModal) {
            secModal.classList.add('active');
        }
    });
}

// Button par click karne se login page par bhejne ka function
function goToLogin() {
    window.location.href = "Login_Page/login.html";
}

// 2. Sidebar elements ko select karna (Pehle wala same code)
const inventoryLink = document.querySelector('.nav-inventory');
const salesReportsLink = document.querySelector('.nav-sales');
const settingsLink = document.querySelector('.nav-setting');

if (currentUserRole === 'worker') {
    if(inventoryLink) inventoryLink.style.display = 'none';
    if(salesReportsLink) salesReportsLink.style.display = 'none';
    if(settingsLink) settingsLink.style.display = 'none';
}

// HTML elements select karna
const loginForm = document.getElementById('loginForm');
const modal = document.getElementById('customModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

// 2. Custom Popup Show karne ka function
function showPopup(type, title, message, redirect = false) {
    modalIcon.innerText = type === "success" ? "🎉" : "❌";
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    
    modal.classList.add('active');

    // Agar successful login hai toh 2 second baad automatic dashboard khul jaye
    if (redirect) {
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 2000);
    }
}

// 3. Popup Close karne ka function (Jab user Okay dabaye)
function closeModal() {
    modal.classList.remove('active');
}

// 4. Form Submit Logic (Automatic Selector)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;

    let matchedUser = null;
    let userRole = null;

    // Check karna ke typed username kis ke sath match hota hai
    if (usernameInput === USERS_DB.admin.username) {
        matchedUser = USERS_DB.admin;
        userRole = "admin";
    } else if (usernameInput === USERS_DB.worker.username) {
        matchedUser = USERS_DB.worker;
        userRole = "worker";
    }

    // A. Agar Username mil gaya database mein
    if (matchedUser) {
        
        // B. Password check karna
        if (passwordInput === matchedUser.password) {
            
            // C. SaaS Subscription Expiry check karna
            const today = new Date();
            const expiry = new Date(matchedUser.expiryDate);

            if (today > expiry) {
                showPopup("error", "Subscription Expired", "Aap ki subscription khatam ho chuki hai. Please admin se rabta kar ke renew karwayein.");
            } else {
                // Role ko save karna taa ke main dashboard ko pata chale ke kaun aaya hai
                localStorage.setItem('currentUserRole', userRole);
                showPopup("success", "Login Successful", `Welcome back as ${userRole.toUpperCase()}! Redirecting...`, true);
            }

        } else {
            showPopup("error", "Access Denied", "Aap ka password durust nahi hai. Dubara koshish karein.");
        }

    } else {
        showPopup("error", "User Not Found", "Yeh username hamare system mein mojood nahi hai.");
    }
});