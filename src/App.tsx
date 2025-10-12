import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import AssetDetail from './pages/AssetDetail';
import Monitoring from './pages/Monitoring';
import Analytics from './pages/Analytics';
import Visualization from './pages/Visualization';
import Maintenance from './pages/Maintenance';
import Simulation from './pages/Simulation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import './App.css';

// Simple authentication check
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <DarkModeProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Public Home/Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes with Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assets" element={<AssetManagement />} />
                    <Route path="/assets/:type/:id" element={<AssetDetail />} />
                    <Route path="/monitoring" element={<Monitoring />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/visualization" element={<Visualization />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/simulation" element={<Simulation />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </NotificationProvider>
    </DarkModeProvider>
  );
}

export default App;
