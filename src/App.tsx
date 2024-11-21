import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import AIChat from './components/AIChat';
import { useState } from 'react';

// Import all necessary components
import QuizGenerator from './components/dashboard/educator/ContentCreation/QuizGenerator';
import LessonPlanBuilder from './components/dashboard/educator/ContentCreation/LessonPlanBuilder';
import AssignmentCreator from './components/dashboard/educator/ContentCreation/AssignmentCreator';
import MultimediaUploader from './components/dashboard/educator/ContentCreation/MultimediaUploader';
import TemplateSelector from './components/dashboard/educator/ContentCreation/TemplateSelector';
import PerformanceMetrics from './components/dashboard/educator/Analytics/PerformanceMetrics';
import EngagementStats from './components/dashboard/educator/Analytics/EngagementStats';
import ReportGenerator from './components/dashboard/educator/Analytics/ReportGenerator';

function App() {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<DashboardLayout onAIChatToggle={() => setShowAIChat(!showAIChat)} />}>
            <Route index element={<DashboardHome />} />
            
            {/* Educator Routes */}
            <Route path="content">
              <Route path="quiz" element={<QuizGenerator onSave={console.log} />} />
              <Route path="lesson" element={<LessonPlanBuilder onSave={console.log} />} />
              <Route path="assignment" element={<AssignmentCreator onSave={console.log} />} />
              <Route path="multimedia" element={<MultimediaUploader onUpload={console.log} />} />
              <Route path="templates" element={<TemplateSelector onSelect={console.log} />} />
            </Route>
            
            <Route path="analytics">
              <Route path="performance" element={<PerformanceMetrics />} />
              <Route path="engagement" element={<EngagementStats />} />
              <Route path="reports" element={<ReportGenerator />} />
            </Route>

            {/* Catch all undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
      </div>
    </Router>
  );
}

export default App;