# Task Matrix – Project and Team Management Platform

Task Matrix is a full-stack project management application built to help teams organize projects, manage tasks, coordinate work, and monitor progress through a centralized workspace.

## Features

### Authentication and Security
- User registration and login.
- Password hashing with bcrypt.
- JWT-based authentication.
- Protected API routes.
- Role-based access control for admin and client accounts.

### Project and Task Management
- Create and manage projects.
- Create, update, and organize tasks.
- View task details and track work.
- Team collaboration through the application dashboard.

### Real-Time Collaboration
- Socket.IO integration with the Express server.
- Real-time ticket locking and unlocking.
- Prevention of duplicate ticket locks.
- Lock ownership validation.
- Automatic lock release when an agent disconnects.
- Broadcast updates to connected dashboard users.

### Dashboard and Supporting Features
- Activity tracking.
- Notifications.
- AI-assisted task generation.
- Inventory management.
- Analytics endpoints.

### Invoice and Payment API
- Invoice creation for registered clients.
- Admin and client access restrictions.
- Client-specific invoice listing.
- Invoice ownership checks to prevent unauthorized access.
- Stripe Checkout session creation.
- Stripe webhook signature verification before processing payment events.

Stripe payment processing requires valid Stripe credentials and webhook configuration. Stripe onboarding for new businesses in India may require an invitation. The payment flow has not been verified end-to-end in this environment.

## Technology Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Zustand
- Tailwind CSS
- Lucide React
- dnd-kit

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Socket.IO
- Zod
- Express Rate Limit
- OpenAI SDK
- Stripe SDK

**Additional Packages**
- PDFKit
- Nodemailer

PDF receipt generation and email delivery are not yet implemented and verified as complete workflows.

## Project Structure

```text
Task-Matrix/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── validators/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── prompts.md
```

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/shreyap2052-sys/prodesk-capstone-taskmatrix.git
cd prodesk-capstone-taskmatrix
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Additional integrations may require their own credentials:

```env
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
```

Do not commit `.env` files or expose secret credentials.

Start the backend:

```bash
npm start
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file if required by your deployment configuration. Configure the API URL using the environment variable expected by the frontend.

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

## API Route Overview

| Route | Purpose |
|---|---|
| `/api/auth` | Registration and login |
| `/api/projects` | Project management |
| `/api/tasks` | Task management |
| `/api/activities` | Activity records |
| `/api/notifications` | Notifications |
| `/api/ai` | AI-assisted task generation |
| `/api/inventory` | Inventory operations |
| `/api/analytics` | Analytics data |
| `/api/invoices` | Invoice management |
| `/api/payments` | Checkout session creation |
| `/api/webhooks/stripe` | Stripe payment webhook |

Protected endpoints require a valid bearer token. Access permissions depend on the route and authenticated user's role.

## Real-Time Ticket Locking

The application uses Socket.IO to coordinate ticket handling between connected agents.

| Event | Description |
|---|---|
| `join_dashboard` | Joins the ticket dashboard |
| `lock_ticket` | Requests a ticket lock |
| `unlock_ticket` | Releases a ticket lock |
| `current_locks` | Returns current lock information |
| `ticket_locked` | Broadcasts a new lock |
| `ticket_unlocked` | Broadcasts an unlock |
| `lock_rejected` | Reports a rejected lock request |
| `unlock_rejected` | Reports a rejected unlock request |

The current lock implementation uses an in-memory JavaScript Map. Locks are released when their owning socket disconnects. Because the Map is in memory, lock state is not shared across multiple backend instances and does not persist through server restarts.

## Security Notes

- Passwords are hashed before storage.
- Protected routes use JWT authentication.
- Role middleware restricts administrative operations.
- Invoice access checks validate client ownership on the backend.
- Stripe webhook events are verified using the webhook signing secret before payment processing.
- Secret keys and database credentials must remain in environment variables.

## Current Integration Notes

- Stripe Checkout and webhook handling require valid Stripe account credentials.
- New Stripe business onboarding in India may require an invitation.
- End-to-end payment verification has not been completed.
- PDF receipt generation and Nodemailer delivery remain future integration work.

## Author

Developed as part of the Prodesk engineering internship capstone work.

