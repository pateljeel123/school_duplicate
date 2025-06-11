import { useState } from 'react';

const HODTeachers = () => {
  // Mock teacher data
  const teachersData = [
    {
      id: 1,
      name: 'Dr. Robert Johnson',
      email: 'robert.j@example.com',
      department: 'Computer Science',
      students: 45,
      courses: 3,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=RJ',
    },
    {
      id: 2,
      name: 'Prof. Amanda Lee',
      email: 'amanda.lee@example.com',
      department: 'Mathematics',
      students: 38,
      courses: 2,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=AL',
    },
    {
      id: 3,
      name: 'Dr. Thomas Wilson',
      email: 'thomas.w@example.com',
      department: 'Physics',
      students: 27,
      courses: 2,
      status: 'Inactive',
      avatar: 'https://via.placeholder.com/40?text=TW',
    },
    {
      id: 4,
      name: 'Prof. Sarah Miller',
      email: 'sarah.m@example.com',
      department: 'English',
      students: 32,
      courses: 3,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=SM',
    },
    {
      id: 5,
      name: 'Dr. James Davis',
      email: 'james.d@example.com',
      department: 'Chemistry',
      students: 29,
      courses: 2,
      status: 'Inactive',
      avatar: 'https://via.placeholder.com/40?text=JD',
    },
    {
      id: 6,
      name: 'Prof. Jennifer Lee',
      email: 'jennifer.l@example.com',
      department: 'Biology',
      students: 35,
      courses: 3,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=JL',
    },
    {
      id: 7,
      name: 'Dr. Michael Brown',
      email: 'michael.b@example.com',
      department: 'Computer Science',
      students: 42,
      courses: 4,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=MB',
    },
    {
      id: 8,
      name: 'Prof. Lisa Anderson',
      email: 'lisa.a@example.com',
      department: 'Mathematics',
      students: 30,
      courses: 2,
      status: 'Active',
      avatar: 'https://via.placeholder.com/40?text=LA',
    },
  ];

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get unique departments for filter
  const departments = ['all', ...new Set(teachersData.map(teacher => teacher.department))];

  // Filter teachers based on search and filters
  const filteredTeachers = teachersData.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter;
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && teacher.status === 'Active') ||
                         (statusFilter === 'inactive' && teacher.status === 'Inactive');
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Page header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Teachers</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Filters and search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {departments.map(department => (
                    <option key={department} value={department}>
                      {department === 'all' ? 'All Departments' : department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Teachers table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={teacher.avatar} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.students}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.courses}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-primary-dark mr-3">View</button>
                        <button className="text-primary hover:text-primary-dark">Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODTeachers;