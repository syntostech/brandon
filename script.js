document.addEventListener('DOMContentLoaded', () => {
    const playlistButton = document.getElementById('playlistButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const playlistTracksContainer = document.getElementById('playlistTracks');
    const currentTrackName = document.getElementById('currentTrackName');

    // Playlist of songs
    const playlist = [
        {
            name: "Canción 1",
            url: "https://www.syntos.xyz/music/crossfire"
        },
        {
            name: "Canción 2", 
            url: "https://ejemplo.com/cancion2.mp3"
        },
        {
            name: "Canción 3",
            url: "https://ejemplo.com/cancion3.mp3"
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
                alert('No se pudo reproducir la canción.');
            });
    }

    // Toggle play/pause
    playlistButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    playlistButton.textContent = 'Pausar';
                });
        } else {
            audioPlayer.pause();
            playlistButton.textContent = 'Reproducir';
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
