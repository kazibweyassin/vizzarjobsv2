// VizzarJobs Frontend API Connection
// This file handles all API calls to the backend

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001/api' 
    : 'https://vizzarjobsv2.onrender.com/api';

// API utility class
class VizzarAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('vizzar_token');
        console.log('🚀 VizzarAPI initialized with base URL:', this.baseURL);
        console.log('🏠 Current hostname:', window.location.hostname);
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('vizzar_token', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        localStorage.removeItem('vizzar_token');
    }

    // Get headers with authentication
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('🔄 API Request:', url, options);
        
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            console.log('📡 API Response Status:', response.status, response.statusText);
            
            const data = await response.json();
            console.log('📦 API Response Data:', data);

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('❌ API Error:', error);
            console.error('🔗 Request URL:', url);
            console.error('⚙️ Request Config:', config);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }

    // Get subscription tiers
    async getSubscriptionTiers() {
        return this.request('/subscription/tiers');
    }

    // Authentication methods
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async logout() {
        this.removeToken();
        return { message: 'Logged out successfully' };
    }

    async forgotPassword(email) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token, newPassword) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    }

    // User profile methods
    async getUserProfile() {
        return this.request('/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async uploadResume(formData) {
        // Remove Content-Type header for FormData
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return this.request('/user/upload-resume', {
            method: 'POST',
            headers,
            body: formData,
        });
    }

    // Subscription methods
    async getUserSubscription() {
        return this.request('/user/subscription');
    }

    async createSubscription(subscriptionData) {
        return this.request('/billing/create-subscription', {
            method: 'POST',
            body: JSON.stringify(subscriptionData),
        });
    }

    async cancelSubscription() {
        return this.request('/billing/cancel-subscription', {
            method: 'POST',
        });
    }

    // Employer matching methods
    async getAvailableMatches() {
        return this.request('/matches/available');
    }

    async requestIntroduction(introductionData) {
        return this.request('/matches/request-introduction', {
            method: 'POST',
            body: JSON.stringify(introductionData),
        });
    }

    async getMatchHistory() {
        return this.request('/matches/history');
    }

    // Admin methods (require admin token)
    async getAdminUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/admin/users?${queryString}`);
    }

    async getAdminAnalytics() {
        return this.request('/admin/analytics');
    }
}

// Create global API instance
window.vizzarAPI = new VizzarAPI();

// Test connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const health = await window.vizzarAPI.healthCheck();
        console.log('✅ Backend connection successful:', health);
        
        // Update UI to show backend is connected
        updateConnectionStatus(true);
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        updateConnectionStatus(false);
    }
});

// Update connection status in UI
function updateConnectionStatus(isConnected) {
    // Create or update connection indicator
    let indicator = document.getElementById('backend-status');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'backend-status';
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.padding = '5px 10px';
        indicator.style.borderRadius = '5px';
        indicator.style.fontSize = '12px';
        indicator.style.fontWeight = 'bold';
        indicator.style.zIndex = '9999';
        document.body.appendChild(indicator);
    }

    if (isConnected) {
        indicator.textContent = '✅ Backend Connected';
        indicator.style.backgroundColor = '#4CAF50';
        indicator.style.color = 'white';
    } else {
        indicator.textContent = '❌ Backend Offline';
        indicator.style.backgroundColor = '#f44336';
        indicator.style.color = 'white';
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VizzarAPI;
}
