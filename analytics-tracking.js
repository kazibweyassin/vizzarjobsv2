// Advanced Analytics & Tracking System for VizzarJobs
// Google Analytics, Facebook Pixel, Custom Events, and Dashboard

class AnalyticsTracker {
    constructor() {
        this.isInitialized = false;
        this.events = [];
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            leadMagnets: 0,
            scrollDepth: 0
        };
        
        // Revenue tracking
        this.revenueData = {
            totalRevenue: 0,
            conversions: 0,
            averageOrderValue: 0,
            conversionRate: 0
        };

        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Initialize tracking systems
        this.initializeGoogleAnalytics();
        this.initializeFacebookPixel();
        this.initializeCustomTracking();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Analytics system initialized');
    }

    // Google Analytics 4 Setup
    initializeGoogleAnalytics() {
        // GA4 Configuration
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            // Enhanced ecommerce settings
            send_page_view: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
            
            // Custom parameters
            custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'target_country',
                'custom_parameter_3': 'profession'
            }
        });

        // Enhanced ecommerce events
        this.setupEcommerceTracking();
    }

    // Facebook Pixel Setup
    initializeFacebookPixel() {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');

        // Advanced matching for better attribution
        const userData = this.getUserData();
        if (userData.email) {
            fbq('init', 'YOUR_PIXEL_ID', {
                em: this.hashEmail(userData.email)
            });
        }
    }

    // Custom tracking initialization
    initializeCustomTracking() {
        // Heat mapping and session recording
        this.initializeHotjar();
        
        // Custom dashboard metrics
        this.trackPageLoad();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        
        // Lead scoring
        this.initializeLeadScoring();
    }

    // Hotjar initialization for heatmaps and recordings
    initializeHotjar() {
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }

    // Setup comprehensive event listeners
    setupEventListeners() {
        // Button clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Form interactions
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                this.trackFormInteraction(e);
            }
        });

        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateScrollDepth();
            }, 100);
        });

        // Video interactions (if any)
        document.addEventListener('play', (e) => {
            if (e.target.tagName === 'VIDEO') {
                this.trackVideoPlay(e.target);
            }
        }, true);

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackPageExit();
            }
        });
    }

    // Enhanced ecommerce tracking
    setupEcommerceTracking() {
        // Track product views (pricing page views)
        this.trackEvent('view_item_list', {
            item_list_id: 'pricing_plans',
            item_list_name: 'Pricing Plans',
            items: [
                {
                    item_id: 'starter',
                    item_name: 'Starter Toolkit',
                    item_category: 'visa_services',
                    price: 97,
                    currency: 'USD'
                },
                {
                    item_id: 'professional', 
                    item_name: 'Professional Support',
                    item_category: 'visa_services',
                    price: 497,
                    currency: 'USD'
                },
                {
                    item_id: 'vip',
                    item_name: 'VIP Concierge',
                    item_category: 'visa_services', 
                    price: 1997,
                    currency: 'USD'
                }
            ]
        });
    }

    // Track specific events
    trackEvent(eventName, parameters = {}) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...parameters,
                timestamp: Date.now(),
                page_location: window.location.href,
                page_title: document.title
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            const fbEventMap = {
                'sign_up': 'CompleteRegistration',
                'purchase': 'Purchase',
                'add_to_cart': 'AddToCart',
                'begin_checkout': 'InitiateCheckout',
                'view_item': 'ViewContent',
                'lead': 'Lead'
            };

            const fbEventName = fbEventMap[eventName] || 'CustomEvent';
            fbq('track', fbEventName, parameters);
        }

        // Custom tracking
        this.events.push({
            event: eventName,
            parameters: parameters,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });

        // Send to custom analytics endpoint
        this.sendCustomEvent(eventName, parameters);
    }

    // Track clicks with detailed context
    trackClick(event) {
        const element = event.target;
        const tagName = element.tagName.toLowerCase();
        
        // Track button clicks
        if (tagName === 'button' || element.closest('button')) {
            const button = tagName === 'button' ? element : element.closest('button');
            const buttonText = button.textContent.trim();
            const buttonClass = button.className;
            
            this.trackEvent('button_click', {
                button_text: buttonText,
                button_class: buttonClass,
                section: this.getCurrentSection(button)
            });
        }

        // Track link clicks
        if (tagName === 'a' || element.closest('a')) {
            const link = tagName === 'a' ? element : element.closest('a');
            const href = link.href;
            const linkText = link.textContent.trim();
            
            this.trackEvent('link_click', {
                link_url: href,
                link_text: linkText,
                is_external: !href.startsWith(window.location.origin)
            });
        }

        // Track pricing plan interactions
        if (element.closest('.pricing-card')) {
            const pricingCard = element.closest('.pricing-card');
            const planName = pricingCard.querySelector('h3')?.textContent || 'Unknown';
            
            this.trackEvent('pricing_interaction', {
                plan_name: planName,
                interaction_type: 'click'
            });
        }
    }

    // Track form interactions
    trackFormInteraction(event) {
        const field = event.target;
        const formId = field.closest('form')?.id || 'unknown_form';
        const fieldName = field.name || field.id || 'unknown_field';
        
        this.sessionData.interactions++;
        
        this.trackEvent('form_interaction', {
            form_id: formId,
            field_name: fieldName,
            field_type: field.type,
            interaction_count: this.sessionData.interactions
        });

        // Lead scoring based on form completion
        this.updateLeadScore('form_interaction', 5);
    }

    // Track scroll depth
    updateScrollDepth() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > this.sessionData.scrollDepth) {
            this.sessionData.scrollDepth = scrollPercent;
            
            // Track scroll milestones
            const milestones = [25, 50, 75, 90];
            for (const milestone of milestones) {
                if (scrollPercent >= milestone && !this.getScrollMilestone(milestone)) {
                    this.setScrollMilestone(milestone);
                    this.trackEvent('scroll_depth', {
                        scroll_depth: milestone,
                        page_section: this.getCurrentSection()
                    });
                }
            }
        }
    }

    // Track conversions
    trackConversion(conversionType, value = 0, currency = 'USD') {
        this.revenueData.conversions++;
        this.revenueData.totalRevenue += value;
        this.revenueData.averageOrderValue = this.revenueData.totalRevenue / this.revenueData.conversions;

        // Google Analytics purchase event
        this.trackEvent('purchase', {
            transaction_id: this.generateTransactionId(),
            value: value,
            currency: currency,
            items: [{
                item_id: conversionType,
                item_name: this.getProductName(conversionType),
                item_category: 'visa_services',
                price: value,
                quantity: 1
            }]
        });

        // Update lead score
        this.updateLeadScore('conversion', 100);

        // Send conversion data to dashboard
        this.updateDashboardMetrics();
    }

    // Lead scoring system
    initializeLeadScoring() {
        this.leadScore = 0;
        this.leadActions = [];
    }

    updateLeadScore(action, points) {
        this.leadScore += points;
        this.leadActions.push({
            action: action,
            points: points,
            timestamp: Date.now(),
            totalScore: this.leadScore
        });

        // Track high-value leads
        if (this.leadScore >= 50 && !this.isHighValueLead) {
            this.isHighValueLead = true;
            this.trackEvent('high_value_lead', {
                lead_score: this.leadScore,
                actions_count: this.leadActions.length
            });
        }
    }

    // Custom dashboard metrics
    updateDashboardMetrics() {
        const metrics = {
            session_duration: Date.now() - this.sessionData.startTime,
            page_views: this.sessionData.pageViews,
            interactions: this.sessionData.interactions,
            scroll_depth: this.sessionData.scrollDepth,
            lead_score: this.leadScore,
            events_count: this.events.length,
            revenue_data: this.revenueData
        };

        // Send to custom analytics dashboard
        fetch('/api/analytics/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: this.getSessionId(),
                metrics: metrics,
                timestamp: Date.now()
            })
        }).catch(error => {
            console.warn('Failed to update dashboard metrics:', error);
        });
    }

    // Utility functions
    getCurrentSection(element = null) {
        const sections = ['home', 'features', 'pricing', 'testimonials', 'contact'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                const absoluteBottom = absoluteTop + rect.height;
                
                if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
                    return sectionId;
                }
            }
        }
        
        return 'unknown';
    }

    getUserData() {
        return {
            email: document.getElementById('email')?.value || '',
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            targetCountry: document.getElementById('targetCountry')?.value || '',
            profession: document.getElementById('profession')?.value || ''
        };
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }

    generateTransactionId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getProductName(productId) {
        const productNames = {
            'starter': 'Starter Toolkit',
            'professional': 'Professional Support',
            'vip': 'VIP Concierge',
            'coaching': 'Group Coaching',
            'course': 'Online Course'
        };
        return productNames[productId] || productId;
    }

    hashEmail(email) {
        // Simple hash function for privacy (use proper hashing in production)
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Scroll milestone tracking
    getScrollMilestone(milestone) {
        return localStorage.getItem(`scroll_${milestone}_${window.location.pathname}`) === 'true';
    }

    setScrollMilestone(milestone) {
        localStorage.setItem(`scroll_${milestone}_${window.location.pathname}`, 'true');
    }

    // Track page load
    trackPageLoad() {
        this.sessionData.pageViews++;
        
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    // Track time on page
    trackTimeOnPage() {
        setInterval(() => {
            const timeOnPage = Date.now() - this.sessionData.startTime;
            
            // Track engagement milestones
            const milestones = [30000, 60000, 180000, 300000]; // 30s, 1m, 3m, 5m
            for (const milestone of milestones) {
                if (timeOnPage >= milestone && !this.getTimeMilestone(milestone)) {
                    this.setTimeMilestone(milestone);
                    this.trackEvent('time_milestone', {
                        time_seconds: milestone / 1000,
                        engaged_user: true
                    });
                    
                    // Update lead score for engagement
                    this.updateLeadScore('time_engagement', 10);
                }
            }
        }, 10000); // Check every 10 seconds
    }

    getTimeMilestone(milestone) {
        return this[`time_${milestone}`] === true;
    }

    setTimeMilestone(milestone) {
        this[`time_${milestone}`] = true;
    }

    // Track page exit
    trackPageExit() {
        const sessionDuration = Date.now() - this.sessionData.startTime;
        
        this.trackEvent('page_exit', {
            session_duration: sessionDuration,
            scroll_depth: this.sessionData.scrollDepth,
            interactions: this.sessionData.interactions,
            lead_score: this.leadScore
        });

        // Send final session data
        this.updateDashboardMetrics();
    }

    // Track video interactions
    trackVideoPlay(video) {
        this.trackEvent('video_play', {
            video_title: video.title || 'Unknown',
            video_duration: video.duration,
            video_src: video.src
        });
    }

    // Send custom events to analytics endpoint
    sendCustomEvent(eventName, parameters) {
        fetch('/api/analytics/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                parameters: parameters,
                session_id: this.getSessionId(),
                timestamp: Date.now(),
                url: window.location.href,
                user_data: this.getUserData()
            })
        }).catch(error => {
            console.warn('Failed to send custom event:', error);
        });
    }

    // Public methods for manual tracking
    trackCustomEvent(eventName, parameters = {}) {
        this.trackEvent(eventName, parameters);
    }

    trackLeadMagnetDownload(leadMagnetType) {
        this.sessionData.leadMagnets++;
        this.updateLeadScore('lead_magnet_download', 25);
        
        this.trackEvent('lead_magnet_download', {
            lead_magnet_type: leadMagnetType,
            total_downloads: this.sessionData.leadMagnets
        });
    }

    trackConsultationBooking() {
        this.updateLeadScore('consultation_booking', 50);
        
        this.trackEvent('consultation_booking', {
            booking_value: 0, // Free consultation
            lead_score: this.leadScore
        });
    }

    trackPricingPageView() {
        this.trackEvent('view_pricing', {
            section: 'pricing',
            timestamp: Date.now()
        });
    }

    // A/B testing support
    trackABTest(testName, variant) {
        this.trackEvent('ab_test_view', {
            test_name: testName,
            variant: variant,
            session_id: this.getSessionId()
        });
    }
}

// Initialize analytics
const analytics = new AnalyticsTracker();

// Global tracking functions
window.trackEvent = (eventName, parameters) => {
    analytics.trackCustomEvent(eventName, parameters);
};

window.trackConversion = (type, value, currency = 'USD') => {
    analytics.trackConversion(type, value, currency);
};

window.trackLeadMagnet = (type) => {
    analytics.trackLeadMagnetDownload(type);
};

// Export for global use
window.AnalyticsTracker = AnalyticsTracker;
window.analytics = analytics;
