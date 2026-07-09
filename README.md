# NOVASPHERE 2026

NOVASPHERE 2026 is the official platform for our premier inter-college innovation summit, featuring dynamic events including an Ideathon, tech debates, debugging competitions, and hands-on technical workshops.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS (with a custom dark, modern aesthetic)
- **Authentication**: NextAuth.js (Credentials provider) with JWT sessions
- **Database**: MongoDB Atlas + Mongoose
- **Email**: Nodemailer for OTP and email verification
- **Payments**: Manual UPI verification workflow with an integrated Admin Dashboard

## ✨ Core Features

- **Robust Authentication**: Secure registration with email OTP verification and credential login.
- **Dynamic Event Spotlights**: Browse and register for competitive events and technical workshops.
- **Integrated Payment Verification**: Users upload UPI transaction IDs, which are securely verified by admins via a dedicated dashboard.
- **Admin Dashboard**: Comprehensive control panel to manage registrations, export data to spreadsheets, and verify payments.
- **Sleek UI/UX**: Premium dark mode design with glassmorphism and micro-animations.

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the necessary variables:
- `MONGODB_URI` – MongoDB Atlas connection string
- `NEXTAUTH_SECRET` – Secure random string for JWT sessions
- `ADMIN_PASSWORD` – Secure password for the admin dashboard
- `NEXT_PUBLIC_APP_URL` – Base URL (e.g., `http://localhost:3000`)
- `EMAIL_*` – SMTP settings for Nodemailer

### 3. Run the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the application.

## 📄 License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more details.
