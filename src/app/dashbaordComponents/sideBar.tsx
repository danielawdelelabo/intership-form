'use client';

import { BarChart3, FileText, Building2 } from 'lucide-react';

interface SideBarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const SideBar = ({ onNavigate, currentView }: SideBarProps) => {
  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard summary'
    },
    { 
      id: 'applications', 
      label: 'Applications',
      icon: FileText,
      description: 'Manage submissions'
    },
   
  ];

  const isActive = (id: string) => currentView === id;

  return (
    <nav className="w-64 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Internship</h2>
            <p className="text-xs text-gray-500">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}              className={`w-full group flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                isActive(item.id)
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-600">
                  {item.description}
                </div>
              </div>
              {isActive(item.id) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
