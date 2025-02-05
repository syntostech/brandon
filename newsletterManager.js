class NewsletterManager {
    constructor() {
        this.initializeNewsletterForms();
    }

    initializeNewsletterForms() {
        const formContainers = document.querySelectorAll('.newsletter-container');
        
        formContainers.forEach(container => {
            this.setupNewsletterForm(container);
        });
    }

    setupNewsletterForm(container) {
        const form = container.querySelector('.newsletter-form');
        const elements = {
            emailInput: form.querySelector('input[name="email"]'),
            nameInput: form.querySelector('input[name="firstName"]'),
            submitButton: form.querySelector('.newsletter-submit'),
            loadingButton: form.querySelector('.newsletter-loading'),
            successMessage: container.querySelector('.newsletter-success'),
            errorMessage: container.querySelector('.newsletter-error'),
            backButton: container.querySelector('.newsletter-back'),
            inputGroup: container.querySelector('.input-group')
        };

        this.setupFormListeners(form, elements);
        this.setupInputAnimations(container);
    }

    setupFormListeners(form, elements) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isRateLimited()) {
                this.handleRateLimit(elements);
                return;
            }

            await this.handleFormSubmission(form, elements);
        });

        elements.backButton.addEventListener('click', () => {
            this.resetForm(form, elements);
        });
    }

    setupInputAnimations(container) {
        const inputs = container.querySelectorAll('.newsletter-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('input-focused');
                }
            });

            if (input.value) {
                input.parentElement.classList.add('input-focused');
            }
        });
    }

    isRateLimited() {
        const time = new Date().valueOf();
        const previousTimestamp = localStorage.getItem('newsletter-timestamp');
        return previousTimestamp && Number(previousTimestamp) + 60000 > time;
    }

    handleRateLimit(elements) {
        elements.errorMessage.style.display = 'flex';
        elements.errorMessage.querySelector('p').textContent = 'Too many signups, please try again in a little while';
        elements.submitButton.style.display = 'none';
        elements.inputGroup.style.display = 'none';
        elements.backButton.style.display = 'block';
    }

    async handleFormSubmission(form, elements) {
        this.showLoadingState(elements);
        localStorage.setItem('newsletter-timestamp', new Date().valueOf());

        const formData = new URLSearchParams({
            userGroup: 'broadcast',
            email: elements.emailInput.value,
            firstName: elements.nameInput.value
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
                this.showSuccess(form, elements);
            } else {
                const data = await response.json();
                this.showError(elements, data.message || response.statusText);
            }
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                this.handleRateLimit(elements);
                return;
            }
            this.showError(elements, error.message || 'An error occurred');
            localStorage.setItem('newsletter-timestamp', '');
        }
    }

    showLoadingState(elements) {
        elements.submitButton.style.display = 'none';
        elements.loadingButton.style.display = 'flex';
    }

    showSuccess(form, elements) {
        elements.successMessage.style.display = 'flex';
        elements.inputGroup.style.display = 'none';
        elements.loadingButton.style.display = 'none';
        elements.backButton.style.display = 'block';
        form.reset();
    }

    showError(elements, message) {
        elements.errorMessage.style.display = 'flex';
        elements.errorMessage.querySelector('p').textContent = message;
        elements.inputGroup.style.display = 'none';
        elements.loadingButton.style.display = 'none';
        elements.backButton.style.display = 'block';
    }

    resetForm(form, elements) {
        elements.successMessage.style.display = 'none';
        elements.errorMessage.style.display = 'none';
        elements.backButton.style.display = 'none';
        elements.inputGroup.style.display = 'flex';
        elements.submitButton.style.display = 'flex';
        form.reset();
    }
}


