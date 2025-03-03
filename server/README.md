
# EnergyHarmony Backend

This is the backend server for the EnergyHarmony IoT application for smart home energy monitoring.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Devices
- `GET /api/devices` - Get all devices for a user
- `POST /api/devices` - Create a new device
- `PUT /api/devices/:id` - Update a device
- `DELETE /api/devices/:id` - Delete a device

### Usage Data
- `GET /api/usage/daily` - Get daily usage data
- `GET /api/usage/weekly` - Get weekly usage data
- `POST /api/usage` - Record new usage data

### Budget
- `GET /api/budget` - Get the user's budget
- `POST /api/budget` - Create or update a budget

### Summary
- `GET /api/summary` - Get usage summary statistics

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/energy-harmony
   JWT_SECRET=your_jwt_secret
   ```

3. Start the server:
   ```
   npm run dev
   ```

## Usage with Frontend

The frontend application is configured to connect to this backend. Make sure the backend is running before starting the frontend application.
