document.addEventListener('DOMContentLoaded', function() {
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
    
    // Add staggered animation delay to secondary cards
    const secondaryCards = document.querySelectorAll('.secondary-card');
    secondaryCards.forEach((card, index) => {
        card.style.animationDelay = `${(cards.length * 0.2) + (index * 0.1)}s`;
    });
});
