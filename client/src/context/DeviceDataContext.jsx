import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Device categories with their icons
export const deviceCategories = [
  { value: 'thermostat', label: 'Thermostat', icon: '🌡️' },
  { value: 'air-conditioner', label: 'Air Conditioner', icon: '❄️' },
  { value: 'heater', label: 'Heater', icon: '🔥' },
  { value: 'humidifier', label: 'Humidifier', icon: '💧' },
  { value: 'dehumidifier', label: 'Dehumidifier', icon: '🌫️' },
  { value: 'weather-station', label: 'Weather Station', icon: '🌤️' }
];

// Create context
const DeviceDataContext = createContext();

// Create provider
export const DeviceDataProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const fetchLatestData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/latest');
      setDeviceData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching device data:', err);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };
  
  // Poll for data every 5 seconds
  useEffect(() => {
    fetchLatestData();
    
    const interval = setInterval(() => {
      fetchLatestData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
    // Calculate stats based on the current data
  const calculateStats = () => {
    if (!deviceData || deviceData.length === 0) {
      return { avgTemp: 0, avgHumidity: 0, devices: [], devicesByCategory: {} };
    }
    
    // Filter data by selected category if needed
    const filteredData = selectedCategory === 'all' 
      ? deviceData 
      : deviceData.filter(data => data.category === selectedCategory);

    // If no data after filtering
    if (filteredData.length === 0) {
      return { avgTemp: 0, avgHumidity: 0, devices: [], devicesByCategory: {} };
    }
    
    // Get unique devices
    const devices = [...new Set(filteredData.map(data => data.deviceId))];
    
    // Organize devices by category
    const devicesByCategory = {};
    deviceData.forEach(data => {
      const category = data.category || 'uncategorized';
      if (!devicesByCategory[category]) {
        devicesByCategory[category] = new Set();
      }
      devicesByCategory[category].add(data.deviceId);
    });
    
    // Convert Sets to arrays
    Object.keys(devicesByCategory).forEach(key => {
      devicesByCategory[key] = Array.from(devicesByCategory[key]);
    });
    
    // Calculate average temperature and humidity from filtered data
    const avgTemp = filteredData.reduce((acc, curr) => acc + curr.temperature, 0) / filteredData.length;
    const avgHumidity = filteredData.reduce((acc, curr) => acc + curr.humidity, 0) / filteredData.length;
    
    return {
      avgTemp: parseFloat(avgTemp.toFixed(1)),
      avgHumidity: parseFloat(avgHumidity.toFixed(1)),
      devices,
      devicesByCategory
    };
  };
  
  const stats = calculateStats();
  // Add device data through form submission
  const addDeviceData = async (formData) => {
    try {
      // Add default category if none provided
      if (!formData.category) {
        formData.category = 'uncategorized';
      }

      // Add a device name if none provided
      if (!formData.name) {
        formData.name = `Device ${formData.deviceId}`;
      }
      
      console.log('Sending data to server:', formData); // Debug what we're sending
      
      const response = await axios.post('http://localhost:5000/api/data', formData);
      console.log('Response from server:', response.data); // Debug what we get back
      setDeviceData([response.data, ...deviceData]);
      return { success: true };
    } catch (err) {
      console.error('Error adding device data:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to add data. Please try again.' 
      };
    }
  };
    return (
    <DeviceDataContext.Provider
      value={{
        deviceData,
        loading,
        error,
        stats,
        fetchLatestData,
        addDeviceData,
        selectedCategory,
        setSelectedCategory,
        categories: deviceCategories
      }}
    >
      {children}
    </DeviceDataContext.Provider>
  );
};

// Custom hook to use the context
export const useDeviceData = () => {
  const context = useContext(DeviceDataContext);
  if (!context) {
    throw new Error('useDeviceData must be used within a DeviceDataProvider');
  }
  return context;
};

export default DeviceDataContext;
