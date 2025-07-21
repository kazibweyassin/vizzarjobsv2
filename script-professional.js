// Professional VizzarJobs Interactive Features
// Industry-standard functionality with modern UX patterns

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all professional features
    initNavigation();
    initScrollAnimations();
    initFormValidation();
    initMobileMenu();
    initStatCounters();
    initProfessionalInteractions();
    initIntersectionObserver();
});

// Professional Navigation System
function initNavigation() {
    const navbar = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Enhanced navbar scroll behavior
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll (professional pattern)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });
    
    // Professional smooth scrolling with offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavLink(link);
            }
        });
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// Professional Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('mobile-open');
            
            if (isOpen) {
                navLinks.classList.remove('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            } else {
                navLinks.classList.add('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }
}

// Professional Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add staggered animations
                if (element.classList.contains('feature-card')) {
                    const cards = [...element.parentNode.children];
                    const index = cards.indexOf(element);
                    setTimeout(() => {
                        element.classList.add('animate-fade-in-up');
                    }, index * 150);
                } else if (element.classList.contains('testimonial-card')) {
                    const cards = [...element.parentNode.children];
                    const index = cards.indexOf(element);
                    setTimeout(() => {
                        element.classList.add('animate-fade-in-right');
                    }, index * 100);
                } else if (element.classList.contains('process-step')) {
                    const steps = [...element.parentNode.children];
                    const index = steps.indexOf(element);
                    setTimeout(() => {
                        element.classList.add('animate-fade-in-up');
                    }, index * 200);
                } else {
                    element.classList.add('animate-fade-in-up');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const elements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .process-step, .stat-card, .section-header'
    );
    elements.forEach(el => observer.observe(el));
}

// Professional Form Validation
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    const submitBtn = form.querySelector('.form-submit');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Professional form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            await submitForm(form, submitBtn);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.field-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--error-500);
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: none;
        `;
        formGroup.appendChild(errorElement);
    }
    
    if (isValid) {
        field.style.borderColor = 'var(--success-500)';
        errorElement.style.display = 'none';
    } else {
        field.style.borderColor = 'var(--error-500)';
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.closest('.form-group').querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

async function submitForm(form, submitBtn) {
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'var(--success-500)';
        
        // Show success message
        showFormResult(form, 'success', 'Thank you! We\'ll get back to you within 24 hours.');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 3000);
        
    } catch (error) {
        // Show error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error occurred';
        submitBtn.style.background = 'var(--error-500)';
        
        showFormResult(form, 'error', 'Something went wrong. Please try again.');
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 3000);
    }
}

function showFormResult(form, type, message) {
    let resultElement = form.querySelector('.form-result');
    
    if (!resultElement) {
        resultElement = document.createElement('div');
        resultElement.className = 'form-result';
        form.appendChild(resultElement);
    }
    
    resultElement.className = `form-result ${type}-message`;
    resultElement.textContent = message;
    resultElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        resultElement.style.display = 'none';
    }, 5000);
}

// Professional Statistics Counter
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[\d,]/g, '');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, 16);
}

// Professional Interactions
function initProfessionalInteractions() {
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Card interactions
    document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Professional loading states for all interactive elements
    document.querySelectorAll('button, .btn').forEach(element => {
        element.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('no-loading')) {
                addClickFeedback(this);
            }
        });
    });
}

function addClickFeedback(element) {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

// Intersection Observer for performance
function initIntersectionObserver() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add animation classes when elements come into view
    const animateElements = document.querySelectorAll('[data-animate]');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animate;
                element.classList.add(animation);
                animateObserver.unobserve(element);
            }
        });
    });
    
    animateElements.forEach(el => animateObserver.observe(el));
}

// Professional utility functions
function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--${type === 'error' ? 'error' : type === 'success' ? 'success' : 'primary'}-500);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-dependent operations
}, 16);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Expose useful functions globally
window.VizzarJobs = {
    scrollToElement,
    showNotification,
    validateForm: (formElement) => validateForm(formElement)
};
