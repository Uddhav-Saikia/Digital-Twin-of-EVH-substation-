import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
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

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    paths.forEach(path => {
      currentPath += `/${path}`;
      const menuItem = menuItems.find(item => item.path === currentPath);
      breadcrumbs.push({
        label: menuItem?.label || path.charAt(0).toUpperCase() + path.slice(1),
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };

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
          <button className="icon-button">
            <Bell size={20} />
            <span className="notification-badge">4</span>
          </button>
          <button className="icon-button">
            <User size={20} />
          </button>
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
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <ChevronRight size={16} className="breadcrumb-separator" />}
                <Link 
                  to={crumb.path} 
                  className={index === getBreadcrumbs().length - 1 ? 'active' : ''}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

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
