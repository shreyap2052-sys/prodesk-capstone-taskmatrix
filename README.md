# Task Matrix – Agile Project Management Platform

Task Matrix is a full-stack project management application designed to help teams organize projects, manage tasks, track progress, and collaborate through a centralized workspace.

## Features

- User registration and login with JWT authentication.
- Secure password hashing using bcryptjs.
- Project creation and management.
- Task creation, editing, deletion, and assignment.
- Task priorities, deadlines, and status tracking.
- Kanban-style task organization.
- Team collaboration and activity tracking.
- Dashboard metrics and project progress overview.
- Real-time communication using Socket.IO.
- AI-powered task suggestions through a server-side OpenAI integration.
- Request validation using Zod.
- Centralized error handling and standardized API responses.
- Rate limiting for login and AI generation endpoints.
- Protected API routes with authentication and authorization checks.

## Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- Zod
- OpenAI SDK
- express-rate-limit

## Project Structure

```text
Task-Matrix/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│   ├── socket.js
│   └── package.json
├── README.md
├── prompts.md
└── .gitignore
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shreyap2052-sys/prodesk-capstone-taskmatrix.git
cd prodesk-capstone-taskmatrix
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Start the backend

```bash
npm start
```

The backend starts using the `node server.js` production entry point.

### 4. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend is available at `http://localhost:5173`.

## Backend API

The Express backend exposes the following API route groups:

| Route | Purpose |
|---|---|
| `/api/auth` | User registration and authentication |
| `/api/projects` | Project management |
| `/api/tasks` | Task management |
| `/api/activities` | Activity tracking |
| `/api/notifications` | Notifications |
| `/api/ai` | AI-powered task suggestions |

The root endpoint (`/`) provides a basic API health check.

## Sprint 17 – Backend Provisioning & Secure MERN Integration

This phase focuses on preparing the existing backend for cloud deployment and secure communication with the React frontend.

### Backend Provisioning

- Configured the backend startup script as `node server.js`.
- Used the platform-provided `PORT` environment variable with a local fallback.
- Initialized the HTTP server with Socket.IO integration.
- Added a root health-check endpoint.
- Connected the application to MongoDB through Mongoose before starting the server.

### Production Security

- Configured environment-based frontend origin validation.
- Restricted Express CORS to the configured frontend URL.
- Applied corresponding origin restrictions to Socket.IO.
- Enabled credential support for authorized cross-origin requests.
- Kept database credentials, JWT secrets, and API keys outside the source code.
- Added environment files to `.gitignore`.

### Environment Configuration

The backend requires the following environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `OPENAI_API_KEY` | Server-side OpenAI API access |
| `FRONTEND_URL` | Authorized frontend origin |

For production, configure these variables through the hosting provider's environment settings rather than committing secrets.

### Cloud Deployment Configuration

The backend is structured for deployment on platforms such as Render, Railway, or Fly.io.

Recommended Render configuration:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

For MongoDB Atlas connectivity, configure the appropriate Network Access rules for the cloud deployment.

The production `FRONTEND_URL` must match the deployed frontend origin. The frontend's `VITE_API_URL` must point to the deployed backend URL.

## AI Task Generation

The application includes an AI task suggestion feature. Authenticated users can enter a task idea and receive a generated task suggestion containing a title, description, subtasks, and suggested priority.

The AI request is handled by:

`POST /api/ai/generate-task`

The OpenAI API key is stored in the backend environment and is never exposed through frontend code.

## Backend Security and Validation

- JWT authentication protects private API routes.
- Passwords are hashed using bcryptjs.
- Zod schemas validate request bodies before database operations.
- Invalid request payloads receive HTTP 400 responses.
- Missing resources return HTTP 404 responses.
- Unauthorized access is rejected.
- Centralized error handling provides consistent JSON responses.
- Rate limiting helps protect login and AI generation endpoints.
- CORS restricts browser-based access to the configured frontend origin.

## Database

The application uses MongoDB with Mongoose models for users, projects, tasks, activities, and notifications.

MongoDB Atlas provides the cloud database infrastructure. Connection details are supplied through environment variables.

## Integration Testing Checklist

The following checks can be used to verify the complete application integration:

- [ ] Backend starts successfully.
- [ ] MongoDB Atlas connection succeeds.
- [ ] API health-check endpoint responds successfully.
- [ ] Frontend communicates with the configured backend URL.
- [ ] User registration and login work.
- [ ] Protected API requests accept valid JWT tokens.
- [ ] Project and task operations persist in MongoDB.
- [ ] Unauthorized frontend origins are rejected.
- [ ] Socket.IO establishes a connection from the authorized frontend.

## Project Documentation

Architecture and database diagrams are included in the repository:

- `taskmatrix-architecture.png`
- `taskmatrix-erd-clean.png`

## Repository Maintainer

Developed and maintained by [shreyap2052-sys](https://github.com/shreyap2052-sys).