// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
    button.disabled = true;

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage();
            form.reset();
        } else {
            throw new Error('Wystąpił błąd podczas wysyłania formularza');
        }
    })
    .catch(error => {
        alert(error.message);
    })
    .finally(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    });
});

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Wiadomość wysłana pomyślnie!</h3>
        <p>Odpowiemy w ciągu 24 godzin</p>
    `;
    
    document.getElementById('contact').appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Sticky header with color transition
window.addEventListener('scroll', function() {
    const header = document.querySelector('.navbar');
    header.style.background = window.scrollY > 100 
        ? 'rgba(40, 54, 24, 0.95)' 
        : 'rgb(40, 54, 24)';
});

// Scroll-triggered animations
const animateElements = () => {
    const elementsToAnimate = [
        ...document.querySelectorAll('.section'),
        ...document.querySelectorAll('.method-card'),
        ...document.querySelectorAll('.review-card')
    ];

    elementsToAnimate.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateElements);
window.addEventListener('load', animateElements);

// Section-based scroll handling
let isScrollBlocked = false;
const sectionScrollController = {
    scrollTimeout: null,

    initialize() {
        window.addEventListener("wheel", this.handleWheel.bind(this), { passive: false });
        window.addEventListener("keydown", this.handleKeys.bind(this));
        window.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });
    },

    getCurrentSection() {
        return [...document.querySelectorAll('.section')].find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });
    },

    scrollToAdjacentSection(direction) {
        if (isScrollBlocked) return false;
        
        const currentSection = this.getCurrentSection();
        if (!currentSection) return false;

        const target = direction === 'down' 
            ? currentSection.nextElementSibling 
            : currentSection.previousElementSibling;

        if (target?.classList.contains('section')) {
            isScrollBlocked = true;
            target.scrollIntoView({ behavior: 'smooth' });
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                isScrollBlocked = false;
            }, 200);
            return true;
        }
        return false;
    },

    handleWheel(event) {
        const direction = event.deltaY > 0 ? 'down' : 'up';
        const handled = this.scrollToAdjacentSection(direction);
        
        if (handled) {
            event.preventDefault();
        }
    },

    handleKeys(event) {
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            const direction = event.key === 'ArrowDown' ? 'down' : 'up';
            const handled = this.scrollToAdjacentSection(direction);
            
            if (handled) {
                event.preventDefault();
            }
        }
    },

    // Touch handling
    touchStartY: 0,
    handleTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
    },

    handleTouchEnd(event) {
        const deltaY = event.changedTouches[0].clientY - this.touchStartY;
        if (Math.abs(deltaY) < 30) return;
        
        const direction = deltaY > 0 ? 'up' : 'down';
        this.scrollToAdjacentSection(direction);
    }
};

sectionScrollController.initialize();

const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 5) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});