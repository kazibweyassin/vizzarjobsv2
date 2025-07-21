const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'VizzarJobs Backend is running!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Test API endpoints (without database)
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        server: 'VizzarJobs Backend',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mock authentication endpoint
app.post('/api/auth/test', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email and password required'
        });
    }
    
    res.json({
        status: 'success',
        message: 'Mock authentication successful',
        user: {
            id: 'test-user-123',
            email: email,
            subscription_tier: 'professional'
        }
    });
});

// Mock employer data endpoint
app.get('/api/employers/test', (req, res) => {
    res.json({
        status: 'success',
        data: [
            {
                id: '1',
                company_name: 'Google',
                industry: 'Technology',
                headquarters_location: 'Mountain View, CA',
                visa_sponsorship_confirmed: true,
                active_positions: 200,
                success_rate: 94.1
            },
            {
                id: '2',
                company_name: 'Microsoft',
                industry: 'Technology',
                headquarters_location: 'Redmond, WA',
                visa_sponsorship_confirmed: true,
                active_positions: 180,
                success_rate: 92.3
            }
        ]
    });
});

// Mock subscription tiers endpoint
app.get('/api/subscription/tiers', (req, res) => {
    res.json({
        status: 'success',
        data: [
            {
                tier: 'starter',
                price: 49,
                features: ['Basic job search', '5 applications/month'],
                introductions_limit: 5
            },
            {
                tier: 'professional',
                price: 147,
                features: ['Premium matching', '20 applications/month'],
                introductions_limit: 20
            },
            {
                tier: 'executive',
                price: 297,
                features: ['Priority support', 'Unlimited applications'],
                introductions_limit: -1
            },
            {
                tier: 'premium',
                price: 497,
                features: ['Personal consultant', 'Guaranteed interviews'],
                introductions_limit: -1
            }
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VizzarJobs Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`💼 Employers test: http://localhost:${PORT}/api/employers/test`);
    console.log(`💰 Subscription tiers: http://localhost:${PORT}/api/subscription/tiers`);
    console.log(`🔐 Auth test: POST http://localhost:${PORT}/api/auth/test`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
