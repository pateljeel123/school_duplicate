import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { chatService, userService } from '../../services/api';

const StudentDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for chat messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  
  // State for student data
  const [studentData, setStudentData] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [studentError, setStudentError] = useState(null);
  
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
            { id: 2, sender: 'Student', content: 'I need help with my math homework.', timestamp: new Date(Date.now() - 85400000).toISOString() },
            { id: 3, sender: 'AI Assistant', content: 'Sure! What specific math topic are you working on?', timestamp: new Date(Date.now() - 84400000).toISOString() },
            { id: 4, sender: 'Student', content: 'Algebra. I\'m struggling with quadratic equations.', timestamp: new Date(Date.now() - 83400000).toISOString() },
            { id: 5, sender: 'AI Assistant', content: 'I can definitely help with quadratic equations. Let\'s start by reviewing the formula...', timestamp: new Date(Date.now() - 82400000).toISOString() },
          ]);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setMessagesError('Failed to load chat history. Using sample data instead.');
        
        // Fallback to mock data
        setMessages([
          { id: 1, sender: 'AI Assistant', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { id: 2, sender: 'Student', content: 'I need help with my math homework.', timestamp: new Date(Date.now() - 85400000).toISOString() },
          { id: 3, sender: 'AI Assistant', content: 'Sure! What specific math topic are you working on?', timestamp: new Date(Date.now() - 84400000).toISOString() },
          { id: 4, sender: 'Student', content: 'Algebra. I\'m struggling with quadratic equations.', timestamp: new Date(Date.now() - 83400000).toISOString() },
          { id: 5, sender: 'AI Assistant', content: 'I can definitely help with quadratic equations. Let\'s start by reviewing the formula...', timestamp: new Date(Date.now() - 82400000).toISOString() },
        ]);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  // Fetch student data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoadingStudent(true);
      setStudentError(null);
      try {
        // In a real app, you would fetch the current student's data
        // This would typically use the logged-in user's ID
        const response = await userService.getCurrentStudent();
        if (response && response.data) {
          setStudentData(response.data);
        } else {
          // Fallback to mock data if API returns empty
          setStudentData({
            id: 1,
            name: 'John Doe',
            grade: '8th',
            attendance: 92,
            performance: 85,
            lastActive: '2023-06-15T10:30:00Z',
            subjects: [
              { name: 'Math', score: 78 },
              { name: 'Science', score: 85 },
              { name: 'English', score: 92 },
              { name: 'History', score: 80 },
              { name: 'Art', score: 95 },
            ],
            recentAssignments: [
              { id: 1, title: 'Math Homework', subject: 'Math', dueDate: '2023-06-20', status: 'Pending' },
              { id: 2, title: 'Science Project', subject: 'Science', dueDate: '2023-06-25', status: 'Completed' },
              { id: 3, title: 'English Essay', subject: 'English', dueDate: '2023-06-18', status: 'Pending' },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setStudentError('Failed to load student data. Using sample data instead.');
        
        // Fallback to mock data
        setStudentData({
          id: 1,
          name: 'John Doe',
          grade: '8th',
          attendance: 92,
          performance: 85,
          lastActive: '2023-06-15T10:30:00Z',
          subjects: [
            { name: 'Math', score: 78 },
            { name: 'Science', score: 85 },
            { name: 'English', score: 92 },
            { name: 'History', score: 80 },
            { name: 'Art', score: 95 },
          ],
          recentAssignments: [
            { id: 1, title: 'Math Homework', subject: 'Math', dueDate: '2023-06-20', status: 'Pending' },
            { id: 2, title: 'Science Project', subject: 'Science', dueDate: '2023-06-25', status: 'Completed' },
            { id: 3, title: 'English Essay', subject: 'English', dueDate: '2023-06-18', status: 'Pending' },
          ],
        });
      } finally {
        setLoadingStudent(false);
      }
    };
    
    fetchStudentData();
  }, []);
  
  // Prepare analytics data when student data is available
  useEffect(() => {
    if (studentData) {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        // In a real app, you might fetch additional analytics data
        // For now, we'll use the student data we already have
        
        // Prepare performance data (last 5 months)
        const performanceData = [
          { name: 'Jan', score: Math.floor(Math.random() * 20) + 70 },
          { name: 'Feb', score: Math.floor(Math.random() * 20) + 70 },
          { name: 'Mar', score: Math.floor(Math.random() * 20) + 70 },
          { name: 'Apr', score: Math.floor(Math.random() * 20) + 70 },
          { name: 'May', score: studentData.performance },
        ];
        
        // Prepare attendance data (last 5 months)
        const attendanceData = [
          { name: 'Jan', rate: Math.floor(Math.random() * 15) + 80 },
          { name: 'Feb', rate: Math.floor(Math.random() * 15) + 80 },
          { name: 'Mar', rate: Math.floor(Math.random() * 15) + 80 },
          { name: 'Apr', rate: Math.floor(Math.random() * 15) + 80 },
          { name: 'May', rate: studentData.attendance },
        ];
        
        setAnalyticsData({
          performance: performanceData,
          attendance: attendanceData,
          subjects: studentData.subjects || [],
        });
      } catch (err) {
        console.error('Error preparing analytics data:', err);
        setAnalyticsError('Failed to prepare analytics data.');
      } finally {
        setLoadingAnalytics(false);
      }
    }
  }, [studentData]);
  
  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageObj = {
      id: messages.length + 1,
      sender: 'Student',
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
        <h1 className="text-2xl font-bold text-primary">Student Dashboard</h1>
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
              {loadingStudent ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">Loading student data...</p>
                </div>
              ) : studentError ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-yellow-600">{studentError}</p>
                </div>
              ) : !studentData ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">No student data available.</p>
                </div>
              ) : (
                <>
                  {/* Student info and summary cards */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                          {studentData.name ? studentData.name.charAt(0) : '?'}
                        </div>
                        <div className="ml-4">
                          <h2 className="text-xl font-semibold text-gray-800">{studentData.name}</h2>
                          <p className="text-gray-600">Grade: {studentData.grade}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Performance</p>
                          <p className="text-xl font-bold text-green-600">{studentData.performance}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Attendance</p>
                          <p className="text-xl font-bold text-blue-600">{studentData.attendance}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject performance */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-700">Subject Performance</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studentData.subjects && studentData.subjects.map((subject, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-800">{subject.name}</h4>
                              <span className={`font-bold ${subject.score >= 90 ? 'text-green-600' : subject.score >= 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                {subject.score}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${subject.score >= 90 ? 'bg-green-600' : subject.score >= 70 ? 'bg-blue-600' : 'bg-yellow-600'}`}
                                style={{ width: `${subject.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent assignments */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-700">Recent Assignments</h3>
                    </div>
                    <div className="overflow-x-auto">
                      {studentData.recentAssignments && studentData.recentAssignments.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {studentData.recentAssignments.map((assignment) => (
                              <tr key={assignment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{assignment.subject}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{assignment.dueDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {assignment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          No recent assignments found.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
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
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.performance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" fill="#0088FE" name="Performance Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Attendance Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.attendance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="rate" fill="#00C49F" name="Attendance Rate" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Subject Performance */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Subject Performance</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.subjects}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="score" fill="#FFBB28" name="Subject Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-700">AI Learning Assistant</h3>
                <p className="text-sm text-gray-500 mt-1">Ask for help with homework, studying, or any learning questions.</p>
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
                        <div key={message.id} className={`flex ${message.sender === 'Student' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-3/4 rounded-lg p-3 ${message.sender === 'Student' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
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

export default StudentDashboard;