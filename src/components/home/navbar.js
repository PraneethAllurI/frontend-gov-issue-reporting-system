import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeAccessToken, removeRole } from '../../utils/authUtils';
import IssueReportForm from './issueReportForm'; // Your report form component
import ShowReports from './showReports' // Component to show all reports

const Navbar = ({ username }) => {
  const [selectedSection, setSelectedSection] = useState('report'); // Default section is 'report'
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary logout logic here
    console.log('Logging out...');
    removeAccessToken();
    removeRole();
    navigate('/login');
  };

  return (
    <div>
      {/* Main Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link to="/dashboard">
            <h2 className="text-xl font-semibold">Govt-issue-tracking</h2>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-grow max-w-lg mx-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Section - Username & Logout */}
        <div className="flex items-center space-x-4">
          <p className="text-sm">Welcome, <span className="font-semibold">{username}</span></p>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Subnavbar for "Report an Issue" and "Show Reports" */}
      <nav className="bg-gray-300 p-4">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${selectedSection === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedSection('report')}
          >
            Report an Issue
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedSection === 'showReports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedSection('showReports')}
          >
            Show Reports
          </button>
        </div>
      </nav>

      {/* Conditional rendering of components based on selected section */}
      <div className="p-6">
        {selectedSection === 'report' && <IssueReportForm />}
        {selectedSection === 'showReports' && <ShowReports />}
      </div>
    </div>
  );
};

export default Navbar;
