// Email Marketing & Lead Magnet System
// ConvertKit Integration with Automated Sequences

class EmailMarketing {
    constructor() {
        this.convertKitApiKey = 'YOUR_CONVERTKIT_API_KEY';
        this.formId = 'YOUR_CONVERTKIT_FORM_ID';
        this.baseUrl = 'https://api.convertkit.com/v3';
        
        // Lead magnet configurations
        this.leadMagnets = {
            visa_checklist: {
                title: "Ultimate Visa Application Checklist",
                description: "50-point checklist for perfect visa applications",
                file: "/downloads/visa-checklist.pdf",
                tag: "visa-checklist",
                sequence: "welcome-series"
            },
            country_guide: {
                title: "50 Countries Visa Requirements Guide", 
                description: "Complete requirements for top destinations",
                file: "/downloads/country-guide.pdf",
                tag: "country-guide",
                sequence: "educational-series"
            },
            interview_prep: {
                title: "Visa Interview Questions Database",
                description: "200+ common questions with expert answers",
                file: "/downloads/interview-questions.pdf",
                tag: "interview-prep",
                sequence: "interview-series"
            },
            salary_templates: {
                title: "Salary Negotiation Templates",
                description: "Email templates for salary negotiations",
                file: "/downloads/salary-templates.pdf",
                tag: "salary-negotiation",
                sequence: "career-series"
            },
            country_matrix: {
                title: "Country Comparison Matrix",
                description: "Compare visa requirements across countries",
                file: "/downloads/country-matrix.xlsx",
                tag: "country-comparison",
                sequence: "research-series"
            }
        };

        // Email sequences
        this.sequences = {
            "welcome-series": [
                {
                    day: 0,
                    subject: "🎉 Welcome! Your Visa Checklist is Ready",
                    template: "welcome_with_download"
                },
                {
                    day: 2,
                    subject: "Sarah's Success Story: From India to Google London",
                    template: "success_story_sarah"
                },
                {
                    day: 4,
                    subject: "⚠️ 7 Common Visa Mistakes That Cost You the Job",
                    template: "common_mistakes"
                },
                {
                    day: 7,
                    subject: "Country Spotlight: United States H1B Guide",
                    template: "country_spotlight_usa"
                },
                {
                    day: 10,
                    subject: "Interview Prep: What Visa Officers Really Want to Hear",
                    template: "interview_preparation"
                },
                {
                    day: 14,
                    subject: "🔥 Special Offer: 40% Off Professional Package",
                    template: "special_offer_professional"
                },
                {
                    day: 21,
                    subject: "Free 30-Min Consultation - Limited Slots Available",
                    template: "consultation_invite"
                }
            ]
        };
    }

    // Subscribe user and trigger lead magnet
    async subscribeWithLeadMagnet(email, firstName, lastName, leadMagnetKey, additionalData = {}) {
        try {
            const leadMagnet = this.leadMagnets[leadMagnetKey];
            
            if (!leadMagnet) {
                throw new Error('Invalid lead magnet key');
            }

            // Subscribe to ConvertKit
            const response = await fetch(`${this.baseUrl}/forms/${this.formId}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: this.convertKitApiKey,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    tags: [leadMagnet.tag, 'lead-magnet'],
                    fields: {
                        target_country: additionalData.targetCountry || '',
                        profession: additionalData.profession || '',
                        lead_source: additionalData.leadSource || 'website',
                        signup_date: new Date().toISOString()
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe user');
            }

            const result = await response.json();

            // Track the lead magnet signup
            this.trackLeadMagnetEvent(leadMagnetKey, email);

            // Show download modal
            this.showDownloadModal(leadMagnet);

            // Start email sequence
            this.triggerSequence(result.subscription.id, leadMagnet.sequence);

            return {
                success: true,
                subscription: result.subscription,
                downloadUrl: leadMagnet.file
            };

        } catch (error) {
            console.error('Lead magnet subscription error:', error);
            this.showErrorMessage('Failed to process signup. Please try again.');
            return { success: false, error: error.message };
        }
    }

    // Show download modal
    showDownloadModal(leadMagnet) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-download text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Success!</h3>
                <p class="text-gray-600 mb-6">
                    ${leadMagnet.description}
                </p>
                <div class="space-y-4">
                    <a href="${leadMagnet.file}" 
                       class="block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                       download>
                        <i class="fas fa-download mr-2"></i>
                        Download ${leadMagnet.title}
                    </a>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="block w-full text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>
                <div class="mt-6 text-sm text-gray-500">
                    <i class="fas fa-envelope mr-1"></i>
                    Check your email for additional resources!
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Trigger email sequence
    async triggerSequence(subscriptionId, sequenceName) {
        try {
            const sequence = this.sequences[sequenceName];
            
            if (!sequence) {
                console.warn(`Sequence "${sequenceName}" not found`);
                return;
            }

            // Add subscriber to sequence tag
            await fetch(`${this.baseUrl}/subscribers/${subscriptionId}/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: this.convertKitApiKey,
                    tags: [sequenceName]
                })
            });

            console.log(`Subscriber added to sequence: ${sequenceName}`);

        } catch (error) {
            console.error('Failed to trigger email sequence:', error);
        }
    }

    // Track lead magnet events
    trackLeadMagnetEvent(leadMagnetKey, email) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_magnet_download', {
                event_category: 'lead_generation',
                event_label: leadMagnetKey,
                custom_parameter_1: email
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: leadMagnetKey,
                content_category: 'lead_magnet'
            });
        }

        // Custom tracking
        fetch('/api/track-lead-magnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                leadMagnet: leadMagnetKey,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        }).catch(error => {
            console.warn('Failed to track lead magnet:', error);
        });
    }

    // Show error message
    showErrorMessage(message) {
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
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Get user data from current form
    getUserData() {
        return {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            targetCountry: document.getElementById('targetCountry')?.value || '',
            profession: document.getElementById('profession')?.value || ''
        };
    }
}

// Initialize email marketing
const emailMarketing = new EmailMarketing();

// Lead magnet handlers
function downloadLeadMagnet(leadMagnetKey) {
    const userData = emailMarketing.getUserData();
    
    if (!userData.email || !userData.firstName) {
        // Show signup form if data missing
        showLeadMagnetSignupForm(leadMagnetKey);
        return;
    }

    // Process the lead magnet signup
    emailMarketing.subscribeWithLeadMagnet(
        userData.email,
        userData.firstName,
        userData.lastName,
        leadMagnetKey,
        {
            targetCountry: userData.targetCountry,
            profession: userData.profession,
            leadSource: 'website'
        }
    );
}

// Show dedicated signup form for lead magnets
function showLeadMagnetSignupForm(leadMagnetKey) {
    const leadMagnet = emailMarketing.leadMagnets[leadMagnetKey];
    
    if (!leadMagnet) {
        console.error('Invalid lead magnet key');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-gift text-primary-600 text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">${leadMagnet.title}</h3>
                <p class="text-gray-600">${leadMagnet.description}</p>
            </div>
            
            <form id="leadMagnetForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input type="text" id="lm_firstName" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text" id="lm_lastName"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input type="email" id="lm_email" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                
                <div class="flex space-x-4 pt-4">
                    <button type="submit" 
                            class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        <i class="fas fa-download mr-2"></i>
                        Get Free Download
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()"
                            class="px-4 py-3 text-gray-500 hover:text-gray-700">
                        Cancel
                    </button>
                </div>
            </form>
            
            <div class="text-center text-xs text-gray-500 mt-4">
                <i class="fas fa-shield-alt text-green-500 mr-1"></i>
                Your email is safe with us. No spam, ever.
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Handle form submission
    const form = modal.querySelector('#leadMagnetForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: modal.querySelector('#lm_firstName').value,
            lastName: modal.querySelector('#lm_lastName').value,
            email: modal.querySelector('#lm_email').value
        };

        // Process the signup
        const result = await emailMarketing.subscribeWithLeadMagnet(
            formData.email,
            formData.firstName,
            formData.lastName,
            leadMagnetKey,
            { leadSource: 'lead-magnet-popup' }
        );

        if (result.success) {
            modal.remove();
        }
    });
}

// Newsletter subscription (separate from lead magnets)
async function subscribeToNewsletter(email, firstName = '', lastName = '') {
    try {
        const response = await fetch(`${emailMarketing.baseUrl}/forms/${emailMarketing.formId}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: emailMarketing.convertKitApiKey,
                email: email,
                first_name: firstName,
                last_name: lastName,
                tags: ['newsletter', 'general-signup']
            })
        });

        if (response.ok) {
            // Track newsletter signup
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'email_marketing',
                    event_label: 'general_newsletter'
                });
            }

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
            successDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check mr-2"></i>
                    <span>Successfully subscribed to newsletter!</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(successDiv);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);

            return true;
        }
        
        throw new Error('Failed to subscribe');

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        emailMarketing.showErrorMessage('Failed to subscribe. Please try again.');
        return false;
    }
}

// Add lead magnet buttons to the page
document.addEventListener('DOMContentLoaded', function() {
    // Add lead magnet buttons to appropriate sections
    addLeadMagnetButtons();
    
    // Add newsletter signup to footer
    addNewsletterSignup();
    
    // Add exit-intent lead magnet
    addExitIntentPopup();
});

function addLeadMagnetButtons() {
    // Add to hero section
    const heroSection = document.querySelector('#home .container');
    if (heroSection) {
        const leadMagnetButton = document.createElement('div');
        leadMagnetButton.className = 'mt-8 text-center';
        leadMagnetButton.innerHTML = `
            <button onclick="downloadLeadMagnet('visa_checklist')" 
                    class="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all">
                <i class="fas fa-gift mr-2"></i>
                Get Free Visa Checklist
            </button>
        `;
        
        const statsSection = heroSection.querySelector('.mt-16');
        if (statsSection) {
            statsSection.parentNode.insertBefore(leadMagnetButton, statsSection);
        }
    }

    // Add to features section
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
        const leadMagnetCTA = document.createElement('div');
        leadMagnetCTA.className = 'text-center mt-16';
        leadMagnetCTA.innerHTML = `
            <div class="bg-primary-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                    Start Your Journey Today
                </h3>
                <p class="text-gray-600 mb-6">
                    Download our comprehensive visa checklist and get started immediately
                </p>
                <button onclick="downloadLeadMagnet('visa_checklist')" 
                        class="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    <i class="fas fa-download mr-2"></i>
                    Download Free Checklist
                </button>
            </div>
        `;
        
        featuresSection.appendChild(leadMagnetCTA);
    }
}

function addNewsletterSignup() {
    // Add newsletter signup to footer
    const footer = document.querySelector('footer .container');
    if (footer) {
        const newsletterSection = document.createElement('div');
        newsletterSection.className = 'bg-primary-800 rounded-lg p-8 mb-12';
        newsletterSection.innerHTML = `
            <div class="text-center max-w-2xl mx-auto">
                <h3 class="text-2xl font-bold text-white mb-4">
                    Stay Updated on Visa Opportunities
                </h3>
                <p class="text-primary-200 mb-6">
                    Get weekly insights, success stories, and exclusive tips delivered to your inbox
                </p>
                <form id="newsletterForm" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input type="email" id="newsletter_email" placeholder="Enter your email" required
                           class="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white">
                    <button type="submit" 
                            class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Subscribe
                    </button>
                </form>
            </div>
        `;
        
        footer.insertBefore(newsletterSection, footer.firstChild);

        // Handle newsletter form
        const newsletterForm = newsletterSection.querySelector('#newsletterForm');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterSection.querySelector('#newsletter_email').value;
            subscribeToNewsletter(email);
            newsletterForm.reset();
        });
    }
}

function addExitIntentPopup() {
    let popupShown = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !popupShown) {
            popupShown = true;
            showLeadMagnetSignupForm('visa_checklist');
        }
    });
}

// Export for global use
window.EmailMarketing = EmailMarketing;
window.downloadLeadMagnet = downloadLeadMagnet;
window.subscribeToNewsletter = subscribeToNewsletter;
