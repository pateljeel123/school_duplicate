import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { chatService, userService } from '../../services/api';

const TeacherDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for chat messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  
  // State for student data
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    studentPerformance: [],
    studentEngagement: [],
    subjectPerformance: [],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoadingMessages(true);
      setMessagesError(null);
      try {
        const response = await chatService.getChatHistory();
        if (response && response.data) {
          setMessages(response.data);
        } else {
          // Fallback to mock data if API returns empty
          setMessages([
            { id: 1, sender: 'AI Assistant', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 2, sender: 'Teacher', content: 'I need help creating a lesson plan for tomorrow.', timestamp: new Date(Date.now() - 85400000).toISOString() },
            { id: 3, sender: 'AI Assistant', content: 'Sure! What subject and grade level are you teaching?', timestamp: new Date(Date.now() - 84400000).toISOString() },
            { id: 4, sender: 'Teacher', content: 'Science for 8th grade. The topic is photosynthesis.', timestamp: new Date(Date.now() - 83400000).toISOString() },
            { id: 5, sender: 'AI Assistant', content: 'Great! Here\'s a suggested lesson plan for photosynthesis...', timestamp: new Date(Date.now() - 82400000).toISOString() },
          ]);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setMessagesError('Failed to load chat history. Using sample data instead.');
        
        // Fallback to mock data
        setMessages([
          { id: 1, sender: 'AI Assistant', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { id: 2, sender: 'Teacher', content: 'I need help creating a lesson plan for tomorrow.', timestamp: new Date(Date.now() - 85400000).toISOString() },
          { id: 3, sender: 'AI Assistant', content: 'Sure! What subject and grade level are you teaching?', timestamp: new Date(Date.now() - 84400000).toISOString() },
          { id: 4, sender: 'Teacher', content: 'Science for 8th grade. The topic is photosynthesis.', timestamp: new Date(Date.now() - 83400000).toISOString() },
          { id: 5, sender: 'AI Assistant', content: 'Great! Here\'s a suggested lesson plan for photosynthesis...', timestamp: new Date(Date.now() - 82400000).toISOString() },
        ]);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  // Fetch students data when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      setStudentsError(null);
      try {
        // Use getAllStudents method which fetches from the Supabase database
        const response = await userService.getAllStudents();
        if (response && response.studentsData && response.studentsData.length > 0) {
          // Transform the data to match our component's expected format
          const formattedStudents = response.studentsData.map(student => ({
            id: student.id,
            name: student.fullname || 'Unknown',
            email: student.email || 'No email',
            grade: student.std || 'N/A',
            roll_no: student.roll_no || 'N/A',
            gender: student.gender || 'N/A',
            attendance: Math.floor(Math.random() * 20) + 80, // Random between 80-100 for demo
            performance: Math.floor(Math.random() * 30) + 70, // Random between 70-100 for demo
            lastActive: student.created_at || new Date().toISOString(),
            stream: student.stream || 'N/A',
            avatar: student.avatar_url || `https://via.placeholder.com/40?text=${student.fullname?.charAt(0) || ''}`,
            parents_name: student.parents_name || 'N/A',
            parents_num: student.parents_num || 'N/A',
            address: student.address || 'N/A',
            dob: student.dob || 'N/A',
            status: student.status
          }));
          setStudents(formattedStudents);
        } else {
          // Fallback to mock data if API returns empty
          setStudents([
            { id: 1, name: 'John Doe', grade: '8th', attendance: 92, performance: 85, lastActive: '2023-06-15T10:30:00Z' },
            { id: 2, name: 'Jane Smith', grade: '8th', attendance: 88, performance: 92, lastActive: '2023-06-14T09:45:00Z' },
            { id: 3, name: 'Robert Johnson', grade: '8th', attendance: 95, performance: 78, lastActive: '2023-06-15T11:20:00Z' },
            { id: 4, name: 'Emily Davis', grade: '8th', attendance: 90, performance: 88, lastActive: '2023-06-13T14:10:00Z' },
            { id: 5, name: 'Michael Brown', grade: '8th', attendance: 85, performance: 80, lastActive: '2023-06-12T15:30:00Z' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching students data:', err);
        setStudentsError('Failed to load students data. Using sample data instead.');
        
        // Fallback to mock data
        setStudents([
          { id: 1, name: 'John Doe', grade: '8th', attendance: 92, performance: 85, lastActive: '2023-06-15T10:30:00Z' },
          { id: 2, name: 'Jane Smith', grade: '8th', attendance: 88, performance: 92, lastActive: '2023-06-14T09:45:00Z' },
          { id: 3, name: 'Robert Johnson', grade: '8th', attendance: 95, performance: 78, lastActive: '2023-06-15T11:20:00Z' },
          { id: 4, name: 'Emily Davis', grade: '8th', attendance: 90, performance: 88, lastActive: '2023-06-13T14:10:00Z' },
          { id: 5, name: 'Michael Brown', grade: '8th', attendance: 85, performance: 80, lastActive: '2023-06-12T15:30:00Z' },
        ]);
      } finally {
        setLoadingStudents(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  // Fetch analytics data when component mounts
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        // In a real app, you would fetch analytics data from an API
        // const response = await analyticsService.getTeacherAnalytics();
        // setAnalyticsData(response.data);
        
        // Using mock data for now
        // This would be replaced with actual API calls in a production environment
        
        // Prepare student performance data
        const studentPerformanceData = students.map(student => ({
          name: student.name,
          performance: student.performance || Math.floor(Math.random() * 30) + 70, // Random score between 70-100 if not available
        }));
        
        // Prepare student engagement data
        const studentEngagementData = [
          { name: 'High', value: Math.floor(students.length * 0.4) }, // 40% of students
          { name: 'Medium', value: Math.floor(students.length * 0.35) }, // 35% of students
          { name: 'Low', value: Math.floor(students.length * 0.25) }, // 25% of students
        ];
        
        // Prepare subject performance data
        const subjectPerformanceData = [
          { name: 'Science', score: 82 },
          { name: 'Math', score: 78 },
          { name: 'English', score: 85 },
          { name: 'History', score: 80 },
          { name: 'Art', score: 88 },
        ];
        
        setAnalyticsData({
          studentPerformance: studentPerformanceData,
          studentEngagement: studentEngagementData,
          subjectPerformance: subjectPerformanceData,
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setAnalyticsError('Failed to load analytics data. Using sample data instead.');
        
        // Fallback to mock data
        setAnalyticsData({
          studentPerformance: [
            { name: 'John D.', performance: 85 },
            { name: 'Jane S.', performance: 92 },
            { name: 'Robert J.', performance: 78 },
            { name: 'Emily D.', performance: 88 },
            { name: 'Michael B.', performance: 80 },
          ],
          studentEngagement: [
            { name: 'High', value: 2 },
            { name: 'Medium', value: 2 },
            { name: 'Low', value: 1 },
          ],
          subjectPerformance: [
            { name: 'Science', score: 82 },
            { name: 'Math', score: 78 },
            { name: 'English', score: 85 },
            { name: 'History', score: 80 },
            { name: 'Art', score: 88 },
          ],
        });
      } finally {
        setLoadingAnalytics(false);
      }
    };
    
    // Only fetch analytics if we have students data
    if (students.length > 0) {
      fetchAnalyticsData();
    }
  }, [students]);
  
  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageObj = {
      id: messages.length + 1,
      sender: 'Teacher',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Add message to UI immediately
    setMessages([...messages, messageObj]);
    setNewMessage('');
    
    try {
      // Send message to API
      await chatService.sendMessage(newMessage);
      
      // In a real app, you would wait for the AI response
      // For now, simulate an AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: 'AI Assistant',
          content: 'I\'m processing your request. How else can I assist you today?',
          timestamp: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      // Handle error (could show a notification to the user)
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Teacher Dashboard</h1>
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
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'students' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'analytics' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'messages' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            AI Assistant
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Total Students</h3>
                  <p className="mt-2 text-3xl font-bold text-primary">{students.length}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span>Assigned to your classes</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Average Performance</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {students.length > 0 
                      ? Math.round(students.reduce((sum, student) => sum + (student.performance || 0), 0) / students.length) 
                      : 0}%
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span>Based on recent assessments</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Average Attendance</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {students.length > 0 
                      ? Math.round(students.reduce((sum, student) => sum + (student.attendance || 0), 0) / students.length) 
                      : 0}%
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span>Last 30 days</span>
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Performance */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Performance</h3>
                  <div className="h-64">
                    {loadingAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Loading chart data...</p>
                      </div>
                    ) : analyticsError ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-yellow-600">{analyticsError}</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.studentPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="performance" fill="#0088FE" name="Performance Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                
                {/* Student Engagement */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Engagement</h3>
                  <div className="h-64">
                    {loadingAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">Loading chart data...</p>
                      </div>
                    ) : analyticsError ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-yellow-600">{analyticsError}</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.studentEngagement}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analyticsData.studentEngagement.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-700">Recent Student Activity</h3>
                </div>
                
                <div className="overflow-x-auto">
                  {loadingStudents ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Loading student activity...</p>
                    </div>
                  ) : studentsError ? (
                    <div className="p-8 text-center">
                      <p className="text-yellow-600">{studentsError}</p>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No student activity found.</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.slice(0, 5).map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                  {student.name ? student.name.charAt(0) : '?'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</div>
                                  <div className="text-xs text-gray-500">{student.email || 'No email'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.grade || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Roll: {student.roll_no || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.performance || 'N/A'}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.performance || 0}%` }}></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.attendance || 'N/A'}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${student.attendance || 0}%` }}></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(student.lastActive)}</div>
                              <div className="text-xs text-gray-400">{student.stream || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => {
                                  alert(`Student Details:\nName: ${student.name}\nEmail: ${student.email}\nGrade: ${student.grade}\nRoll No: ${student.roll_no}\nGender: ${student.gender}\nStream: ${student.stream}\nPerformance: ${student.performance}%\nAttendance: ${student.attendance}%\nParents: ${student.parents_name}\nContact: ${student.parents_num}\nAddress: ${student.address}\nDOB: ${student.dob}\nStatus: ${student.status || 'Active'}`)
                                }} 
                                className="text-primary hover:text-primary-dark px-3 py-1 border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                              >
                                View Details
                              </button>
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
          
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Search and filters */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                      Add Student
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Students list */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-700">Your Students</h3>
                </div>
                
                <div className="overflow-x-auto">
                  {loadingStudents ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Loading students data...</p>
                    </div>
                  ) : studentsError ? (
                    <div className="p-8 text-center">
                      <p className="text-yellow-600">{studentsError}</p>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No students found.</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                  {student.name ? student.name.charAt(0) : '?'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.grade || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.performance || 'N/A'}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.attendance || 'N/A'}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(student.lastActive)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => {
                                  alert(`Student Details:\nName: ${student.name}\nEmail: ${student.email}\nGrade: ${student.grade}\nRoll No: ${student.roll_no}\nGender: ${student.gender}\nStream: ${student.stream}\nPerformance: ${student.performance}%\nAttendance: ${student.attendance}%\nParents: ${student.parents_name}\nContact: ${student.parents_num}\nAddress: ${student.address}\nDOB: ${student.dob}\nStatus: ${student.status || 'Active'}`)
                                }} 
                                className="text-primary hover:text-primary-dark mr-3 px-3 py-1 border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                              >
                                View Details
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors">Message</button>
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
              {/* Student Performance */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Performance</h3>
                <div className="h-80">
                  {loadingAnalytics ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  ) : analyticsError ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-yellow-600">{analyticsError}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.studentPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="performance" fill="#0088FE" name="Performance Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              
              {/* Subject Performance */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Subject Performance</h3>
                <div className="h-80">
                  {loadingAnalytics ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  ) : analyticsError ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-yellow-600">{analyticsError}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.subjectPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#00C49F" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              
              {/* Student Engagement */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Engagement</h3>
                <div className="h-80">
                  {loadingAnalytics ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  ) : analyticsError ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-yellow-600">{analyticsError}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.studentEngagement}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.studentEngagement.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-700">AI Assistant</h3>
                <p className="text-sm text-gray-500 mt-1">Ask for help with lesson planning, grading, or any teaching task.</p>
              </div>
              
              <div className="flex flex-col h-[600px]">
                {/* Chat messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">Loading chat history...</p>
                    </div>
                  ) : messagesError ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-yellow-600">{messagesError}</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">No messages yet. Start a conversation with the AI Assistant.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'Teacher' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-3/4 rounded-lg p-3 ${message.sender === 'Teacher' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">{formatDate(message.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;