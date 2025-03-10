class AudioPlayerController {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.playlist = AUDIO_PLAYLIST;
        this.lyrics = null;
        this.srtData = null;
        this.activeLyricIndex = -1;
        this.lyricsContainer = document.getElementById('lyrics-container');
        this.lyricsContent = document.querySelector('.lyrics-content');
        this.lyricsVisible = false;
        
        this.initializePlayer();
        this.initializeEventListeners();
        this.loadTrack(this.currentTrackIndex);
    }

    initializePlayer() {
        this.player = document.querySelector('.music-player');
        this.trackName = this.player.querySelector('.track-name');
        this.artistName = this.player.querySelector('.artist-name');
        this.progressBar = this.player.querySelector('.progress-filled');
        this.currentTimeEl = this.player.querySelector('.current-time');
        this.durationEl = this.player.querySelector('.duration');
        this.playPauseBtn = this.player.querySelector('.play-pause');
        this.previousBtn = this.player.querySelector('.previous');
        this.nextBtn = this.player.querySelector('.next');
        this.songLink = this.player.querySelector('.song-link');
        this.playIcon = this.playPauseBtn.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        this.audio = document.getElementById('audio-player');
        
        // Create lyrics toggle button
        this.createLyricsToggleButton();
    }

    createLyricsToggleButton() {
        // Create lyrics toggle button and add to controls
        this.lyricsBtn = document.createElement('button');
        this.lyricsBtn.className = 'control-btn lyrics-toggle';
        this.lyricsBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
        
        // Insert before the song link
        const controls = this.player.querySelector('.controls');
        controls.insertBefore(this.lyricsBtn, this.songLink);
        
        // Initially hide lyrics button until we confirm lyrics exist
        this.lyricsBtn.style.display = 'none';
    }

    initializeEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.previousBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Add lyrics toggle button event listener
        this.lyricsBtn.addEventListener('click', () => this.toggleLyrics());
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateActiveLyrics();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        });
        
        const progressContainer = this.player.querySelector('.progress-bar');
        progressContainer.addEventListener('click', (e) => {
            const clickPosition = e.offsetX / progressContainer.offsetWidth;
            this.audio.currentTime = clickPosition * this.audio.duration;
        });
        
        // Close lyrics when clicking outside
        document.addEventListener('click', (e) => {
            if (this.lyricsVisible && 
                !this.lyricsContainer.contains(e.target) && 
                !this.lyricsBtn.contains(e.target)) {
                this.toggleLyrics(false);
            }
        });
    }

    toggleLyrics(force) {
        if (typeof force === 'boolean') {
            this.lyricsVisible = force;
        } else {
            this.lyricsVisible = !this.lyricsVisible;
        }
        
        // Update button style to indicate active state
        if (this.lyricsVisible) {
            this.lyricsBtn.classList.add('active');
        } else {
            this.lyricsBtn.classList.remove('active');
        }
        
        // Show or hide lyrics as dropdown
        if (this.lyricsVisible && this.srtData) {
            this.lyricsContainer.classList.remove('hidden');
            this.lyricsContainer.style.display = 'block';
            this.renderAllLyrics();
        } else {
            this.lyricsContainer.classList.add('hidden');
            this.lyricsContainer.style.display = 'none';
        }
    }

    fetchLyrics(srtUrl) {
        return fetch(srtUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(srtText => {
                this.parseSRT(srtText);
                // Update lyrics toggle button visibility based on whether lyrics exist
                if (this.srtData && this.srtData.length > 0) {
                    this.lyricsBtn.style.display = 'flex';
                } else {
                    this.lyricsBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching lyrics:', error);
                this.srtData = null;
                this.lyricsBtn.style.display = 'none';
            });
    }

    parseSRT(srtText) {
        // Make sure we have text to parse
        if (!srtText || typeof srtText !== 'string' || srtText.trim() === '') {
            console.error('Invalid SRT text:', srtText);
            this.srtData = null;
            return;
        }
        
        const srtLines = srtText.trim().split('\n\n');
        this.srtData = [];
        
        srtLines.forEach(block => {
            const lines = block.split('\n');
            if (lines.length < 3) return;
            
            // Get time codes
            const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
            if (!timeMatch) return;
            
            // Convert time format (00:00:06,494) to seconds
            const startTime = this.timeToSeconds(timeMatch[1]);
            const endTime = this.timeToSeconds(timeMatch[2]);
            
            // Get the text (could be multiple lines)
            const text = lines.slice(2).join(' ');
            
            this.srtData.push({
                startTime,
                endTime,
                text
            });
        });
    }

    timeToSeconds(timeString) {
        const [time, milliseconds] = timeString.split(',');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds) / 1000;
    }

    updateActiveLyrics() {
        if (!this.srtData || !this.lyricsContent || !this.lyricsVisible) {
            return;
        }
        
        const currentTime = this.audio.currentTime;
        let newLyricIndex = -1;
        
        for (let i = 0; i < this.srtData.length; i++) {
            const line = this.srtData[i];
            if (currentTime >= line.startTime && currentTime <= line.endTime) {
                newLyricIndex = i;
                break;
            }
        }
        
        // Only update if the lyric has changed
        if (newLyricIndex !== this.activeLyricIndex) {
            this.activeLyricIndex = newLyricIndex;
            this.highlightActiveLyric();
        }
    }
    
    renderAllLyrics() {
        if (!this.srtData || this.srtData.length === 0) {
            this.lyricsContent.innerHTML = "<p>No lyrics available</p>";
            return;
        }
        
        // Clear previous content
        this.lyricsContent.innerHTML = "";
        
        // Create a wrapper for scrollable lyrics
        const lyricsWrapper = document.createElement('div');
        lyricsWrapper.className = 'lyrics-wrapper';
        
        // Add each lyric line with timing
        this.srtData.forEach((lyric, index) => {
            const lyricLine = document.createElement('p');
            lyricLine.textContent = lyric.text;
            lyricLine.dataset.index = index;
            lyricLine.className = 'lyric-line';
            
            // Add click event to seek to this lyric's time
            lyricLine.addEventListener('click', () => {
                this.audio.currentTime = lyric.startTime;
                if (!this.isPlaying) {
                    this.togglePlayPause();
                }
            });
            
            lyricsWrapper.appendChild(lyricLine);
        });
        
        this.lyricsContent.appendChild(lyricsWrapper);
        this.highlightActiveLyric();
    }
    
    highlightActiveLyric() {
        if (!this.lyricsVisible || this.activeLyricIndex === -1) return;
        
        // Remove highlight from all lyric lines
        const allLines = this.lyricsContent.querySelectorAll('.lyric-line');
        allLines.forEach(line => {
            line.style.fontWeight = 'normal';
            line.style.color = 'rgba(255, 255, 255, 0.8)';
        });
        
        // Add highlight to active line
        const activeLine = this.lyricsContent.querySelector(`.lyric-line[data-index="${this.activeLyricIndex}"]`);
        if (activeLine) {
            activeLine.style.fontWeight = 'bold';
            activeLine.style.color = 'white';
            
            // Scroll to make the active line visible
            const wrapper = activeLine.parentElement;
            if (wrapper) {
                const lineTop = activeLine.offsetTop;
                const wrapperHeight = wrapper.clientHeight;
                const scrollTop = wrapper.scrollTop;
                
                if (lineTop < scrollTop || lineTop > scrollTop + wrapperHeight) {
                    wrapper.scrollTop = lineTop - (wrapperHeight / 2);
                }
            }
        }
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.trackName.textContent = track.title || "Unknown Title";
        this.artistName.textContent = track.artist || "Unknown Artist";
        this.songLink.href = track.link || "#";
        this.audio.src = track.audioUrl;
        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        
        // Reset lyrics state
        this.activeLyricIndex = -1;
        this.srtData = null;
        
        // Hide lyrics toggle button by default until we know lyrics exist
        this.lyricsBtn.style.display = 'none';
        
        // Hide lyrics container if it was previously shown
        if (this.lyricsVisible) {
            this.toggleLyrics(false);
        }
        
        // Only load lyrics for tracks that have an SRT URL
        if (track.lyricsUrl) {
            this.fetchLyrics(track.lyricsUrl);
        }
        
        // Handle track start time if specified
        if (track.startTime) {
            this.audio.addEventListener('loadedmetadata', () => {
                this.audio.currentTime = track.startTime;
            }, { once: true });
        }
        
        // Update play/pause button state
        if (this.isPlaying) {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
            this.audio.play().catch(error => console.log('Playback failed:', error));
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
        }
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
            this.audio.play().catch(error => console.log('Playback failed:', error));
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
            this.audio.pause();
        }
    }

    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.audio.play().catch(error => console.log('Playback failed:', error));
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = `${percent}%`;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}
