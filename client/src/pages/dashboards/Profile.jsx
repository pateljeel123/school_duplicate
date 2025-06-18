import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { userService, authService } from '../../services/api';
import { getAuthSession, updateUserProfile } from '../../services/supabaseModel';
import {
  UserCircleIcon,
  AcademicCapIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabaseClient';
import defaultUserImage from '../../assets/user.jpg';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [identityData, setIdentityData] = useState(null);
  
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role || '';
  const userId = currentUser?.id || '';

  // Get additional user data from Supabase session
  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user?.identities?.[0]?.identity_data) {
        setIdentityData(res.data.session.user.identities[0].identity_data);
      }
    });
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get user data from Supabase auth session
        const { session, userData, error: sessionError } = await getAuthSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        // If we have userData from the database, use it
        if (userData) {
          setUserData(userData);
          setFormData(userData);
        } else {
          // Otherwise, use data from session and localStorage
          const currentUser = authService.getCurrentUser();
          
          // Create profile data from current session with correct field names based on database schema
          const baseProfileData = {
            id: currentUser?.id || session?.user?.id || '',
            fullname: currentUser?.name || session?.user?.user_metadata?.full_name || 'User',
            email: currentUser?.email || session?.user?.email || 'user@example.com',
            role: currentUser?.role || userRole,
            // Default values for other fields
            phonenumber: '',
            address: '',
            gender: ''
          };
          
          // Add role-specific fields based on database schema
          let profileData = { ...baseProfileData };
          
          if (userRole === 'teacher') {
            profileData = {
              ...profileData,
              subject_expertise: '',
              highest_qualification: '',
              experience: '',
              teaching_level: '',
              bio: ''
            };
          } else if (userRole === 'student') {
            profileData = {
              ...profileData,
              std: '',
              roll_no: '',
              dob: '',
              parents_name: '',
              parents_num: '',
              previous_school: '',
              stream: ''
            };
          } else if (userRole === 'hod') {
            profileData = {
              ...profileData,
              department_expertise: '',
              highest_qualification: '',
              experience: '',
              vision_department: ''
            };
          } else if (userRole === 'admin') {
            profileData = {
              ...profileData,
              admin_access_level: ''
            };
          }
          
          setUserData(profileData);
          setFormData(profileData);
        }
      } catch (err) {
        console.error('Error getting user data:', err);
        setError('There was a problem loading profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      
      // Update user data using supabaseModel
      const { data, error } = await updateUserProfile(userRole, userId, formData);
      
      if (error) {
        throw error;
      }
      
      response = { data, message: 'Profile updated successfully' };
      
      // As a fallback, also update using userService
      try {
        switch(userRole) {
          case 'teacher':
            await userService.updateTeacher(userId, formData);
            break;
          case 'student':
            await userService.updateStudent(userId, formData);
            break;
          case 'hod':
            await userService.updateHod(userId, formData);
            break;
          case 'admin':
            // For admin, no additional update needed
            break;
          default:
            console.log('Invalid user role');
        }
      } catch (serviceError) {
        console.error('Error updating with userService:', serviceError);
        // Continue with the flow as we already updated with supabaseModel
      }
      
      // Update localStorage with new user data
      if (formData.name) {
        localStorage.setItem('userName', formData.name);
      }
      if (formData.email) {
        localStorage.setItem('userEmail', formData.email);
      }
      
      setUserData(formData);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('There was a problem updating the profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData(userData || {});
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-black">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="bg-white p-2 rounded-full mb-4 sm:mb-0 sm:mr-6">
              {identityData?.avatar_url ? (
                <img 
                  src={userData.avatar_url} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full object-cover" 
                />
              ) : (
                <img 
                  src={defaultUserImage} 
                  alt="Default Profile" 
                  className="h-24 w-24 rounded-full object-cover" 
                />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{userData?.fullname || 'User'}</h1>
              <p className="text-blue-100 mt-1 capitalize">{userData?.role || userRole}</p>
              {userData?.department && (
                <p className="text-blue-100 mt-1">{userData.department}</p>
              )}
            </div>
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="mt-4 sm:mt-0 sm:ml-auto px-4 py-2 bg-white text-blue-600 rounded-md flex items-center hover:bg-blue-50 transition-colors"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        {editMode ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phonenumber"
                    value={formData.phonenumber || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                {/* Role-specific fields */}
                {userRole === 'teacher' && (
                  <>
                    <div>
                      <label htmlFor="subject_expertise" className="block text-sm font-medium text-gray-700">Subject Expertise</label>
                      <input
                        type="text"
                        id="subject_expertise"
                        name="subject_expertise"
                        value={formData.subject_expertise || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="highest_qualification" className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                      <input
                        type="text"
                        id="highest_qualification"
                        name="highest_qualification"
                        value={formData.highest_qualification || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="teaching_level" className="block text-sm font-medium text-gray-700">Teaching Level</label>
                      <input
                        type="text"
                        id="teaching_level"
                        name="teaching_level"
                        value={formData.teaching_level || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </>
                )}
                
                {userRole === 'student' && (
                  <>
                    <div>
                      <label htmlFor="std" className="block text-sm font-medium text-gray-700">Class/Standard</label>
                      <input
                        type="text"
                        id="std"
                        name="std"
                        value={formData.std || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700">Roll Number</label>
                      <input
                        type="text"
                        id="roll_no"
                        name="roll_no"
                        value={formData.roll_no || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="parents_name" className="block text-sm font-medium text-gray-700">Parent's Name</label>
                      <input
                        type="text"
                        id="parents_name"
                        name="parents_name"
                        value={formData.parents_name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="parents_num" className="block text-sm font-medium text-gray-700">Parent's Phone Number</label>
                      <input
                        type="tel"
                        id="parents_num"
                        name="parents_num"
                        value={formData.parents_num || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="previous_school" className="block text-sm font-medium text-gray-700">Previous School</label>
                      <input
                        type="text"
                        id="previous_school"
                        name="previous_school"
                        value={formData.previous_school || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="stream" className="block text-sm font-medium text-gray-700">Stream</label>
                      <input
                        type="text"
                        id="stream"
                        name="stream"
                        value={formData.stream || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}
                
                {userRole === 'hod' && (
                  <>
                    <div>
                      <label htmlFor="department_expertise" className="block text-sm font-medium text-gray-700">Department Expertise</label>
                      <input
                        type="text"
                        id="department_expertise"
                        name="department_expertise"
                        value={formData.department_expertise || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="highest_qualification" className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                      <input
                        type="text"
                        id="highest_qualification"
                        name="highest_qualification"
                        value={formData.highest_qualification || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="vision_department" className="block text-sm font-medium text-gray-700">Vision for Department</label>
                      <textarea
                        id="vision_department"
                        name="vision_department"
                        value={formData.vision_department || ''}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <div>
                      <label htmlFor="admin_access_level" className="block text-sm font-medium text-gray-700">Admin Access Level</label>
                      <select
                        id="admin_access_level"
                        name="admin_access_level"
                        value={formData.admin_access_level || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Access Level</option>
                        <option value="full">Full Access</option>
                        <option value="limited">Limited Access</option>
                        <option value="read_only">Read Only</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                disabled={saving}
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                {identityData && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="text-md font-semibold text-blue-800 mb-2">Identity Provider Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {userData.fullname && (
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-800 font-medium">{userData.fullname}</p>
                        </div>
                      )}
                      {userData.email && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-800 font-medium">{userData.email}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Profile Picture</p>
                        {userData.picture ? (
                          <img 
                            src={userData.picture} 
                            alt="Profile" 
                            className="h-16 w-16 rounded-full mt-1 border-2 border-blue-200 object-cover" 
                          />
                        ) : (
                          <img 
                            src={defaultUserImage} 
                            alt="Default Profile" 
                            className="h-16 w-16 rounded-full mt-1 border-2 border-blue-200 object-cover" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                
                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium">{userData?.phonenumber || 'Not Available'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-800 font-medium">{userData?.address || 'Not Available'}</p>
                  </div>
                </div>
                
                {/* Role-specific information */}
                {userRole === 'teacher' && (
                  <>
                    <div className="flex items-start">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Subject Expertise</p>
                        <p className="text-gray-800 font-medium">{userData?.subject_expertise || 'Not Available'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Qualification</p>
                        <p className="text-gray-800 font-medium">{userData?.qualification || 'Not Available'}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {userRole === 'student' && (
                  <>
                    <div className="flex items-start">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="text-gray-800 font-medium">{userData?.std || 'Not Available'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <IdentificationIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Roll Number</p>
                        <p className="text-gray-800 font-medium">{userData?.roll_no || 'Not Available'}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {userRole === 'hod' && (
                  <div className="flex items-start">
                    <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                        <p className="text-gray-800 font-medium">{userData?.department || 'Not Available'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;