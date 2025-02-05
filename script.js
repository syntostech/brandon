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
        });

document.addEventListener('DOMContentLoaded', function() {
    var formContainers = document.getElementsByClassName("newsletter-form-container");

    function submitHandler(event) {
        event.preventDefault();
        var container = event.target.closest(".newsletter-form-container");
        var form = event.target;
        var emailInput = form.querySelector('input[name="email"]');
        var nameInput = form.querySelector('input[name="firstName"]');
        var userGroupInput = form.querySelector('input[name="userGroup"]');
        var success = container.querySelector(".newsletter-success");
        var errorContainer = container.querySelector(".newsletter-error");
        var errorMessage = container.querySelector(".newsletter-error-message");
        var backButton = container.querySelector(".newsletter-back-button");
        var submitButton = container.querySelector(".newsletter-form-button");
        var loadingButton = container.querySelector(".newsletter-loading-button");

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const rateLimit = () => {
            errorContainer.style.display = "flex";
            errorMessage.innerText = "Too many signups, please try again in a little while";
            submitButton.style.display = "none";
            emailInput.style.display = "none";
            nameInput.style.display = "none";
            backButton.style.display = "block";
        }

        var time = new Date();
        var timestamp = time.valueOf();
        var previousTimestamp = localStorage.getItem("loops-form-timestamp");

        if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
            rateLimit();
            return false;
        }
        localStorage.setItem("loops-form-timestamp", timestamp);

        submitButton.style.display = "none";
        loadingButton.style.display = "flex";

        var formBody = "userGroup=" + encodeURIComponent(userGroupInput.value) +
            "&mailingLists=&email=" + encodeURIComponent(emailInput.value) + 
            "&firstName=" + encodeURIComponent(nameInput.value);

        fetch(form.action, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => [res.ok, res.json(), res])
        .then(([ok, dataPromise, res]) => {
            if (ok) {
                success.style.display = "flex";
                form.reset();
            } else {
                dataPromise.then(data => {
                    errorContainer.style.display = "flex";
                    errorMessage.innerText = data.message
                        ? data.message
                        : res.statusText;
                });
            }
        })
        .catch(error => {
            if (error.message === "Failed to fetch") {
                rateLimit();
                return;
            }
            errorContainer.style.display = "flex";
            if (error.message) errorMessage.innerText = error.message;
            localStorage.setItem("loops-form-timestamp", '');
        })
        .finally(() => {
            emailInput.style.display = "none";
            nameInput.style.display = "none";
            loadingButton.style.display = "none";
            backButton.style.display = "block";
        });

        return false;
    }

    function resetFormHandler(event) {
        var container = event.target.closest(".newsletter-form-container");
        var form = container.querySelector(".newsletter-form");
        var emailInput = form.querySelector('input[name="email"]');
        var nameInput = form.querySelector('input[name="firstName"]');
        var success = container.querySelector(".newsletter-success");
        var errorContainer = container.querySelector(".newsletter-error");
        var errorMessage = container.querySelector(".newsletter-error-message");
        var backButton = container.querySelector(".newsletter-back-button");
        var submitButton = container.querySelector(".newsletter-form-button");

        success.style.display = "none";
        errorContainer.style.display = "none";
        errorMessage.innerText = "Oops! Something went wrong, please try again";
        backButton.style.display = "none";
        emailInput.style.display = "flex";
        nameInput.style.display = "flex";
        submitButton.style.display = "flex";
    }

    for (var i = 0; i < formContainers.length; i++) {
        var formContainer = formContainers[i];
        var form = formContainer.querySelector(".newsletter-form");
        var backButton = formContainer.querySelector(".newsletter-back-button");
        
        form.addEventListener("submit", submitHandler);
        backButton.addEventListener("click", resetFormHandler);
    }
}); });
