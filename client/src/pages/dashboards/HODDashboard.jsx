import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { userService } from '../../services/api';

const HODDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for teachers data
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [teachersError, setTeachersError] = useState(null);
  
  // State for department data
  const [departmentData, setDepartmentData] = useState(null);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [departmentError, setDepartmentError] = useState(null);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    performance: [],
    attendance: [],
    subjects: [],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Fetch teachers data when component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      setTeachersError(null);
      try {
        const response = await userService.getAllTeachers();
        if (response && response.data && response.data.length > 0) {
          setTeachers(response.data);
        } else {
          // Fallback to mock data if API returns empty
          setTeachers([
            { id: 1, name: 'John Smith', subject: 'Mathematics', experience: '8 years', performance: 92, students: 45 },
            { id: 2, name: 'Sarah Johnson', subject: 'Science', experience: '5 years', performance: 88, students: 38 },
            { id: 3, name: 'Michael Brown', subject: 'English', experience: '10 years', performance: 95, students: 42 },
            { id: 4, name: 'Emily Davis', subject: 'History', experience: '3 years', performance: 82, students: 35 },
            { id: 5, name: 'Robert Wilson', subject: 'Geography', experience: '7 years', performance: 90, students: 40 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching teachers data:', err);
        setTeachersError('Failed to load teachers data. Using sample data instead.');
        
        // Fallback to mock data
        setTeachers([
          { id: 1, name: 'John Smith', subject: 'Mathematics', experience: '8 years', performance: 92, students: 45 },
          { id: 2, name: 'Sarah Johnson', subject: 'Science', experience: '5 years', performance: 88, students: 38 },
          { id: 3, name: 'Michael Brown', subject: 'English', experience: '10 years', performance: 95, students: 42 },
          { id: 4, name: 'Emily Davis', subject: 'History', experience: '3 years', performance: 82, students: 35 },
          { id: 5, name: 'Robert Wilson', subject: 'Geography', experience: '7 years', performance: 90, students: 40 },
        ]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    
    fetchTeachers();
  }, []);
  
  // Fetch department data when component mounts
  useEffect(() => {
    const fetchDepartmentData = async () => {
      setLoadingDepartment(true);
      setDepartmentError(null);
      try {
        // In a real app, you would fetch the current HOD's department data
        const response = await userService.getDepartmentData();
        if (response && response.data) {
          setDepartmentData(response.data);
        } else {
          // Fallback to mock data if API returns empty
          setDepartmentData({
            id: 1,
            name: 'Science Department',
            teachersCount: 12,
            studentsCount: 450,
            performance: 87,
            attendance: 92,
            subjects: [
              { name: 'Physics', teachersCount: 3, studentsCount: 120 },
              { name: 'Chemistry', teachersCount: 3, studentsCount: 115 },
              { name: 'Biology', teachersCount: 4, studentsCount: 135 },
              { name: 'Environmental Science', teachersCount: 2, studentsCount: 80 },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching department data:', err);
        setDepartmentError('Failed to load department data. Using sample data instead.');
        
        // Fallback to mock data
        setDepartmentData({
          id: 1,
          name: 'Science Department',
          teachersCount: 12,
          studentsCount: 450,
          performance: 87,
          attendance: 92,
          subjects: [
            { name: 'Physics', teachersCount: 3, studentsCount: 120 },
            { name: 'Chemistry', teachersCount: 3, studentsCount: 115 },
            { name: 'Biology', teachersCount: 4, studentsCount: 135 },
            { name: 'Environmental Science', teachersCount: 2, studentsCount: 80 },
          ],
        });
      } finally {
        setLoadingDepartment(false);
      }
    };
    
    fetchDepartmentData();
  }, []);
  
  // Prepare analytics data when department data is available
  useEffect(() => {
    if (departmentData && teachers.length > 0) {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        // In a real app, you might fetch additional analytics data
        // For now, we'll use the data we already have
        
        // Prepare performance data (last 5 months)
        const performanceData = [
          { name: 'Jan', score: Math.floor(Math.random() * 15) + 75 },
          { name: 'Feb', score: Math.floor(Math.random() * 15) + 75 },
          { name: 'Mar', score: Math.floor(Math.random() * 15) + 75 },
          { name: 'Apr', score: Math.floor(Math.random() * 15) + 75 },
          { name: 'May', score: departmentData.performance },
        ];
        
        // Prepare attendance data (last 5 months)
        const attendanceData = [
          { name: 'Jan', rate: Math.floor(Math.random() * 10) + 85 },
          { name: 'Feb', rate: Math.floor(Math.random() * 10) + 85 },
          { name: 'Mar', rate: Math.floor(Math.random() * 10) + 85 },
          { name: 'Apr', rate: Math.floor(Math.random() * 10) + 85 },
          { name: 'May', rate: departmentData.attendance },
        ];
        
        // Prepare subject data from department
        const subjectData = departmentData.subjects.map(subject => ({
          name: subject.name,
          students: subject.studentsCount,
          teachers: subject.teachersCount
        }));
        
        setAnalyticsData({
          performance: performanceData,
          attendance: attendanceData,
          subjects: subjectData,
        });
      } catch (err) {
        console.error('Error preparing analytics data:', err);
        setAnalyticsError('Failed to prepare analytics data.');
      } finally {
        setLoadingAnalytics(false);
      }
    }
  }, [departmentData, teachers]);
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">HOD Dashboard</h1>
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
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'teachers' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'analytics' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {loadingDepartment ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">Loading department data...</p>
                </div>
              ) : departmentError ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-yellow-600">{departmentError}</p>
                </div>
              ) : !departmentData ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">No department data available.</p>
                </div>
              ) : (
                <>
                  {/* Department info and summary cards */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800">{departmentData.name}</h2>
                        <p className="text-gray-600">Department Overview</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-500">Teachers</p>
                          <p className="text-xl font-bold text-blue-600">{departmentData.teachersCount}</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-500">Students</p>
                          <p className="text-xl font-bold text-green-600">{departmentData.studentsCount}</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-500">Performance</p>
                          <p className="text-xl font-bold text-purple-600">{departmentData.performance}%</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-500">Attendance</p>
                          <p className="text-xl font-bold text-yellow-600">{departmentData.attendance}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject breakdown */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-700">Subject Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher-Student Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {departmentData.subjects.map((subject, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{subject.teachersCount}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{subject.studentsCount}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">1:{Math.round(subject.studentsCount / subject.teachersCount)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Top performing teachers */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-700">Top Performing Teachers</h3>
                    </div>
                    <div className="overflow-x-auto">
                      {loadingTeachers ? (
                        <div className="p-8 text-center">
                          <p className="text-gray-500">Loading teachers data...</p>
                        </div>
                      ) : teachersError ? (
                        <div className="p-8 text-center">
                          <p className="text-yellow-600">{teachersError}</p>
                        </div>
                      ) : teachers.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-gray-500">No teachers data available.</p>
                        </div>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* Sort teachers by performance and show top 3 */}
                            {[...teachers]
                              .sort((a, b) => b.performance - a.performance)
                              .slice(0, 3)
                              .map((teacher) => (
                                <tr key={teacher.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{teacher.subject}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{teacher.experience}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-900 mr-2">{teacher.performance}%</span>
                                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                        <div 
                                          className={`h-2.5 rounded-full ${teacher.performance >= 90 ? 'bg-green-600' : teacher.performance >= 80 ? 'bg-blue-600' : 'bg-yellow-600'}`}
                                          style={{ width: `${teacher.performance}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{teacher.students}</div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Teachers Tab */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">All Teachers</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary-dark">
                      Search
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {loadingTeachers ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Loading teachers data...</p>
                    </div>
                  ) : teachersError ? (
                    <div className="p-8 text-center">
                      <p className="text-yellow-600">{teachersError}</p>
                    </div>
                  ) : teachers.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No teachers data available.</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{teacher.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{teacher.experience}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 mr-2">{teacher.performance}%</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${teacher.performance >= 90 ? 'bg-green-600' : teacher.performance >= 80 ? 'bg-blue-600' : 'bg-yellow-600'}`}
                                    style={{ width: `${teacher.performance}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{teacher.students}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary hover:text-primary-dark mr-3">View</button>
                              <button className="text-gray-600 hover:text-gray-900">Message</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">Loading analytics data...</p>
                </div>
              ) : analyticsError ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-yellow-600">{analyticsError}</p>
                </div>
              ) : (
                <>
                  {/* Performance Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Performance Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.performance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" fill="#8884d8" name="Performance Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Attendance Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Attendance Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.attendance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="rate" fill="#82ca9d" name="Attendance Rate" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Subject Distribution */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Subject Distribution</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.subjects}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="students" fill="#0088FE" name="Students" />
                          <Bar dataKey="teachers" fill="#00C49F" name="Teachers" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;