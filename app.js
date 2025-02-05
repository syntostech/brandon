document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player if element exists
    if (document.querySelector('.music-player')) {
        const player = new AudioPlayerController();
    }
});
