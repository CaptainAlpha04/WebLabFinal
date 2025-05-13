import React from 'react';
import { useDeviceData } from '../context/DeviceDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card card-hover">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { 
    deviceData, 
    loading, 
    error, 
    stats, 
    selectedCategory, 
    setSelectedCategory,
    categories 
  } = useDeviceData();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  // Format data for charts
  const formatDataForChart = (data) => {
    return data.map(item => ({
      name: new Date(item.timestamp).toLocaleTimeString(),
      temperature: item.temperature,
      humidity: item.humidity,
      deviceId: item.deviceId,
      category: item.category || 'uncategorized',
      deviceName: item.name || item.deviceId
    })).reverse();
  };
  
  // Filter data based on selected category
  const filteredData = selectedCategory === 'all' 
    ? deviceData 
    : deviceData.filter(item => item.category === selectedCategory);
  
  const chartData = formatDataForChart(filteredData);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1>IoT Device Dashboard</h1>
        <p className="text-gray-500">Real-time monitoring of IoT device data</p>
      </div>
      
      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Devices
          </button>
          
          {categories.map((category) => (
            <button 
              key={category.value}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                selectedCategory === category.value 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Average Temperature" 
          value={`${stats.avgTemp}°C`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard 
          title="Average Humidity" 
          value={`${stats.avgHumidity}%`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Active Devices" 
          value={stats.devices.length} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>}
          color="bg-green-100 text-green-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="mb-4">Temperature Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#f97316" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h2 className="mb-4">Humidity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#2563eb" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
        {/* Device Cards by Category */}
      <div className="mb-8">
        <h2 className="mb-4">Devices by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(stats.devicesByCategory || {}).map(([category, devices]) => {
            // Find the category metadata
            const categoryInfo = categories.find(c => c.value === category) || {
              icon: '📱',
              label: category === 'uncategorized' ? 'Uncategorized' : category
            };
            
            return devices.length > 0 && (
              <div key={category} className="card card-hover">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{categoryInfo.icon}</span>
                  <h3 className="text-lg font-medium">{categoryInfo.label}</h3>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {devices.length} {devices.length === 1 ? 'device' : 'devices'}
                </div>
                <ul className="divide-y">
                  {devices.map((deviceId, index) => {
                    const deviceData = filteredData.find(d => d.deviceId === deviceId);
                    return deviceData && index < 3 ? (
                      <li key={deviceId} className="py-2">
                        <div className="font-medium">{deviceData.name || deviceId}</div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{deviceData.temperature}°C</span>
                          <span>{deviceData.humidity}%</span>
                        </div>
                      </li>
                    ) : null;
                  })}
                  {devices.length > 3 && (
                    <li className="py-2 text-center text-sm text-gray-500">
                      +{devices.length - 3} more devices
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    
      {/* Data Table */}
      <div className="card">
        <h2 className="mb-4">Recent Data Points</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data) => (
                <tr key={data._id || data.timestamp}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.name || data.deviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-1 text-lg">
                        {categories.find(c => c.value === data.category)?.icon || '📱'}
                      </span>
                      <span>
                        {categories.find(c => c.value === data.category)?.label || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.temperature}°C</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.humidity}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(data.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
