import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const HODDashboard = () => {
  // Mock teacher data
  const teacherData = [
    {
      id: 1,
      name: 'Dr. Robert Johnson',
      department: 'Computer Science',
      students: 45,
      activeStatus: 'Active',
      lastActive: '10 minutes ago',
      avatar: 'https://via.placeholder.com/40?text=RJ',
    },
    {
      id: 2,
      name: 'Prof. Amanda Lee',
      department: 'Mathematics',
      students: 38,
      activeStatus: 'Active',
      lastActive: '2 hours ago',
      avatar: 'https://via.placeholder.com/40?text=AL',
    },
    {
      id: 3,
      name: 'Dr. Thomas Wilson',
      department: 'Physics',
      students: 27,
      activeStatus: 'Inactive',
      lastActive: '2 days ago',
      avatar: 'https://via.placeholder.com/40?text=TW',
    },
    {
      id: 4,
      name: 'Prof. Sarah Miller',
      department: 'English',
      students: 32,
      activeStatus: 'Active',
      lastActive: '1 hour ago',
      avatar: 'https://via.placeholder.com/40?text=SM',
    },
    {
      id: 5,
      name: 'Dr. James Davis',
      department: 'Chemistry',
      students: 29,
      activeStatus: 'Inactive',
      lastActive: '3 days ago',
      avatar: 'https://via.placeholder.com/40?text=JD',
    },
  ];

  // Mock chart data
  const departmentData = [
    { name: 'Computer Science', value: 45 },
    { name: 'Mathematics', value: 38 },
    { name: 'Physics', value: 27 },
    { name: 'English', value: 32 },
    { name: 'Chemistry', value: 29 },
  ];

  const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#3B5249'];

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Filter teachers based on search and status
  const filteredTeachers = teacherData.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && teacher.activeStatus === 'Active') ||
                         (statusFilter === 'inactive' && teacher.activeStatus === 'Inactive');
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">HOD Dashboard</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
              <p className="text-3xl font-bold text-primary">{teacherData.length}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Teachers</h3>
              <p className="text-3xl font-bold text-green-500">
                {teacherData.filter(teacher => teacher.activeStatus === 'Active').length}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-primary">
                {teacherData.reduce((sum, teacher) => sum + teacher.students, 0)}
              </p>
            </div>
          </div>
          
          {/* Department distribution chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
            
            {/* Quick stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Overview</h3>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-gray-700">{dept.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">{dept.value} students</span>
                      <span className="text-gray-500">
                        {teacherData.filter(t => t.department === dept.name).length} teachers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Teacher list */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher List</h3>
              
              {/* Search and filter */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
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
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={teacher.avatar} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-dark">{teacher.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-dark">{teacher.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-dark">{teacher.students}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.activeStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {teacher.activeStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-3">View Details</button>
                          <button className="text-gray-600 hover:text-dark">Message</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No teachers found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;