document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        intro: document.getElementById('intro'),
        reveal: document.getElementById('reveal'),
        proposal: document.getElementById('proposal'),
        success: document.getElementById('success')
    };

    const envelope = document.getElementById('envelope');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const music = document.getElementById('bg-music');
    const proposalText = document.getElementById('proposal-text');
    const proposalString = "¿Me harías el honor de acompañarme? 🤍";

    // Audio Control
    const playAudio = () => {
        music.volume = 0.5;
        music.play().catch(e => console.log("Audio autoplay prevented"));
    };

    // Typewriter Effect with smooth continuous writing
    const typeWriter = (text, element, baseSpeed = 100) => {
        let i = 0;
        element.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.innerHTML = '&nbsp;';
        element.appendChild(cursor);

        function type() {
            if (i < text.length) {
                // Insert text before cursor
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                
                // Smaller random variation for smoother, more continuous flow
                const randomDelay = baseSpeed + Math.random() * 40 - 20;
                setTimeout(type, randomDelay);
            } else {
                // Remove cursor after a while
                setTimeout(() => cursor.remove(), 2000);
            }
        }
        type();
    };

    // Helper to switch screens
    const switchScreen = (current, next) => {
        screens[current].style.opacity = '0';
        setTimeout(() => {
            screens[current].classList.add('hidden');
            screens[current].classList.remove('active');
            
            screens[next].classList.remove('hidden');
            screens[next].style.display = 'flex'; // Ensure flex
            
            // Force reflow
            void screens[next].offsetWidth;
            
            screens[next].classList.add('active');
            screens[next].style.opacity = '1';

            // Trigger Typewriter if entering proposal
            if (next === 'proposal') {
                typeWriter(proposalString, proposalText, 90);
            }

            // Branding Overlay Control
            const brandingOverlay = document.getElementById('branding-overlay');
            const brandingContent = `
                <div class="branding-before">fever presents</div>
                <div class="branding-after">Candlelight</div>
            `;
            
            if (brandingOverlay) {
                if (current === 'intro') {
                    // Moving to reveal: Fade out AND clear content to ensure reset
                    brandingOverlay.classList.add('fade-out');
                    setTimeout(() => {
                        if (brandingOverlay.classList.contains('fade-out')) {
                             brandingOverlay.innerHTML = ''; 
                        }
                    }, 900); // Wait for transition
                } else if (next === 'success') {
                     createFloatingHearts();
                } else if (next === 'proposal') {
                    // Entering proposal: Restore content and Fade in
                    brandingOverlay.innerHTML = brandingContent;
                    // Force reflow
                    void brandingOverlay.offsetWidth;
                    brandingOverlay.classList.remove('fade-out');
                }
            }
        }, 800);
    };

    // Floating Hearts Logic
    const createFloatingHearts = () => {
        const container = document.querySelector('.floating-hearts');
        if (!container) return;

        const createHeart = () => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // Random properties
            const left = Math.random() * 100;
            const size = Math.random() * 15 + 10;
            const duration = Math.random() * 3 + 3;
            const delay = Math.random() * 2;
            const tx = (Math.random() - 0.5) * 100; // Translate X movement

            heart.style.left = `${left}%`;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.setProperty('--tx', `${tx}px`);
            
            // Random color tint (gold/white/red)
            const colors = ['rgba(212, 175, 55, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(138, 3, 3, 0.4)'];
            heart.style.background = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(heart);

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, (duration + delay) * 1000);
        };

        // Create hearts periodically
        const interval = setInterval(createHeart, 300);
        
        // Stop after 10 seconds to save performance
        setTimeout(() => clearInterval(interval), 10000);
    };

    // 1. Intro Click (Blow out candle logic)
    screens.intro.addEventListener('click', () => {
        // Find the flame
        const flame = document.querySelector('.flame');
        if (flame) {
            flame.classList.add('extinguish');
        }
        
        playAudio(); // Try to play audio on first interaction (if not muted)
        
        // Wait for extinguish animation (500ms) before switching
        setTimeout(() => {
            switchScreen('intro', 'reveal');
        }, 600);
    });



    // 2. Reveal Section - Card Click
    const cardReveal = document.getElementById('card-reveal');
    if (cardReveal) {
        cardReveal.addEventListener('click', () => {
            cardReveal.classList.add('clicked');
            setTimeout(() => {
                switchScreen('reveal', 'proposal');
            }, 1500);
        });
    }

    // Sparkle Cursor Logic
    const createSparkle = (e) => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Handle both mouse and touch events
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 800);
    };

    document.addEventListener('mousemove', createSparkle);
    document.addEventListener('touchmove', createSparkle, { passive: true });

    // 3. "No" Button Interaction (Run away with smooth animation)
    let noClickCount = 0;
    const noTexts = [
        "No", 
        "¿Segura?", 
        "¡No puedes!", 
        "¡Sigo aquí!",
        "¡Ándale!",
        "Por favooor 🥺",
        "No seas así 💔",
        "Mira el otro botón 😉",
        "¡Ya di que sí!",
        "Solo un click...",
        "¡No muerdo!",
        "¿Y si lo hablamos?",
        "Soy inevitable",
        "Vamos...",
        "¡Te estoy esperando!",
        "¿Sigues intentando?",
        "Mejor ríndete",
        "¡El otro botón brilla más!",
        "Acepta tu destino 💙",
        "Ya casi...",
        "¡No te canses!",
        "¡Sigo siendo la mejor opción!"
    ];

    const moveButton = () => {
        // Trigger Attention on Yes Button
        btnYes.classList.add('attention');
        // Remove attention after a short while so it doesn't pulse forever if they stop
        setTimeout(() => btnYes.classList.remove('attention'), 1500);

        // Update Text (Cycle through options)
        noClickCount++;
        const textIndex = noClickCount % noTexts.length;
        btnNo.textContent = noTexts[textIndex];

        // Get button dimensions
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;
        
        // Calculate safe area with larger padding on mobile
        const padding = window.innerWidth < 768 ? 60 : 40;
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        
        // Ensure random position is within safe bounds
        const x = Math.max(padding, Math.min(Math.random() * maxX, maxX - padding));
        const y = Math.max(padding, Math.min(Math.random() * maxY, maxY - padding));
        
        // Set position fixed on first move
        if (btnNo.style.position !== 'fixed') {
            btnNo.style.position = 'fixed';
            btnNo.style.zIndex = '100';
        }
        
        // Smooth transition will be handled by CSS
        btnNo.style.left = `${x}px`;
        btnNo.style.top = `${y}px`;
    };

    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', moveButton); // For mobile
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });

    // 4. "Yes" Button Click
    btnYes.addEventListener('click', () => {
        // Trigger confetti (Hearts)
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#8a0303'],
            shapes: ['heart']
        });

        // Loop confetti a bit
        let end = Date.now() + 2000;
        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#d4af37', '#ffffff'],
                shapes: ['heart']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#d4af37', '#ffffff'],
                shapes: ['heart']
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        switchScreen('proposal', 'success');

        // Generate Google Calendar Link
        // Title: Candlelight: Clásicos del Rock
        // Date: 15 Feb 2025 (Assuming next year or specific date, user image said dom 15 feb, 2026? 2025?)
        // Let's assume 2026 since Feb 15 is Sunday in 2026. 2025 Feb 15 is Saturday.
        // Image says "dom 15 feb", so it's likely 2026.
        // Time: 07:30 p.m. -> 19:30
        const eventTitle = encodeURIComponent("Candlelight: Clásicos del Rock con mi Pequeño❤️");
        const eventLocation = encodeURIComponent("Teatro Principal - Manuel A. Segura, Jr. Huancavelica 261, Lima");
        const eventDetails = encodeURIComponent("Una noche mágica juntos.");
        
        // Format: YYYYMMDDTHHMMSSZ
        // Feb 15 2026 19:30 to 21:00 (approx duration)
        // Note: Dates must be in UTC or simple format.
        const startDate = "20260215T193000";
        const endDate = "20260215T210000"; 
        
        // Google Calendar doesn't support reminders via URL, but we can add it to details
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDetails}&location=${eventLocation}&sf=true&output=xml`;
        
        document.getElementById('btn-calendar').href = calendarUrl;
    });
});
