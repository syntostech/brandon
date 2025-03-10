// utils.js - Utility functions for the website

// Animate social links with a staggered delay
function animateSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        link.style.animation = 'fadeInUp 0.5s ease-out forwards';
        link.style.opacity = '0';
    });
}

// Handle mobile-specific functionality
function handleMobileLayout() {
    if (window.innerWidth < 768) {
        const musicPlayer = document.querySelector('.music-player');
        if (musicPlayer) {
            const musicCard = document.querySelector('.music-card');
            if (musicCard) {
                musicCard.addEventListener('click', (e) => {
                    e.preventDefault();
                    musicPlayer.classList.toggle('minimized');
                });
            }
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements
    animateSocialLinks();
    
    // Handle mobile-specific features
    handleMobileLayout();
});
