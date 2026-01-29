# Community Recycling Gamified – Frontend (Angular)

This folder contains the **frontend** (Angular) for the Community Recycling Gamified platform. It provides role-based navigation and UI for Users and Admins and communicates with the backend REST API.

## Demo Credentials

Admin accounts:
- Email: test@gmail.com  
  Password: 123

User account:
- Email: takis@gmail.com  
  Password: 123

## Main User Routes

User:
- /dashboard
- /rewards
- /my-redemptions
- /points-ledger
- /my-badges

Admin:
- /admin
- /admin/rewards
- /admin/rewards/create
- /admin/rewards/edit/:id
- /admin/redemptions/pending

## How to Run (Local)

1) Open a terminal in the frontend directory and run:

npm install  
npm start  

or, if using Angular CLI:

npm install  
ng serve  

2) The frontend application will be available at:

http://localhost:4200

## Notes

- The frontend expects the backend API to be running (usually https://localhost:5001).
- If the backend base URL is configured in an environment file, update it if your API uses a different port.
- If you see CORS errors, enable/adjust CORS in the backend for http://localhost:4200.
