import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DeviceDataProvider } from './context/DeviceDataContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <DeviceDataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DeviceDataProvider>
  );
}

export default App;
