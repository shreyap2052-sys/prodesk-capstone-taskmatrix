# TaskMatrix

## Project Overview

TaskMatrix is a full-stack Agile project management platform designed for software teams to organize projects, manage tasks, track progress, and collaborate through a centralized workspace.

The application will provide a structured alternative to managing development work through scattered spreadsheets, chat messages, and separate task lists. Team members will be able to create projects, manage Kanban boards, assign tasks, track deadlines, and view project activity from one interface.

The system will also support real-time updates so that changes made by one team member can be reflected for other active users without requiring a manual page refresh.

## Problem Statement

Software teams often manage project work across multiple tools, which can make it difficult to maintain a consistent view of task ownership, progress, priorities, and deadlines.

TaskMatrix aims to bring these workflows into a single application where teams can organize their work using projects, Kanban boards, task assignments, priorities, deadlines, comments, and an activity feed.

## Project Goals

* Provide a centralized workspace for software project management.
* Allow teams to organize work using projects and Kanban boards.
* Make task ownership, priority, status, and deadlines easy to identify.
* Support role-based access to project functionality.
* Provide real-time updates for collaborative workflows.
* Maintain structured and persistent project data.
* Provide a responsive interface for desktop and mobile users.
* Build the application with a scalable architecture that can be extended in future development phases.

## Target Users

### Project Administrators

Users responsible for creating projects, managing members, and controlling project-level permissions.

### Team Members

Developers, designers, testers, and other contributors who create, update, and complete project tasks.

### Viewers

Users who need visibility into project progress but should have limited editing permissions.

## Designated Track

**Fullstack Engineering**

TaskMatrix will include both a client-side application and a backend API with persistent database storage.

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* shadcn/ui
* dnd-kit

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* MongoDB
* Mongoose

### Authentication & Validation

* JWT
* Zod

### Development & Deployment

* Git
* GitHub
* Thunder Client
* Vercel
* Render

## Core Features

TaskMatrix features are divided into three priority levels to keep the initial release focused and prevent scope creep.

### P0 — MVP / Core Requirements

These features define the minimum usable version of TaskMatrix.

* **User Authentication**

  * User registration and login.
  * JWT-based authentication.
  * Protected application routes.

* **Role-Based Access Control**

  * Admin, project member, and viewer permissions.
  * Project-level access restrictions.

* **Project Management**

  * Create, view, update, and delete projects.
  * Add and remove project members.
  * View project details and current progress.

* **Kanban Task Management**

  * Create, edit, and delete tasks.
  * Organize tasks into Kanban columns.
  * Drag and drop tasks between statuses.
  * Track task status and progress.

* **Task Assignment**

  * Assign tasks to project members.
  * Display task ownership.
  * Allow authorized users to update assignments.

* **Task Priorities**

  * Low, Medium, High, and Critical priority levels.
  * Visual priority indicators.

* **Task Deadlines**

  * Set task due dates.
  * Display overdue tasks.
  * Track upcoming deadlines.

* **Task Details**

  * Task title and description.
  * Status, priority, assignee, and deadline.
  * Task creation and update timestamps.

### P1 — Enhanced Features

These features will improve collaboration and project visibility after the MVP is functional.

* Real-time task updates using Socket.io.
* Task comments.
* Project activity feed.
* Task and project search.
* Filtering by status, priority, and assignee.
* Project progress dashboard.
* In-app notifications.
* Responsive mobile interface.

### P2 — Future Features

These features are intentionally outside the initial MVP scope and may be considered in later development phases.

* AI-assisted task creation and summarization.
* Advanced project analytics.
* Email notifications.
* GitHub repository integration.
* Automated reporting.
* External calendar integration.
* Subscription or payment functionality.

## Scope Control

The P0 feature set will be treated as the core MVP and will take priority over P1 and P2 features.

P1 features will be implemented only after the core application workflow is stable. P2 features will not block the MVP and may be deferred if they conflict with the project timeline.


