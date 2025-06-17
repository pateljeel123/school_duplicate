import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaStar, FaChalkboardTeacher, FaBook, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // State for text animation
  const [teacherTextIndex, setTeacherTextIndex] = useState(0);
  const [studentTextIndex, setStudentTextIndex] = useState(0);
  
  const teacherTexts = [
    "Plans lessons in seconds",
    "Tells stories like a TED speaker",
    "Uses real-time examples & facts",
    "Generates quizzes instantly",
    "Adapts to every class level"
  ];
  
  const studentTexts = [
    "Solves doubts instantly",
    "Learns at their own pace",
    "Gets smarter with every click",
    "Prepares better for every exam",
    "Never misses a concept"
  ];
  
  // Text animation effect
  useEffect(() => {
    const teacherInterval = setInterval(() => {
      setTeacherTextIndex((prevIndex) => (prevIndex + 1) % teacherTexts.length);
    }, 3000);
    
    const studentInterval = setInterval(() => {
      setStudentTextIndex((prevIndex) => (prevIndex + 1) % studentTexts.length);
    }, 3000);
    
    return () => {
      clearInterval(teacherInterval);
      clearInterval(studentInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-16 bg-gradient-to-br from-primary via-primary/90 to-rich-blue">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{ 
              y: [null, Math.random() * 20 - 10 + '%'],
              opacity: [null, Math.random() * 0.3 + 0.1]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            style={{ width: Math.random() * 6 + 2 + 'px', height: Math.random() * 6 + 2 + 'px' }}
          />
        ))}
      </div>
      
      <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* Left content */}
        <div className="w-full md:w-1/2 text-center md:text-left z-10 mb-10 md:mb-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-1 inline-block rounded-lg bg-gradient-to-r from-bright-green to-accent mb-4"
          >
            <div className="bg-primary/80 rounded-md px-4 py-1">
              <p className="text-white/90 text-sm font-medium">Next-Gen Education Platform</p>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-display mb-4"
          >
            AI powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-bright-green to-accent">learning management system</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/90 font-body mb-6"
          >
            Turn Every Teacher Into a Genius. Every Student Into a Topper.
          </motion.p>
          
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <h3 className="text-white text-base font-medium mb-2 flex items-center">
                  <FaChalkboardTeacher className="text-bright-green mr-2" /> For Teachers:
                </h3>
                <div className="h-12 flex items-center bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={teacherTextIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-white/90 text-sm font-medium"
                    >
                      {teacherTexts[teacherTextIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="w-1/2">
                <h3 className="text-white text-base font-medium mb-2 flex items-center">
                  <FaUserGraduate className="text-accent mr-2" /> For Students:
                </h3>
                <div className="h-12 flex items-center bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={studentTextIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-white/90 text-sm font-medium"
                    >
                      {studentTexts[studentTextIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <button 
              className="bg-gradient-to-r from-bright-green to-bright-green/80 text-white py-3 px-8 rounded-md hover:shadow-lg hover:shadow-bright-green/20 transition-all duration-300 flex items-center justify-center font-medium group"
              onClick={() => navigate('/courses')}
            >
              Explore Courses <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button 
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-8 rounded-md hover:bg-white/15 transition-all duration-300 font-medium"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </motion.div>
        </div>
        
        {/* Right content - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full md:w-1/2 flex justify-center items-center z-10"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-bright-green to-accent rounded-xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-primary/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group">
                  <div className="bg-gradient-to-br from-bright-green to-bright-green/70 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Learn</h3>
                    <p className="text-white/70 text-sm">At your pace</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group">
                  <div className="bg-gradient-to-br from-accent to-accent/70 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaBook className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Study</h3>
                    <p className="text-white/70 text-sm">Smart content</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group">
                  <div className="bg-gradient-to-br from-bright-green to-bright-green/70 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaChalkboardTeacher className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Teach</h3>
                    <p className="text-white/70 text-sm">Share knowledge</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group">
                  <div className="bg-gradient-to-br from-accent to-accent/70 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaUserGraduate className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Grow</h3>
                    <p className="text-white/70 text-sm">Build skills</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg text-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-white/80 text-sm">Join <span className="text-bright-green font-medium">10,000+</span> students already learning</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary to-transparent"></div>
    </section>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setRole(localStorage.getItem('role') || '');
    }
  }, []);
  
  const handleGetStarted = () => {
    if (user) {
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/courses');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-body">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
            Our <span className="text-bright-green">Impact</span> in Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="bg-bright-green/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaUserGraduate className="text-bright-green text-xl" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">10K+</h3>
              <p className="text-gray-600 text-sm">Students</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="bg-bright-green/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaChalkboardTeacher className="text-bright-green text-xl" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">500+</h3>
              <p className="text-gray-600 text-sm">Teachers</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="bg-bright-green/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-bright-green text-xl" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">1,200+</h3>
              <p className="text-gray-600 text-sm">Courses</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="bg-bright-green/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-bright-green text-xl" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">98%</h3>
              <p className="text-gray-600 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Why Choose <span className="text-bright-green">EduNex</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A minimalist approach to education with powerful features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-bright-green">
              <div className="flex items-start mb-4">
                <div className="bg-bright-green/10 p-3 rounded-md mr-4">
                  <FaUserGraduate className="text-bright-green text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">Personalized Learning</h3>
                  <p className="text-gray-600 text-sm">Adaptive curriculum that adjusts to each student's unique learning style and pace.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-bright-green">
              <div className="flex items-start mb-4">
                <div className="bg-bright-green/10 p-3 rounded-md mr-4">
                  <FaChalkboardTeacher className="text-bright-green text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">Expert Educators</h3>
                  <p className="text-gray-600 text-sm">Learn from industry professionals and experienced teachers with proven track records.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-bright-green">
              <div className="flex items-start mb-4">
                <div className="bg-bright-green/10 p-3 rounded-md mr-4">
                  <FaBook className="text-bright-green text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">Modern Curriculum</h3>
                  <p className="text-gray-600 text-sm">Up-to-date course materials designed for today's digital world and future careers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Teachers Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Our <span className="text-bright-green">Expert</span> Teachers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Meet the educators who will guide your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-primary">Sarah Johnson</h3>
                <p className="text-bright-green text-sm mb-2">Mathematics</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span className="mr-2">8+ Years</span>
                  <span className="flex items-center"><FaStar className="text-yellow-500 mr-1" /> 4.9</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="David Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-primary">David Chen</h3>
                <p className="text-bright-green text-sm mb-2">Computer Science</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span className="mr-2">10+ Years</span>
                  <span className="flex items-center"><FaStar className="text-yellow-500 mr-1" /> 4.8</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="Maria Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-primary">Maria Rodriguez</h3>
                <p className="text-bright-green text-sm mb-2">Literature</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span className="mr-2">12+ Years</span>
                  <span className="flex items-center"><FaStar className="text-yellow-500 mr-1" /> 4.9</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="James Wilson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-primary">James Wilson</h3>
                <p className="text-bright-green text-sm mb-2">Physics</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span className="mr-2">9+ Years</span>
                  <span className="flex items-center"><FaStar className="text-yellow-500 mr-1" /> 4.7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="px-6 py-2 bg-white text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300 text-sm font-medium">
              View All Teachers
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Student <span className="text-bright-green">Testimonials</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">What our community has to say about their learning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex text-yellow-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-600 text-sm mb-6">"The personalized learning approach has transformed my academic performance. I'm more engaged and confident than ever before."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-bold">AK</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary text-sm">Aisha Khan</h4>
                  <p className="text-gray-500 text-xs">Student</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex text-yellow-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-600 text-sm mb-6">"As a parent, I've seen remarkable improvement in my son's grades and interest in learning. The teachers are exceptional and truly care."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-bold">JM</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary text-sm">John Miller</h4>
                  <p className="text-gray-500 text-xs">Parent</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex text-yellow-500 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="text-gray-300" />
              </div>
              <p className="text-gray-600 text-sm mb-6">"The interactive lessons and real-world applications have made teaching more effective. Students are more engaged and show better results."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <span className="font-bold">LP</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary text-sm">Lisa Patel</h4>
                  <p className="text-gray-500 text-xs">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">Start Your <span className="text-bright-green">Learning Journey</span> Today</h2>
              <p className="text-gray-600 mb-6 max-w-lg">Join our community of learners and discover a world of knowledge with personalized education tailored to your needs.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleGetStarted}
                  className="px-6 py-2 bg-bright-green text-white rounded-md hover:bg-bright-green/90 transition-colors duration-300 text-sm font-medium"
                >
                  Get Started
                </button>
                <button className="px-6 py-2 bg-white text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors duration-300 font-medium">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block md:w-1/3 bg-gradient-to-br from-primary/10 to-bright-green/10 h-full p-12">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm mb-4">
                    <FaGraduationCap className="text-3xl text-bright-green" />
                  </div>
                  <p className="text-primary font-medium">Education for Everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
