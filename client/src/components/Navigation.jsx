import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-teal-500 font-mono">iota <span className='text-sm font-light text-black font-sans'>smart IOT dashboard</span></h1>
            </div>
          </div>
          <nav className="flex space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : ''}`
              }
              end
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : ''}`
              }
            >
              Admin Console
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
