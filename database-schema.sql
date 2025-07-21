-- VizzarJobs Database Schema
-- Run this to create the complete database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    current_position VARCHAR(200),
    years_experience INTEGER,
    target_countries TEXT[],
    skills TEXT[],
    salary_expectation VARCHAR(100),
    preferred_locations TEXT[],
    professional_summary TEXT,
    resume_url VARCHAR(500),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    role VARCHAR(20) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Employers table
CREATE TABLE employers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    headquarters_location VARCHAR(100),
    visa_sponsorship_confirmed BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'pending',
    contact_email VARCHAR(255),
    hiring_manager_name VARCHAR(200),
    active_positions INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    h1b_petitions_annual INTEGER DEFAULT 0,
    approval_rate DECIMAL(5,2) DEFAULT 0.00,
    average_salary INTEGER,
    company_size VARCHAR(50),
    website_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    tier VARCHAR(50) NOT NULL, -- starter, professional, executive, premium
    status VARCHAR(50) NOT NULL, -- active, canceled, past_due, incomplete
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    introductions_used INTEGER DEFAULT 0,
    introductions_limit INTEGER NOT NULL,
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Job matches table
CREATE TABLE job_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    position_title VARCHAR(200),
    salary_range VARCHAR(100),
    location VARCHAR(100),
    match_score DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, introduced, viewed, interviewed, hired, rejected
    introduction_date TIMESTAMP,
    custom_message TEXT,
    employer_response TEXT,
    interview_date TIMESTAMP,
    outcome VARCHAR(50),
    last_update TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_type VARCHAR(100) NOT NULL, -- welcome, nurture, upgrade, reengagement
    email_sequence_step INTEGER DEFAULT 1,
    subject VARCHAR(255),
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, failed
    created_at TIMESTAMP DEFAULT NOW()
);

-- User sessions table (for security tracking)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employer verification requests table
CREATE TABLE employer_verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    requested_by_email VARCHAR(255),
    verification_documents TEXT[],
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    reviewer_notes TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User activity log
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employer job postings
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    requirements TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(100),
    remote_allowed BOOLEAN DEFAULT false,
    visa_sponsorship_available BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, closed, filled
    posted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Employer reviews/ratings
CREATE TABLE employer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    interview_experience TEXT,
    visa_process_rating INTEGER CHECK (visa_process_rating >= 1 AND visa_process_rating <= 5),
    would_recommend BOOLEAN,
    anonymous BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP DEFAULT NOW()
);

-- Success stories
CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    position_title VARCHAR(200),
    salary_amount INTEGER,
    story_text TEXT,
    timeline_days INTEGER,
    visa_type VARCHAR(50),
    featured BOOLEAN DEFAULT false,
    anonymous BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, featured
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_employers_verification_status ON employers(verification_status);
CREATE INDEX idx_employers_visa_sponsorship ON employers(visa_sponsorship_confirmed);
CREATE INDEX idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX idx_job_matches_employer_id ON job_matches(employer_id);
CREATE INDEX idx_job_matches_status ON job_matches(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_job_postings_employer_id ON job_postings(employer_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employers_updated_at BEFORE UPDATE ON employers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_matches_updated_at BEFORE UPDATE ON job_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
