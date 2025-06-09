'use client'
import React, { useState } from 'react';
import { Bell, Users, User, Calendar, Building, BarChart3 } from 'lucide-react';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const currentPath = usePathname();
  console.log((currentPath));
  const [activeItem, setActiveItem] = useState(currentPath);

  const menuItems = [
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      id: 'groups',
      label: 'Groups',
      path: '/groups',
      icon: Users,
    },
    {
      id: 'members',
      label: 'Members',
      path: '/members',
      icon: User,
    },
    {
      id: 'activities',
      label: 'Activities Scheduled',
      path: '/activities',
      icon: CelebrationIcon,
    },
    {
      id: 'schedule',
      label: 'Schedule Meetings',
      path: '/schedule-meetings',
      icon: Calendar,
    },
    {
      id: 'organisations',
      label: 'Organisations',
      path: '/organisations',
      icon: Building,
    },
    {
      id: 'progress',
      label: 'Progress',
      path: '/progress',
      icon: BarChart3,
    },
  ];

  // Function to check if a menu item should be active
  const isActiveItem = (itemPath) => {
      return currentPath.startsWith(itemPath) || currentPath === itemPath;
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveItem(item.path);
            
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={() => setActiveItem(item.path)}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-200 text-gray-700 border-l-4 border-gray-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    className={`h-5 w-5 mr-3 ${
                      isActive ? 'text-gray-600' : 'text-gray-500'
                    }`} 
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;