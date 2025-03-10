// app.js - Main application initialization

// Initialize the audio player when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the audio player if it exists on the page
    if (document.querySelector('.music-player')) {
        // Create a new instance of the audio player controller
        const player = new AudioPlayerController();
        
        // Store the player instance globally for potential access from other scripts
        window.audioPlayer = player;
    }
    
    // Add smooth scroll behavior to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
