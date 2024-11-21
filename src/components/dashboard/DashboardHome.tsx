import React from 'react';
import { Users, BookOpen, MessageSquare, Trophy } from 'lucide-react';
import Card from '../ui/Card';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
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
          <Card key={i} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mt-4">{stat.label}</h3>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
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
                  icon: <Users className="text-blue-600" />
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
          </Card>
        </div>

        <Card className="p-6">
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
        </Card>
      </div>
    </div>
  );
}