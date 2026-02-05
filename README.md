# NextJS-Practice

A modern, full-stack authentication system built with Next.js 16, featuring user registration, email verification, password management, and user profiles with a beautiful dark mode UI.

## 🌟 Features

### Authentication
- ✅ User Registration with email verification
- ✅ Secure Login/Logout functionality
- ✅ Password reset via email
- ✅ Email verification with time-limited tokens (2 minutes)
- ✅ HTTP-only cookie-based session management
- ✅ Protected routes with middleware

### User Management
- ✅ User profile page with account details
- ✅ Password change functionality
- ✅ Account verification status
- ✅ Member since date tracking


## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Date/Time:** Moment.js
- **Authentication:** JWT with HTTP-only cookies
- **Database:** MongoDB

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm
- MongoDB database

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
npm install

```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for sending verification/reset emails)
SMTP_HOST=<your_smtp_host>
SMTP_PORT=<port_for_smtp_on_host>
SMTP_USER=<user_id>
SMTP_PASSWORD=<user_password>
EMAIL_USER=<from_user>
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🔐 Authentication Flow

### Registration
1. User fills out registration form (username, email, password)
2. System creates account and sends verification email
3. Email contains time-limited token (2 minutes)
4. User clicks verification link
5. Account is activated

### Login
1. User enters credentials
2. System validates and creates session with HTTP-only cookie
3. User redirected to home page or profile

### Password Reset
1. User requests password reset via email
2. System sends reset link with time-limited token (2 minutes)
3. User clicks link and enters new password
4. Password updated and user can login

## 🛡️ Security Features

- ✅ HTTP-only cookies for session management
- ✅ JWT token-based authentication
- ✅ Password hashing (bcrypt assumed)
- ✅ Time-limited email verification (2 minutes)
- ✅ Time-limited password reset tokens (2 minutes)
- ✅ Protected routes via middleware
- ✅ CSRF protection via middleware

## 📧 Email Templates

Professional HTML email templates are included for:
- Email verification with countdown timer
- Password reset with security notices

## 🚦 Route Protection

Routes are protected using Next.js middleware:
- **Public routes:** `/`, `/login`, `/register`, `/pending-verification`. `/forgotpassword`, `resetpassword`
- **Protected routes:** `/profile`
- **Logic:**
  - Logged-in users cannot access login/register/pending-verification/forgotpassword/resetpassword
  - Non-authenticated users redirected to login when accessing protected routes

## 📱 Pages Overview

### Home (`/`)
- Conditional navigation (Login/Register vs Profile/Logout)
- Hero section with gradient text
- Feature cards
- Responsive design

### Login (`/login`)
- Username/password form
- Link to forgot password
- Link to register

### Register (`/register`)
- Username, email, password form
- Email verification flow

### Profile (`/profile`)
- User information display
- Password change functionality
- Logout button

### Forgot Password (`/forgotpassword`)
- Email input for password reset
- Countdown timer after email sent

### Reset Password (`/resetpassword`)
- New password form
- Token validation
- Countdown timer

### Pending Verification (`/pending-verification`)
- Email verification status
- Countdown timer
- Success/error states

## 🧪 API Routes

All API routes are located in `app/api/`:

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user
- `POST /api/users/verifymail` - Verify email
- `POST /api/users/forgotpassword` - Request password reset
- `POST /api/users/resetpassword` - Reset password
- `PUT /api/users/updatepassword` - Change password
- `GET /api/users/logout` - Logout user
- `GET /api/auth/status` - Check authentication status


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.



