document.addEventListener('DOMContentLoaded', function() {
    const lastLoginElement = document.getElementById('lastLogin');
    const telegramBubble = document.getElementById('telegram-promo');
    const closeTelegramBubble = document.getElementById('closeTelegramBubble');

    if (lastLoginElement) {
        const currentDate = new Date();
        lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
    }

    if (telegramBubble && closeTelegramBubble) {
        const isBubbleClosed = localStorage.getItem('telegramBubbleClosed');
        
        if (isBubbleClosed) {
            telegramBubble.classList.add('hidden');
        }

        closeTelegramBubble.addEventListener('click', function() {
            telegramBubble.classList.add('hidden');
            localStorage.setItem('telegramBubbleClosed', Date.now().toString());
        });

        setTimeout(() => {
            if (!localStorage.getItem('telegramBubbleClosed')) {
                telegramBubble.classList.remove('hidden');
            }
        }, 3000);
    }
});
