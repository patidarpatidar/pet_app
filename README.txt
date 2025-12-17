PET MANAGEMENT SYSTEM
=====================

OVERVIEW
--------
This is a full-stack pet management application built with React (frontend) and Node.js/Express (backend). The system allows users to browse available pets, submit adoption applications, and administrators to manage pets and applications.

FEATURES
--------

User Features:
- Browse available pets with search and filtering
- View detailed pet information
- Submit adoption applications
- View personal application status

Admin Features:
- Add, edit, and delete pets
- View all adoption applications
- Approve or reject applications
- Update pet status automatically/manually

TECHNICAL STACK
---------------

Frontend:
- React 18
- React Router for navigation
- Bootstrap for responsive design
- Axios for API calls
- React Lazy Load Image Component for performance

Backend:
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests


INSTALLATION & SETUP
--------------------

Prerequisites:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

Backend Setup:
1. Navigate to backend directory: cd backend
2. Install dependencies: npm install
3. Create .env file with:
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret_key
   - PORT=5000
4. Start the server: npm start

Frontend Setup:
1. Navigate to frontend directory: cd frontend
2. Install dependencies: npm install
3. Start the development server: npm start

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

API ENDPOINTS
-------------

Authentication:
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

Pets:
- GET /api/pets - Get all pets (with pagination, search, filters)
- GET /api/pets/:id - Get pet by ID
- POST /api/pets - Create new pet (admin only)
- PUT /api/pets/:id - Update pet (admin only)
- DELETE /api/pets/:id - Delete pet (admin only)

Applications:
- GET /api/applications - Get all applications (admin only)
- GET /api/applications/user - Get user's applications
- POST /api/applications - Submit new application
- PUT /api/applications/:id - Update application status (admin only)

DATABASE MODELS
---------------

User Model:
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: 'user', 'admin', default: 'user')

Pet Model:
- name: String (required)
- species: String (required)
- breed: String (required)
- age: Number (required)
- description: String
- photo: String (URL)
- status: String (enum: 'available', 'adopted', default: 'available')

AdoptionApplication Model:
- user: ObjectId (ref: User)
- pet: ObjectId (ref: Pet)
- status: String (enum: 'pending', 'approved', 'rejected', default: 'pending')
- applicationDate: Date (default: Date.now)
- notes: String

USAGE GUIDE
-----------

For Users:
1. Register/Login to access the system
2. Browse pets on the home page
3. Use search and filters to find specific pets
4. Click "View Details" to see more information
5. Click "Adopt" to submit an application
6. View your applications in the "My Applications" section

For Admins:
1. Login with admin credentials
2. Access "Admin Dashboard" from the navigation
3. Add new pets using "Add Pet" button
4. View and manage all adoption applications
5. Approve/reject applications as needed

RESPONSIVE DESIGN
-----------------
The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

