// utils.js - Utility functions for the website

// Animate social links with a staggered delay
function animateSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        link.style.animation = 'fadeInUp 0.5s ease-out forwards';
        link.style.opacity = '0';
    });
}

// Format time from seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Parse SRT file content into structured lyrics
function parseSRT(srtContent) {
    if (!srtContent) return [];
    
    const lines = srtContent.trim().split('\n\n');
    const lyrics = [];
    
    lines.forEach(line => {
        const parts = line.trim().split('\n');
        if (parts.length >= 3) {
            const index = parseInt(parts[0].trim());
            const timeParts = parts[1].trim().split(' --> ');
            const startTime = parseTimeString(timeParts[0]);
            const endTime = parseTimeString(timeParts[1]);
            const text = parts.slice(2).join(' ').trim();
            
            lyrics.push({
                index,
                startTime,
                endTime,
                text
            });
        }
    });
    
    return lyrics;
}

// Parse time string from SRT format (00:00:00,000) to seconds
function parseTimeString(timeStr) {
    const [time, milliseconds] = timeStr.split(',');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds) / 1000;
}

// Handle mobile-specific functionality
function handleMobileLayout() {
    if (window.innerWidth < 768) {
        const musicPlayer = document.querySelector('.music-player');
        if (musicPlayer) {
            const musicCard = document.querySelector('.music-card');
            if (musicCard) {
                musicCard.addEventListener('click', (e) => {
                    e.preventDefault();
                    musicPlayer.scrollIntoView({ behavior: 'smooth' });
                });
            }
        }
    }
}

// Fetch text content from URL
async function fetchTextContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching text content:', error);
        return null;
    }
}
