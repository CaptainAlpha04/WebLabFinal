import mongoose from 'mongoose';

const deviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    trim: true
  },  name: {
    type: String,
    default: '',
    trim: true
  },category: {
    type: String,
    enum: ['thermostat', 'air-conditioner', 'heater', 'humidifier', 'dehumidifier', 'weather-station', 'uncategorized'],
    default: 'uncategorized'
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const DeviceData = mongoose.model('DeviceData', deviceDataSchema);

export default DeviceData;
