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
            
            if (brandingOverlay) {
                if (current === 'intro') {
                    // Moving to reveal: Fade out branding
                    brandingOverlay.classList.add('fade-out');
                } else if (next === 'proposal') {
                    // Entering proposal: Fade in branding
                    brandingOverlay.classList.remove('fade-out');
                } else if (next === 'success') {
                     // Success: Fade out logic if needed, or keep it. 
                     // Usually detailed proposal keeps it or removes it?
                     // Let's assume keep it visible or fade out?
                     // The original code didn't explicitly hide it on success, 
                     // but `overlay-proposal` would stay visible unless hidden.
                     // The requirement is "reappear like it does". 
                     // So on proposal it appears.
                }
            }
        }, 800);
    };

    // 1. Intro Click
    screens.intro.addEventListener('click', () => {
        playAudio(); // Try to play audio on first interaction
        switchScreen('intro', 'reveal');
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

    // 3. "No" Button Interaction (Run away with smooth animation)
    const moveButton = () => {
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
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#8a0303']
        });

        // Loop confetti a bit
        let end = Date.now() + 2000;
        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#d4af37', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#d4af37', '#ffffff']
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
