# Task Matrix – Agile Project Management Platform

Task Matrix is a full-stack project management application designed to help teams organize projects, manage tasks, track progress, and collaborate through a centralized workspace.

## Features

- User registration and login with JWT authentication.
- Secure password hashing.
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
- MongoDB
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

Create a `.env` file with the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Start the backend

Run the backend start script:

```bash
npm start
```

### 4. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file if required:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend using:

```bash
npm run dev
```

## AI Task Generation

The application includes an AI task suggestion feature. Authenticated users can enter a task idea and receive a generated task suggestion containing a title, description, subtasks, and suggested priority.

The AI request is handled by the backend through:

`POST /api/ai/generate-task`

The OpenAI API key is stored in the backend environment and is never exposed through frontend code.

## Backend Security and Validation

- JWT authentication protects private API routes.
- Zod schemas validate request bodies before database operations.
- Invalid request payloads receive HTTP 400 responses.
- Missing resources return HTTP 404 responses.
- Unauthorized access is rejected.
- Centralized error handling provides consistent JSON responses.
- Rate limiting helps protect login and AI generation endpoints.

## Database

The application uses MongoDB with Mongoose models for users, projects, tasks, activities, and notifications.

## Project Documentation

Architecture and database diagrams are included in the repository.

## Attribution

This project is adapted from the Task Matrix codebase by Sakshi Gupta, with permission.

Original source: https://github.com/saakshigupta-saa/Task_Matrix

Repository maintainer: https://github.com/shreyap2052-sys
