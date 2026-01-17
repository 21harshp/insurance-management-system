# Insurance Management System

A full-stack web application for managing Health and Motor insurance policies with role-based access control.

## Features

### User Roles
- **Admin**: Manage Sales Managers, view/reset passwords
- **Sales Manager**: Create and manage insurance policies, change own password

### Insurance Types
- **Health Insurance**: Comprehensive health policy management
- **Motor Insurance**: Car/Bike insurance policy management

### Key Functionality
- Role-based authentication with JWT
- Split-screen dashboard (Form + Table)
- Search and filter policies by name and month
- Automatic renewal button based on policy expiry
- Data isolation (Sales Managers see only their own data)
- Password management and reset capabilities

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Modern CSS with dark theme and glassmorphism

## Setup Instructions

### Prerequisites
- Node.js (v20.16.0 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit the `.env` file and update:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `ADMIN_ID`: Admin user ID (default: ADMIN)
- `ADMIN_PASSWORD`: Admin password (default: admin123)

4. Start MongoDB (if running locally):
```bash
# macOS
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Admin Login
1. Go to `http://localhost:5173`
2. Login with:
   - User ID: `ADMIN`
   - Password: `admin123` (or your configured password)

### Admin Functions
- Create Sales Manager accounts (auto-generated IDs: SM0001, SM0002, etc.)
- View all Sales Managers with their passwords
- Reset Sales Manager passwords

### Sales Manager Login
1. Use the User ID and Password provided by Admin
2. Access the dashboard to:
   - Switch between Health and Motor insurance
   - Create new policies
   - View and search existing policies
   - Renew policies (button appears when policy expires in current or next month)
   - Change password

### Policy Renewal Logic
The "Renew" button appears when:
- Current month equals policy end month, OR
- Current month equals policy end month + 1

Example: If policy ends on May 10, 2026:
- Button shows in May (same month)
- Button shows in June (next month)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login for Admin/Sales Manager
- `POST /api/auth/change-password` - Change password (Sales Manager)

### User Management (Admin Only)
- `GET /api/users/sales-managers` - Get all Sales Managers
- `POST /api/users/sales-managers` - Create Sales Manager
- `PUT /api/users/sales-managers/:id/reset-password` - Reset password

### Health Insurance
- `GET /api/health-insurance` - Get policies (with filters)
- `POST /api/health-insurance` - Create policy
- `PUT /api/health-insurance/:id` - Update policy
- `DELETE /api/health-insurance/:id` - Delete policy

### Motor Insurance
- `GET /api/motor-insurance` - Get policies (with filters)
- `POST /api/motor-insurance` - Create policy
- `PUT /api/motor-insurance/:id` - Update policy
- `DELETE /api/motor-insurance/:id` - Delete policy

## Project Structure

```
Insurance Management system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── HealthInsurance.js
│   │   └── MotorInsurance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── healthInsurance.js
│   │   └── motorInsurance.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Common/
│   │   │   └── SalesManager/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- Admin password should be changed in production
- Use HTTPS in production
- Update CORS settings for production deployment

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite dev server with HMR
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

```

## Deployment

### Deploy to GitHub

1. **Initialize Git repository:**
```bash
cd "/Users/harshpatel/Documents/rohit/Insurance Management system"
git init
git add .
git commit -m "Initial commit: Insurance Management System"
```

2. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (don't initialize with README)
   - Copy the repository URL

3. **Push to GitHub:**
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Deploy to Vercel

#### Backend Deployment

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `backend` folder as the root directory
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `ADMIN_ID`: `ADMIN`
   - `ADMIN_PASSWORD`: Your secure admin password
   - `FRONTEND_URL`: Your frontend Vercel URL (add after frontend deployment)
5. Deploy

#### Frontend Deployment

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository again
3. Select the `frontend` folder as the root directory
4. Configure environment variables:
   - `VITE_API_URL`: Your backend Vercel URL + `/api` (e.g., `https://your-backend.vercel.app/api`)
5. Deploy

#### Post-Deployment

1. Update backend `FRONTEND_URL` environment variable with your frontend Vercel URL
2. Redeploy backend to apply CORS changes
3. Test the application by logging in as Admin

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify network access if using MongoDB Atlas

### Port Conflicts
- Backend default: 5000 (change in `.env`)
- Frontend default: 5173 (change in `vite.config.js`)

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`

## License

This project is for educational/business purposes.
