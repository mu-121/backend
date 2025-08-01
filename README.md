# Backend App with Email Verification

A Node.js backend application with user authentication, email verification using OTP, and password reset functionality.

## Features

- User registration and login
- Email verification with OTP
- Password reset with OTP
- JWT token authentication
- Secure password hashing with bcrypt
- Email notifications using Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account for sending emails

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=1d
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

## Gmail Setup for Email Sending

To use Gmail for sending emails, you need to:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `EMAIL_PASSWORD` environment variable

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/signin` - Login user

### Email Verification
- `POST /api/users/verify-email` - Verify email with OTP
- `POST /api/users/resend-verification-otp` - Resend verification OTP

### Password Reset
- `POST /api/users/forgot-password` - Request password reset OTP
- `POST /api/users/reset-password` - Reset password with OTP

## API Usage Examples

### 1. User Registration
```bash
POST /api/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification OTP.",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Email Verification
```bash
POST /api/users/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

### 3. User Login
```bash
POST /api/users/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

### 4. Forgot Password
```bash
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset OTP sent successfully"
}
```

### 5. Reset Password
```bash
POST /api/users/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## Error Responses

### Email Not Verified
```json
{
  "message": "Please verify your email first",
  "emailNotVerified": true
}
```

### Invalid OTP
```json
{
  "message": "Invalid OTP"
}
```

### Expired OTP
```json
{
  "message": "OTP has expired"
}
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- OTP expiration (10 minutes)
- Email verification required for login
- Secure email sending with Gmail SMTP

## File Structure

```
├── Controllers/
│   └── authController.js      # Authentication logic
├── models/
│   └── signUpModal.js         # User model
├── routes/
│   └── users.js              # User routes
├── utils/
│   └── emailService.js       # Email service
├── .env                      # Environment variables
├── index.js                  # Main server file
└── package.json
```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. The server will start on the configured port (default: 3000)

## Notes

- OTP expires after 10 minutes
- Users must verify their email before they can login
- Password reset OTP is sent to the registered email
- All sensitive data is properly hashed and secured 