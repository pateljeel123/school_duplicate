import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const HODAnalytics = () => {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments', 'teachers', 'students'
  
  // Mock department data
  const departmentData = [
    { name: 'Computer Science', students: 120, teachers: 8, courses: 15 },
    { name: 'Mathematics', students: 95, teachers: 6, courses: 12 },
    { name: 'Physics', students: 75, teachers: 5, courses: 10 },
    { name: 'Chemistry', students: 80, teachers: 5, courses: 8 },
    { name: 'Biology', students: 85, teachers: 6, courses: 9 },
    { name: 'English', students: 110, teachers: 7, courses: 11 },
  ];
  
  // Mock teacher performance data
  const teacherPerformanceData = [
    { name: 'Dr. Robert Johnson', rating: 4.8, students: 45, department: 'Computer Science' },
    { name: 'Prof. Amanda Lee', rating: 4.6, students: 38, department: 'Mathematics' },
    { name: 'Dr. Thomas Wilson', rating: 4.2, students: 27, department: 'Physics' },
    { name: 'Prof. Sarah Miller', rating: 4.7, students: 32, department: 'English' },
    { name: 'Dr. James Davis', rating: 4.3, students: 29, department: 'Chemistry' },
  ];
  
  // Mock student enrollment data
  const studentEnrollmentData = [
    { month: 'Jan', enrollment: 520 },
    { month: 'Feb', enrollment: 540 },
    { month: 'Mar', enrollment: 555 },
    { month: 'Apr', enrollment: 570 },
    { month: 'May', enrollment: 585 },
    { month: 'Jun', enrollment: 600 },
  ];
  
  // Mock course popularity data
  const coursePopularityData = [
    { name: 'Introduction to Programming', students: 45 },
    { name: 'Calculus I', students: 38 },
    { name: 'Physics 101', students: 32 },
    { name: 'English Literature', students: 35 },
    { name: 'Organic Chemistry', students: 28 },
  ];
  
  const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#3B5249', '#6B818C'];
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Page header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">HOD Analytics</h1>
      </div>
      
      {/* Tab navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'departments' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Department Analytics
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'teachers' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Teacher Performance
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'students' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Student Metrics
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Departments</h3>
                  <p className="text-3xl font-bold text-primary">{departmentData.length}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {departmentData.reduce((sum, dept) => sum + dept.teachers, 0)}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                  <p className="text-3xl font-bold text-blue-500">
                    {departmentData.reduce((sum, dept) => sum + dept.students, 0)}
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
              
              {/* Department distribution pie chart */}
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
          
          {/* Teachers Tab */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Teacher Rating</h3>
                  <p className="text-3xl font-bold text-primary">
                    {(teacherPerformanceData.reduce((sum, teacher) => sum + teacher.rating, 0) / teacherPerformanceData.length).toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Rated Teacher</h3>
                  <p className="text-3xl font-bold text-green-500">
                    {teacherPerformanceData.reduce((prev, current) => (prev.rating > current.rating) ? prev : current).name.split(' ')[1]}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Students per Teacher</h3>
                  <p className="text-3xl font-bold text-blue-500">
                    {Math.round(teacherPerformanceData.reduce((sum, teacher) => sum + teacher.students, 0) / teacherPerformanceData.length)}
                  </p>
                </div>
              </div>
              
              {/* Teacher ratings chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Ratings</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teacherPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rating" name="Rating (out of 5)" fill="#2E86AB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Teacher workload comparison */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Workload (Students per Teacher)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teacherPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" name="Number of Students" fill="#A23B72" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                  <p className="text-3xl font-bold text-primary">{studentEnrollmentData[studentEnrollmentData.length - 1].enrollment}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Enrollment Growth</h3>
                  <p className="text-3xl font-bold text-green-500">
                    +{studentEnrollmentData[studentEnrollmentData.length - 1].enrollment - studentEnrollmentData[0].enrollment}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Most Popular Course</h3>
                  <p className="text-3xl font-bold text-blue-500">
                    {coursePopularityData.reduce((prev, current) => (prev.students > current.students) ? prev : current).name.split(' ')[0]}
                  </p>
                </div>
              </div>
              
              {/* Student enrollment trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Enrollment Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={studentEnrollmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[500, 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="enrollment" name="Total Students" stroke="#2E86AB" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Course popularity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Popular Courses</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={coursePopularityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" name="Number of Students" fill="#F18F01" />
                    </BarChart>
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

export default HODAnalytics;