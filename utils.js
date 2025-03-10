// utils.js - Utility functions
// Last login function
function initLastLogin() {
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }
}

// Handle music player toggle
function initMusicToggle() {
    const musicCard = document.querySelector('.card h3')?.textContent.toLowerCase().includes('music') 
        ? document.querySelector('.card h3').closest('.card') 
        : null;
    
    if (musicCard) {
        musicCard.addEventListener('click', (e) => {
            // Only toggle music player if it's the music card
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
            
            // Prevent default link behavior for this specific card
            e.preventDefault();
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
    initMusicToggle();
    animateSocialLinks();
});
