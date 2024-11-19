import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, UserCircle, LayoutDashboard, BookOpen, Users, BarChart, Settings, LogOut, Brain, MessageSquare, GraduationCap, Trophy } from 'lucide-react';
import AIChat from './AIChat';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Brain className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EduQuery</h1>
              </div>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">Teacher</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg w-64 border border-gray-200 focus-within:border-blue-500 transition-colors">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none focus:outline-none flex-1 placeholder-gray-400"
              />
            </div>
            
            <button 
              onClick={() => setShowAIChat(!showAIChat)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Brain size={20} />
              <span className="hidden md:inline">AI Assistant</span>
            </button>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block font-medium">Sarah Wilson</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 mt-16 h-full bg-white shadow-sm transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <nav className="p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={24} />} label="Dashboard" active />
          <SidebarItem icon={<BookOpen size={24} />} label="Content" />
          <SidebarItem icon={<Users size={24} />} label="Students" />
          <SidebarItem icon={<MessageSquare size={24} />} label="Discussions" />
          <SidebarItem icon={<GraduationCap size={24} />} label="Courses" />
          <SidebarItem icon={<BarChart size={24} />} label="Analytics" />
          <div className="border-t my-4"></div>
          <SidebarItem icon={<Settings size={24} />} label="Settings" />
          <SidebarItem icon={<LogOut size={24} />} label="Logout" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Sarah!</h2>
            <p className="text-gray-600">Here's what's happening with your classes today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Students', value: '248', icon: <Users className="text-blue-600" /> },
              { label: 'Active Courses', value: '12', icon: <BookOpen className="text-green-600" /> },
              { label: 'Assignments', value: '36', icon: <MessageSquare className="text-purple-600" /> },
              { label: 'Class Average', value: '85%', icon: <Trophy className="text-yellow-600" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                  <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +12%
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mt-4">{stat.label}</h3>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-blue-600 text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: 'New assignment submission',
                    desc: 'John Doe submitted Math Assignment #3',
                    time: '2h ago',
                    icon: <UserCircle className="text-blue-600" />
                  },
                  {
                    title: 'Course milestone reached',
                    desc: 'Physics 101 completion rate at 75%',
                    time: '3h ago',
                    icon: <Trophy className="text-yellow-600" />
                  },
                  {
                    title: 'New discussion thread',
                    desc: 'Emma started a discussion on Chemistry',
                    time: '5h ago',
                    icon: <MessageSquare className="text-purple-600" />
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Create New Quiz', desc: 'Generate AI-powered questions' },
                  { label: 'Add Assignment', desc: 'Set tasks for your students' },
                  { label: 'Schedule Class', desc: 'Plan your next session' },
                  { label: 'Generate Report', desc: 'View class performance' }
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
                  >
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
    </div>
  );
}

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
    active 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-gray-700 hover:bg-gray-50'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);