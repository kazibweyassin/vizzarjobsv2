// VizzarJobs Backend API - Quick Start with Express.js
// This is a foundation to get you started immediately

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Database connection (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// User Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, passwordHash, firstName, lastName]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
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
        lastName: user.rows[0].last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, first_name, last_name, phone, current_position, years_experience, subscription_tier FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, currentPosition, yearsExperience } = req.body;

    const updatedUser = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, current_position = $4, years_experience = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [firstName, lastName, phone, currentPosition, yearsExperience, req.user.userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscription Management
app.post('/api/billing/create-subscription', authenticateToken, async (req, res) => {
  try {
    const { tier, paymentMethodId } = req.body;

    // Define pricing based on tier
    const prices = {
      starter: 'price_starter_id', // Replace with actual Stripe price IDs
      professional: 'price_professional_id',
      executive: 'price_executive_id',
      premium: 'price_premium_id'
    };

    // Create or retrieve Stripe customer
    let customer;
    const existingCustomer = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (existingCustomer.rows[0]?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingCustomer.rows[0].stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId }
      });

      // Update user with Stripe customer ID
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, req.user.userId]
      );
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: prices[tier] }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Save subscription to database
    await pool.query(
      'INSERT INTO subscriptions (user_id, stripe_subscription_id, tier, status, introductions_limit) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, subscription.id, tier, subscription.status, getTierLimit(tier)]
    );

    res.json({
      subscription,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to get tier limits
function getTierLimit(tier) {
  const limits = {
    starter: 5,
    professional: 20,
    executive: 50,
    premium: 100
  };
  return limits[tier] || 5;
}

// Employer Matching
app.get('/api/matches/available', authenticateToken, async (req, res) => {
  try {
    // Get user's subscription info
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [req.user.userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    const sub = subscription.rows[0];
    const remainingIntroductions = sub.introductions_limit - sub.introductions_used;

    if (remainingIntroductions <= 0) {
      return res.status(403).json({ error: 'Introduction limit reached' });
    }

    // Get available employers (simplified matching)
    const employers = await pool.query(
      'SELECT * FROM employers WHERE verification_status = $1 LIMIT $2',
      ['verified', remainingIntroductions]
    );

    res.json({
      availableMatches: employers.rows,
      remainingIntroductions,
      subscriptionTier: sub.tier
    });
  } catch (error) {
    console.error('Matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/matches/request-introduction', authenticateToken, async (req, res) => {
  try {
    const { employerId } = req.body;

    // Check if user has introductions left
    const subscription = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [req.user.userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    const sub = subscription.rows[0];
    if (sub.introductions_used >= sub.introductions_limit) {
      return res.status(403).json({ error: 'Introduction limit reached' });
    }

    // Create job match record
    const match = await pool.query(
      'INSERT INTO job_matches (user_id, employer_id, status, introduction_date) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [req.user.userId, employerId, 'pending']
    );

    // Update introductions used
    await pool.query(
      'UPDATE subscriptions SET introductions_used = introductions_used + 1 WHERE id = $1',
      [sub.id]
    );

    // Here you would send email to employer
    // await sendIntroductionEmail(req.user.userId, employerId);

    res.json({
      message: 'Introduction requested successfully',
      match: match.rows[0]
    });
  } catch (error) {
    console.error('Introduction request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stripe webhook handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      // Update subscription status in database
      pool.query(
        'UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2',
        [subscription.status, subscription.id]
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`VizzarJobs API running on port ${port}`);
});

module.exports = app;
