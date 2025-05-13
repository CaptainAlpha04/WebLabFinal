import express from 'express';
import DeviceData from '../models/DeviceData.mjs';

const router = express.Router();

// Get all device data
router.get('/all', async (req, res) => {
  try {
    const data = await DeviceData.find().sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Get latest data (limit 10)
router.get('/latest', async (req, res) => {
  try {
    const data = await DeviceData.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest data', error: error.message });
  }
});

// Get data by device ID
router.get('/device/:id', async (req, res) => {
  try {
    const data = await DeviceData.find({ deviceId: req.params.id })
      .sort({ timestamp: -1 });
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for this device' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device data', error: error.message });
  }
});

// Add new device data
router.post('/', async (req, res) => {
  try {
    const { deviceId, temperature, humidity, category, name } = req.body;
    
    // Basic validation
    if (!deviceId || temperature == null || humidity == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newData = new DeviceData({
      deviceId,
      temperature,
      humidity,
      category: category || 'uncategorized',
      name: name || `Device ${deviceId}`
    });
    
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
});

export default router;
