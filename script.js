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
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;

            if (name === '') {
                alert('Please enter your name.');
                isValid = false;
            }
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

    // Fade-in animations on scroll
    const fadeElements = document.querySelectorAll('section > *:not(h2), section > div > *:not(h2)');
    // Select direct children of sections or children of direct div containers within sections for animation

    function checkFadeElements() {
        fadeElements.forEach(el => {
            // Add 'fade-in' class if not already present, so CSS can handle initial state
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
            }

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

    // Add fade-in class to all sections to make them initially hidden
    sections.forEach(section => {
        // Apply to section itself if we want the whole section to fade
        // section.classList.add('fade-in');
        // Or apply to children as currently implemented
        const directChildren = Array.from(section.children);
        directChildren.forEach(child => {
            if (child.tagName !== 'H2') { // Don't fade section titles immediately
                if (child.classList.contains('overview-content') || child.classList.contains('team-container') || child.id === 'contact-form' || child.classList.contains('alternative-contact') || child.classList.contains('hero-content')) {
                    Array.from(child.children).forEach(innerChild => innerChild.classList.add('fade-in'));
                } else {
                    child.classList.add('fade-in');
                }
            }
        });
    });

    window.addEventListener('scroll', checkFadeElements);
    checkFadeElements(); // Initial check on page load

}); 