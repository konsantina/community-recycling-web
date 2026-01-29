# Community Recycling Gamified – Frontend (Angular)

This folder contains the **frontend** of the Community Recycling Gamified platform, built with Angular.  
The frontend provides role-based navigation and UI for **Users** and **Admins** and communicates with the backend REST API.

---

## Important – Backend Dependency

This frontend **does not work standalone**.

Before running the frontend:
- The backend API must be running
- The database must be created locally using EF Core migrations
- At least **two users must exist in the database**:
  - One **Admin** user with **Role = 0**
  - One **User** with **Role = 2**

User accounts are **not included** and **not seeded automatically**.  
They must be created manually (via registration endpoint or directly in the database), as described in the backend README.

---

## Main Routes

### User Routes
- /dashboard
- /rewards
- /my-redemptions
- /points-ledger
- /my-badges

### Admin Routes
- /admin
- /admin/rewards
- /admin/rewards/create
- /admin/rewards/edit/:id
- /admin/redemptions/pending

Access to routes is controlled via JWT authentication and role-based guards.

---

## How to Run the Frontend (Local)

1. Make sure the backend API is running (usually at https://localhost:5001)
2. Open a terminal in the frontend directory
3. Run the following commands:

npm install  
npm start  

or, if using Angular CLI:

npm install  
ng serve  

The frontend application will be available at:

http://localhost:4200

---

## Environment Configuration

If the backend API runs on a different port or host, update the API base URL in the Angular environment configuration files (e.g. `environment.ts`).

---

## Authentication & Authorization

- JWT token is issued by the backend after login
- Token is stored on the client
- Angular route guards restrict access based on role:
  - Admin routes require Role = 0
  - User routes require Role = 2

If a user does not have the required role, access to the route is denied.

---

## Notes

- If API calls fail, verify that:
  - the backend is running
  - CORS allows requests from http://localhost:4200
  - valid users exist in the database with correct role values
- If login succeeds but pages are inaccessible, check the user role stored in the database.

---

## Technologies Used

Angular  
TypeScript  
JWT Authentication  
Role-based Route Guards

---

## Summary

The frontend relies entirely on the backend for authentication, authorization, and data.  
A local database with properly configured users and roles is required before the application can be used.
