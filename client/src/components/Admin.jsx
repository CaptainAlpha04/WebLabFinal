import React, { useState } from 'react';
import { useDeviceData } from '../context/DeviceDataContext';

const Admin = () => {
  const { addDeviceData, categories } = useDeviceData();
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    category: '',
    temperature: '',
    humidity: ''
  });
  const [status, setStatus] = useState({
    message: '',
    type: '' // 'success' or 'error'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);    
    setStatus({ message: '', type: '' });

    // Validate form data
    if (!formData.deviceId || !formData.temperature || !formData.humidity || !formData.category) {
      setStatus({
        message: 'Device ID, Category, Temperature and Humidity are required',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }
    
    // If name is empty, use the device ID as a name
    if (!formData.name) {
      formData.name = `Device ${formData.deviceId}`;
    }

    try {
      // Convert temperature and humidity to numbers
      const dataToSubmit = {
        ...formData,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity)
      };

      const result = await addDeviceData(dataToSubmit);
      
      if (result.success) {
        setStatus({
          message: 'Device data added successfully!',
          type: 'success'
        });
        // Reset form
        setFormData({
          deviceId: '',
          name: '',
          category: '',
          temperature: '',
          humidity: ''
        });
      } else {
        setStatus({
          message: result.error || 'Failed to add device data',
          type: 'error'
        });
      }
    } catch (error) {
      setStatus({
        message: 'An error occurred while adding device data',
        type: 'error'
      });
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1>Admin Console</h1>
        <p className="text-gray-500">Upload simulated IoT device data</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className="card h-full flex flex-col">
          <div>
            <h2 className="mb-4">Quick Data Generation</h2>
            <p className="text-sm text-gray-500 mb-6">
              Generate random data for testing purposes. Select a device type to populate the form.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
            {categories.map((category) => (
              <button 
                key={category.value}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-orange-200/20 hover:shadow transition-all"
                onClick={() => {
                  // Pre-fill with random data for this category
                  setFormData({
                    deviceId: `${category.value}-${Math.floor(Math.random() * 1000)}`,
                    name: `${category.label} ${Math.floor(Math.random() * 100)}`,
                    category: category.value,
                    temperature: (20 + Math.random() * 10).toFixed(1),
                    humidity: (50 + Math.random() * 30).toFixed(1)
                  });
                }}
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card h-full">
          <h2 className="mb-6">Upload Device Data</h2>

          {status.message && (
            <div className={`mb-4 p-3 rounded-md ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status.message}
            </div>
          )}        
            <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-4">
              <div>
                <label htmlFor="deviceId" className="form-label">Device ID</label>
                <input
                  type="text"
                  id="deviceId"
                  name="deviceId"
                  className="form-input"
                  placeholder="e.g. device001"
                  value={formData.deviceId}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="name" className="form-label">Device Name (Optional)</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Living Room Thermostat"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="category" className="form-label">Device Category</label>
                <div className="relative">            
                  <select
                    id="category"
                    name="category"
                    className="form-input appearance-none pr-8"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="temperature" className="form-label">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  id="temperature"
                  name="temperature"
                  className="form-input"
                  placeholder="e.g. 25.5"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="humidity" className="form-label">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  id="humidity"
                  name="humidity"
                  className="form-input"
                  placeholder="e.g. 60"
                  value={formData.humidity}
                  onChange={handleChange}
                />              </div>
            </div>

            <div className="mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Submit Data'}
              </button>
            </div>
          </form>
        </div>
      </div>    </div>
  );
};

export default Admin;
