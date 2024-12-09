document.addEventListener('DOMContentLoaded', () => {
    const playlistButton = document.getElementById('playlistButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const playlistTracksContainer = document.getElementById('playlistTracks');
    const currentTrackName = document.getElementById('currentTrackName');

    // Playlist of songs
    const playlist = [
        {
            name: "The River (Remix)",
            url: "https://syntos.xyz/music/river.mp3"
        },
        {
            name: "Heroes", 
            url: "https://syntos.xyz/music/heroes.mp3"
        },
                {
            name: "Crossfire", 
            url: "https://syntos.xyz/music/crossfire.mp3"
        }
    ];

    let currentTrackIndex = 0;

    // Render playlist tracks
    function renderPlaylist() {
        playlistTracksContainer.innerHTML = playlist.map((track, index) => `
            <div class="track-item" data-index="${index}">
                ${track.name}
            </div>
        `).join('');

        // Add click event to each track
        document.querySelectorAll('.track-item').forEach(trackElement => {
            trackElement.addEventListener('click', () => {
                const index = parseInt(trackElement.dataset.index);
                playTrack(index);
            });
        });
    }

    // Play a specific track
    function playTrack(index) {
        currentTrackIndex = index;
        audioPlayer.src = playlist[index].url;
        currentTrackName.textContent = playlist[index].name;
        
        // Update active track styling
        document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.track-item[data-index="${index}"]`).classList.add('active');
        
        audioPlayer.play()
            .then(() => {
                playlistButton.textContent = 'Pausar';
            })
            .catch(error => {
                console.error('Error playing track:', error);
                alert('this song cannot be played at this time.');
            });
    }

    // Toggle play/pause
    playlistButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    playlistButton.textContent = 'Pause';
                });
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

    // Initial render
    renderPlaylist();
});
