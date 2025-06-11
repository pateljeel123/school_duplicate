import { useState, useEffect } from 'react';
import { lessonPlanningService } from '../../services/api';

const LessonPlanning = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [duration, setDuration] = useState('');
  const [showLessonPlan, setShowLessonPlan] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get user ID from localStorage (would be set during login)
  const userId = localStorage.getItem('userId') || '1'; // Default to '1' for testing
  
  // Fetch saved lesson plans when component mounts
  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        setLoading(true);
        const response = await lessonPlanningService.getTeacherLessonPlans(userId);
        setSavedPlans(response.lessonPlans || []);
      } catch (err) {
        console.error('Error fetching saved plans:', err);
        setError('Failed to load saved lesson plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedPlans();
  }, [userId]);
  
  // Mock lesson templates
  const lessonTemplates = [
    {
      id: 1,
      title: 'Introduction to a New Topic',
      description: 'A template for introducing students to a new subject area or concept',
      icon: '🚀',
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 2,
      title: 'Skill Practice Session',
      description: 'A template focused on practicing and reinforcing specific skills',
      icon: '🔄',
      color: 'bg-green-100 border-green-300',
    },
    {
      id: 3,
      title: 'Review and Assessment',
      description: 'A template for reviewing previously learned material and assessment',
      icon: '📝',
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      id: 4,
      title: 'Project-Based Learning',
      description: 'A template for guiding students through project-based activities',
      icon: '🏗️',
      color: 'bg-purple-100 border-purple-300',
    },
    {
      id: 5,
      title: 'Discussion and Debate',
      description: 'A template for facilitating classroom discussions and debates',
      icon: '💬',
      color: 'bg-pink-100 border-pink-300',
    },
    {
      id: 6,
      title: 'Interactive Multimedia',
      description: 'A template incorporating videos, simulations, and interactive content',
      icon: '🎮',
      color: 'bg-indigo-100 border-indigo-300',
    },
  ];

  // Generate a lesson plan based on template, topic and duration
  const generateLessonPlan = () => {
    const template = lessonTemplates.find(t => t.id === selectedCard);
    
    // Different sections based on template type
    let sections = [];
    
    switch(template.id) {
      case 1: // Introduction to a New Topic
        sections = [
          { title: 'Warm-up Activity', duration: '10 minutes', content: 'Begin with an engaging activity to spark interest in the new topic.' },
          { title: 'Introduction to Key Concepts', duration: '15 minutes', content: `Present the main concepts of "${topicName}" using visual aids and examples.` },
          { title: 'Guided Practice', duration: '15 minutes', content: 'Walk students through initial practice with the new concepts.' },
          { title: 'Q&A Session', duration: '5 minutes', content: 'Address student questions about the new material.' },
          { title: 'Homework Assignment', duration: '5 minutes', content: 'Explain the homework that will reinforce today\'s learning.' },
        ];
        break;
      case 2: // Skill Practice Session
        sections = [
          { title: 'Review of Concepts', duration: '10 minutes', content: `Quick review of the key concepts related to "${topicName}".` },
          { title: 'Demonstration', duration: '10 minutes', content: 'Demonstrate the skills with examples.' },
          { title: 'Individual Practice', duration: '15 minutes', content: 'Students practice independently with teacher support.' },
          { title: 'Group Practice', duration: '15 minutes', content: 'Students work in pairs or small groups to practice skills.' },
          { title: 'Assessment', duration: '10 minutes', content: 'Quick assessment to gauge understanding.' },
        ];
        break;
      case 3: // Review and Assessment
        sections = [
          { title: 'Recap of Previous Learning', duration: '15 minutes', content: `Review the key points of "${topicName}" covered previously.` },
          { title: 'Practice Questions', duration: '20 minutes', content: 'Students work through practice questions to reinforce learning.' },
          { title: 'Common Misconceptions', duration: '10 minutes', content: 'Address common errors and misconceptions.' },
          { title: 'Assessment', duration: '15 minutes', content: 'Formal or informal assessment to gauge understanding.' },
        ];
        break;
      case 4: // Project-Based Learning
        sections = [
          { title: 'Project Introduction', duration: '10 minutes', content: `Introduce the project related to "${topicName}" and its objectives.` },
          { title: 'Planning Phase', duration: '15 minutes', content: 'Students plan their approach to the project.' },
          { title: 'Research/Work Time', duration: '25 minutes', content: 'Students work on their projects with teacher guidance.' },
          { title: 'Progress Check', duration: '5 minutes', content: 'Brief check-in on project progress.' },
          { title: 'Next Steps', duration: '5 minutes', content: 'Outline what students should prepare for the next session.' },
        ];
        break;
      case 5: // Discussion and Debate
        sections = [
          { title: 'Topic Introduction', duration: '10 minutes', content: `Introduce the discussion topic "${topicName}" and set ground rules.` },
          { title: 'Preparation Time', duration: '15 minutes', content: 'Students prepare their points and gather evidence.' },
          { title: 'Structured Discussion/Debate', duration: '25 minutes', content: 'Facilitate the discussion or debate.' },
          { title: 'Reflection', duration: '10 minutes', content: 'Students reflect on the discussion and key takeaways.' },
        ];
        break;
      case 6: // Interactive Multimedia
        sections = [
          { title: 'Introduction', duration: '5 minutes', content: `Introduce the topic "${topicName}" and the multimedia resources.` },
          { title: 'Multimedia Presentation', duration: '15 minutes', content: 'Present the interactive content or video.' },
          { title: 'Interactive Activity', duration: '20 minutes', content: 'Students engage with interactive simulations or activities.' },
          { title: 'Discussion', duration: '10 minutes', content: 'Discuss insights and learning from the multimedia content.' },
          { title: 'Application Task', duration: '10 minutes', content: 'Students apply what they learned to a new situation.' },
        ];
        break;
      default:
        sections = [
          { title: 'Introduction', duration: '10 minutes', content: `Introduce the topic "${topicName}".` },
          { title: 'Main Activity', duration: '30 minutes', content: 'Main learning activity.' },
          { title: 'Conclusion', duration: '10 minutes', content: 'Summarize key points and check understanding.' },
        ];
    }
    
    return {
      title: `${template.title}: ${topicName}`,
      duration: `${duration} minutes`,
      sections: sections
    };
  };

  const handleCardClick = (id) => {
    setSelectedCard(id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowLessonPlan(true);
  };
  
  // Save the current lesson plan to the database
  const saveLessonPlan = async () => {
    if (!lessonPlan) return;
    
    try {
      setLoading(true);
      setSaveSuccess(false);
      
      const planToSave = {
        teacherId: userId,
        templateId: selectedCard,
        title: lessonPlan.title,
        topicName,
        duration,
        sections: lessonPlan.sections,
        createdAt: new Date().toISOString()
      };
      
      await lessonPlanningService.saveLessonPlan(planToSave);
      
      // Refresh the saved plans list
      const response = await lessonPlanningService.getTeacherLessonPlans(userId);
      setSavedPlans(response.lessonPlans || []);
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error saving lesson plan:', err);
      setError('Failed to save lesson plan');
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowLessonPlan(false);
    setSelectedCard(null);
    setTopicName('');
    setDuration('');
  };

  const [activeTab, setActiveTab] = useState('templates'); // 'templates' or 'saved'
  
  const lessonPlan = selectedCard ? generateLessonPlan() : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lesson Planning</h1>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Lesson plan saved successfully!
        </div>
      )}
      
      {!showLessonPlan ? (
        <div>
          {/* Tabs for Templates and Saved Plans */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Create New Plan
            </button>
            <button
              onClick={() => savedPlans.length > 0 && setActiveTab('saved')}
              className={`py-2 px-4 font-medium border-b-2 ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              disabled={!savedPlans.length}
            >
              Saved Plans ({savedPlans.length})
            </button>
          </div>
          
          {activeTab === 'templates' ? (
            /* Templates Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`p-6 rounded-lg shadow-md border-2 ${template.color} cursor-pointer transform transition-transform hover:scale-105`}
                  onClick={() => handleCardClick(template.id)}
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Saved Plans Grid */
            <div>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading saved plans...</p>
                </div>
              ) : savedPlans.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No saved plans yet. Create your first lesson plan!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className="p-6 rounded-lg shadow-md border-2 bg-white border-gray-200 cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => {
                        // Load saved plan
                        setSelectedCard(plan.templateId);
                        setTopicName(plan.topicName);
                        setDuration(plan.duration);
                        setShowLessonPlan(true);
                      }}
                    >
                      <div className="text-4xl mb-3">
                        {lessonTemplates.find(t => t.id === plan.templateId)?.icon || '📄'}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                      <p className="text-gray-600">Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{lessonPlan.title}</h2>
            <div className="flex space-x-3">
              <button 
                onClick={saveLessonPlan}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Plan'}
              </button>
              <button 
                onClick={handleBack}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Templates
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="font-medium">Total Duration:</span> {lessonPlan.duration}
          </div>
          
          <div className="space-y-4">
            {lessonPlan.sections.map((section, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">{section.duration}</span>
                </div>
                <p className="text-gray-700">{section.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-semibold mb-2">Teacher Notes</h3>
            <p className="text-gray-700">This lesson plan is a template. Feel free to adjust timing and activities based on your students' needs and classroom dynamics.</p>
          </div>
        </div>
      )}
      
      {/* Modal for topic and duration */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {lessonTemplates.find(t => t.id === selectedCard)?.title}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="topic">
                  Topic Name
                </label>
                <input
                  id="topic"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g., Photosynthesis, World War II"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="duration">
                  Lesson Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 45, 60, 90"
                  min="1"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Create Lesson Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanning;