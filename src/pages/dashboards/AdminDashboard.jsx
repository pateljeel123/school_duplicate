import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'logs'
  
  // Mock user data
  const userData = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'student', status: 'active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Emily Johnson', email: 'emily.j@example.com', role: 'student', status: 'active', lastLogin: '1 day ago' },
    { id: 3, name: 'Dr. Robert Johnson', email: 'robert.j@example.com', role: 'teacher', status: 'active', lastLogin: '10 minutes ago' },
    { id: 4, name: 'Prof. Amanda Lee', email: 'amanda.lee@example.com', role: 'teacher', status: 'active', lastLogin: '2 hours ago' },
    { id: 5, name: 'Dr. Thomas Wilson', email: 'thomas.w@example.com', role: 'teacher', status: 'inactive', lastLogin: '2 days ago' },
    { id: 6, name: 'Michael Brown', email: 'michael.b@example.com', role: 'student', status: 'active', lastLogin: '5 minutes ago' },
    { id: 7, name: 'Sarah Davis', email: 'sarah.d@example.com', role: 'student', status: 'inactive', lastLogin: '3 days ago' },
    { id: 8, name: 'Prof. James Davis', email: 'james.d@example.com', role: 'hod', status: 'active', lastLogin: '1 hour ago' },
    { id: 9, name: 'Lisa Wilson', email: 'lisa.w@example.com', role: 'hod', status: 'active', lastLogin: '4 hours ago' },
    { id: 10, name: 'David Chen', email: 'david.c@example.com', role: 'admin', status: 'active', lastLogin: '30 minutes ago' },
  ];

  // Mock system logs
  const systemLogs = [
    { id: 1, user: 'John Smith', action: 'Login', timestamp: '2023-06-09 14:32:45', details: 'Successful login from 192.168.1.105' },
    { id: 2, user: 'Dr. Robert Johnson', action: 'Content Update', timestamp: '2023-06-09 13:15:22', details: 'Updated course materials for CS101' },
    { id: 3, user: 'Admin', action: 'User Created', timestamp: '2023-06-09 11:45:10', details: 'Created new user account for Sarah Davis' },
    { id: 4, user: 'Emily Johnson', action: 'Chat Interaction', timestamp: '2023-06-09 10:22:33', details: 'Sent 15 messages to AI assistant' },
    { id: 5, user: 'Prof. Amanda Lee', action: 'Report Generated', timestamp: '2023-06-09 09:17:05', details: 'Generated student performance report' },
    { id: 6, user: 'System', action: 'Backup', timestamp: '2023-06-09 03:00:00', details: 'Automated system backup completed' },
    { id: 7, user: 'Michael Brown', action: 'Login Failed', timestamp: '2023-06-08 22:45:12', details: 'Failed login attempt from 203.0.113.42' },
    { id: 8, user: 'Prof. James Davis', action: 'Role Change', timestamp: '2023-06-08 16:30:45', details: 'Changed user role from teacher to HOD' },
  ];

  // Chart data
  const userRoleData = [
    { name: 'Students', value: userData.filter(user => user.role === 'student').length },
    { name: 'Teachers', value: userData.filter(user => user.role === 'teacher').length },
    { name: 'HODs', value: userData.filter(user => user.role === 'hod').length },
    { name: 'Admins', value: userData.filter(user => user.role === 'admin').length },
  ];

  const activityData = [
    { name: 'Mon', logins: 45, messages: 30 },
    { name: 'Tue', logins: 52, messages: 42 },
    { name: 'Wed', logins: 48, messages: 35 },
    { name: 'Thu', logins: 61, messages: 55 },
    { name: 'Fri', logins: 55, messages: 40 },
    { name: 'Sat', logins: 28, messages: 22 },
    { name: 'Sun', logins: 25, messages: 18 },
  ];

  const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'];

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users based on search, role, and status
  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && user.status === 'active') ||
                         (statusFilter === 'inactive' && user.status === 'inactive');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    // In a real app, this would call an API to update the user's role
    console.log(`Changing user ${userId} role to ${newRole}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
      </div>
      
      {/* Tab navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'users' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'logs' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            System Logs
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-primary">{userData.length}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {userData.filter(user => user.status === 'active').length}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages Today</h3>
                  <p className="text-3xl font-bold text-primary">152</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">System Status</h3>
                  <p className="text-xl font-semibold text-green-500">All Systems Operational</p>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User distribution chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userRoleData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userRoleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Activity chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Activity</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="logins" fill="#2E86AB" name="Logins" />
                        <Bar dataKey="messages" fill="#A23B72" name="Messages" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Management</h3>
                
                {/* Search and filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full lg:w-64"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Role filter */}
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                      <option value="hod">HODs</option>
                      <option value="admin">Admins</option>
                    </select>
                    
                    {/* Status filter */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-md ${statusFilter === 'all' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setStatusFilter('active')}
                        className={`px-4 py-2 rounded-md ${statusFilter === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => setStatusFilter('inactive')}
                        className={`px-4 py-2 rounded-md ${statusFilter === 'inactive' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-dark">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-dark capitalize">{user.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              className="mr-2 px-2 py-1 border rounded text-sm"
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="hod">HOD</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button className="text-primary hover:text-primary-dark mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No users found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* System Logs Tab */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-700">System Logs</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {systemLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{log.user}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-dark">{log.action}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{log.details}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;