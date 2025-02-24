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
    }

    initializeEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.previousBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateActiveLyrics();
            
            const track = this.playlist[this.currentTrackIndex];
            if (track.copyright) {
                const playedTime = this.audio.currentTime - (track.startTime || 0);
                if (playedTime >= 30) {
                    this.nextTrack();
                }
            }
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
            if (this.isPlaying) {
                this.audio.play().catch(error => console.log('Playback failed:', error));
            }
        });
        
        this.audio.addEventListener('loadedmetadata', () => {
            const track = this.playlist[this.currentTrackIndex];
            if (track.copyright) {
                this.durationEl.textContent = this.formatTime((track.startTime || 0) + 30);
            } else {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }
        });
        
        const progressContainer = this.player.querySelector('.progress-bar');
        progressContainer.addEventListener('click', (e) => {
            const track = this.playlist[this.currentTrackIndex];
            const clickPosition = e.offsetX / progressContainer.offsetWidth;
            let newTime;
            
            if (track.copyright) {
                const startTime = track.startTime || 0;
                const maxTime = startTime + 30;
                newTime = startTime + (clickPosition * 30);
                if (newTime > maxTime) newTime = maxTime;
            } else {
                newTime = clickPosition * this.audio.duration;
            }
            
            this.audio.currentTime = newTime;
        });
    }

    // Method to fetch and parse the SRT file
    fetchLyrics(srtUrl) {
        return fetch(srtUrl)
            .then(response => response.text())
            .then(srtText => {
                this.parseSRT(srtText);
            })
            .catch(error => {
                console.error('Error fetching lyrics:', error);
                // Fall back to static lyrics if SRT fetch fails
                this.setStaticLyrics();
            });
    }

    // Parse SRT text into timed lyrics
    parseSRT(srtText) {
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

    // Convert SRT time format to seconds
    timeToSeconds(timeString) {
        const [time, milliseconds] = timeString.split(',');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds) / 1000;
    }

    // Display static lyrics as fallback
    setStaticLyrics() {
        const lyrics = `¡Oye! Señor del Tamborín, toca una canción para mí
No tengo sueño y no hay ningún lugar al que vaya

¡Oye! Señor del Tamborín, toca una canción para mí
en el tintineo de la mañana vendré siguiéndote

Aunque sé que el imperio
del atardecer ha vuelto a ser arena
Se ha desvanecido entre mis manos,
Me dejó aquí ciego de pie,
pero aún sin dormir
oh mi cansancio me sorprende
estoy plantado en mis zapatos
No tengo a nadie con quien encontrarme
en estas antiguas calles vacías
demasiadas muertas para soñar`;
        
        // Split lyrics into lines
        const lines = lyrics.split('\n').filter(line => line.trim() !== '');
        
        this.srtData = lines.map((line, index) => {
            // Create a timing of about 4 seconds per line
            return {
                startTime: index * 4,
                endTime: (index + 1) * 4 - 0.1, // Subtract a small amount to prevent overlap
                text: line
            };
        });
        
        // Set initial active line
        this.activeLyricIndex = 0;
        this.renderLyrics();
    }

    // Update the active lyrics based on current playback time
    updateActiveLyrics() {
        if (!this.srtData || !this.lyricsContent) {
            return;
        }
        
        const currentTime = this.audio.currentTime;
        let foundActive = false;
        let newLyricIndex = -1;
        
        for (let i = 0; i < this.srtData.length; i++) {
            const line = this.srtData[i];
            if (currentTime >= line.startTime && currentTime <= line.endTime) {
                newLyricIndex = i;
                foundActive = true;
                break;
            }
        }
        
        // Show or hide the lyrics container based on whether there's active lyrics
        if (foundActive) {
            this.lyricsContainer.classList.remove('hidden');
        } else {
            this.lyricsContainer.classList.add('hidden');
        }
        
        // Only update if the lyric has changed
        if (newLyricIndex !== this.activeLyricIndex) {
            this.activeLyricIndex = newLyricIndex;
            this.renderLyrics();
        }
    }

    // Render the current lyric in the bubble
    renderLyrics() {
        // If no active lyrics, hide the container
        if (!this.srtData || this.activeLyricIndex === -1) {
            this.lyricsContent.textContent = "";
            this.lyricsContainer.classList.add('hidden');
            return;
        }
        
        const currentLyric = this.srtData[this.activeLyricIndex];
        
        // Create a new bubble effect by removing and adding animation
        const lyricsBubble = this.lyricsContainer.querySelector('.lyrics-bubble');
        lyricsBubble.style.animation = 'none';
        // Trigger reflow
        void lyricsBubble.offsetWidth;
        lyricsBubble.style.animation = 'bubble-fade 0.3s ease-in-out';
        
        // Update the content
        this.lyricsContent.textContent = currentLyric.text;
        
        // Ensure the container is visible
        this.lyricsContainer.classList.remove('hidden');
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.trackName.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.songLink.href = track.link;
        this.audio.src = track.audioUrl;
        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = track.copyright ? 
            this.formatTime(track.startTime || 0) : '0:00';
        
        // Reset lyrics state
        this.activeLyricIndex = -1;
        this.srtData = null;
        this.lyricsContainer.classList.add('hidden');
        
        // Only load lyrics for tracks that should have them
        if (track.title.includes("Tambourine") || track.lyricsUrl) {
            // If the track has an SRT URL defined, fetch it
            if (track.lyricsUrl) {
                this.fetchLyrics(track.lyricsUrl)
                    .then(() => {
                        // Initially render all lyrics
                        this.renderLyrics();
                    });
            } else {
                // Fall back to static lyrics
                this.setStaticLyrics();
            }
        }
        
        this.audio.addEventListener('loadedmetadata', () => {
            if (track.copyright && track.startTime) {
                this.audio.currentTime = track.startTime;
            }
            
            if (this.isPlaying) {
                this.playIcon.classList.add('hidden');
                this.pauseIcon.classList.remove('hidden');
            } else {
                this.playIcon.classList.remove('hidden');
                this.pauseIcon.classList.add('hidden');
            }
        }, { once: true });
        
        if (this.isPlaying) {
            this.audio.play().catch(error => console.log('Playback failed:', error));
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
            const track = this.playlist[this.currentTrackIndex];
            let percent;
            
            if (track.copyright) {
                const startTime = track.startTime || 0;
                const currentPosition = this.audio.currentTime - startTime;
                percent = (currentPosition / 30) * 100;
                if (percent < 0) percent = 0;
                if (percent > 100) percent = 100;
            } else {
                percent = (this.audio.currentTime / this.audio.duration) * 100;
            }
            
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
