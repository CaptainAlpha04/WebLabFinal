import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.mjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/data', dataRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('IoT Dashboard API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// For testing purposes, populate with some dummy data if needed
import DeviceData from './models/DeviceData.mjs';

const populateDummyData = async () => {
  try {
    const count = await DeviceData.countDocuments();
    if (count === 0) {
      console.log('Populating dummy data...');
      const dummyData = [
        { deviceId: 'device001', temperature: 25.5, humidity: 60 },
        { deviceId: 'device001', temperature: 26.2, humidity: 62 },
        { deviceId: 'device002', temperature: 22.8, humidity: 55 },
        { deviceId: 'device002', temperature: 23.1, humidity: 54 },
        { deviceId: 'device003', temperature: 28.0, humidity: 70 }
      ];
      
      await DeviceData.insertMany(dummyData);
      console.log('Dummy data populated successfully');
    }
  } catch (error) {
    console.error('Error populating dummy data:', error);
  }
};

// Uncomment the line below to populate dummy data on server start
// populateDummyData();