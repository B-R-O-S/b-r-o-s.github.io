// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS animations
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// Mobile Menu Toggle
document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// GSAP Animations for Hero Section
gsap.to('#hero-title', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.3
});

gsap.to('#hero-text', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.6
});

gsap.to('#hero-button', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.9
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }

    // Update progress bar
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Validation
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        let isValid = true;

        // Simple validation
        if (nameInput.value.trim() === '') {
            isValid = false;
            nameInput.classList.add('border-red-500');
        } else {
            nameInput.classList.remove('border-red-500');
        }

        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('border-red-500');
        } else {
            emailInput.classList.remove('border-red-500');
        }

        if (messageInput.value.trim() === '') {
            isValid = false;
            messageInput.classList.add('border-red-500');
        } else {
            messageInput.classList.remove('border-red-500');
        }

        if (isValid) {
            // Success! 
            // In a real implementation, you would send the form data to your server here

            // Show success message
            alert('Message sent successfully!');

            // Reset form
            contactForm.reset();
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ScrollTrigger Animations for sections
gsap.registerPlugin(ScrollTrigger);

// Create scroll animations for sections
const sections = document.querySelectorAll('section:not(.hero-section)');

sections.forEach(section => {
    gsap.fromTo(section.querySelector('h2'),
        { opacity: 0, y: -50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Create a timeline for each project card for staggered animations
const projectCards = document.querySelectorAll('#projects .card-hover');

projectCards.forEach((card, index) => {
    gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Create hover effects for project cards
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            duration: 0.3
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            duration: 0.3
        });
    });
});
