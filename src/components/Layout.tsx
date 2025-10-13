import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Activity,
  LineChart,
  Box,
  Wrench,
  PlayCircle,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  User,
  Sun,
  Moon,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNotifications } from '../contexts/NotificationContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      description: 'System overview and KPIs'
    },
    {
      path: '/assets',
      icon: <Database size={20} />,
      label: 'Asset Management',
      description: 'Manage substation equipment'
    },
    {
      path: '/monitoring',
      icon: <Activity size={20} />,
      label: 'Monitoring & SCADA',
      description: 'Real-time monitoring'
    },
    {
      path: '/analytics',
      icon: <LineChart size={20} />,
      label: 'Predictive Analytics',
      description: 'AI/ML predictions'
    },
    {
      path: '/visualization',
      icon: <Box size={20} />,
      label: '3D/2D Visualization',
      description: 'Visual representation'
    },
    {
      path: '/maintenance',
      icon: <Wrench size={20} />,
      label: 'Maintenance',
      description: 'Maintenance planning'
    },
    {
      path: '/simulation',
      icon: <PlayCircle size={20} />,
      label: 'Simulation',
      description: 'Scenario testing'
    },
    {
      path: '/reports',
      icon: <FileText size={20} />,
      label: 'Reports',
      description: 'Generate reports'
    },
    {
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      description: 'System configuration'
    }
  ];


  return (
    <div className="layout-container">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="top-nav-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="app-title">EHV Substation Digital Twin</h1>
        </div>
        
        <div className="top-nav-right">
          <Link 
            to="/training" 
            className="training-button"
            title="Operator Training & Development"
          >
            <GraduationCap size={20} />
            <span>Training</span>
          </Link>
          <button 
            className="icon-button"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/notifications" className="icon-button">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
          <Link to="/profile" className="icon-button">
            <User size={20} />
          </Link>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
              </Link>
            ))}
            
            {/* Logout Button */}
            <button
              className="nav-item logout-btn"
              onClick={handleLogout}
              title="Sign out"
            >
              <span className="nav-icon"><LogOut size={20} /></span>
              {sidebarOpen && (
                <div className="nav-content">
                  <span className="nav-label">Logout</span>
                  <span className="nav-description">Sign out of system</span>
                </div>
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Page Content */}
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
