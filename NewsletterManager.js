// Newsletter form functionality
document.addEventListener('DOMContentLoaded', function() {
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

        // Rate limiting function
        const rateLimit = () => {
            errorMessage.style.display = 'flex';
            errorMessage.querySelector('p').textContent = 'Too many signups, please try again in a little while';
            submitButton.style.display = 'none';
            inputGroup.style.display = 'none';
            backButton.style.display = 'block';
        };

        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Check rate limiting
            const time = new Date().valueOf();
            const previousTimestamp = localStorage.getItem('loops-form-timestamp');

            if (previousTimestamp && Number(previousTimestamp) + 60000 > time) {
                rateLimit();
                return;
            }
            localStorage.setItem('loops-form-timestamp', time);

            // Show loading state
            submitButton.style.display = 'none';
            loadingButton.style.display = 'flex';

            // Prepare form data
            const formData = new URLSearchParams({
                userGroup: 'broadcast',
                email: emailInput.value,
                firstName: nameInput.value
            });

            try {
                // Submit form
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                if (response.ok) {
                    // Show success message
                    successMessage.style.display = 'flex';
                    form.reset();
                } else {
                    // Show error message
                    const data = await response.json();
                    errorMessage.style.display = 'flex';
                    errorMessage.querySelector('p').textContent = data.message || response.statusText;
                }
            } catch (error) {
                // Handle fetch errors
                if (error.message === 'Failed to fetch') {
                    rateLimit();
                    return;
                }
                errorMessage.style.display = 'flex';
                errorMessage.querySelector('p').textContent = error.message || 'An error occurred';
                localStorage.setItem('loops-form-timestamp', '');
            } finally {
                // Clean up UI
                inputGroup.style.display = 'none';
                loadingButton.style.display = 'none';
                backButton.style.display = 'block';
            }
        });

        // Back button handler
        backButton.addEventListener('click', function() {
            // Reset form state
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            backButton.style.display = 'none';
            inputGroup.style.display = 'flex';
            submitButton.style.display = 'flex';
            form.reset();
        });

        // Input animation handlers
        const inputs = container.querySelectorAll('.newsletter-input');
        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });

            // Remove focus animation if empty
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('input-focused');
                }
            });

            // Check initial state (for browser autofill)
            if (input.value) {
                input.parentElement.classList.add('input-focused');
            }
        });
    });
});
