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
│   ├── server.js
│   └── package.json
├── README.md
├── Prompts.md
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

Create a `.env` file using the environment variables required by the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### 3. Start the backend

Use the start script defined in `backend/package.json`.

### 4. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Use the development script defined in `frontend/package.json`.

## Database

The application uses MongoDB with Mongoose models for users, projects, tasks, activities, and notifications.

## Project Documentation

Architecture and database diagrams are included in the repository.

## Attribution

This project is adapted from the Task Matrix codebase by Sakshi Gupta, with permission. Original source: https://github.com/saakshigupta-saa/Task_Matrix

Repository maintainer: [shreyap2052-sys](https://github.com/shreyap2052-sys)

Further modifications and project contributions should be documented accurately as they are completed.