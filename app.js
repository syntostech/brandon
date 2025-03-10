// app.js - Main application file
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.music-player')) {
        const player = new AudioPlayerController();
        
        // Add mobile-specific toggle for minimized player if needed
        const musicCard = document.querySelector('.music-card');
        if (musicCard && window.innerWidth < 768) {
            musicCard.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.music-player').classList.toggle('minimized');
            });
        }
    }
});
