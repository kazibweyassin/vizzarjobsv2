const { Pool } = require('pg');
require('dotenv').config();

// Sample data for seeding the database
const sampleEmployers = [
    {
        company_name: 'Amazon',
        industry: 'Technology',
        headquarters_location: 'Seattle, WA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'hiring@amazon.com',
        hiring_manager_name: 'Sarah Johnson',
        active_positions: 250,
        success_rate: 87.5,
        h1b_petitions_annual: 8500,
        approval_rate: 87.0,
        average_salary: 145000,
        company_size: '1000000+',
        website_url: 'https://amazon.jobs',
        description: 'Global technology company focused on e-commerce, cloud computing, and artificial intelligence.'
    },
    {
        company_name: 'Microsoft',
        industry: 'Technology',
        headquarters_location: 'Redmond, WA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@microsoft.com',
        hiring_manager_name: 'David Chen',
        active_positions: 180,
        success_rate: 92.3,
        h1b_petitions_annual: 6800,
        approval_rate: 92.0,
        average_salary: 158000,
        company_size: '200000+',
        website_url: 'https://careers.microsoft.com',
        description: 'Leading technology company developing software, services, devices and solutions.'
    },
    {
        company_name: 'Google',
        industry: 'Technology',
        headquarters_location: 'Mountain View, CA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'jobs@google.com',
        hiring_manager_name: 'Maria Rodriguez',
        active_positions: 200,
        success_rate: 94.1,
        h1b_petitions_annual: 5200,
        approval_rate: 94.0,
        average_salary: 165000,
        company_size: '150000+',
        website_url: 'https://careers.google.com',
        description: 'Multinational technology company specializing in Internet-related services and products.'
    },
    {
        company_name: 'Apple',
        industry: 'Technology',
        headquarters_location: 'Cupertino, CA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'jobs@apple.com',
        hiring_manager_name: 'James Wilson',
        active_positions: 150,
        success_rate: 89.7,
        h1b_petitions_annual: 4100,
        approval_rate: 91.0,
        average_salary: 168000,
        company_size: '150000+',
        website_url: 'https://jobs.apple.com',
        description: 'Technology company that designs, develops, and sells consumer electronics and software.'
    },
    {
        company_name: 'Meta',
        industry: 'Technology',
        headquarters_location: 'Menlo Park, CA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@meta.com',
        hiring_manager_name: 'Lisa Park',
        active_positions: 120,
        success_rate: 88.9,
        h1b_petitions_annual: 3900,
        approval_rate: 89.0,
        average_salary: 172000,
        company_size: '75000+',
        website_url: 'https://careers.meta.com',
        description: 'Social technology company building platforms for people to connect and share.'
    },
    {
        company_name: 'Tesla',
        industry: 'Automotive/Technology',
        headquarters_location: 'Austin, TX',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@tesla.com',
        hiring_manager_name: 'Robert Kim',
        active_positions: 100,
        success_rate: 83.2,
        h1b_petitions_annual: 2756,
        approval_rate: 83.0,
        average_salary: 155000,
        company_size: '100000+',
        website_url: 'https://tesla.com/careers',
        description: 'Electric vehicle and clean energy company accelerating sustainable transport.'
    },
    {
        company_name: 'Salesforce',
        industry: 'Technology',
        headquarters_location: 'San Francisco, CA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@salesforce.com',
        hiring_manager_name: 'Jennifer Lee',
        active_positions: 90,
        success_rate: 90.1,
        h1b_petitions_annual: 2634,
        approval_rate: 90.0,
        average_salary: 162000,
        company_size: '75000+',
        website_url: 'https://salesforce.com/careers',
        description: 'Cloud-based software company providing customer relationship management services.'
    },
    {
        company_name: 'IBM',
        industry: 'Technology',
        headquarters_location: 'Armonk, NY',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@ibm.com',
        hiring_manager_name: 'Michael Brown',
        active_positions: 110,
        success_rate: 85.4,
        h1b_petitions_annual: 4205,
        approval_rate: 85.0,
        average_salary: 128000,
        company_size: '350000+',
        website_url: 'https://ibm.com/careers',
        description: 'Global technology and consulting company providing hardware, software, and services.'
    },
    {
        company_name: 'Oracle',
        industry: 'Technology',
        headquarters_location: 'Austin, TX',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@oracle.com',
        hiring_manager_name: 'Susan Taylor',
        active_positions: 85,
        success_rate: 86.3,
        h1b_petitions_annual: 2987,
        approval_rate: 86.0,
        average_salary: 142000,
        company_size: '140000+',
        website_url: 'https://oracle.com/careers',
        description: 'Computer technology corporation specializing in database software and cloud computing.'
    },
    {
        company_name: 'Intel',
        industry: 'Technology',
        headquarters_location: 'Santa Clara, CA',
        visa_sponsorship_confirmed: true,
        verification_status: 'verified',
        contact_email: 'careers@intel.com',
        hiring_manager_name: 'Kevin Zhang',
        active_positions: 75,
        success_rate: 88.1,
        h1b_petitions_annual: 3142,
        approval_rate: 88.0,
        average_salary: 135000,
        company_size: '120000+',
        website_url: 'https://intel.com/careers',
        description: 'Semiconductor company designing and manufacturing microprocessors and related technologies.'
    }
];

const sampleJobPostings = [
    {
        title: 'Senior Software Engineer',
        description: 'Design and develop scalable web applications using modern technologies.',
        requirements: ['5+ years experience', 'JavaScript/React', 'Node.js', 'AWS'],
        salary_min: 130000,
        salary_max: 180000,
        location: 'Seattle, WA',
        remote_allowed: true
    },
    {
        title: 'Data Scientist',
        description: 'Analyze large datasets to drive business insights and machine learning models.',
        requirements: ['PhD in related field', 'Python/R', 'Machine Learning', 'SQL'],
        salary_min: 140000,
        salary_max: 200000,
        location: 'San Francisco, CA',
        remote_allowed: false
    },
    {
        title: 'Product Manager',
        description: 'Lead product development and strategy for consumer-facing applications.',
        requirements: ['3+ years PM experience', 'Technical background', 'Agile/Scrum'],
        salary_min: 120000,
        salary_max: 170000,
        location: 'Mountain View, CA',
        remote_allowed: true
    },
    {
        title: 'DevOps Engineer',
        description: 'Build and maintain CI/CD pipelines and cloud infrastructure.',
        requirements: ['Docker/Kubernetes', 'AWS/Azure', 'Infrastructure as Code'],
        salary_min: 110000,
        salary_max: 160000,
        location: 'Austin, TX',
        remote_allowed: true
    },
    {
        title: 'Machine Learning Engineer',
        description: 'Develop and deploy ML models at scale for production systems.',
        requirements: ['TensorFlow/PyTorch', 'Python', 'Distributed Systems'],
        salary_min: 150000,
        salary_max: 220000,
        location: 'Menlo Park, CA',
        remote_allowed: false
    }
];

async function seedDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await pool.query('TRUNCATE job_postings, employer_reviews, job_matches, subscriptions, employers, users RESTART IDENTITY CASCADE');

        // Insert sample employers
        console.log('🏢 Inserting sample employers...');
        for (const employer of sampleEmployers) {
            await pool.query(
                `INSERT INTO employers (
                    company_name, industry, headquarters_location, visa_sponsorship_confirmed,
                    verification_status, contact_email, hiring_manager_name, active_positions,
                    success_rate, h1b_petitions_annual, approval_rate, average_salary,
                    company_size, website_url, description
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                [
                    employer.company_name, employer.industry, employer.headquarters_location,
                    employer.visa_sponsorship_confirmed, employer.verification_status,
                    employer.contact_email, employer.hiring_manager_name, employer.active_positions,
                    employer.success_rate, employer.h1b_petitions_annual, employer.approval_rate,
                    employer.average_salary, employer.company_size, employer.website_url,
                    employer.description
                ]
            );
        }

        // Get employer IDs for job postings
        const employers = await pool.query('SELECT id, company_name FROM employers ORDER BY company_name');
        
        // Insert sample job postings
        console.log('💼 Inserting sample job postings...');
        for (let i = 0; i < sampleJobPostings.length; i++) {
            const posting = sampleJobPostings[i];
            const employer = employers.rows[i % employers.rows.length];
            
            await pool.query(
                `INSERT INTO job_postings (
                    employer_id, title, description, requirements, salary_min, salary_max,
                    location, remote_allowed, visa_sponsorship_available, expires_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    employer.id, posting.title, posting.description, posting.requirements,
                    posting.salary_min, posting.salary_max, posting.location,
                    posting.remote_allowed, true, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                ]
            );
        }

        // Create sample admin user
        console.log('👤 Creating sample admin user...');
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash('admin123', 12);
        
        await pool.query(
            `INSERT INTO users (
                email, password_hash, first_name, last_name, role, email_verified,
                subscription_tier, subscription_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                'admin@vizzarjobs.com', adminPassword, 'Admin', 'User', 'admin',
                true, 'premium', 'active'
            ]
        );

        // Create sample regular users
        console.log('👥 Creating sample users...');
        const sampleUsers = [
            {
                email: 'priya.sharma@email.com',
                firstName: 'Priya',
                lastName: 'Sharma',
                currentPosition: 'Software Engineer',
                yearsExperience: 3,
                skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
                targetCountries: ['United States']
            },
            {
                email: 'david.chen@email.com',
                firstName: 'David',
                lastName: 'Chen',
                currentPosition: 'Data Scientist',
                yearsExperience: 5,
                skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
                targetCountries: ['United States', 'Canada']
            },
            {
                email: 'maria.gonzalez@email.com',
                firstName: 'Maria',
                lastName: 'Gonzalez',
                currentPosition: 'Product Manager',
                yearsExperience: 4,
                skills: ['Product Strategy', 'Agile', 'Data Analysis'],
                targetCountries: ['United States']
            }
        ];

        for (const user of sampleUsers) {
            const userPassword = await bcrypt.hash('password123', 12);
            await pool.query(
                `INSERT INTO users (
                    email, password_hash, first_name, last_name, current_position,
                    years_experience, skills, target_countries, subscription_tier,
                    subscription_status, email_verified
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    user.email, userPassword, user.firstName, user.lastName,
                    user.currentPosition, user.yearsExperience, user.skills,
                    user.targetCountries, 'professional', 'active', true
                ]
            );
        }

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📊 Seeded data summary:');
        console.log(`• ${sampleEmployers.length} employers`);
        console.log(`• ${sampleJobPostings.length} job postings`);
        console.log(`• ${sampleUsers.length + 1} users (including admin)`);
        console.log('\n🔑 Admin login credentials:');
        console.log('Email: admin@vizzarjobs.com');
        console.log('Password: admin123');
        console.log('\n🔑 Sample user login credentials:');
        console.log('Email: priya.sharma@email.com');
        console.log('Password: password123');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await pool.end();
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
