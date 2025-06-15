import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
const Sidebar = ({ userRole, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Define navigation items based on user role
  const getNavItems = () => {
    // For teacher role, show Lesson Planning and Student Analytics points
    if (userRole === 'teacher') {
      return [
        {
          name: 'Dashboard',
          icon: <HomeIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}`,
        },
        {
          name: 'Lesson Planning',
          icon: <AcademicCapIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/lesson-planning`,
        },
        {
          name: 'Courses',
          icon: <AcademicCapIcon className="w-6 h-6" />,
          path: '/courses',
        },
        {
          name: 'Messages',
          icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/messages`,
        },
        {
          name: 'Student Analytics',
          icon: <ChartBarIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/student-analytics`,
        },
        {
          name: 'AI Assistant',
          icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/ai-assistant`,
        },
        {
          name: 'Performance',
          icon: <ChartBarIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/student-analytics`,
          state: { activeTab: 'performance' }
        },
        {
          name: 'Attendance',
          icon: <UserGroupIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/student-analytics`,
          state: { activeTab: 'attendance' }
        },
        {
          name: 'Engagement',
          icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/student-analytics`,
          state: { activeTab: 'engagement' }
        },
      ];
    }

    // For other roles, show all items as before
    const commonItems = [
      {
        name: 'Dashboard',
        icon: <HomeIcon className="w-6 h-6" />,
        path: `/dashboard/${userRole}`,
      },

    ];

    const roleSpecificItems = {
      student: [
        {
          name: 'Courses',
          icon: <AcademicCapIcon className="w-6 h-6" />,
          path: '/courses',
        },
        {
          name: 'AI Assistant',
          icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
          path: `/dashboard/${userRole}/ai-assistant`,
        },
      ],
      hod: [
        {
          name: 'Teachers',
          icon: <UserGroupIcon className="w-6 h-6" />,
          path: '/dashboard/hod/teachers',
        },
        {
          name: 'Analytics',
          icon: <ChartBarIcon className="w-6 h-6" />,
          path: '/dashboard/hod/analytics',
        },
      ],
      admin: [
        {
          name: 'Users',
          icon: <UserGroupIcon className="w-6 h-6" />,
          path: '/dashboard/admin/users',
        },
        {
          name: 'Analytics',
          icon: <ChartBarIcon className="w-6 h-6" />,
          path: '/dashboard/admin/analytics',
        },
        // {
        //   name: 'Settings',
        //   icon: <Cog6ToothIcon className="w-6 h-6" />,
        //   path: '/dashboard/admin/settings',
        // },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[userRole] || [])];
  };

  const navItems = getNavItems();

  return (
    <div
      className={`bg-white shadow-md h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <Link to="/" className="text-xl font-bold text-primary">
            ScroolPortal
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            className={`w-6 h-6 text-gray-600 transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path &&
              (!item.state?.activeTab ||
                (location.state?.activeTab === item.state?.activeTab));
            return (
              <Link
                key={item.name}
                to={{
                  pathname: item.path,
                  state: item.state
                }}
                className={`flex items-center px-4 py-3 ${isActive ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={onLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2 w-full text-gray-700 hover:bg-gray-100 rounded-md`}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;