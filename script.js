document.addEventListener('DOMContentLoaded', function() {
    const lastLoginElement = document.getElementById('lastLogin');
    const currentDate = new Date();
    lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;

    // Telegram Promo Bubble Logic
    const telegramBubble = document.getElementById('telegram-promo');
    const closeTelegramBubble = document.getElementById('closeTelegramBubble');

    // Check if bubble has been closed before
    const isBubbleClosed = localStorage.getItem('telegramBubbleClosed');
    
    if (isBubbleClosed) {
        telegramBubble.classList.add('hidden');
    }

    closeTelegramBubble.addEventListener('click', function() {
        telegramBubble.classList.add('hidden');
        // Remember that bubble was closed
        localStorage.setItem('telegramBubbleClosed', 'true');
    });

    // Optional: Auto-show bubble after certain time
    setTimeout(() => {
        if (!localStorage.getItem('telegramBubbleClosed')) {
            telegramBubble.classList.remove('hidden');
        }
    }, 3000); // Show after 3 seconds
});
