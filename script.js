// VizzarJobs Interactive Features - Modern UI/UX Enhanced with Backend Integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features with modern enhancements
    initNavigation();
    initModernAnimations();
    initFormValidation();
    initScrollEffects();
    initMobileMenu();
    initModernInteractions();
    initGlassmorphism();
    initBlobAnimations();
    initBackendIntegration();
});

// Backend Integration
function initBackendIntegration() {
    // Add a delay to ensure API is loaded
    setTimeout(() => {
        if (window.vizzarAPI) {
            // Test backend connection
            testBackendConnection();
            
            // Load subscription tiers from backend
            loadSubscriptionTiers();
            
            // Setup form handlers
            setupContactForm();
            setupNewsletterForm();
        } else {
            console.log('ℹ️ API not available, running in offline mode');
        }
    }, 2000);
}

async function testBackendConnection() {
    try {
        const health = await window.vizzarAPI.healthCheck();
        console.log('✅ Backend connected:', health);
        showConnectionStatus(true);
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showConnectionStatus(false);
    }
}

function showConnectionStatus(isConnected) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium z-50 transition-all duration-300 ${
        isConnected 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
    }`;
    statusDiv.textContent = isConnected 
        ? '✅ Backend Connected' 
        : '❌ Backend Offline';
    
    document.body.appendChild(statusDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusDiv.style.opacity = '0';
        setTimeout(() => statusDiv.remove(), 300);
    }, 3000);
}

async function loadSubscriptionTiers() {
    try {
        if (!window.vizzarAPI) {
            console.log('ℹ️ API not available, using default pricing');
            return;
        }
        
        const response = await window.vizzarAPI.getSubscriptionTiers();
        if (response.status === 'success') {
            updatePricingDisplay(response.data);
        }
    } catch (error) {
        console.error('Failed to load subscription tiers:', error);
        console.log('ℹ️ Using default pricing display');
    }
}

function updatePricingDisplay(tiers) {
    tiers.forEach(tier => {
        const priceElement = document.querySelector(`[data-tier="${tier.tier}"] .price-amount`);
        const featuresElement = document.querySelector(`[data-tier="${tier.tier}"] .features-list`);
        
        if (priceElement) {
            priceElement.textContent = `$${tier.price}`;
        }
        
        if (featuresElement) {
            featuresElement.innerHTML = tier.features
                .map(feature => `<li class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    ${feature}
                </li>`)
                .join('');
        }
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
                type: 'contact'
            };
            
            try {
                showFormLoading(contactForm, true);
                
                // For now, we'll simulate a successful submission
                // In production, you'd send this to a contact endpoint
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showFormSuccess(contactForm, 'Thank you! We\'ll be in touch soon.');
                contactForm.reset();
            } catch (error) {
                showFormError(contactForm, 'Failed to send message. Please try again.');
            } finally {
                showFormLoading(contactForm, false);
            }
        });
    }
}

function setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const email = formData.get('email');
            
            if (!email || !isValidEmail(email)) {
                showFormError(form, 'Please enter a valid email address.');
                return;
            }
            
            try {
                showFormLoading(form, true);
                
                // For now, simulate newsletter signup
                // In production, you'd send this to a newsletter endpoint
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showFormSuccess(form, 'Successfully subscribed! Check your email for our visa guide.');
                form.reset();
            } catch (error) {
                showFormError(form, 'Subscription failed. Please try again.');
            } finally {
                showFormLoading(form, false);
            }
        });
    });
}

function showFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;
        submitBtn.dataset.originalText = originalText;
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || originalText;
    }
}

function showFormSuccess(form, message) {
    showFormMessage(form, message, 'success');
}

function showFormError(form, message) {
    showFormMessage(form, message, 'error');
}

function showFormMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message mt-4 p-4 rounded-lg text-sm ${
        type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
    }`;
    messageDiv.textContent = message;
    
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navigation functionality with glassmorphism effects
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Enhanced navbar scroll effect with glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.borderBottom = 'none';
        }
    });
    
    // Enhanced smooth scroll with custom easing
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Add modern scroll behavior
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add active link indicator
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
        
        // Add hover effects for nav links
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
            link.style.textShadow = '0 0 10px rgba(99, 102, 241, 0.5)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
            link.style.textShadow = 'none';
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }
}

// Modern animation and scroll effects
function initModernAnimations() {
    // Enhanced Intersection Observer with modern effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add staggered animations based on element type
                if (element.classList.contains('feature-card')) {
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.animationDelay = `${index * 0.2}s`;
                    element.classList.add('animate-fade-in-up');
                    
                    // Add shimmer effect
                    setTimeout(() => {
                        element.classList.add('shimmer-effect');
                    }, index * 200 + 500);
                    
                } else if (element.classList.contains('testimonial-card')) {
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.animationDelay = `${index * 0.15}s`;
                    element.classList.add('animate-slide-in-right');
                    
                } else if (element.classList.contains('stats-item')) {
                    const index = Array.from(element.parentNode.children).indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                    element.classList.add('animate-scale-in');
                    
                    // Animate numbers
                    animateCounter(element);
                    
                } else {
                    element.classList.add('animate-fade-in');
                }
                
                // Add glass effect to cards
                if (element.classList.contains('feature-card') || element.classList.contains('testimonial-card')) {
                    element.style.backdropFilter = 'blur(10px)';
                    element.style.background = 'rgba(255, 255, 255, 0.1)';
                    element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements for modern animations
    const animateElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .process-step, .stats-item, .trust-logo'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add floating animations to various elements
    initFloatingAnimations();
}

// Counter animation for statistics
function animateCounter(element) {
    const numberElement = element.querySelector('.stats-number');
    if (!numberElement) return;
    
    const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
    const suffix = numberElement.textContent.replace(/[\d,]/g, '');
    let currentNumber = 0;
    const increment = finalNumber / 50;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            numberElement.textContent = finalNumber.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            numberElement.textContent = Math.floor(currentNumber).toLocaleString() + suffix;
        }
    }, 30);
}

// Floating animations for background elements
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-element, .blob');
    
    floatingElements.forEach((element, index) => {
        const duration = 3000 + (index * 500);
        const delay = index * 200;
        
        element.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite alternate`;
    });
}

// Enhanced scroll effects with modern parallax
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Enhanced parallax for hero background blobs
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = 0.2 + (index * 0.1);
            const rotation = scrolled * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
        });
        
        // Parallax for feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            const speed = 0.05 + (index * 0.02);
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                card.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
        
        // Dynamic navbar glassmorphism intensity
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const intensity = Math.min(scrolled / 300, 1);
            navbar.style.backdropFilter = `blur(${10 + intensity * 10}px)`;
            navbar.style.background = `rgba(255, 255, 255, ${0.05 + intensity * 0.1})`;
        }
        
        // Floating elements with different speeds
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.03);
            const sway = Math.sin(scrolled * 0.01 + index) * 20;
            element.style.transform = `translateY(${scrolled * speed}px) translateX(${sway}px)`;
        });
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
    
    // Mouse movement parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02;
            const x = mouseX * 50 * speed;
            const y = mouseY * 50 * speed;
            
            blob.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const targetCountry = document.getElementById('targetCountry');
        const profession = document.getElementById('profession');
        
        // Reset error states
        clearErrors();
        
        let isValid = true;
        
        // Validate required fields
        if (!firstName.value.trim()) {
            showError('firstName', 'Please enter your first name');
            isValid = false;
        }
        
        if (!lastName.value.trim()) {
            showError('lastName', 'Please enter your last name');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!targetCountry.value) {
            showError('targetCountry', 'Please select your target country');
            isValid = false;
        }
        
        if (!profession.value.trim()) {
            showError('profession', 'Please enter your profession');
            isValid = false;
        }
        
        // Validate phone if provided
        if (phone.value.trim() && !isValidPhone(phone.value)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // If valid, show success message
        if (isValid) {
            showSuccessMessage();
            
            // Send form data (simulate API call)
            submitFormData({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                targetCountry: targetCountry.value,
                profession: profession.value
            });
        }
    });
}

// Helper functions for form validation
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    if (inputElement) {
        inputElement.classList.add('border-red-500');
        inputElement.focus();
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    const inputElements = document.querySelectorAll('.form-input');
    
    errorElements.forEach(el => {
        el.classList.add('hidden');
    });
    
    inputElements.forEach(el => {
        el.classList.remove('border-red-500');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's between 10-15 digits
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

function showSuccessMessage() {
    const form = document.getElementById('user-form');
    const successMessage = document.getElementById('thank-you-message');
    
    if (form && successMessage) {
        // Hide form with animation
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            
            // Animate success message
            setTimeout(() => {
                successMessage.style.transition = 'all 0.5s ease';
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 50);
            
            // Scroll to success message
            successMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }
}

function submitFormData(formData) {
    // Simulate API submission
    console.log('Form submitted:', formData);
    
    // Here you would typically send the data to your backend
    // Example:
    // fetch('/api/submit-form', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // });
}

// Scroll to form function (called from buttons)
function scrollToForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll to testimonials function
function scrollToTestimonials() {
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Input enhancement effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Real-time validation feedback
        input.addEventListener('input', function() {
            if (this.classList.contains('border-red-500')) {
                this.classList.remove('border-red-500');
                const errorElement = document.getElementById(`${this.id}-error`);
                if (errorElement) {
                    errorElement.classList.add('hidden');
                }
            }
        });
    });
});

// Add loading states and micro-interactions
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
    button.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// Enhanced scroll animations
function initAdvancedAnimations() {
    // Stagger animations for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover sound effects (optional)
    const interactiveElements = document.querySelectorAll('button, .feature-card, .testimonial-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Add subtle scale effect
            element.style.transform = element.style.transform || '' + ' scale(1.02)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = element.style.transform.replace(' scale(1.02)', '');
        });
    });
}

// Initialize advanced animations when DOM is ready
document.addEventListener('DOMContentLoaded', initAdvancedAnimations);

// Performance optimization: Debounce scroll events
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
const debouncedScrollHandler = debounce(() => {
    // Your scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Modern interaction enhancements
function initModernInteractions() {
    // Enhanced button interactions
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            createRippleEffect(e, this);
        });
        
        // Magnetic effect for CTA buttons
        if (button.classList.contains('btn-primary')) {
            addMagneticEffect(button);
        }
    });
    
    // Card hover effects with 3D transforms
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            this.style.boxShadow = '';
        });
        
        // Mouse move 3D effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
    
    // Form input enhancements
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.boxShadow = '';
        });
    });
}

// Ripple effect for buttons
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Magnetic effect for buttons
function addMagneticEffect(element) {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
}

// Glassmorphism effects
function initGlassmorphism() {
    const glassElements = document.querySelectorAll('.glass-card, .feature-card, .testimonial-card');
    
    glassElements.forEach(element => {
        // Add glassmorphism on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.style.backdropFilter = 'blur(20px)';
                    element.style.background = 'rgba(255, 255, 255, 0.1)';
                    element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }
            });
        });
        
        observer.observe(element);
    });
}

// Blob animations controller
function initBlobAnimations() {
    const blobs = document.querySelectorAll('.blob');
    
    blobs.forEach((blob, index) => {
        // Random movement animation
        setInterval(() => {
            const x = Math.random() * 20 - 10;
            const y = Math.random() * 20 - 10;
            const scale = 0.8 + Math.random() * 0.4;
            
            blob.style.transform += ` translate(${x}px, ${y}px) scale(${scale})`;
        }, 3000 + index * 1000);
        
        // Color shifting
        setInterval(() => {
            const hue = Math.random() * 60 + 200; // Blue to purple range
            blob.style.background = `hsl(${hue}, 70%, 60%)`;
        }, 5000 + index * 1500);
    });
}

// Advanced loading states
function addAdvancedLoadingState(button) {
    const originalText = button.innerHTML;
    const originalWidth = button.offsetWidth;
    
    // Stage 1: Loading
    button.style.width = originalWidth + 'px';
    button.innerHTML = '<div class="loading-spinner"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        // Stage 2: Processing
        button.innerHTML = '<i class="fas fa-cog fa-spin mr-2"></i>Processing...';
        
        setTimeout(() => {
            // Stage 3: Success
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                // Stage 4: Reset
                button.innerHTML = originalText;
                button.style.background = '';
                button.style.width = '';
                button.disabled = false;
            }, 2000);
        }, 1500);
    }, 1000);
}

// Smooth scroll to section with offset
function smoothScrollTo(targetId, offset = 100) {
    const target = document.getElementById(targetId);
    if (target) {
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize cursor trail effect (optional modern touch)
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        updateTrail();
    });
    
    function updateTrail() {
        const existingTrails = document.querySelectorAll('.cursor-trail');
        existingTrails.forEach(t => t.remove());
        
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.left = point.x + 'px';
            trailElement.style.top = point.y + 'px';
            trailElement.style.opacity = index / trailLength;
            document.body.appendChild(trailElement);
        });
    }
}
