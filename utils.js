// utils.js - Utility functions

// Card animations function
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Last login function
function initLastLogin() {
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }
}

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    initLastLogin();
    initCardAnimations();
});
