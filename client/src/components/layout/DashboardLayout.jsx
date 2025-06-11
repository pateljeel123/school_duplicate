import { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, userRole, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={userRole} onLogout={onLogout} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;