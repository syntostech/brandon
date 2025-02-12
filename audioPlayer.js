class AudioPlayerController {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.playlist = AUDIO_PLAYLIST;
        this.previewTimer = null;
        this.initializePlayer();
        this.initializeEventListeners();
        this.loadTrack(this.currentTrackIndex);
    }

    initializePlayer() {
        // Cache DOM elements
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
            // Check if current time exceeds 30 seconds for copyrighted songs
            if (this.playlist[this.currentTrackIndex].copyright && 
                this.audio.currentTime >= 30) {
                this.audio.pause();
                this.isPlaying = false;
                this.playIcon.classList.remove('hidden');
                this.pauseIcon.classList.add('hidden');
            }
        });
        
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => {
            const track = this.playlist[this.currentTrackIndex];
            // Set duration display to 30s for copyrighted songs
            if (track.copyright) {
                this.durationEl.textContent = '0:30';
            } else {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }
        });
        
        const progressContainer = this.player.querySelector('.progress-bar');
        progressContainer.addEventListener('click', (e) => {
            const track = this.playlist[this.currentTrackIndex];
            const clickPosition = e.offsetX / progressContainer.offsetWidth;
            let newTime = clickPosition * this.audio.duration;
            
            // Prevent seeking beyond 30s for copyrighted songs
            if (track.copyright && newTime > 30) {
                newTime = 30;
            }
            this.audio.currentTime = newTime;
        });
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.trackName.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.songLink.href = track.link;
        this.audio.src = track.audioUrl;
        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
        
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
    }

    updateProgress() {
        if (this.audio.duration) {
            const track = this.playlist[this.currentTrackIndex];
            let percent;
            
            if (track.copyright) {
                // For copyrighted songs, calculate progress based on 30 seconds
                percent = (this.audio.currentTime / 30) * 100;
                if (percent > 100) percent = 100;
            } else {
                // For non-copyrighted songs, use full duration
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
