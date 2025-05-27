document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#main-header nav ul');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('#main-header nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('#main-header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate position, considering the sticky header height
                const headerOffset = document.getElementById('main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Always prevent default submission now

            const messageInput = document.getElementById('message');
            const message = messageInput.value.trim();
            let isValid = true;


            if (message === '') {
                alert('Please enter your message.');
                isValid = false;
            }

            if (isValid) {
                const recipientEmail = 'entropaisk@gmail.com';
                const subject = `We are interested! 🚀`;
                const body = message;

                // Encode components for the mailto URL
                const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                window.location.href = mailtoLink;
                contactForm.reset(); // Reset the form after attempting to open email client
            }
            // If not valid, alerts are shown and nothing else happens due to preventDefault earlier
        });
    }


    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll('main section');
    const headerHeight = document.getElementById('main-header').offsetHeight;

    function changeNavOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted offset
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        // Special case for hero: if no other section is active, hero is (even if slightly scrolled past)
        if (!currentSectionId && window.pageYOffset < sections[0].offsetTop - headerHeight - 50) {
            const homeLink = document.querySelector('a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        } else if (!document.querySelector('#main-header nav ul li a.active') && window.pageYOffset < sections[0].offsetTop) {
            const homeLink = document.querySelector('a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', changeNavOnScroll);
    changeNavOnScroll(); // Initial call to set active link on page load

    // Fade-in animations on scroll - REVISED LOGIC
    // Step 1: Add 'fade-in' class to all elements intended for animation.
    sections.forEach(section => {
        const directChildren = Array.from(section.children);
        directChildren.forEach(child => {
            if (child.tagName !== 'H2') { // Don't fade section titles immediately
                if (child.classList.contains('overview-content') ||
                    child.classList.contains('team-container') ||
                    child.id === 'contact-form' ||
                    child.classList.contains('alternative-contact') ||
                    child.classList.contains('hero-content')) {
                    // For these specific containers, apply fade-in to their children
                    Array.from(child.children).forEach(innerChild => {
                        if (innerChild.classList) { // Ensure it's an element
                            innerChild.classList.add('fade-in');
                        }
                    });
                } else {
                    // For other direct children of the section
                    child.classList.add('fade-in');
                }
            }
        });
    });

    // Step 2: Select all elements that now have the 'fade-in' class.
    const fadeElements = document.querySelectorAll('.fade-in');

    // Step 3: Define the function to make them visible when they scroll into view.
    function checkFadeElements() {
        fadeElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            // Trigger when element is a bit into the viewport
            if (elementTop < windowHeight - 100) {
                el.classList.add('visible');
            } else {
                // Optional: remove 'visible' class if element scrolls out of view from the top
                // This creates a re-fading effect if you scroll up and down
                // if (elementTop > windowHeight) {
                //     el.classList.remove('visible');
                // }
            }
        });
    }

    // Step 4: Attach scroll listener and run an initial check.
    window.addEventListener('scroll', checkFadeElements);
    checkFadeElements(); // Initial check on page load
    // End of REVISED Fade-in animations on scroll logic

    // Hero Canvas Particle Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Mouse object for interactivity
        let mouse = {
            x: null,
            y: null,
            radius: 120 // Interaction radius in pixels (hover area around cursor)
        };

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => { // Changed from mouseout for better canvas edge detection
            mouse.x = null;
            mouse.y = null;
        });

        // Set canvas dimensions
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            // Ensure hero element exists before trying to get its offsetHeight
            const heroElement = document.getElementById('hero');
            if (heroElement) {
                canvas.height = heroElement.offsetHeight; // Match hero section height
            } else {
                canvas.height = window.innerHeight; // Fallback if hero not found
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor(x, y, directionX, directionY, size, color, layer) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
                this.layer = layer; // 'background' or 'foreground'
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Boundary check (bounce off edges)
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }

                // Mouse interactivity: Repel particles
                if (mouse.x !== null && mouse.y !== null) {
                    let dxMouse = this.x - mouse.x;
                    let dyMouse = this.y - mouse.y;
                    let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                    let interactionRadius = mouse.radius;
                    // Adjust repel strength based on layer
                    let repelFactor = this.layer === 'foreground' ? 2.5 : 1.0;

                    if (distanceMouse < interactionRadius) {
                        let forceDirectionX = dxMouse / distanceMouse;
                        let forceDirectionY = dyMouse / distanceMouse;

                        // Force is stronger when closer to the mouse
                        let force = (interactionRadius - distanceMouse) / interactionRadius;

                        this.x += forceDirectionX * force * repelFactor;
                        this.y += forceDirectionY * force * repelFactor;

                        // Prevent particles from being pushed completely out of bounds by mouse
                        if (this.x + this.size > canvas.width) this.x = canvas.width - this.size;
                        if (this.x - this.size < 0) this.x = this.size;
                        if (this.y + this.size > canvas.height) this.y = canvas.height - this.size;
                        if (this.y - this.size < 0) this.y = this.size;
                    }
                }

                // Move particle based on its direction and speed
                this.x += this.directionX;
                this.y += this.directionY;

                this.draw();
            }
        }

        // Create particle array with layers
        function initParticles() {
            particlesArray = [];
            // Adjust density: lower number means more particles
            const totalNumberOfParticles = (canvas.height * canvas.width) / 6000;

            const numBackgroundParticles = Math.floor(totalNumberOfParticles * 0.30); // 25% for background
            const numForegroundParticles = totalNumberOfParticles - numBackgroundParticles; // 75% for foreground

            // Colors with varied alpha for depth
            const bgColors = ['rgba(106, 13, 173, 0.15)', 'rgba(106, 13, 173, 0.25)', 'rgba(255, 255, 255, 0.1)', 'rgba(128, 0, 128, 0.2)'];
            const fgColors = ['rgba(106, 13, 173, 0.6)', 'rgba(106, 13, 173, 0.75)', 'rgba(255, 255, 255, 0.4)', 'rgba(128, 0, 128, 0.65)'];

            // Background particles (larger, slower)
            for (let i = 0; i < numBackgroundParticles; i++) {
                const size = Math.random() * 3 + 3.5; // Size: 3.5 to 6.5
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * 0.2) - 0.1; // Slower: -0.1 to 0.1 px/frame
                const directionY = (Math.random() * 0.2) - 0.1;
                const color = bgColors[Math.floor(Math.random() * bgColors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, 'background'));
            }

            // Foreground particles (smaller, faster)
            for (let i = 0; i < numForegroundParticles; i++) {
                const size = Math.random() * 2 + 1; // Size: 1 to 3
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * 0.9) - 0.45; // Faster: -0.75 to 0.75 px/frame
                const directionY = (Math.random() * 0.9) - 0.45;
                const color = fgColors[Math.floor(Math.random() * fgColors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, 'foreground'));
            }
        }

        // Animation loop
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        initParticles();
        animateParticles();

        // Re-initialize particles if hero section height changes significantly
        let heroHeight = document.getElementById('hero') ? document.getElementById('hero').offsetHeight : window.innerHeight;
        setInterval(() => {
            const currentHeroElement = document.getElementById('hero');
            const currentHeroHeight = currentHeroElement ? currentHeroElement.offsetHeight : window.innerHeight;
            if (Math.abs(currentHeroHeight - heroHeight) > 50) { // Check for significant change
                heroHeight = currentHeroHeight;
                resizeCanvas();
                initParticles();
            }
        }, 1000);
    }

    // GSAP animation for the new send button
    // IMPORTANT: Make sure to include the GSAP library in your HTML for this to work.
    // e.g., <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', (e) => {
            // The button is type="submit", so it will trigger the form's submit event.
            // The form's submit handler already has e.preventDefault() for demo purposes.
            // If that changes, and the form actually submits and navigates, 
            // the animation might be cut short.

            // Check if GSAP is available
            if (typeof gsap !== 'undefined') {
                const iconSvg = sendButton.querySelector('.icon svg');
                gsap.timeline({
                    onComplete: () => {
                        // Animation complete. Form submission logic will proceed as per the form's event listener.
                    }
                })
                    .to(iconSvg, {
                        duration: 0.4,
                        x: -8,
                        y: 8,
                        ease: 'power1.out' // Added an ease
                    })
                    .to(iconSvg, {
                        duration: 0.4,
                        x: '50vw',
                        y: '-50vh',
                        ease: 'power2.in' // Added an ease
                    })
                    .set(iconSvg, {
                        x: '-50vw',
                        y: '50vh'
                    })
                    .to(iconSvg, {
                        duration: 0.3,
                        x: 0,
                        y: 0,
                        ease: 'power1.out' // Added an ease
                    });
            } else {
                console.warn('GSAP library is not loaded. Button animation will not play.');
            }
        });
    }

    // Add scroll event listener for navbar background transition
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Toggle functionality for overview card info
    const overviewListItems = document.querySelectorAll('#overview .overview-card ul li');
    overviewListItems.forEach(item => {
        item.addEventListener('click', () => {
            const infoText = item.querySelector('.toggle-info');
            if (infoText) {
                infoText.classList.toggle('visible');
            }
        });
    });

    // Randomly rotate scattered phrases in Overview section - REMOVED
    // const scatteredPhrases = document.querySelectorAll('.scattered-phrase');
    // scatteredPhrases.forEach(phrase => {
    // const randomRotation = Math.random() * 30 - 15; // -15 to +15 degrees
    // phrase.style.transform = `rotate(${randomRotation}deg)`;
    // });

    // Frog jump animation for agent icon
    const agentIcon = document.getElementById('agent-icon');
    const scatteredPhrases = document.querySelectorAll('.scattered-phrase');
    const scatteredContainer = document.querySelector('.scattered-text-container');

    if (agentIcon && scatteredPhrases.length > 0 && scatteredContainer) {
        let currentPhraseIndex = -1; // Start before the first phrase
        let isJumping = false;

        // Ensure container is positioned for absolute children
        if (getComputedStyle(scatteredContainer).position === 'static') {
            scatteredContainer.style.position = 'relative';
        }

        function jumpToNextPhrase() {
            if (isJumping) return; // Don't jump if already jumping
            isJumping = true;

            let nextPhraseIndex;
            do {
                nextPhraseIndex = Math.floor(Math.random() * scatteredPhrases.length);
            } while (nextPhraseIndex === currentPhraseIndex && scatteredPhrases.length > 1);

            const targetPhrase = scatteredPhrases[nextPhraseIndex];
            currentPhraseIndex = nextPhraseIndex;

            const containerRect = scatteredContainer.getBoundingClientRect();
            const targetRect = targetPhrase.getBoundingClientRect();
            const agentRect = agentIcon.getBoundingClientRect();

            // Calculate target position relative to the container
            const targetX = targetRect.left - containerRect.left + (targetRect.width / 2) - (agentRect.width / 2);
            const targetY = targetRect.top - containerRect.top - agentRect.height; // Position above the phrase

            // Calculate current position relative to the container (or initialize if first jump)
            const currentX = (agentIcon.style.left === '') ? targetX : parseFloat(agentIcon.style.left);
            const currentY = (agentIcon.style.top === '') ? targetY : parseFloat(agentIcon.style.top);

            // Determine jump direction for rotation
            const deltaX = targetX - currentX;
            const angle = Math.atan2(0, deltaX) * (180 / Math.PI); // Simplified angle for horizontal jump
            // Add a slight rotation to simulate looking towards the target
            // If deltaX is positive (jumping right), rotate slightly right. If negative (jumping left), rotate slightly left.
            const rotation = deltaX > 0 ? 15 : (deltaX < 0 ? -15 : 0);

            // Mid-point for arc (higher than start/end)
            const midX = currentX + (targetX - currentX) / 2;
            const midY = Math.min(currentY, targetY) - 50; // 50px jump height

            // GSAP animation for smoother arc and rotation
            if (typeof gsap !== 'undefined') {
                gsap.timeline({
                    onComplete: () => {
                        isJumping = false;
                        setTimeout(jumpToNextPhrase, Math.random() * 3000 + 2000); // Random delay for next jump
                    }
                })
                    .to(agentIcon, {
                        duration: 0.4, // Duration to reach peak
                        left: midX + 'px',
                        top: midY + 'px',
                        rotation: rotation, // Apply rotation during ascent
                        ease: 'power1.out'
                    })
                    .to(agentIcon, {
                        duration: 0.4, // Duration to land
                        left: targetX + 'px',
                        top: targetY + 'px',
                        rotation: 0, // Reset rotation on land
                        ease: 'power1.in'
                    });
            } else {
                // Fallback to CSS transitions if GSAP is not available
                agentIcon.style.transform = `rotate(${rotation}deg) translateY(-50px)`; // Initial jump up and rotate
                setTimeout(() => {
                    agentIcon.style.left = targetX + 'px';
                    agentIcon.style.top = targetY + 'px';
                    agentIcon.style.transform = 'rotate(0deg) translateY(0px)'; // Land and reset rotation
                    isJumping = false;
                    setTimeout(jumpToNextPhrase, Math.random() * 3000 + 2000); // Random delay
                }, 500); // Corresponds to CSS transition duration
            }
        }

        // Initial position above the first phrase (or a random one if preferred)
        if (scatteredPhrases.length > 0) {
            const initialPhrase = scatteredPhrases[0];
            const containerRect = scatteredContainer.getBoundingClientRect();
            const initialRect = initialPhrase.getBoundingClientRect();
            const agentRect = agentIcon.getBoundingClientRect();

            agentIcon.style.left = (initialRect.left - containerRect.left + (initialRect.width / 2) - (agentRect.width / 2)) + 'px';
            agentIcon.style.top = (initialRect.top - containerRect.top - agentRect.height) + 'px';
        }

        setTimeout(jumpToNextPhrase, 2000); // Start the first jump after a delay
    }

}); 