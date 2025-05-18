document.addEventListener('DOMContentLoaded', () => {
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
            e.preventDefault(); // Prevent actual submission for this example
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;

            if (email === '') {
                alert('Please enter your email.');
                isValid = false;
            } else if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                isValid = false;
            }
            if (message === '') {
                alert('Please enter your message.');
                isValid = false;
            }

            if (isValid) {
                alert('Form submitted successfully! (This is a demo)');
                contactForm.reset();
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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

        // Set canvas dimensions
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.getElementById('hero').offsetHeight; // Match hero section height
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Create particle array
        function initParticles() {
            particlesArray = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000; // Adjust density
            const colors = ['rgba(106, 13, 173, 0.3)', 'rgba(106, 13, 173, 0.5)', 'rgba(255, 255, 255, 0.2)', 'rgba(128, 0, 128, 0.4)']; // Shades of purple and white, with alpha

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 3 + 1; // Particle size (1 to 4)
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * .4) - .2; // Slow movement
                const directionY = (Math.random() * .4) - .2; // Slow movement
                const color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
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

        // Re-initialize particles if hero section height changes (e.g. due to window resize affecting content flow indirectly)
        // This is a simple way, a more robust solution might use ResizeObserver on the #hero element.
        let heroHeight = document.getElementById('hero').offsetHeight;
        setInterval(() => {
            if (document.getElementById('hero').offsetHeight !== heroHeight) {
                heroHeight = document.getElementById('hero').offsetHeight;
                resizeCanvas(); // Ensure canvas dimensions are updated
                initParticles(); // Recreate particles for new dimensions
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
}); 