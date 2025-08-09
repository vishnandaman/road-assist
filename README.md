# RoadAssist - Roadside Assistance Platform

A full-stack web application for connecting users with nearby mechanics for roadside assistance services.

## 🏗️ Project Structure

```
Odoo_Hackathon/
├── backend/                 # Node.js/Express API Server
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication and error handling
│   ├── models/            # MongoDB/Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── frontend/              # React.js Client Application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── context/       # React context providers
│   │   └── hooks/         # Custom React hooks
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/roadassist
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start MongoDB:**
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Backend Architecture

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile

#### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /location` - Update user location
- `GET /mechanics/nearby` - Get nearby mechanics

#### Requests (`/api/requests`)
- `POST /` - Create service request
- `GET /nearby` - Get nearby requests (mechanics)
- `PUT /:id/accept` - Accept request (mechanics)

#### Mechanics (`/api/mechanics`)
- `GET /profile` - Get mechanic profile
- `POST /profile` - Create/update mechanic profile
- `PUT /availability` - Update availability
- `GET /current-request` - Get current request
- `PUT /complete-request` - Complete current request

### Database Models

#### User
- Basic user information (name, email, password, phone)
- Role-based access (user, mechanic, admin)
- Geolocation support for finding nearby services
- Vehicle information

#### Request
- Service request details
- Location tracking
- Status management (pending, accepted, in_progress, completed)
- Pricing and time estimation

#### Mechanic
- Specialized mechanic profile
- Service specialties
- Availability status
- Current location and active requests

#### Review
- User feedback system
- Rating and comments
- Links to completed requests

## 🎨 Frontend Architecture

### Key Features
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Real-time Updates**: Socket.io integration for live tracking
- **Geolocation**: Google Maps integration for location services
- **Authentication**: JWT-based auth with protected routes
- **Payment Integration**: Razorpay payment gateway

### Component Structure
- **Layout Components**: Navbar, Footer, LoadingSpinner
- **Page Components**: Home, Login, Register, ServiceRequest, etc.
- **Feature Components**: LiveMap, PaymentForm, ReviewCard, etc.
- **Context Providers**: AuthContext for state management

### Color Theme
- **Primary Color**: `#4d417f` (Purple)
- **Secondary Color**: `#995f15` (Brown)
- **Warning Color**: `#ffc107` (Yellow)
- **Success Color**: `#28a745` (Green)

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: JWT token generated and stored in localStorage
3. **Protected Routes**: Token verified on each API request
4. **Role-based Access**: Different permissions for users vs mechanics

## 📱 Key Features

### For Users
- Request roadside assistance
- Real-time tracking of mechanic location
- Payment processing
- Service history and reviews
- Emergency contact information

### For Mechanics
- View nearby service requests
- Accept/reject requests
- Update availability status
- Track current service location
- Complete service requests

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Bootstrap** - CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **Socket.io** - Real-time communication
- **Google Maps API** - Location services

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Backend**: Centralized error middleware with proper HTTP status codes
- **Frontend**: Global error boundary and API error interceptors
- **Validation**: Input validation on both client and server
- **Authentication**: Token expiration and refresh handling

## 🔧 Development

### Running in Development Mode
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Environment Variables
Create `.env` files in both backend and frontend directories with appropriate configuration.

### Database Setup
Ensure MongoDB is running and the database connection string is properly configured.

## 📝 API Documentation

The API follows RESTful conventions with consistent response formats:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

