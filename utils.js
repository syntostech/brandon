// utils.js - Utility functions

// Last login function
function initLastLogin() {
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }
}

// Initialize music player
function initMusicPlayer() {
    const musicPlayer = document.querySelector('.music-player');
    const musicCard = document.querySelector('.music-card');
    
    // Set up music player defaults
    if (musicPlayer) {
        const audioPlayer = document.getElementById('audio-player');
        const playPauseBtn = document.querySelector('.play-pause');
        
        // Set up play/pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                const playIcon = playPauseBtn.querySelector('.play-icon');
                const pauseIcon = playPauseBtn.querySelector('.pause-icon');
                
                if (playIcon.classList.contains('hidden')) {
                    // Currently playing, pause it
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                    if (audioPlayer) audioPlayer.pause();
                } else {
                    // Currently paused, play it
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                    if (audioPlayer) audioPlayer.play().catch(error => console.log('Playback failed:', error));
                }
            });
        }
    }
    
    // Music card should still toggle player visibility on mobile
    if (musicCard && window.innerWidth < 768) {
        musicCard.addEventListener('click', (e) => {
            e.preventDefault();
            musicPlayer.classList.toggle('minimized');
        });
    }
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

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    initLastLogin();
    initMusicPlayer();
    animateSocialLinks();
});
