// audioPlayer.js - Audio player controller with lyrics functionality

class AudioPlayerController {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.playlist = AUDIO_PLAYLIST;
        this.srtData = null;
        this.activeLyricIndex = -1;
        this.lyricsVisible = false;
        
        this.initializePlayer();
        this.initializeEventListeners();
        this.loadTrack(this.currentTrackIndex);
    }

    initializePlayer() {
        // Main player elements
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
        
        // Lyrics elements
        this.lyricsBtn = this.player.querySelector('.lyrics-button');
        this.lyricsContainer = document.getElementById('lyrics-container');
        this.lyricsContent = this.lyricsContainer.querySelector('.lyrics-content');
    }

    initializeEventListeners() {
        // Player control events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.previousBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.lyricsBtn.addEventListener('click', () => this.toggleLyrics());
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            if (this.lyricsVisible) {
                this.updateActiveLyrics();
            }
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = formatTime(this.audio.duration);
        });
        
        // Progress bar click event
        const progressContainer = this.player.querySelector('.progress-bar');
        progressContainer.addEventListener('click', (e) => {
            const clickPosition = e.offsetX / progressContainer.offsetWidth;
            this.audio.currentTime = clickPosition * this.audio.duration;
        });
    }

    loadTrack(index) {
        // Reset
        this.activeLyricIndex = -1;
        this.lyricsContent.innerHTML = '';
        
        // Get current track
        const track = this.playlist[index];
        
        // Update player UI
        this.trackName.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.audio.src = track.audioUrl;
        this.songLink.href = track.link;
        
        // Reset progress
        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        
        // Fetch lyrics if available
        if (track.lyricsUrl) {
            this.fetchLyrics(track.lyricsUrl);
        } else {
            this.srtData = null;
            this.lyricsBtn.style.display = 'none';
        }
        
        // If previously playing, autoplay the new track
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }

    playAudio() {
        this.audio.play();
        this.isPlaying = true;
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
    }

    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.pauseIcon.classList.add('hidden');
        this.playIcon.classList.remove('hidden');
    }

    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }

    updateProgress() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 1;
        const progressPercent = (currentTime / duration) * 100;
        
        this.progressBar.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = formatTime(currentTime);
    }

    toggleLyrics() {
        this.lyricsVisible = !this.lyricsVisible;
        
        // Update button style
        if (this.lyricsVisible) {
            this.lyricsBtn.classList.add('active');
            this.lyricsContainer.classList.remove('hidden');
            this.renderLyrics();
            this.updateActiveLyrics();
        } else {
            this.lyricsBtn.classList.remove('active');
            this.lyricsContainer.classList.add('hidden');
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
                // Show or hide lyrics button based on available lyrics
                if (this.srtData && this.srtData.length > 0) {
                    this.lyricsBtn.style.display = 'block';
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
        // Reset data
        this.srtData = [];
        
        // Make sure we have text to parse
        if (!srtText || typeof srtText !== 'string' || srtText.trim() === '') {
            return;
        }
        
        const srtLines = srtText.trim().split('\n\n');
        
        srtLines.forEach(block => {
            const lines = block.split('\n');
            if (lines.length < 3) return;
            
            // Get time codes
            const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
            if (!timeMatch) return;
            
            // Convert time format (00:00:06,494) to seconds
            const startTime = timeToSeconds(timeMatch[1]);
            const endTime = timeToSeconds(timeMatch[2]);
            
            // Get the text (could be multiple lines)
            const text = lines.slice(2).join(' ').trim();
            
            this.srtData.push({
                id: parseInt(lines[0]),
                startTime,
                endTime,
                text
            });
        });
    }

    renderLyrics() {
        // Clear current content
        this.lyricsContent.innerHTML = '';
        
        // Make sure we have lyrics to render
        if (!this.srtData || this.srtData.length === 0) {
            this.lyricsContent.innerHTML = '<div class="lyric-line">No lyrics available</div>';
            return;
        }
        
        // Create elements for each lyric line
        this.srtData.forEach((lyric, index) => {
            const lyricElement = document.createElement('div');
            lyricElement.className = 'lyric-line';
            lyricElement.dataset.index = index;
            lyricElement.textContent = lyric.text;
            
            // Add click event to jump to this part of the song
            lyricElement.addEventListener('click', () => {
                this.audio.currentTime = lyric.startTime;
                this.updateActiveLyrics();
            });
            
            this.lyricsContent.appendChild(lyricElement);
        });
    }

    updateActiveLyrics() {
        if (!this.srtData || this.srtData.length === 0) return;
        
        const currentTime = this.audio.currentTime;
        let newActiveIndex = -1;
        
        // Find the current active lyric
        for (let i = 0; i < this.srtData.length; i++) {
            if (currentTime >= this.srtData[i].startTime && currentTime <= this.srtData[i].endTime) {
                newActiveIndex = i;
                break;
            }
        }
        
        // If nothing found but we're after the last lyric's end time, keep the last one active
        if (newActiveIndex === -1 && currentTime > this.srtData[this.srtData.length - 1].endTime) {
            newActiveIndex = this.srtData.length - 1;
        }
        
        // If active lyric has changed
        if (newActiveIndex !== this.activeLyricIndex) {
            // Remove active class from all lyrics
            const allLyrics = this.lyricsContent.querySelectorAll('.lyric-line');
            allLyrics.forEach(el => el.classList.remove('active'));
            
            // Add active class to current lyric
            if (newActiveIndex !== -1) {
                const activeLyric = this.lyricsContent.querySelector(`.lyric-line[data-index="${newActiveIndex}"]`);
                if (activeLyric) {
                    activeLyric.classList.add('active');
                    
                    // Scroll to active lyric (with some offset to center it)
                    const container = this.lyricsContent;
                    const scrollOffset = activeLyric.offsetTop - (container.offsetHeight / 2) + (activeLyric.offsetHeight / 2);
                    
                    container.scrollTo({
                        top: scrollOffset,
                        behavior: 'smooth'
                    });
                }
            }
            
            this.activeLyricIndex = newActiveIndex;
        }
    }
}

// Initialize audio player when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = new AudioPlayerController();
});
