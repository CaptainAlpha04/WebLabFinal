# IoT Dashboard Application

This project demonstrates a real-time IoT device monitoring dashboard built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Real-time Data Dashboard**: Visualize temperature and humidity data from IoT devices
- **Admin Console**: Upload simulated device data through a user-friendly interface
- **RESTful API**: Backend API for sending and retrieving device data
- **Data Visualization**: Charts showing trends over time using Recharts
- **Responsive UI**: Modern monochrome design that works on all devices

## Project Structure

- **`/client`**: React frontend application
  - Dashboard with real-time data visualization
  - Admin console for data upload
  - Context API for global state management

- **`/server`**: Express backend application
  - RESTful API endpoints
  - MongoDB integration with Mongoose
  - Device data models

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account (or local MongoDB)

### Installation and Setup

1. **Clone the repository**

2. **Setup the server**

   ```powershell
   cd server
   npm install
   ```
   
   Update the `.env` file with your MongoDB Atlas connection string:
   
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

3. **Setup the client**

   ```powershell
   cd client
   npm install
   ```

4. **Run the application**

   In one terminal, start the server:
   ```powershell
   cd server
   npm start
   ```
   
   In another terminal, start the client:
   ```powershell
   cd client
   npm run dev
   ```

5. **Access the application**
   - Dashboard: http://localhost:5173/
   - Admin Console: http://localhost:5173/admin

## API Endpoints

- `GET /api/data/all`: Get all device data
- `GET /api/data/latest`: Get the most recent device data (limited to 10 entries)
- `GET /api/data/device/:id`: Get data for a specific device
- `POST /api/data`: Upload new device data

## Dashboard Features

- Real-time data updates (polling every 5 seconds)
- Temperature and humidity visualization
- Device statistics and trends
- Data table with recent readings

## Admin Console Features

- Form for uploading device data
- Validation for required fields
- Quick data generation for testing
- Success/error feedback

## Learning Outcomes

This project demonstrates:
- React Hooks (useState, useEffect, useContext)
- Context API for state management
- Express middleware and error handling
- RESTful API design
- MongoDB with Mongoose ODM
- Real-time data visualization
