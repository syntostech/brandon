document.addEventListener('DOMContentLoaded', () => {
    const playlistButton = document.getElementById('playlistButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const attributionBubble = document.getElementById('attributionBubble');

    // Playlist of songs
    const playlist = [
        {
            name: "The River (Remix)",
            artist: "AURORA & Askjell",
            url: "https://syntos.xyz/music/river.mp3",
            link: "https://youtu.be/Q2kURz7xFj8"
        },
        {
            name: "CrossFire",
            artist: "Stephen", 
            url: "https://syntos.xyz/music/crossfire.mp3",
            link: "https://mrsuicidesheep.ffm.to/stephen-crossfire"
        },
        {
            name: "Heroes",
            artist: "Alesso & Tove Lo",
            url: "https://syntos.xyz/music/heroes.mp3",
            link: "https://alesso.lnk.to/forever"
        },
        {
            name: "To be loved",
            artist: "AURORA & Askjell",
            url: "https://syntos.xyz/music/loved.mp3",
            link: "https://askjell.lnk.to/ToBeLoved_ftAuroraID"
        }
    ];

    let previousTracks = [];
    let attributionTimeout;

    // Show attribution bubble
    function showAttribution(track) {
        // Clear any existing timeout
        if (attributionTimeout) {
            clearTimeout(attributionTimeout);
        }

        // Update attribution text
        attributionBubble.innerHTML = `
            ${track.name} - ${track.artist} 
            <a href="${track.link}" target="_blank">Listen here</a>
        `;

        // Show bubble
        attributionBubble.classList.add('show');

        // Hide after 5 seconds
        attributionTimeout = setTimeout(() => {
            attributionBubble.classList.remove('show');
        }, 5000);
    }

    // Select a random track, avoiding recently played tracks
    function getRandomTrack() {
        // If we've played all tracks, reset the previous tracks
        if (previousTracks.length >= playlist.length) {
            previousTracks = [];
        }

        // Filter out previously played tracks
        const availableTracks = playlist.filter(track => 
            !previousTracks.includes(track)
        );

        // Select a random track from available tracks
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        const selectedTrack = availableTracks[randomIndex];
        
        // Add to previous tracks
        previousTracks.push(selectedTrack);

        return selectedTrack;
    }

    // Play a random track
    function playRandomTrack() {
        const track = getRandomTrack();
        
        audioPlayer.src = track.url;
        
        audioPlayer.play()
            .then(() => {
                playlistButton.textContent = 'Pause';
                // Show attribution for current track
                showAttribution(track);
            })
            .catch(error => {
                console.error('Error playing track:', error);
                alert('this song cannot be played at this time');
            });
    }

    // Toggle play/pause
    playlistButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            // If no track is playing, start with a random track
            if (audioPlayer.src === '') {
                playRandomTrack();
            } else {
                audioPlayer.play()
                    .then(() => {
                        playlistButton.textContent = 'Pause';
                    });
            }
        } else {
            audioPlayer.pause();
            playlistButton.textContent = 'Play';
        }
    });

    // Auto-play next random track
    audioPlayer.addEventListener('ended', () => {
        playRandomTrack();
    });
});
