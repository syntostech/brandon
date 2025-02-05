document.addEventListener('DOMContentLoaded', function() {
    // Last login update
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }

    // Add staggered animation delay to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Music Player Implementation
    const playlist = [
        {
            title: "Mr.Tambourine Man",
            artist: "Aurora",
            audioUrl: "https://www.syntos.xyz/cdn/songs/tambourine.mp3",
            link: "https://www.youtube.com/watch?v=JvygwqECh4g"
        },


    class MusicPlayer {
        constructor() {
            this.currentTrackIndex = 0;
            this.isPlaying = false;
            
            // Cache DOM elements
            this.player = document.querySelector('.music-player');
            if (!this.player) return;
            
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
            
            this.initializeEventListeners();
            this.loadTrack(this.currentTrackIndex);
        }
        
        initializeEventListeners() {
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            this.previousBtn.addEventListener('click', () => this.previousTrack());
            this.nextBtn.addEventListener('click', () => this.nextTrack());
            
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.nextTrack());
            this.audio.addEventListener('loadedmetadata', () => {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            });
            
            this.player.querySelector('.progress-bar').addEventListener('click', (e) => {
                const progressBar = e.currentTarget;
                const clickPosition = e.offsetX / progressBar.offsetWidth;
                const newTime = clickPosition * this.audio.duration;
                this.audio.currentTime = newTime;
                this.progressBar.style.width = `${clickPosition * 100}%`;
            });
        }
        
        loadTrack(index) {
            const track = playlist[index];
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
            this.currentTrackIndex = (this.currentTrackIndex - 1 + playlist.length) % playlist.length;
            this.loadTrack(this.currentTrackIndex);
        }
        
        nextTrack() {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % playlist.length;
            this.loadTrack(this.currentTrackIndex);
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

    // Initialize music player
    new MusicPlayer();

    // Newsletter Implementation
    const formContainers = document.querySelectorAll('.newsletter-container');

    formContainers.forEach(container => {
        const form = container.querySelector('.newsletter-form');
        const emailInput = form.querySelector('input[name="email"]');
        const nameInput = form.querySelector('input[name="firstName"]');
        const submitButton = form.querySelector('.newsletter-submit');
        const loadingButton = form.querySelector('.newsletter-loading');
        const successMessage = container.querySelector('.newsletter-success');
        const errorMessage = container.querySelector('.newsletter-error');
        const backButton = container.querySelector('.newsletter-back');
        const inputGroup = container.querySelector('.input-group');

        const rateLimit = () => {
            errorMessage.style.display = 'flex';
            errorMessage.querySelector('p').textContent = 'Too many signups, please try again in a little while';
            submitButton.style.display = 'none';
            inputGroup.style.display = 'none';
            backButton.style.display = 'block';
        };

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const time = new Date().valueOf();
            const previousTimestamp = localStorage.getItem('loops-form-timestamp');

            if (previousTimestamp && Number(previousTimestamp) + 60000 > time) {
                rateLimit();
                return;
            }
            localStorage.setItem('loops-form-timestamp', time);

            submitButton.style.display = 'none';
            loadingButton.style.display = 'flex';

            const formData = new URLSearchParams({
                userGroup: 'broadcast',
                email: emailInput.value,
                firstName: nameInput.value
            });

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                if (response.ok) {
                    successMessage.style.display = 'flex';
                    form.reset();
                } else {
                    const data = await response.json();
                    errorMessage.style.display = 'flex';
                    errorMessage.querySelector('p').textContent = data.message || response.statusText;
                }
            } catch (error) {
                if (error.message === 'Failed to fetch') {
                    rateLimit();
                    return;
                }
                errorMessage.style.display = 'flex';
                errorMessage.querySelector('p').textContent = error.message || 'An error occurred';
                localStorage.setItem('loops-form-timestamp', '');
            } finally {
                inputGroup.style.display = 'none';
                loadingButton.style.display = 'none';
                backButton.style.display = 'block';
            }
        });

        backButton.addEventListener('click', function() {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            backButton.style.display = 'none';
            inputGroup.style.display = 'flex';
            submitButton.style.display = 'flex';
            form.reset();
        });

        const inputs = container.querySelectorAll('.newsletter-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('input-focused');
                }
            });

            if (input.value) {
                input.parentElement.classList.add('input-focused');
            }
        });
    });
});
