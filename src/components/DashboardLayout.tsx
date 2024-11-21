import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  Brain,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Upload,
  Palette,
  BarChart,
  Users,
  FileBarChart,
  UserCircle,
  School,
  BookOpenCheck,
  Calendar,
  MessageSquare,
  Trophy,
  ClipboardList,
  Target
} from 'lucide-react';

interface DashboardLayoutProps {
  onAIChatToggle: () => void;
}

export default function DashboardLayout({ onAIChatToggle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('teacher');
  const navigate = useNavigate();
  const location = useLocation();

  const teacherMenuItems = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      ],
    },
    {
      title: 'Content Creation',
      items: [
        { label: 'Quiz Generator', path: '/content/quiz', icon: <GraduationCap size={20} /> },
        { label: 'Lesson Plan Builder', path: '/content/lesson', icon: <BookOpen size={20} /> },
        { label: 'Assignment Creator', path: '/content/assignment', icon: <FileText size={20} /> },
        { label: 'Multimedia Uploader', path: '/content/multimedia', icon: <Upload size={20} /> },
        { label: 'Templates', path: '/content/templates', icon: <Palette size={20} /> },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Performance Metrics', path: '/analytics/performance', icon: <BarChart size={20} /> },
        { label: 'Engagement Stats', path: '/analytics/engagement', icon: <Users size={20} /> },
        { label: 'Reports', path: '/analytics/reports', icon: <FileBarChart size={20} /> },
      ],
    },
  ];

  const studentMenuItems = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
      ],
    },
    {
      title: 'Learning',
      items: [
        { label: 'My Courses', path: '/student/courses', icon: <BookOpenCheck size={20} /> },
        { label: 'Assignments', path: '/student/assignments', icon: <ClipboardList size={20} /> },
        { label: 'Schedule', path: '/student/schedule', icon: <Calendar size={20} /> },
      ],
    },
    {
      title: 'Engagement',
      items: [
        { label: 'Discussion Forum', path: '/student/forum', icon: <MessageSquare size={20} /> },
        { label: 'Progress Tracking', path: '/student/progress', icon: <Target size={20} /> },
        { label: 'Achievements', path: '/student/achievements', icon: <Trophy size={20} /> },
      ],
    },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Brain className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduQuery
                </h1>
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => setUserRole('teacher')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    userRole === 'teacher' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Teacher
                </button>
                <button
                  onClick={() => setUserRole('student')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    userRole === 'student' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg w-64 border border-gray-200">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none focus:outline-none flex-1 placeholder-gray-400"
              />
            </div>
            
            <button 
              onClick={onAIChatToggle}
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
      <aside className={`fixed left-0 top-0 mt-16 h-full bg-white shadow-sm transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <nav className="p-4 space-y-6">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-2">
              {sidebarOpen && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  {section.title}
                </h2>
              )}
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {item.icon}
                  <span className={`font-medium truncate ${!sidebarOpen ? 'hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6`}>
        <Outlet />
      </main>
    </div>
  );
}