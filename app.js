// app.js - Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initLastLogin();
    initCardAnimations();
    
    // Initialize music player if element exists
    if (document.querySelector('.music-player')) {
        const player = new AudioPlayerController();
    }
    
    // Initialize newsletter if element exists
    if (document.querySelector('.newsletter-container')) {
        const newsletter = new NewsletterManager();
    }
});
