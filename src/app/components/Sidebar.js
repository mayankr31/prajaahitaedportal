// src/components/Sidebar.js
'use client'
import React, { useEffect, useState } from 'react';
import { Bell, Users, User, Calendar, Building, BarChart3 } from 'lucide-react';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Link from 'next/link';
import { usePathname, useParams, redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session} = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const currentPath = usePathname();
  const params = useParams();
  const role = params.role; 

  // Base menu items - same for all roles
  const baseMenuItems = [
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

  // Role-specific menu items with visibility restrictions
  const getRoleSpecificMenuItems = () => {
    const restrictedRoles = ['volunteer', 'expert'];
    const hiddenPanels = ['organisations', 'progress'];
    
    if(role === "student"){
      return baseMenuItems.filter(item => !["members", "organisations", "progress"].includes(item.id));
    }

    // If current role is in restricted roles, filter out hidden panels
    if (restrictedRoles.includes(role)) {
      return baseMenuItems.filter(item => !hiddenPanels.includes(item.id));
    }
    
    // Admin role sees all panels
    return baseMenuItems;
  };

  const menuItems = getRoleSpecificMenuItems();

  // Function to check if a menu item should be active
  const isActiveItem = (itemPath) => {
    // Create the full role-based path
    const fullPath = `/${role}${itemPath}`;
    return currentPath === fullPath;
  };

  // Function to get the full href for a menu item
  const getMenuItemHref = (itemPath) => {
    return `/${role}${itemPath}`;
  };

  if (!role || !session) {
    return null;
  }

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveItem(item.path);
            const href = getMenuItemHref(item.path);
            
            return (
              <li key={item.id}>
                <Link
                  href={href}
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