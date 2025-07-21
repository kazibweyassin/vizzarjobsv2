// Payment Processing Integration for VizzarJobs
// Stripe & PayPal Implementation

class PaymentProcessor {
    constructor() {
        // Initialize Stripe
        this.stripe = Stripe('pk_live_51234567890_YOUR_PUBLISHABLE_KEY');
        
        // Price configurations
        this.prices = {
            starter: {
                id: 'price_starter_toolkit',
                amount: 9700, // $97.00 in cents
                name: 'Starter Toolkit',
                description: 'Complete visa toolkit for self-guided applicants'
            },
            professional: {
                id: 'price_professional_support', 
                amount: 49700, // $497.00 in cents
                name: 'Professional Support',
                description: 'Complete guidance with expert support'
            },
            vip: {
                id: 'price_vip_concierge',
                amount: 199700, // $1,997.00 in cents
                name: 'VIP Concierge',
                description: 'White-glove service for guaranteed success'
            },
            coaching: {
                id: 'price_group_coaching',
                amount: 9700, // $97.00 in cents
                name: 'Group Coaching',
                description: 'Monthly group coaching sessions',
                recurring: true
            },
            course: {
                id: 'price_online_course',
                amount: 19700, // $197.00 in cents
                name: 'Online Course',
                description: 'Visa mastery online course'
            }
        };
    }

    // Handle Stripe checkout
    async createStripeCheckout(priceKey, customerData) {
        try {
            const price = this.prices[priceKey];
            
            if (!price) {
                throw new Error('Invalid price key');
            }

            // Create checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price_id: price.id,
                    quantity: 1,
                    mode: price.recurring ? 'subscription' : 'payment',
                    customer_email: customerData.email,
                    customer_name: `${customerData.firstName} ${customerData.lastName}`,
                    success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${priceKey}`,
                    cancel_url: `${window.location.origin}/pricing`,
                    metadata: {
                        plan: priceKey,
                        target_country: customerData.targetCountry,
                        profession: customerData.profession
                    }
                })
            });

            const session = await response.json();

            if (session.error) {
                throw new Error(session.error);
            }

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

        } catch (error) {
            console.error('Stripe checkout error:', error);
            this.showPaymentError(error.message);
        }
    }

    // Handle PayPal payment
    initializePayPal(containerId, priceKey) {
        const price = this.prices[priceKey];
        
        if (!price) {
            console.error('Invalid price key for PayPal');
            return;
        }

        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: (price.amount / 100).toFixed(2),
                            currency_code: 'USD'
                        },
                        description: price.description
                    }]
                });
            },
            
            onApprove: async (data, actions) => {
                try {
                    const order = await actions.order.capture();
                    
                    // Send order details to server
                    await fetch('/api/paypal-success', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderId: order.id,
                            plan: priceKey,
                            amount: price.amount,
                            customerData: this.getCustomerData()
                        })
                    });

                    // Redirect to success page
                    window.location.href = `/success?order_id=${order.id}&plan=${priceKey}`;
                    
                } catch (error) {
                    console.error('PayPal capture error:', error);
                    this.showPaymentError('Payment processing failed. Please try again.');
                }
            },
            
            onError: (err) => {
                console.error('PayPal error:', err);
                this.showPaymentError('PayPal payment failed. Please try again or use a different payment method.');
            },
            
            onCancel: (data) => {
                console.log('PayPal payment cancelled:', data);
                // Optional: track cancellation event
                gtag('event', 'payment_cancelled', {
                    payment_method: 'paypal',
                    plan: priceKey
                });
            }
        }).render(`#${containerId}`);
    }

    // Get customer data from form
    getCustomerData() {
        return {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            targetCountry: document.getElementById('targetCountry')?.value || '',
            profession: document.getElementById('profession')?.value || ''
        };
    }

    // Show payment error message
    showPaymentError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Track payment events
    trackPaymentEvent(event, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                event_category: 'payment',
                payment_method: data.method,
                plan: data.plan,
                value: data.amount / 100,
                currency: 'USD'
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            if (event === 'purchase') {
                fbq('track', 'Purchase', {
                    value: data.amount / 100,
                    currency: 'USD',
                    content_name: data.plan,
                    content_category: 'visa-services'
                });
            } else if (event === 'initiate_checkout') {
                fbq('track', 'InitiateCheckout', {
                    value: data.amount / 100,
                    currency: 'USD',
                    content_name: data.plan
                });
            }
        }
    }
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();

// Enhanced pricing button handlers
function handlePricingClick(planType) {
    // Validate customer data first
    const customerData = paymentProcessor.getCustomerData();
    
    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
        // Scroll to form if data is missing
        document.getElementById('user-form').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Highlight required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'targetCountry', 'profession'];
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && !element.value) {
                element.classList.add('border-red-500');
                element.focus();
            }
        });
        
        return;
    }

    // Track checkout initiation
    paymentProcessor.trackPaymentEvent('initiate_checkout', {
        method: 'stripe',
        plan: planType,
        amount: paymentProcessor.prices[planType].amount
    });

    // Create Stripe checkout
    paymentProcessor.createStripeCheckout(planType, customerData);
}

// Add payment buttons to pricing cards
document.addEventListener('DOMContentLoaded', function() {
    // Update existing pricing buttons with payment handlers
    const pricingButtons = {
        starter: document.querySelector('.pricing-card:nth-child(1) button'),
        professional: document.querySelector('.pricing-card:nth-child(2) button'),
        vip: document.querySelector('.pricing-card:nth-child(3) button')
    };

    // Add click handlers
    if (pricingButtons.starter) {
        pricingButtons.starter.onclick = () => handlePricingClick('starter');
    }
    
    if (pricingButtons.professional) {
        pricingButtons.professional.onclick = () => handlePricingClick('professional');
    }
    
    if (pricingButtons.vip) {
        pricingButtons.vip.onclick = () => handlePricingClick('vip');
    }

    // Initialize PayPal buttons for additional products
    const additionalProducts = document.querySelectorAll('.revenue-stream-card');
    additionalProducts.forEach((card, index) => {
        const productTypes = ['course', 'coaching', 'course', 'starter']; // Map to pricing
        const productType = productTypes[index] || 'course';
        
        // Add PayPal container
        const paypalContainer = document.createElement('div');
        paypalContainer.id = `paypal-${productType}-${index}`;
        paypalContainer.className = 'mt-4';
        card.appendChild(paypalContainer);
        
        // Initialize PayPal button
        paymentProcessor.initializePayPal(paypalContainer.id, productType);
    });
});

// Payment success handler
function handlePaymentSuccess(sessionId, planType) {
    // Track successful purchase
    paymentProcessor.trackPaymentEvent('purchase', {
        method: 'stripe',
        plan: planType,
        amount: paymentProcessor.prices[planType].amount,
        session_id: sessionId
    });

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    successMessage.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
            <p class="text-gray-600 mb-6">
                Thank you for your purchase. You'll receive access instructions via email within 5 minutes.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700">
                Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto-redirect after 10 seconds
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 10000);
}

// Export for global use
window.PaymentProcessor = PaymentProcessor;
window.handlePricingClick = handlePricingClick;
window.handlePaymentSuccess = handlePaymentSuccess;
