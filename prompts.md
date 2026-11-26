# AI Assistance and Development Notes

This document summarizes how AI assistance was used during the development of Task Matrix. AI was used as a supporting tool for technical guidance, implementation suggestions, debugging, and documentation. The suggested code was reviewed and integrated into the existing project.

## 1. Project Development

AI assistance was used to:
- Review the existing MERN application structure.
- Understand the responsibilities of frontend components, backend routes, controllers, and models.
- Plan incremental changes without replacing the existing application.
- Troubleshoot development and integration issues.

## 2. Authentication and Backend Security

Assistance included:
- Reviewing JWT authentication middleware.
- Implementing role-based access control for admin and client users.
- Restricting public registration to the client role.
- Adding administrative account provisioning.
- Protecting inventory and analytics routes.
- Reviewing invoice ownership checks to reduce the risk of insecure direct object reference (IDOR) vulnerabilities.

## 3. Invoice Management and Payment Integration

AI assistance was used for:
- Designing the invoice data model.
- Implementing invoice creation and retrieval.
- Calculating invoice totals on the backend.
- Restricting invoice creation, updates, and deletion to administrators.
- Ensuring clients can access only invoices associated with their accounts.
- Creating Stripe Checkout session and webhook handling code.
- Understanding raw request body handling and Stripe webhook signature verification.

Stripe onboarding and credentials were not available for end-to-end payment testing. The integration therefore remains unverified in a live or test payment environment.

PDF receipt generation and email delivery were not completed as verified workflows.

## 4. Sprint 19 – Real-Time Ticket Locking

AI assistance supported:
- Reviewing the existing Express and Socket.IO server setup.
- Planning an in-memory ticket lock mechanism using a JavaScript Map.
- Implementing dashboard room joining.
- Implementing ticket lock and unlock events.
- Preventing duplicate locks.
- Checking lock ownership before allowing release.
- Broadcasting lock state changes to connected clients.
- Releasing locks when the owning socket disconnects.
- Integrating real-time lock state updates into the React Tasks interface.

## 5. Debugging and Verification

AI assistance was used to investigate and resolve implementation issues, including:
- Backend module import and export errors.
- Route registration and middleware configuration.
- Frontend and backend integration issues.
- Environment variable configuration.
- Socket.IO connection and event handling.
- Git status and documentation checks.

## 6. Documentation and Submission

Assistance included:
- Preparing the project README.
- Documenting the technology stack and project structure.
- Summarizing API route groups and Socket.IO events.
- Recording implementation details and known integration limitations.
- Reviewing Git changes before the final submission.

## 7. Development Responsibility

AI assistance was used as a technical reference and implementation aid throughout the project. Code suggestions were integrated into the existing codebase, with development, configuration, debugging, and verification carried out as part of the project work.

This document describes the assistance used during development and does not claim that untested integrations were successfully deployed or verified.