document.addEventListener('DOMContentLoaded', function() {
    const lastLoginElement = document.getElementById('lastLogin');
    const currentDate = new Date();
    lastLoginElement.textContent = `Last login: ${currentDate.toLocaleString()}`;
});
