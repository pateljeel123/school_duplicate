import { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chatService } from '../../services/api';

const TeacherDashboard = () => {
  // State for chat functionality
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'analytics'
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hello! I\'m your Teacher AI assistant. How can I help you with your teaching today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // State for student data
  const [studentData, setStudentData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);

  // Get teacher ID from localStorage (would be set during login)
  const teacherId = localStorage.getItem('userId') || '1'; // Default to '1' for testing

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await chatService.getChatHistory(teacherId);
        if (response.success && response.data.length > 0) {
          // Format the messages from the API
          const formattedMessages = response.data.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        // Keep the default welcome message if there's an error
      }
    };

    fetchChatHistory();
  }, [teacherId]);

  // Fetch student data when component mounts or tab changes to analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      const fetchStudentData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch student data from API
          const response = await chatService.getStudentInteractions(teacherId);
          
          if (response.success) {
            // Update student data
            setStudentData(response.data.students || []);
            
            // Update chart data
            setChartData(response.data.weeklyActivity || [
              { name: 'Monday', messages: 45 },
              { name: 'Tuesday', messages: 38 },
              { name: 'Wednesday', messages: 52 },
              { name: 'Thursday', messages: 41 },
              { name: 'Friday', messages: 30 },
              { name: 'Saturday', messages: 18 },
              { name: 'Sunday', messages: 25 },
            ]);
            
            // Update summary data
            setTotalStudents(response.data.totalStudents || 0);
            setTotalMessages(response.data.totalMessages || 0);
            setActiveStudents(response.data.activeStudents || 0);
          }
        } catch (err) {
          console.error('Error fetching student data:', err);
          setError('Failed to load student data. Using sample data instead.');
          
          // Fallback to mock data
          setStudentData([
            {
              id: 1,
              name: 'John Smith',
              messages: 24,
              lastActive: '2 hours ago',
              avatar: 'https://via.placeholder.com/40?text=JS',
            },
            {
              id: 2,
              name: 'Emily Johnson',
              messages: 18,
              lastActive: '1 day ago',
              avatar: 'https://via.placeholder.com/40?text=EJ',
            },
            {
              id: 3,
              name: 'Michael Brown',
              messages: 32,
              lastActive: '5 minutes ago',
              avatar: 'https://via.placeholder.com/40?text=MB',
            },
            {
              id: 4,
              name: 'Sarah Davis',
              messages: 15,
              lastActive: '3 hours ago',
              avatar: 'https://via.placeholder.com/40?text=SD',
            },
            {
              id: 5,
              name: 'David Wilson',
              messages: 27,
              lastActive: '30 minutes ago',
              avatar: 'https://via.placeholder.com/40?text=DW',
            },
          ]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchStudentData();
    }
  }, [activeTab, teacherId]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Show AI typing indicator
    setIsTyping(true);
    
    try {
      // Send message to API
      const response = await chatService.sendMessage({
        teacherId,
        message: newMessage
      });
      
      // Add AI response
      const aiMessage = {
        id: messages.length + 2,
        content: response.data?.reply || "I'm sorry, I couldn't process your request at the moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        content: "I'm sorry, there was an error processing your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Teacher Dashboard</h1>
      </div>
      
      {/* Tab navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 font-medium ${activeTab === 'chat' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium ${activeTab === 'analytics' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-primary'}`}
          >
            Student Analytics
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'chat' ? (
            // Chat interface
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Messages area */}
              <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-gray-100 text-[#1E1E1E] rounded-bl-none'}`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="bg-white p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask the Teacher AI assistant..."
                    className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button 
                    type="submit" 
                    className="bg-primary text-white rounded-full p-2 hover:bg-opacity-90 focus:outline-none"
                    disabled={!newMessage.trim()}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // Analytics interface
            <div className="space-y-8">
              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {/* Loading state */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                      <p className="text-3xl font-bold text-primary">{totalStudents || studentData.length}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Messages</h3>
                      <p className="text-3xl font-bold text-primary">
                        {totalMessages || studentData.reduce((sum, student) => sum + student.messages, 0)}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Students Today</h3>
                      <p className="text-3xl font-bold text-primary">{activeStudents || 3}</p>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Message Activity</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="messages" fill="#2E86AB" name="Messages" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Student list */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-700 p-6 border-b">Student Interaction Logs</h3>
                    {studentData.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">No student interaction data available</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {studentData.map((student) => (
                              <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img className="h-10 w-10 rounded-full" src={student.avatar} alt="" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-[#1E1E1E]">{student.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-[#1E1E1E]">{student.messages}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{student.lastActive}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button 
                                    className="text-primary hover:text-primary-dark"
                                    onClick={() => window.location.href = `/student-analytics/${student.id}`}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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

export default TeacherDashboard;