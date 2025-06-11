import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { analyticsService } from '../../services/api';

const StudentAnalytics = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('performance'); // 'performance', 'attendance', 'engagement'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for analytics data
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    overallGrade: { grade: 'A-', percentage: 87.6, classRanking: 'Top 15%' },
    attendanceRate: { percentage: 94.2, absences: 3 },
    improvement: { percentage: 12 }
  });
  
  // Get user ID from localStorage (would be set during login)
  const studentId = localStorage.getItem('userId') || '1'; // Default to '1' for testing
  
  // Update activeTab when location.state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Fetch analytics data when component mounts
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch performance data
        const performanceResponse = await analyticsService.getStudentPerformance(studentId);
        if (performanceResponse.success) {
          setPerformanceData(performanceResponse.data || []);
          setProgressData(performanceResponse.progressData || []);
        }
        
        // Fetch attendance data
        const attendanceResponse = await analyticsService.getStudentAttendance(studentId);
        if (attendanceResponse.success) {
          setAttendanceData(attendanceResponse.data || []);
        }
        
        // Fetch engagement data
        const engagementResponse = await analyticsService.getStudentEngagement(studentId);
        if (engagementResponse.success) {
          setEngagementData(engagementResponse.data || []);
        }
        
        // Update summary data if available
        if (performanceResponse.summary) {
          setSummaryData({
            ...summaryData,
            ...performanceResponse.summary
          });
        }
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Using mock data instead.');
        
        // Use mock data as fallback
        setPerformanceData([
          { subject: 'Mathematics', score: 85, average: 72 },
          { subject: 'Science', score: 78, average: 68 },
          { subject: 'English', score: 92, average: 75 },
          { subject: 'History', score: 88, average: 70 },
          { subject: 'Computer Science', score: 95, average: 73 },
        ]);
        
        setAttendanceData([
          { month: 'Jan', attendance: 95 },
          { month: 'Feb', attendance: 98 },
          { month: 'Mar', attendance: 92 },
          { month: 'Apr', attendance: 96 },
          { month: 'May', attendance: 90 },
          { month: 'Jun', attendance: 94 },
        ]);
        
        setEngagementData([
          { name: 'Assignments Completed', value: 85 },
          { name: 'Forum Participation', value: 65 },
          { name: 'Resource Access', value: 90 },
          { name: 'Quiz Attempts', value: 78 },
        ]);
        
        setProgressData([
          { month: 'Jan', score: 72 },
          { month: 'Feb', score: 75 },
          { month: 'Mar', score: 78 },
          { month: 'Apr', score: 82 },
          { month: 'May', score: 85 },
          { month: 'Jun', score: 88 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [studentId]);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#2E86AB" name="Your Score" />
                    <Bar dataKey="average" fill="#A6A6A6" name="Class Average" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#2E86AB" activeDot={{ r: 8 }} name="Average Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'attendance':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#2E86AB" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'engagement':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Engagement Summary</h3>
              <div className="space-y-4">
                {engagementData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Analytics</h1>
      
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
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'performance' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'attendance' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'engagement' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('engagement')}
            >
              Engagement
            </button>
          </div>
          
          {/* Tab content */}
          {renderTabContent()}
          
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold mb-2">Overall Grade</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold">{summaryData.overallGrade.grade}</span>
                <span className="text-gray-500 ml-2">({summaryData.overallGrade.percentage}%)</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{summaryData.overallGrade.classRanking} of your class</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold">{summaryData.attendanceRate.percentage}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{summaryData.attendanceRate.absences} absences this semester</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold mb-2">Improvement</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold">+{summaryData.improvement.percentage}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Since last semester</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAnalytics;