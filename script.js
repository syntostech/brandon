document.addEventListener('DOMContentLoaded', function() {
    const lastLoginElement = document.getElementById('lastLogin');
    const currentDate = new Date();
    lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
});

function closeTelegramBubble() {
            const bubble = document.getElementById('telegramBubble');
            bubble.classList.add('hidden');
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 500);
        }
