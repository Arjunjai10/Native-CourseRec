# EduLearn - Course Recommendation System

A personalized course recommendation system built with React Native for web using Expo, with MongoDB, Node.js, and Express backend.

## Features

- 🔐 User Authentication (Sign In/Sign Up)
- 🎯 Personalized Course Recommendations
- 🤖 AI Course Assistant Chat Interface
- 📚 Course Detail Pages with Reviews
- 👤 User Profile Management
- ⚙️ Settings and Preferences
- 📱 Responsive Design for Web
- 🎨 Modern UI matching provided designs

## Tech Stack

### Frontend
- React Native for Web
- Expo Router for navigation
- Expo Linear Gradient for UI effects
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (running locally or MongoDB Atlas account)

## Installation

### 1. Install Node.js

If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/)

### 2. Clone and Setup

```bash
cd "Native Project/CourseRec"
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/courserec
JWT_SECRET=your_secure_jwt_secret_key_here
```

### 6. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Linux
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on http://localhost:5000

### Start Frontend (Web)

In a new terminal:

```bash
npm run web
```

The web app will open in your browser at http://localhost:8081

## Project Structure

```
CourseRec/
├── app/                      # Frontend screens
│   ├── _layout.jsx          # Root layout with navigation
│   ├── index.jsx            # Entry point (redirects to signin)
│   ├── signin.jsx           # Sign In screen
│   ├── signup.jsx           # Sign Up screen
│   ├── home.jsx             # Dashboard/Home screen
│   ├── profile.jsx          # User profile screen
│   ├── recommendations.jsx  # AI Course Assistant
│   ├── settings.jsx         # Settings screen
│   └── course/
│       └── [id].jsx         # Course detail page
├── backend/                 # Backend server
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   └── Course.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   └── users.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js
│   ├── server.js           # Express server entry point
│   └── package.json
├── package.json            # Frontend dependencies
├── app.json               # Expo configuration
└── babel.config.js        # Babel configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/recommendations/:userId` - Get personalized recommendations
- `POST /api/courses/:id/review` - Add course review (requires auth)

### Users
- `GET /api/users/profile/:id` - Get user profile (requires auth)
- `PUT /api/users/profile/:id` - Update user profile (requires auth)
- `POST /api/users/enroll/:courseId` - Enroll in course (requires auth)

## Available Scripts

### Frontend
- `npm start` - Start Expo development server
- `npm run web` - Start web development server
- `npm run android` - Start Android app
- `npm run ios` - Start iOS app

### Backend
- `npm start` - Start backend server
- `npm run dev` - Start with nodemon (auto-reload)

## Screens Overview

1. **Sign In** (`/signin`) - User authentication with email/password
2. **Sign Up** (`/signup`) - User registration with interests selection
3. **Home** (`/home`) - Dashboard with quick actions and course overview
4. **Profile** (`/profile`) - User profile with stats, interests, and certificates
5. **Recommendations** (`/recommendations`) - AI-powered course recommendations chat
6. **Course Detail** (`/course/[id]`) - Detailed course information with reviews
7. **Settings** (`/settings`) - User settings and profile management

## Features Implemented

✅ User authentication with JWT
✅ Password encryption with bcryptjs
✅ Course recommendation system
✅ User profile management
✅ Course enrollment system
✅ Course reviews and ratings
✅ Interest-based recommendations
✅ Responsive web design
✅ Modern UI matching designs

## Customization

### Changing the Primary Color

The primary purple color (#7C3AED) is used throughout the app. To change it:

1. Search for `#7C3AED` in all `.jsx` files
2. Replace with your desired color

### Adding New Courses

Use the MongoDB interface or create a seed script to add courses to the database.

## Troubleshooting

### Port Already in Use

If port 5000 or 8081 is already in use:

```bash
# Change backend port in backend/.env
PORT=5001

# Expo will automatically find an available port
```

### MongoDB Connection Error

Ensure MongoDB is running:

```bash
# Check MongoDB status
sudo systemctl status mongod

# Or use MongoDB Atlas connection string in .env
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# For backend
cd backend
rm -rf node_modules
npm install
```

## Future Enhancements

- [ ] Real-time notifications
- [ ] Progress tracking
- [ ] Certificate generation
- [ ] Payment integration
- [ ] Video streaming
- [ ] Social features (following, comments)
- [ ] Advanced search and filters
- [ ] Mobile app deployment

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
