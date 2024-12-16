document.addEventListener('DOMContentLoaded', () => {
    const playlistButton = document.getElementById('playlistButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const attributionBubble = document.getElementById('attributionBubble');

    
    const playlist = [
        {
            name: "The River (Remix)",
            artist: "AURORA & Askjell",
            url: "https://syntos.xyz/cdn/music/brandon/river.mp3",
            link: "https://youtu.be/Q2kURz7xFj8"
        },
        {
            name: "CrossFire",
            artist: "Stephen", 
            url: "https://syntos.xyz/cdn/music/brandon/crossfire.mp3",
            link: "https://mrsuicidesheep.ffm.to/stephen-crossfire"
        },
        {
            name: "Heroes",
            artist: "Alesso & Tove Lo",
            url: "https://syntos.xyz/cdn/music/brandon/heroes.mp3",
            link: "https://alesso.lnk.to/forever"
        },
        {
            name: "Medicine",
            artist: "Daughter",
            url: "https://syntos.xyz/cdn/music/brandon/medicine.mp3",
            link: "https://youtu.be/_lhkfaqFmpM"
        },
        {
            name: "Human",
            artist: "Daughter",
            url: "https://syntos.xyz/cdn/music/brandon/human.mp3",
            link: "https://smarturl.it/daughteritunes"
        },
        {
            name: "The Greatest",
            artist: "Sia & Kendrick Lamar",
            url: "https://syntos.xyz/cdn/music/brandon/greatest.mp3",
            link: "https://sia.lnk.to/listenYD"
        },
        {
            name: "To be loved",
            artist: "AURORA & Askjell",
            url: "https://syntos.xyz/cdn/music/brandon/loved.mp3",
            link: "https://askjell.lnk.to/ToBeLoved_ftAuroraID"
        }
    ];

    let previousTracks = [];
    let attributionTimeout;


function showAttribution(track) {
    if (attributionTimeout) {
        clearTimeout(attributionTimeout);
    }


    attributionBubble.innerHTML = `
        ${track.name} - ${track.artist} 
        <a href="${track.link}" target="_blank">Listen here</a>
    `;


    attributionBubble.style.display = 'block';
    attributionBubble.style.opacity = '1';


    attributionTimeout = setTimeout(() => {
        attributionBubble.style.display = 'none';
        attributionBubble.style.opacity = '0';
    }, 5000);
}

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

    // Fade in the new track
    audioPlayer.volume = 0;
    audioPlayer.play()
        .then(() => {
            playlistButton.textContent = 'Pause';
            // Show attribution for current track
            showAttribution(track);

            // Fade in the new track
            let fadeInInterval = setInterval(() => {
                if (audioPlayer.volume < 1) {
                    audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
                } else {
                    clearInterval(fadeInInterval);
                }
            }, 100);

            // Set a timeout to switch to the next track after 60 seconds
            const timeUpdateHandler = () => {
                if (audioPlayer.currentTime >= 90) {
                    audioPlayer.removeEventListener('timeupdate', timeUpdateHandler);

                    // Fade out the current track
                    let fadeOutInterval = setInterval(() => {
                        if (audioPlayer.volume > 0) {
                            audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
                        } else {
                            clearInterval(fadeOutInterval);
                            audioPlayer.pause();
                            playRandomTrack();
                        }
                    }, 100);
                }
            };
            audioPlayer.addEventListener('timeupdate', timeUpdateHandler);
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
