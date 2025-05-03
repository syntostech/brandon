(function() {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    .newsletter-bubble {
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 15px 20px;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 15px;
      font-family: 'Roboto Mono', monospace, system-ui;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      max-width: 280px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 9999;
    }

    .newsletter-bubble.show {
      transform: translateY(0);
      opacity: 1;
    }

    .bubble-icon {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .bubble-content {
      flex-grow: 1;
    }

    .bubble-title {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .bubble-text {
      margin: 0;
      color: #a3a3a3;
      font-size: 12px;
      line-height: 1.4;
    }

    .bubble-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: #a3a3a3;
      font-size: 16px;
      cursor: pointer;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .bubble-close:hover {
      opacity: 1;
    }

    .bubble-button {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      margin-top: 10px;
      transition: background-color 0.3s;
      text-decoration: none;
    }

    .bubble-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Media query for mobile devices */
    @media (max-width: 768px) {
      .newsletter-bubble {
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        width: 90%;
        max-width: 320px;
      }
      
      .newsletter-bubble.show {
        transform: translateX(-50%) translateY(0);
      }
      
      /* Adjust hiding animation for centered position */
      .newsletter-bubble.hiding {
        opacity: 0;
        transform: translateX(-50%) translateY(100px);
      }
    }
  `;
  
  document.head.appendChild(style);

  // Create the bubble elements
  const bubble = document.createElement('div');
  bubble.className = 'newsletter-bubble';
  bubble.innerHTML = `
    <div class="bubble-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    </div>
    <div class="bubble-content">
      <h3 class="bubble-title">Join my newsletter</h3>
      <p class="bubble-text">Get the latest updates directly to your inbox</p>
      <a href="https://brandonvasp.com/broadcast" class="bubble-button">Subscribe now</a>
    </div>
    <button class="bubble-close" aria-label="Close">×</button>
  `;
  
  // Append to body
  document.body.appendChild(bubble);
  
  // Show the bubble with a slight delay
  setTimeout(() => {
    bubble.classList.add('show');
  }, 300);
  
  // Auto-hide after 5 seconds
  const timeoutId = setTimeout(() => {
    hideBubble();
  }, 5000);
  
  // Close button functionality
  const closeButton = bubble.querySelector('.bubble-close');
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    hideBubble();
    clearTimeout(timeoutId);
  });
  
  // Subscribe button functionality
  const subscribeButton = bubble.querySelector('.bubble-button');
  subscribeButton.addEventListener('click', () => {
    // No need for preventDefault, we want the link to work
    hideBubble();
    clearTimeout(timeoutId);
    // NOTE: We removed the alert since we're using a direct link now
  });
  
  // Function to hide bubble with animation
  function hideBubble() {
    // Add a specific class for hiding in mobile view
    if (window.innerWidth <= 768) {
      bubble.classList.add('hiding');
    } else {
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(100px)';
    }
    
    setTimeout(() => {
      if (bubble.parentNode) {
        document.body.removeChild(bubble);
      }
    }, 500);
  }
})();
