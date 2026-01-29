# Community Recycling Gamified Platform

Community Recycling Gamified is a web application that encourages recycling through a gamification system based on points, badges, and redeemable rewards.  
The platform follows a clear role-based architecture, separating responsibilities and access between Users and Admins.

---

## User Roles

The application supports the following roles:

- User – end user who earns points, unlocks badges, and redeems rewards
- Admin – platform administrator with full management permissions

Each role has access to different routes, UI elements, and backend operations.

---

## Demo Credentials

The following demo accounts are available for testing and evaluation.

Admin accounts:
- Email: test@gmail.com  
  Password: 123

- Email: takis@gmail.com  
  Password: 123

User account:
- Email: user@gmail.com  
  Password: 123

---

## User Role – Navigation and Features

The User interacts with the core gamification functionality of the platform.

Dashboard  
Route: /dashboard  
Displays total available points, unlocked badges, and recent activity.  
Backend endpoints:  
GET /api/points/me  
GET /api/badges/me  

Rewards  
Route: /rewards  
Displays all available rewards, their point cost, and a Redeem button that is enabled only when the user has enough points.  
Backend endpoint:  
GET /api/rewards  

Reward Redemption Flow  
1. The user navigates to the Rewards page  
2. Selects a reward and clicks Redeem  
3. A redemption request is created  
4. The request status is set to Pending  
5. Points are not deducted immediately  
Backend endpoint:  
POST /api/redemptions  

My Redemptions  
Route: /my-redemptions  
Displays all redemptions created by the user with their current status (Pending, Approved, Rejected).  
Backend endpoint:  
GET /api/redemptions/me  

Points Ledger  
Route: /points-ledger  
Shows the complete history of point changes with date and action description.  
Backend endpoint:  
GET /api/points/ledger/me  

Badges  
Route: /my-badges  
Displays all available badges, unlocked status, and progress where applicable.  
Backend endpoint:  
GET /api/badges/me  

---

## Admin Role – Navigation and Features

The Admin has full control over the platform configuration and user actions.

Admin Dashboard  
Route: /admin  

Rewards Management  
Routes:  
/admin/rewards  
/admin/rewards/create  
/admin/rewards/edit/:id  

Admins can create, edit, and delete rewards.  
Backend endpoints:  
POST /api/rewards  
PUT /api/rewards/{id}  
DELETE /api/rewards/{id}  

Pending Redemptions  
Route: /admin/redemptions/pending  
Displays all pending redemption requests submitted by users.  
Backend endpoint:  
GET /api/redemptions/pending  

Approve / Reject Redemption  
Admins can approve or reject redemption requests.  
If approved, points are deducted and the points ledger is updated.  
If rejected, no points are deducted.  
Backend endpoints:  
POST /api/redemptions/{id}/approve  
POST /api/redemptions/{id}/reject  

---

## Route Access Matrix

/dashboard – User ✔ Admin ✔  
/rewards – User ✔ Admin ✔  
/my-redemptions – User ✔ Admin ✖  
/points-ledger – User ✔ Admin ✖  
/my-badges – User ✔ Admin ✖  
/admin – User ✖ Admin ✔  
/admin/rewards – User ✖ Admin ✔  
/admin/redemptions/pending – User ✖ Admin ✔  

---

## How to Run the Project

Backend (.NET)

Navigate to the backend directory and run:
dotnet restore  
dotnet run  

The backend API runs at:
https://localhost:5001

Frontend (Angular)

Navigate to the frontend directory and run:
npm install  
npm start  

or, if using Angular CLI:
npm install  
ng serve  

The frontend application will be available at:
http://localhost:4200

---

## Authentication and Authorization

The application uses JWT-based authentication.  
Tokens are stored on the client.  
Role-based route guards are applied on the frontend and role checks are enforced in backend controllers.

---

## Technologies Used

Backend:
ASP.NET Core, Entity Framework Core, REST API, JWT Authentication

Frontend:
Angular, Route Guards, Role-based UI Rendering

---

## Conclusion

Community Recycling Gamified provides a complete gamified recycling experience with clear role separation, controlled reward redemption workflows, and full traceability of user actions and points.
