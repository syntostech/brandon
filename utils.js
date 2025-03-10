// utils.js - Utility functions

// Animate social links
function animateSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        link.style.animation = 'fadeInUp 0.5s ease-out forwards';
        link.style.opacity = '0';
    });
}

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    initLastLogin();
    animateSocialLinks();
    
    // Let AudioPlayerController handle the music player initialization
    // Don't call initMusicPlayer() from here
});
