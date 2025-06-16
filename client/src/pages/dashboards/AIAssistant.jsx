import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIAssistant = () => {
  // State for theme selection
  const [currentTheme, setCurrentTheme] = useState('blue'); // blue, purple, green, orange
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  
  // State for messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
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
      // Call backend API
      const response = await axios.post('http://localhost:5000/api/chat/student', {
        message: newMessage
      });
      
      // Add AI response from backend
      const aiMessage = {
        id: messages.length + 2,
        content: response.data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        content: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Theme configuration
  const themes = {
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-700',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234299e1\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    purple: {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-100',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-700',
      border: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-700',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239f7aea\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    green: {
      primary: 'bg-green-600',
      secondary: 'bg-green-100',
      text: 'text-green-600',
      hover: 'hover:bg-green-700',
      border: 'border-green-200',
      gradient: 'from-green-500 to-green-700',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2348bb78\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    },
    orange: {
      primary: 'bg-orange-600',
      secondary: 'bg-orange-100',
      text: 'text-orange-600',
      hover: 'hover:bg-orange-700',
      border: 'border-orange-200',
      gradient: 'from-orange-500 to-orange-700',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ed8936\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    },
  };

  const theme = themes[currentTheme];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with theme background */}
      <div className={`${theme.primary} bg-opacity-95 text-white`} style={{ backgroundImage: theme.pattern }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0v2.8a2.25 2.25 0 01-1.5 2.25m0 0a4.5 4.5 0 01-1.5.25m-4.5-9.5a4.5 4.5 0 001.423-.25m4.5 9.5a4.5 4.5 0 001.423-.25m0-9.5a4.5 4.5 0 00-1.423-.25m0 0a4.5 4.5 0 01-4.5 0m0 0a4.5 4.5 0 00-1.423.25m0 0a4.5 4.5 0 01-4.5 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
              <p className="text-sm text-white text-opacity-80">Your personal academic companion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with two columns */}
      <div className="flex-grow flex overflow-hidden">
        {/* Main chat area */}
        <div className="flex-grow flex flex-col overflow-hidden p-4">
          <div className="flex-grow bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 rounded-lg bg-white shadow-sm border border-gray-200 max-w-md">
                    <div className={`w-16 h-16 mx-auto rounded-full ${theme.secondary} flex items-center justify-center mb-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${theme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Start a Conversation</h3>
                    <p className="text-gray-600">Ask me anything about your studies, homework, or academic concepts you'd like to understand better.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <div className={`w-full h-full ${theme.primary} flex items-center justify-center text-white`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0v2.8a2.25 2.25 0 01-1.5 2.25m0 0a4.5 4.5 0 01-1.5.25m-4.5-9.5a4.5 4.5 0 001.423-.25m4.5 9.5a4.5 4.5 0 001.423-.25m0-9.5a4.5 4.5 0 00-1.423-.25m0 0a4.5 4.5 0 01-4.5 0m0 0a4.5 4.5 0 00-1.423.25m0 0a4.5 4.5 0 01-4.5 0" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="max-w-[75%]">
                        <div 
                          className={`p-4 rounded-2xl shadow-sm ${message.sender === 'user' 
                            ? `${theme.primary} text-white` 
                            : 'bg-white border border-gray-200'}`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0">
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <div className={`w-full h-full ${theme.primary} flex items-center justify-center text-white`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.25m0 0v2.8a2.25 2.25 0 01-1.5 2.25m0 0a4.5 4.5 0 01-1.5.25m-4.5-9.5a4.5 4.5 0 001.423-.25m4.5 9.5a4.5 4.5 0 001.423-.25m0-9.5a4.5 4.5 0 00-1.423-.25m0 0a4.5 4.5 0 01-4.5 0m0 0a4.5 4.5 0 00-1.423.25m0 0a4.5 4.5 0 01-4.5 0" />
                          </svg>
                        </div>
                      </div>
                      <div className="max-w-[75%]">
                        <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-200">
                          <div className="flex space-x-2">
                            <div className={`w-2 h-2 ${theme.primary} rounded-full animate-bounce`}></div>
                            <div className={`w-2 h-2 ${theme.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                            <div className={`w-2 h-2 ${theme.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                    style={{ borderColor: newMessage ? `var(--${currentTheme}-500)` : '', boxShadow: newMessage ? `0 0 0 1px var(--${currentTheme}-500)` : '' }}
                  />
                </div>
                <button
                  type="submit"
                  className={`${theme.primary} text-white p-3 rounded-full ${theme.hover} transition-all duration-200 flex items-center justify-center shadow-md`}
                  disabled={!newMessage.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
              
              {/* Quick suggestions */}
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-500 mb-2">Quick suggestions:</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setNewMessage("Help me understand photosynthesis")} 
                    className={`px-3 py-2 ${theme.secondary} ${theme.text} rounded-full text-sm transition-all duration-200 hover:shadow-md`}
                  >
                    Help me understand photosynthesis
                  </button>
                  <button 
                    onClick={() => setNewMessage("How do I solve quadratic equations?")} 
                    className={`px-3 py-2 ${theme.secondary} ${theme.text} rounded-full text-sm transition-all duration-200 hover:shadow-md`}
                  >
                    How do I solve quadratic equations?
                  </button>
                  <button 
                    onClick={() => setNewMessage("Explain the causes of World War II")} 
                    className={`px-3 py-2 ${theme.secondary} ${theme.text} rounded-full text-sm transition-all duration-200 hover:shadow-md`}
                  >
                    Explain the causes of World War II
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 p-4 hidden lg:block">
          <div className="space-y-4">
            {/* Theme selection card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-3">Choose Theme</h3>
              
              {/* Theme dropdown button */}
              <div className="relative">
                <button 
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  className={`w-full p-2 rounded-md transition-all flex items-center justify-between ${theme.border} border`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${theme.primary} rounded-md mr-2`}></div>
                    <span className="text-sm font-medium">{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isThemeDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                {isThemeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    <button 
                      onClick={() => {
                        setCurrentTheme('blue');
                        setIsThemeDropdownOpen(false);
                      }} 
                      className={`w-full p-2 text-left flex items-center ${currentTheme === 'blue' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded-md mr-2"></div>
                      <span className="text-sm">Blue</span>
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentTheme('purple');
                        setIsThemeDropdownOpen(false);
                      }} 
                      className={`w-full p-2 text-left flex items-center ${currentTheme === 'purple' ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-6 h-6 bg-purple-600 rounded-md mr-2"></div>
                      <span className="text-sm">Purple</span>
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentTheme('green');
                        setIsThemeDropdownOpen(false);
                      }} 
                      className={`w-full p-2 text-left flex items-center ${currentTheme === 'green' ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-6 h-6 bg-green-600 rounded-md mr-2"></div>
                      <span className="text-sm">Green</span>
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentTheme('orange');
                        setIsThemeDropdownOpen(false);
                      }} 
                      className={`w-full p-2 text-left flex items-center ${currentTheme === 'orange' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="w-6 h-6 bg-orange-600 rounded-md mr-2"></div>
                      <span className="text-sm">Orange</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* AI Assistant info card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-3">About AI Assistant</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Your AI Learning Assistant is designed to help with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Homework assistance</li>
                  <li>Concept explanations</li>
                  <li>Study guidance</li>
                  <li>Research help</li>
                  <li>Practice problems</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">This AI is continuously learning to provide better assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        :root {
          --blue-500: #3b82f6;
          --purple-500: #8b5cf6;
          --green-500: #10b981;
          --orange-500: #f97316;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;