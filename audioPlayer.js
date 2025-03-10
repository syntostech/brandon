// audioPlayer.js - Music player and lyrics functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const audioElement = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const prevBtn = document.querySelector('.previous');
    const nextBtn = document.querySelector('.next');
    const trackName = document.querySelector('.track-name');
    const artistName = document.querySelector('.artist-name');
    const progressBar = document.querySelector('.progress-bar');
    const progressFilled = document.querySelector('.progress-filled');
    const currentTimeElement = document.querySelector('.current-time');
    const durationElement = document.querySelector('.duration');
    const songLink = document.querySelector('.song-link');
    const lyricsToggle = document.querySelector('.lyrics-toggle');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsContent = document.querySelector('.lyrics-content');

    // Player state
    let currentTrackIndex = 0;
    let isPlaying = false;
    let currentLyrics = [];
    let activeLyricIndex = -1;

    // Initialize the player
    initPlayer();

    function initPlayer() {
        loadTrack(currentTrackIndex);
        
        // Event listeners
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', playPreviousTrack);
        nextBtn.addEventListener('click', playNextTrack);
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('ended', playNextTrack);
        progressBar.addEventListener('click', setProgress);
        
        // Lyrics toggle
        lyricsToggle.addEventListener('click', toggleLyrics);
        
        // Keyboard controls
        document.addEventListener('keydown', handleKeyboardControls);
    }

    // Load track data
    async function loadTrack(index) {
        const track = AUDIO_PLAYLIST[index];
        
        // Update track info
        trackName.textContent = track.title;
        artistName.textContent = track.artist;
        
        // Set audio source
        audioElement.src = track.audioUrl;
        
        // Update link
        songLink.href = track.link;
        
        // Reset progress
        progressFilled.style.width = '0%';
        currentTimeElement.textContent = '0:00';
        
        // Load lyrics if available
        if (track.lyricsUrl) {
            await loadLyrics(track.lyricsUrl);
            lyricsToggle.disabled = false;
        } else {
            currentLyrics = [];
            lyricsContent.innerHTML = '<div class="lyric-line">No lyrics available</div>';
            lyricsToggle.disabled = true;
            lyricsToggle.classList.remove('active');
            lyricsContainer.classList.add('hidden');
        }
        
        // Load audio metadata
        audioElement.addEventListener('loadedmetadata', function() {
            durationElement.textContent = formatTime(audioElement.duration);
        });
        
        // Reset playing state
        if (isPlaying) {
            playAudio();
        }
    }

    // Load and parse lyrics
    async function loadLyrics(url) {
        const lyricsText = await fetchTextContent(url);
        if (lyricsText) {
            currentLyrics = parseSRT(lyricsText);
            displayLyrics();
        } else {
            currentLyrics = [];
            lyricsContent.innerHTML = '<div class="lyric-line">Failed to load lyrics</div>';
        }
    }

    // Display lyrics in the container
    function displayLyrics() {
        lyricsContent.innerHTML = '';
        currentLyrics.forEach((lyric, index) => {
            const lyricElement = document.createElement('div');
            lyricElement.className = 'lyric-line';
            lyricElement.textContent = lyric.text;
            lyricElement.dataset.index = index;
            lyricElement.addEventListener('click', () => {
                audioElement.currentTime = lyric.startTime;
            });
            lyricsContent.appendChild(lyricElement);
        });
    }

    // Toggle lyrics visibility
    function toggleLyrics() {
        lyricsContainer.classList.toggle('hidden');
        lyricsToggle.classList.toggle('active');
        
        // Scroll to active lyric if visible
        if (!lyricsContainer.classList.contains('hidden') && activeLyricIndex >= 0) {
            const activeLyric = lyricsContent.querySelector(`.lyric-line[data-index="${activeLyricIndex}"]`);
            if (activeLyric) {
                activeLyric.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Update active lyric based on current time
    function updateActiveLyric(currentTime) {
        if (currentLyrics.length === 0) return;
        
        // Find the current lyric based on time
        let newActiveIndex = -1;
        for (let i = 0; i < currentLyrics.length; i++) {
            if (currentTime >= currentLyrics[i].startTime && currentTime <= currentLyrics[i].endTime) {
                newActiveIndex = i;
                break;
            }
        }
        
        // If active lyric changed, update the display
        if (newActiveIndex !== activeLyricIndex) {
            // Remove active class from previous lyric
            if (activeLyricIndex >= 0) {
                const prevLyric = lyricsContent.querySelector(`.lyric-line[data-index="${activeLyricIndex}"]`);
                if (prevLyric) prevLyric.classList.remove('active');
            }
            
            // Add active class to new lyric
            if (newActiveIndex >= 0) {
                const newLyric = lyricsContent.querySelector(`.lyric-line[data-index="${newActiveIndex}"]`);
                if (newLyric) {
                    newLyric.classList.add('active');
                    
                    // Auto-scroll if lyrics are visible
                    if (!lyricsContainer.classList.contains('hidden')) {
                        newLyric.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
            
            activeLyricIndex = newActiveIndex;
        }
    }

    // Play/Pause toggle
    function togglePlayPause() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    // Play audio
    function playAudio() {
        audioElement.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        isPlaying = true;
    }

    // Pause audio
    function pauseAudio() {
        audioElement.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        isPlaying = false;
    }

    // Play previous track
    function playPreviousTrack() {
        currentTrackIndex--;
        if (currentTrackIndex < 0) {
            currentTrackIndex = AUDIO_PLAYLIST.length - 1;
        }
        loadTrack(currentTrackIndex);
        playAudio();
    }

    // Play next track
    function playNextTrack() {
        currentTrackIndex++;
        if (currentTrackIndex >= AUDIO_PLAYLIST.length) {
            currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        playAudio();
    }

    // Update progress bar
    function updateProgress() {
        const duration = audioElement.duration;
        const currentTime = audioElement.currentTime;
        
        if (duration) {
            // Update progress bar
            const progressPercent = (currentTime / duration) * 100;
            progressFilled.style.width = `${progressPercent}%`;
            
            // Update time display
            currentTimeElement.textContent = formatTime(currentTime);
            
            // Update lyrics if available
            updateActiveLyric(currentTime);
        }
    }

    // Set progress based on click position
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioElement.duration;
        
        audioElement.currentTime = (clickX / width) * duration;
    }

    // Handle keyboard controls
    function handleKeyboardControls(e) {
        // Space - Play/Pause
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
        // Left Arrow - Previous Track
        else if (e.code === 'ArrowLeft') {
            playPreviousTrack();
        }
        // Right Arrow - Next Track
        else if (e.code === 'ArrowRight') {
            playNextTrack();
        }
        // L - Toggle Lyrics
        else if (e.code === 'KeyL') {
            if (!lyricsToggle.disabled) {
                toggleLyrics();
            }
        }
    }
});
