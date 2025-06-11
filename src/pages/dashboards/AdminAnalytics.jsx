import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FaUsers, FaUserGraduate, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'departments'
  
  // Mock data for user statistics
  const userStats = {
    total: 1250,
    students: 950,
    teachers: 180,
    hods: 20,
    admins: 10,
    activeUsers: 1100,
    inactiveUsers: 150,
    newUsersThisMonth: 75
  };
  
  // Mock data for user roles distribution
  const userRolesData = [
    { name: 'Students', value: userStats.students, color: '#2E86AB' },
    { name: 'Teachers', value: userStats.teachers, color: '#A23B72' },
    { name: 'HODs', value: userStats.hods, color: '#F18F01' },
    { name: 'Admins', value: userStats.admins, color: '#C73E1D' },
  ];
  
  // Mock data for user growth over time
  const userGrowthData = [
    { month: 'Jan', users: 980 },
    { month: 'Feb', users: 1020 },
    { month: 'Mar', users: 1080 },
    { month: 'Apr', users: 1120 },
    { month: 'May', users: 1180 },
    { month: 'Jun', users: 1250 },
  ];
  
  // Mock data for department statistics
  const departmentData = [
    { name: 'Computer Science', students: 220, teachers: 35, courses: 25 },
    { name: 'Mathematics', students: 180, teachers: 28, courses: 20 },
    { name: 'Physics', students: 150, teachers: 22, courses: 18 },
    { name: 'Chemistry', students: 140, teachers: 20, courses: 15 },
    { name: 'Biology', students: 130, teachers: 18, courses: 14 },
    { name: 'English', students: 120, teachers: 15, courses: 12 },
    { name: 'History', students: 110, teachers: 12, courses: 10 },
  ];
  
  // Mock data for system activity
  const systemActivityData = [
    { hour: '00:00', logins: 15 },
    { hour: '04:00', logins: 5 },
    { hour: '08:00', logins: 80 },
    { hour: '12:00', logins: 120 },
    { hour: '16:00', logins: 90 },
    { hour: '20:00', logins: 40 },
  ];
  
  // Mock data for system performance
  const systemPerformanceData = [
    { name: 'Response Time', value: 250, unit: 'ms' },
    { name: 'Uptime', value: 99.98, unit: '%' },
    { name: 'Error Rate', value: 0.02, unit: '%' },
    { name: 'API Calls/min', value: 1250, unit: '' },
  ];
  
  const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#3B5249', '#6B818C'];
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Page header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Admin Analytics</h1>
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
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'users' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            User Analytics
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'departments' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Department Analytics
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <FaUsers className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <p className="text-3xl font-bold text-primary">{userStats.total}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FaUserGraduate className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Students</h3>
                    <p className="text-3xl font-bold text-green-500">{userStats.students}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <FaChalkboardTeacher className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Teachers</h3>
                    <p className="text-3xl font-bold text-purple-500">{userStats.teachers}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <FaUserTie className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">HODs</h3>
                    <p className="text-3xl font-bold text-yellow-500">{userStats.hods}</p>
                  </div>
                </div>
              </div>
              
              {/* System performance metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">System Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {systemPerformanceData.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="text-sm text-gray-500">{metric.name}</h4>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {metric.value}{metric.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* System activity chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">System Activity (Logins by Hour)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={systemActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="logins" name="User Logins" fill="#2E86AB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* User growth trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Growth Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[900, 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="Total Users" stroke="#A23B72" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User statistics cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-primary">{userStats.total}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
                  <p className="text-3xl font-bold text-green-500">{userStats.activeUsers}</p>
                  <p className="text-sm text-gray-500 mt-1">{Math.round((userStats.activeUsers / userStats.total) * 100)}% of total</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Inactive Users</h3>
                  <p className="text-3xl font-bold text-red-500">{userStats.inactiveUsers}</p>
                  <p className="text-sm text-gray-500 mt-1">{Math.round((userStats.inactiveUsers / userStats.total) * 100)}% of total</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">New This Month</h3>
                  <p className="text-3xl font-bold text-blue-500">{userStats.newUsersThisMonth}</p>
                  <p className="text-sm text-gray-500 mt-1">+{Math.round((userStats.newUsersThisMonth / userStats.total) * 100)}% growth</p>
                </div>
              </div>
              
              {/* User roles distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Roles Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRolesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRolesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* User growth trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Growth Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[900, 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="Total Users" stroke="#A23B72" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              {/* Department summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Departments</h3>
                  <p className="text-3xl font-bold text-primary">{departmentData.length}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Courses</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {departmentData.reduce((sum, dept) => sum + dept.courses, 0)}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg. Students per Dept</h3>
                  <p className="text-3xl font-bold text-blue-500">
                    {Math.round(departmentData.reduce((sum, dept) => sum + dept.students, 0) / departmentData.length)}
                  </p>
                </div>
              </div>
              
              {/* Department comparison chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" name="Students" fill="#2E86AB" />
                      <Bar dataKey="teachers" name="Teachers" fill="#A23B72" />
                      <Bar dataKey="courses" name="Courses" fill="#F18F01" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Department student distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Distribution by Department</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="students"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;