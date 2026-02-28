## Inter-College Event Website

Production-ready full-stack web application built with:

- **Next.js 14 (App Router, TypeScript)**
- **Tailwind CSS** (dark, modern theme)
- **NextAuth.js (Credentials provider)** with **JWT sessions**
- **MongoDB Atlas + Mongoose**
- **Nodemailer** for email verification
- **Razorpay Node SDK** for payments

### Features

- **Authentication**
  - Registration with **name, email, password**
  - **Email verification** link via Nodemailer
  - Login with credentials
  - **JWT session** handling via NextAuth
  - Protected routes for dashboard and payment APIs

- **Event Management**
  - 5 pre-seeded events (XX1–XX5) with pricing
  - Events listing page with **Register** button

- **Payments (Razorpay)**
  - Backend **order creation** per event
  - Razorpay checkout popup on the frontend
  - Backend **signature verification**
  - Registrations stored in MongoDB with payment details

- **Dashboard**
  - User profile
  - Registered events
  - Payment history and status

---

### Project Structure (high level)

- `app/`
  - `layout.tsx` – root layout, navbar, providers
  - `page.tsx` – Home (video hero, countdown, CTA)
  - `login/page.tsx` – Login form
  - `register/page.tsx` – Registration with email verification
  - `events/page.tsx` – Events listing and registration
  - `dashboard/page.tsx` – Protected user dashboard
  - `api/auth/[...nextauth]/route.ts` – NextAuth handler
  - `api/auth/register/route.ts` – Registration endpoint
  - `api/auth/verify-email/route.ts` – Email verification endpoint
  - `api/events/route.ts` – Events listing API
  - `api/payment/create-order/route.ts` – Razorpay order creation
  - `api/payment/verify/route.ts` – Razorpay verification and registration
- `components/`
  - `navbar.tsx` – top navigation
  - `countdown.tsx` – client countdown timer
  - `events-client.tsx` – client events grid + Razorpay integration
- `lib/`
  - `db.ts` – Mongoose connection helper
  - `auth.ts` – NextAuth configuration
  - `email.ts` – Nodemailer transporter + verification email helper
- `models/`
  - `User.ts` – user schema
  - `Event.ts` – event schema
  - `Registration.ts` – registration schema
- `scripts/`
  - `seed.ts` – seed 5 sample events (XX1–XX5)
- `middleware.ts` – protects `/dashboard` and `/api/payment/*`

---

### Installation

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Fill in:

- `MONGODB_URI` – MongoDB Atlas connection string
- `NEXTAUTH_SECRET` – long random string
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` – usually `http://localhost:3000` in dev
- SMTP settings (`EMAIL_*`)
- Razorpay keys: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

---

### Seed Events

Run once after configuring `MONGODB_URI`:

```bash
npm run seed
```

This inserts the 5 events:

- XX1 – ₹100
- XX2 – ₹150
- XX3 – ₹200
- XX4 – ₹250
- XX5 – ₹300

---

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

### Authentication Flow

1. **Register**
   - User hits `/register`, posts to `/api/auth/register`.
   - Backend creates a user with `emailVerified: false` and a `verificationToken`.
   - Nodemailer sends a verification email with `/verify-email?token=...`.

2. **Verify Email**
   - Verification link calls `/api/auth/verify-email`.
   - On success, `emailVerified` is set to `true`, and user is redirected to `/login?verified=1`.

3. **Login**
   - `/login` uses NextAuth Credentials provider.
   - Only users with `emailVerified === true` can log in.
   - Session is JWT-based; dashboard and payment APIs are protected via middleware and server checks.

---

### Payment Flow (Razorpay)

1. User clicks **Register** on `/events`.
2. Frontend checks session:
   - If not logged in, user is redirected to `/login`.
3. Logged-in users call `/api/payment/create-order` with `eventId`.
   - Backend loads the event, computes `amount = price * 100`, and creates a Razorpay order.
4. Frontend opens Razorpay checkout with the returned order details.
5. On successful payment, Razorpay calls the `handler` on the frontend with
   `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`.
6. Frontend posts these details to `/api/payment/verify`.
7. Backend:
   - Verifies signature using `RAZORPAY_KEY_SECRET`.
   - Creates a `Registration` document.
   - Adds the event to `user.registeredEvents`.

Dashboard then surfaces registrations and payment history.

---

### Production / Vercel Deployment

- Push this project to a Git repository.
- On Vercel, import the project and set environment variables from `.env.example`.
- Ensure:
  - `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` are set to your production URL.
  - Razorpay and SMTP credentials are configured for production.
- Deploy; no additional configuration is required for App Router or API routes.

> Note: Add a hero video file at `public/event-hero.mp4` (muted, looping) for the home
> page background, or update the `src` in `app/page.tsx` to point to your own hosted video.

