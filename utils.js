// utils.js - Utility functions

// Last login function
function initLastLogin() {
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }
}

// Check if music player toggle should be shown
function initMusicToggle() {
    const musicLinks = document.querySelectorAll('.menu-link');
    musicLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes('music')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const musicPlayer = document.querySelector('.music-player');
                musicPlayer.classList.toggle('hidden');
                
                // If showing the player, start playing
                if (!musicPlayer.classList.contains('hidden')) {
                    const playPauseBtn = document.querySelector('.play-pause');
                    const playIcon = playPauseBtn.querySelector('.play-icon');
                    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
                    
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                    
                    // Trigger play via the audio controller if it exists
                    const audioPlayer = document.getElementById('audio-player');
                    if (audioPlayer) {
                        audioPlayer.play().catch(error => console.log('Playback failed:', error));
                    }
                }
            });
        }
    });
}

// Animate social links
function animateSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        link.style.animation = 'fadeInUp 0.5s ease-out forwards';
        link.style.opacity = '0';
    });
}

// Animate menu links
function animateMenuLinks() {
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach((link, index) => {
        link.style.animationDelay = `${0.8 + (index * 0.1)}s`;
        link.style.animation = 'fadeInUp 0.5s ease-out forwards';
        link.style.opacity = '0';
    });
}

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    initLastLogin();
    initMusicToggle();
    animateSocialLinks();
    animateMenuLinks();
});
