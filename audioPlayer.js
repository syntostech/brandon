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
        this.lyrics = `¡Oye! Señor del Tamborín, toca una canción para mí
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
demasiadas muertas para soñar

¡Oye! Señor del Tamborín, toca una canción para mí
No tengo sueño y no hay lugar al que vaya

¡Oye! Señor del Tamborín, toca una canción para mí
en el tintineo de la mañana vendré siguiéndote

Llévame en un viaje en tu mágico barco giratorio
Mis sentidos han sido despojados,
Mis dedos están demasiado entumecidos para dar un paso
esperando solo a las suelas de mis botas, para empezar a divagar.

oh estoy listo para ir a cualquier parte
Estoy listo para ir a cualquier parte, listo para desvanecerme
lanza tu hechizo danzante hacia mí
prometo dejarme llevar por él  

¡Oye! Señor del Tamborín, toca una canción para mí
No tengo sueño y no hay lugar al que vaya

¡Oye! Señor del Tamborín, toca una canción para mí
en el tintineo de la mañana vendré siguiéndote

Aunque puedas oír la risa, girando,
balanceándose locamente a través del sol,
no está dirigido a nadie
simplemente escapa a la carrera
Y salvo por el cielo,
no hay ningún cercado a la vista.

Y si escuchas rastros vagos de rimas saltarinas
Al ritmo de tu tamborín,
no es más que un harapiento payaso ahí detrás,
no es más que una sombra lo que ves que él persigue

¡Oye! Señor del Tamborín, toca una canción para mí
No tengo sueño y no hay lugar al que vaya

¡Oye! Señor del Tamborín, toca una canción para mí
en el tintineo de la mañana vendré siguiéndote

en el tintineo de la mañana vendré siguiéndote`;

        if (this.lyricsContent) {
            this.lyricsContent.textContent = this.lyrics;
        }
    }

    // Update the active lyrics based on current playback time
    updateActiveLyrics() {
        if (!this.srtData || !this.lyricsContent || this.lyricsContainer.classList.contains('hidden')) {
            return;
        }

        const currentTime = this.audio.currentTime;
        let foundActive = false;

        for (let i = 0; i < this.srtData.length; i++) {
            const line = this.srtData[i];
            if (currentTime >= line.startTime && currentTime <= line.endTime) {
                if (this.activeLyricIndex !== i) {
                    this.activeLyricIndex = i;
                    this.renderLyrics();
                }
                foundActive = true;
                break;
            }
        }

        // If no active lyrics found and we had one before, clear the active state
        if (!foundActive && this.activeLyricIndex !== -1) {
            this.activeLyricIndex = -1;
            this.renderLyrics();
        }
    }

    // Render the lyrics with the active line highlighted
    renderLyrics() {
        if (!this.srtData || this.srtData.length === 0) {
            return;
        }

        this.lyricsContent.innerHTML = '';
        
        // Create a simple display with all lyrics, highlighting the active one
        const lyricsDiv = document.createElement('div');
        
        this.srtData.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line.text;
            lineElement.className = 'lyric-line';
            
            if (index === this.activeLyricIndex) {
                lineElement.classList.add('active');
            }
            
            lyricsDiv.appendChild(lineElement);
        });
        
        this.lyricsContent.appendChild(lyricsDiv);
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
        
        // Show or hide lyrics based on the current track
        if (track.title.includes("Tambourine")) {
            this.lyricsContainer.classList.remove('hidden');
            
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
        } else {
            this.lyricsContainer.classList.add('hidden');
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
