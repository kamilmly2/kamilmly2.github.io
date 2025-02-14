window.onload = function() {
    // Reset the form fields when the page loads
    document.getElementById("form").reset();
};
// Intersection Observer setup
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);
// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.fade-up, .fade-in, .slide-in-left, .slide-in-right, .scale-up'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");
// Error messages
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const subjectError = document.getElementById("subject-error");
const messageError = document.getElementById("message-error");
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // Reset error messages
    nameError.classList.remove("active");
    emailError.classList.remove("active");
    phoneError.classList.remove("active");
    subjectError.classList.remove("active");
    messageError.classList.remove("active");
    // Validate form fields
    let isValid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phonenumber.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();
    if (!name) {
        nameError.classList.add("active");
        isValid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.classList.add("active");
        isValid = false;
    }
    if (!phone) {
        phoneError.classList.add("active");
        isValid = false;
    }
    if (!subject) {
        subjectError.classList.add("active");
        isValid = false;
    }
    if (!message) {
        messageError.classList.add("active");
        isValid = false;
    }
    if (!isValid) {
        return; // Stop submission if validation fails
    }
    // Get form data
    const formData = new FormData(form);
    try {
        // Send data to Web3Forms
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            // Hide the form and show the success message
            form.style.display = "none";
            successMessage.style.display = "block";
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
document.getElementById("phonenumber").addEventListener("input", function (event) {
// Usuń wszystkie znaki, które nie są cyframi
this.value = this.value.replace(/\D/g, '');
// Upewnij się, że liczba ma maksymalnie 9 cyfr
if (this.value.length > 9) {
    this.value = this.value.slice(0, 9);
}
});

document.getElementById("contact-form").addEventListener("submit", function (event) {
    const phoneInput = document.getElementById("phonenumber");
    const phoneError = document.getElementById("phone-error");

    if (!/^\d{9}$/.test(phoneInput.value)) {
        phoneError.classList.add("active");
        event.preventDefault(); // Zatrzymuje wysłanie formularza
    } else {
        phoneError.classList.remove("active");
    }
});

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
}

// Hide button when contact section is visible
const floatingButton = document.querySelector('.floating-button');
const contactSection = document.getElementById('contact');

window.addEventListener('scroll', () => {
    const rect = contactSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        floatingButton.classList.add('hidden');
    } else {
        floatingButton.classList.remove('hidden');
    }
});

document.getElementById('currentYear').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // Toggle menu function
    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        backdrop.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Event listeners
    burgerMenu.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isNavLink = e.target.closest('.nav-links a');
        const isBurger = e.target.closest('.burger-menu');
        const isNav = e.target.closest('nav');

        if (!isBurger && !isNavLink && !isNav && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});