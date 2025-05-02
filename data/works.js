document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletterForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingBtn = document.getElementById('loadingBtn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const tryAgainBtn = document.getElementById('try-again-btn');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.style.display = 'none';
        loadingBtn.style.display = 'block';
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const mailingList = formData.get('mailingList');
        const group = formData.get('group');
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Simulate successful submission
            if (email.includes('@')) {
                form.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                // Simulate error
                form.style.display = 'none';
                errorMessage.style.display = 'block';
            }
            
            // Reset loading state
            submitBtn.style.display = 'block';
            loadingBtn.style.display = 'none';
        }, 1500);
        
    
        // Actual API implementation would look something like:
        fetch('https://app.loops.so/api/newsletter-form/cma22ilok0qt4x1mczj5lycyc', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                mailingList: mailingList,
                group: group
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
        })
        .catch(error => {
            form.style.display = 'none';
            errorMessage.style.display = 'block';
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.style.display = 'block';
            loadingBtn.style.display = 'none';
        });
        */
    });
    
    // Handle try again button
    tryAgainBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
        form.style.display = 'block';
    });
});
