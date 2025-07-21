const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (early in the middleware stack)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        server: 'VizzarJobs Backend API'
    });
});

// Test endpoint without database
app.get('/api/test', (req, res) => {
    res.json({
        message: 'VizzarJobs API is working!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/health',
            'GET /api/test',
            'GET /api/subscription/tiers',
            'POST /api/auth/register',
            'POST /api/auth/login'
        ]
    });
});

// Subscription tiers endpoint (mock data)
app.get('/api/subscription/tiers', (req, res) => {
    res.json({
        status: 'success',
        data: [
            {
                tier: 'starter',
                price: 49,
                currency: 'USD',
                interval: 'month',
                features: [
                    'Basic job search',
                    '5 employer introductions/month',
                    'Resume optimization tips',
                    'Email support'
                ],
                introductions_limit: 5,
                popular: false
            },
            {
                tier: 'professional',
                price: 147,
                currency: 'USD', 
                interval: 'month',
                features: [
                    'Premium matching algorithm',
                    '20 employer introductions/month',
                    'Priority application review',
                    'Interview preparation guide',
                    'Live chat support'
                ],
                introductions_limit: 20,
                popular: true
            },
            {
                tier: 'executive',
                price: 297,
                currency: 'USD',
                interval: 'month',
                features: [
                    'Executive-level positions',
                    '50 employer introductions/month',
                    'Dedicated career consultant',
                    'Salary negotiation support',
                    'Phone support'
                ],
                introductions_limit: 50,
                popular: false
            },
            {
                tier: 'premium',
                price: 497,
                currency: 'USD',
                interval: 'month',
                features: [
                    'C-suite and leadership roles',
                    'Unlimited introductions',
                    'Personal visa consultant',
                    'Guaranteed interview opportunities',
                    '24/7 priority support'
                ],
                introductions_limit: -1,
                popular: false
            }
        ]
    });
});

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed'), false);
        }
    }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// =============================================
// AUTHENTICATION ENDPOINTS
// =============================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { 
            email, password, firstName, lastName, phone,
            position, experience, targetCountry, salaryRange, summary
        } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Convert experience string to number
        let experienceYears = null;
        if (experience) {
            if (experience === '3-5') experienceYears = 4;
            else if (experience === '5-8') experienceYears = 6;
            else if (experience === '8-12') experienceYears = 10;
            else if (experience === '12+') experienceYears = 15;
        }

        // Prepare target countries array
        const targetCountries = targetCountry ? [targetCountry] : [];

        // Create user with all application data
        const newUser = await pool.query(
            `INSERT INTO users (
                email, password_hash, first_name, last_name, phone,
                current_position, years_experience, target_countries, 
                salary_expectation, professional_summary, subscription_tier, subscription_status
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'trial', 'active') 
             RETURNING id, email, first_name, last_name`,
            [
                email, passwordHash, firstName, lastName, phone,
                position, experienceYears, targetCountries,
                salaryRange, summary
            ]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send welcome email
        await sendWelcomeEmail(email, firstName);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const user = await pool.query(
            'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.rows[0].id, 
                email: user.rows[0].email,
                role: user.rows[0].role || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                firstName: user.rows[0].first_name,
                lastName: user.rows[0].last_name,
                role: user.rows[0].role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await pool.query('SELECT id, first_name FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user.rows[0].id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send reset email
        await sendPasswordResetEmail(email, user.rows[0].first_name, resetToken);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({ error: 'Invalid reset token' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [passwordHash, decoded.userId]
        );

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Invalid or expired reset token' });
    }
});

// =============================================
// USER MANAGEMENT ENDPOINTS
// =============================================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query(
            `SELECT id, email, first_name, last_name, phone, current_position, years_experience,
                    target_countries, skills, subscription_tier, subscription_status, created_at
             FROM users WHERE id = $1`,
            [req.user.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            currentPosition,
            yearsExperience,
            targetCountries,
            skills,
            salaryExpectation,
            preferredLocations
        } = req.body;

        const updatedUser = await pool.query(
            `UPDATE users SET 
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                phone = COALESCE($3, phone),
                current_position = COALESCE($4, current_position),
                years_experience = COALESCE($5, years_experience),
                target_countries = COALESCE($6, target_countries),
                skills = COALESCE($7, skills),
                salary_expectation = COALESCE($8, salary_expectation),
                preferred_locations = COALESCE($9, preferred_locations),
                updated_at = NOW()
             WHERE id = $10
             RETURNING id, email, first_name, last_name, phone, current_position, years_experience`,
            [firstName, lastName, phone, currentPosition, yearsExperience, 
             targetCountries, skills, salaryExpectation, preferredLocations, req.user.userId]
        );

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser.rows[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Upload resume
app.post('/api/user/upload-resume', authenticateToken, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Save file path to database
        await pool.query(
            'UPDATE users SET resume_url = $1, updated_at = NOW() WHERE id = $2',
            [req.file.path, req.user.userId]
        );

        res.json({
            message: 'Resume uploaded successfully',
            fileName: req.file.filename,
            filePath: req.file.path
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =============================================
// SUBSCRIPTION & BILLING ENDPOINTS
// =============================================

// Create subscription
app.post('/api/billing/create-subscription', authenticateToken, async (req, res) => {
    try {
        const { priceId, paymentMethodId } = req.body;

        // Get user info
        const user = await pool.query(
            'SELECT email, first_name, last_name FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create Stripe customer
        const customer = await stripe.customers.create({
            email: user.rows[0].email,
            name: `${user.rows[0].first_name} ${user.rows[0].last_name}`,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        });

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent']
        });

        // Save subscription to database
        const tier = getTierFromPriceId(priceId);
        await pool.query(
            `INSERT INTO subscriptions (user_id, stripe_subscription_id, tier, status, current_period_start, current_period_end, introductions_limit)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                req.user.userId,
                subscription.id,
                tier,
                subscription.status,
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000),
                getIntroductionLimit(tier)
            ]
        );

        // Update user subscription
        await pool.query(
            'UPDATE users SET subscription_tier = $1, subscription_status = $2 WHERE id = $3',
            [tier, subscription.status, req.user.userId]
        );

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            status: subscription.status
        });
    } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get subscription info
app.get('/api/user/subscription', authenticateToken, async (req, res) => {
    try {
        const subscription = await pool.query(
            `SELECT s.*, u.subscription_tier, u.subscription_status
             FROM subscriptions s
             JOIN users u ON s.user_id = u.id
             WHERE s.user_id = $1 AND s.status = 'active'
             ORDER BY s.created_at DESC LIMIT 1`,
            [req.user.userId]
        );

        if (subscription.rows.length === 0) {
            return res.json({ tier: 'free', status: 'inactive' });
        }

        res.json(subscription.rows[0]);
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cancel subscription
app.post('/api/billing/cancel-subscription', authenticateToken, async (req, res) => {
    try {
        // Get user's active subscription
        const subscription = await pool.query(
            'SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1 AND status = $2',
            [req.user.userId, 'active']
        );

        if (subscription.rows.length === 0) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        // Cancel in Stripe
        await stripe.subscriptions.del(subscription.rows[0].stripe_subscription_id);

        // Update database
        await pool.query(
            'UPDATE subscriptions SET status = $1 WHERE user_id = $2 AND status = $3',
            ['canceled', req.user.userId, 'active']
        );

        await pool.query(
            'UPDATE users SET subscription_status = $1 WHERE id = $2',
            ['canceled', req.user.userId]
        );

        res.json({ message: 'Subscription canceled successfully' });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =============================================
// EMPLOYER MATCHING ENDPOINTS
// =============================================

// Get available matches
app.get('/api/matches/available', authenticateToken, async (req, res) => {
    try {
        // Get user profile for matching
        const userProfile = await pool.query(
            'SELECT skills, target_countries, salary_expectation, years_experience FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Simple matching algorithm - find employers with matching criteria
        const matches = await pool.query(
            `SELECT e.*, 
                    CASE 
                        WHEN e.industry = ANY($1) THEN 95
                        WHEN e.headquarters_location = ANY($2) THEN 90
                        ELSE 75
                    END as match_score
             FROM employers e
             WHERE e.visa_sponsorship_confirmed = true 
               AND e.verification_status = 'verified'
               AND e.active_positions > 0
             ORDER BY match_score DESC, e.success_rate DESC
             LIMIT 20`,
            [userProfile.rows[0].skills || [], userProfile.rows[0].target_countries || []]
        );

        res.json(matches.rows);
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Request introduction
app.post('/api/matches/request-introduction', authenticateToken, async (req, res) => {
    try {
        const { employerId, positionTitle, customMessage } = req.body;

        // Check subscription limits
        const subscription = await pool.query(
            'SELECT introductions_used, introductions_limit FROM subscriptions WHERE user_id = $1 AND status = $2',
            [req.user.userId, 'active']
        );

        if (subscription.rows.length === 0) {
            return res.status(403).json({ error: 'Active subscription required' });
        }

        if (subscription.rows[0].introductions_used >= subscription.rows[0].introductions_limit) {
            return res.status(403).json({ error: 'Introduction limit reached for current plan' });
        }

        // Get employer info
        const employer = await pool.query(
            'SELECT company_name, contact_email, hiring_manager_name FROM employers WHERE id = $1',
            [employerId]
        );

        if (employer.rows.length === 0) {
            return res.status(404).json({ error: 'Employer not found' });
        }

        // Get user info
        const user = await pool.query(
            'SELECT first_name, last_name, email, current_position, resume_url FROM users WHERE id = $1',
            [req.user.userId]
        );

        // Create match record
        const match = await pool.query(
            `INSERT INTO job_matches (user_id, employer_id, position_title, status, introduction_date)
             VALUES ($1, $2, $3, 'pending', NOW())
             RETURNING id`,
            [req.user.userId, employerId, positionTitle]
        );

        // Update introduction count
        await pool.query(
            'UPDATE subscriptions SET introductions_used = introductions_used + 1 WHERE user_id = $1 AND status = $2',
            [req.user.userId, 'active']
        );

        // Send introduction email to employer
        await sendIntroductionEmail(
            employer.rows[0],
            user.rows[0],
            positionTitle,
            customMessage
        );

        res.json({
            message: 'Introduction request sent successfully',
            matchId: match.rows[0].id
        });
    } catch (error) {
        console.error('Request introduction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get match history
app.get('/api/matches/history', authenticateToken, async (req, res) => {
    try {
        const matches = await pool.query(
            `SELECT jm.*, e.company_name, e.industry, e.headquarters_location
             FROM job_matches jm
             JOIN employers e ON jm.employer_id = e.id
             WHERE jm.user_id = $1
             ORDER BY jm.introduction_date DESC`,
            [req.user.userId]
        );

        res.json(matches.rows);
    } catch (error) {
        console.error('Get match history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =============================================
// ADMIN ENDPOINTS
// =============================================

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const users = await pool.query(
            `SELECT id, email, first_name, last_name, subscription_tier, subscription_status, created_at
             FROM users
             WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        const totalCount = await pool.query(
            'SELECT COUNT(*) FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1',
            [`%${search}%`]
        );

        res.json({
            users: users.rows,
            total: parseInt(totalCount.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get analytics (admin only)
app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const stats = await Promise.all([
            pool.query('SELECT COUNT(*) as total_users FROM users'),
            pool.query('SELECT COUNT(*) as active_subscriptions FROM subscriptions WHERE status = $1', ['active']),
            pool.query('SELECT COUNT(*) as total_employers FROM employers'),
            pool.query('SELECT COUNT(*) as total_matches FROM job_matches'),
            pool.query('SELECT COUNT(*) as successful_matches FROM job_matches WHERE status = $1', ['hired']),
            pool.query(`
                SELECT subscription_tier, COUNT(*) as count 
                FROM users 
                WHERE subscription_tier IS NOT NULL 
                GROUP BY subscription_tier
            `),
            pool.query(`
                SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as new_users
                FROM users 
                WHERE created_at >= NOW() - INTERVAL '12 months'
                GROUP BY month 
                ORDER BY month
            `)
        ]);

        res.json({
            totalUsers: parseInt(stats[0].rows[0].total_users),
            activeSubscriptions: parseInt(stats[1].rows[0].active_subscriptions),
            totalEmployers: parseInt(stats[2].rows[0].total_employers),
            totalMatches: parseInt(stats[3].rows[0].total_matches),
            successfulMatches: parseInt(stats[4].rows[0].successful_matches),
            subscriptionBreakdown: stats[5].rows,
            userGrowth: stats[6].rows
        });
    } catch (error) {
        console.error('Admin analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

function getTierFromPriceId(priceId) {
    const tierMap = {
        'price_starter': 'starter',
        'price_professional': 'professional',
        'price_executive': 'executive',
        'price_premium': 'premium'
    };
    return tierMap[priceId] || 'starter';
}

function getIntroductionLimit(tier) {
    const limits = {
        'starter': 5,
        'professional': 20,
        'executive': 50,
        'premium': 999
    };
    return limits[tier] || 5;
}

async function sendWelcomeEmail(email, firstName) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to VizzarJobs! Your visa sponsorship journey starts now 🚀',
        html: `
            <h2>Welcome to VizzarJobs, ${firstName}!</h2>
            <p>You've just taken the most important step toward landing your dream job with visa sponsorship.</p>
            <p><strong>Your quick win for today:</strong></p>
            <ul>
                <li>Complete your profile optimization</li>
                <li>Upload your professional resume</li>
                <li>Set your salary expectations</li>
                <li>Choose your preferred locations</li>
            </ul>
            <p>Ready to start? <a href="${process.env.CLIENT_URL}/dashboard">Access your dashboard</a></p>
            <p>To your success,<br>The VizzarJobs Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Welcome email error:', error);
    }
}

async function sendPasswordResetEmail(email, firstName, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your VizzarJobs Password',
        html: `
            <h2>Password Reset Request</h2>
            <p>Hi ${firstName},</p>
            <p>You requested a password reset for your VizzarJobs account.</p>
            <p><a href="${resetUrl}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

async function sendIntroductionEmail(employer, user, positionTitle, customMessage) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employer.contact_email,
        subject: `Qualified candidate for ${positionTitle} - Visa sponsorship candidate`,
        html: `
            <h2>New Qualified Candidate Introduction</h2>
            <p>Dear ${employer.hiring_manager_name || 'Hiring Manager'},</p>
            
            <p>I'd like to introduce you to <strong>${user.first_name} ${user.last_name}</strong>, 
            a qualified candidate for your ${positionTitle} position.</p>
            
            <h3>Candidate Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${user.first_name} ${user.last_name}</li>
                <li><strong>Current Position:</strong> ${user.current_position}</li>
                <li><strong>Email:</strong> ${user.email}</li>
            </ul>
            
            ${customMessage ? `<h3>Personal Message:</h3><p>${customMessage}</p>` : ''}
            
            <p>This candidate is specifically seeking visa sponsorship opportunities and 
            has been pre-screened for international hiring readiness.</p>
            
            <p>Best regards,<br>VizzarJobs Matching Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

// =============================================
// ERROR HANDLING & SERVER STARTUP
// =============================================

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VizzarJobs API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
