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
        }
    ];

    let currentTrackIndex = 0;
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

    // Play a specific track
    function playTrack(index) {
        currentTrackIndex = index;
        audioPlayer.src = playlist[index].url;
        
        audioPlayer.play()
            .then(() => {
                playlistButton.textContent = 'Pause';
                // Show attribution for current track
                showAttribution(playlist[index]);
            })
            .catch(error => {
                console.error('Error playing track:', error);
                alert('this song cannot be played at this time.');
            });
    }

    // Toggle play/pause
    playlistButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            // If no track is playing, start from the beginning or current track
            if (audioPlayer.src === '') {
                playTrack(0);
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

    // Auto-play next track
    audioPlayer.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack(currentTrackIndex);
    });
});
