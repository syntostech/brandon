document.addEventListener('DOMContentLoaded', () => {
    const starBackground = document.createElement('div');
    starBackground.classList.add('star-background');
    document.body.appendChild(starBackground);

    function createStars(numStars) {
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Randomize star properties
            const size = Math.random() * 3 + 1; // 1-4 pixels
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random twinkle delay and duration
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            
            // Optional: Add subtle movement
            star.style.animation += ', move 10s infinite';
            star.style.animationDelay += `, ${Math.random() * 5}s`;
            
            starBackground.appendChild(star);
        }
    }

    // Create 100 stars (adjust number as needed)
    createStars(100);
});
