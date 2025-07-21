# VizzarJobs Form Data Storage

## 📋 Overview
When users submit the elite application form on VizzarJobs, their data is securely saved to a PostgreSQL database with proper encryption and validation.

## 🔄 Data Flow

### 1. Frontend Form Submission
**Location:** `index.html` (lines 942-980)
- Form ID: `elite-application-form`
- Captures all user input fields
- Sends data to backend API via `api-connection.js`

### 2. API Connection Layer
**Location:** `api-connection.js`
- Class: `VizzarAPI`
- Method: `register(userData)`
- Endpoint: `POST /api/auth/register`
- Base URL: `http://localhost:3001/api`

### 3. Backend Processing
**Location:** `server.js` (lines 198-260)
- Validates required fields
- Checks for duplicate emails
- Hashes password with bcrypt (12 salt rounds)
- Processes experience level mapping
- Saves to PostgreSQL database

### 4. Database Storage
**Location:** PostgreSQL database
- Table: `users`
- Schema: `database-schema.sql`

## 🗃️ Database Schema

### Users Table Structure
```sql
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
    salary_expectation VARCHAR(100),
    professional_summary TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    role VARCHAR(20) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📝 Form Fields Mapping

| Form Field | Database Column | Data Type | Processing |
|------------|----------------|-----------|------------|
| firstName | first_name | VARCHAR(100) | Direct mapping |
| lastName | last_name | VARCHAR(100) | Direct mapping |
| email | email | VARCHAR(255) | Unique constraint |
| phone | phone | VARCHAR(20) | Direct mapping |
| position | current_position | VARCHAR(200) | Direct mapping |
| experience | years_experience | INTEGER | Converted to number |
| targetCountry | target_countries | TEXT[] | Array format |
| salaryRange | salary_expectation | VARCHAR(100) | Direct mapping |
| summary | professional_summary | TEXT | Direct mapping |
| password | password_hash | VARCHAR(255) | Bcrypt hashed |

## 🔐 Security Features

### Password Security
- Bcrypt hashing with 12 salt rounds
- Temporary passwords generated for form submissions
- JWT tokens for authentication

### Data Validation
- Required field validation
- Email uniqueness check
- Input sanitization
- SQL injection prevention (parameterized queries)

### Privacy Protection
- Passwords never stored in plain text
- JWT tokens for secure authentication
- Environment variables for sensitive config

## 📊 Experience Level Mapping

Form submissions convert experience ranges to numeric values:
- "3-5 years" → 4
- "5-8 years" → 6
- "8-12 years" → 10
- "12+ years" → 15

## 🚀 Registration Flow

1. **Form Submission** → JavaScript captures form data
2. **API Call** → `VizzarAPI.register()` sends to backend
3. **Validation** → Server validates required fields
4. **Duplicate Check** → Checks if email already exists
5. **Password Hash** → Bcrypt encryption
6. **Database Insert** → PostgreSQL saves user record
7. **JWT Generation** → Creates authentication token
8. **Response** → Success/error sent to frontend
9. **UI Update** → Success message displayed

## 🗄️ Database Connection

### Environment Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key
PORT=3001
```

### PostgreSQL Pool Connection
- Connection pooling for performance
- Automatic reconnection handling
- Error logging and monitoring

## 📍 File Locations

- **Frontend Form:** `index.html` (line 747)
- **Form Handler:** `index.html` (lines 942-980)
- **API Connection:** `api-connection.js`
- **Backend API:** `server.js` (lines 198-260)
- **Database Schema:** `database-schema.sql`
- **Test Interface:** `test-connection.html`

## ✅ Current Status

✅ **Working Components:**
- Form captures all required data
- Frontend validation active
- Backend API endpoint functional
- Database schema complete
- Password encryption working
- JWT token generation active

⚠️ **Setup Required:**
- PostgreSQL database deployment
- Environment variables configuration
- Database schema deployment

## 🧪 Testing

### Test the complete flow:
1. Open `test-connection.html` in browser
2. Use "Test Registration" button
3. Check backend logs for database operations
4. Verify data appears in PostgreSQL

### Manual Testing:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "temp123",
    "phone": "+1234567890",
    "position": "Software Engineer",
    "experience": "5-8",
    "targetCountry": "United States",
    "salaryRange": "100k-150k",
    "summary": "Experienced developer seeking visa sponsorship"
  }'
```

## 📧 Next Steps for Production

1. **Database Deployment:**
   - Deploy PostgreSQL to cloud provider
   - Run `database-schema.sql` to create tables
   - Update `DATABASE_URL` environment variable

2. **Security Hardening:**
   - Add rate limiting
   - Implement email verification
   - Add CAPTCHA protection

3. **Data Management:**
   - Add user dashboard for data viewing/editing
   - Implement data export functionality
   - Add admin panel for user management

4. **Analytics:**
   - Track form completion rates
   - Monitor registration success/failure
   - Add user engagement metrics
