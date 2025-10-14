import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Shield, Activity, TrendingUp, Lock, Mail, 
  User, Eye, EyeOff, CheckCircle, ArrowRight,
  Database, LineChart, Box, Bell
} from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in real app, this would call an API
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: <Activity size={32} />,
      title: 'Real-Time Monitoring',
      description: 'Monitor all substation equipment with live SCADA data and instant alerts',
      color: '#3b82f6'
    },
    {
      icon: <LineChart size={32} />,
      title: 'Predictive Analytics',
      description: 'AI-powered insights for maintenance planning and failure prediction',
      color: '#10b981'
    },
    {
      icon: <Box size={32} />,
      title: '3D Visualization',
      description: 'Immersive 3D/2D views of your substation infrastructure',
      color: '#f59e0b'
    },
    {
      icon: <Database size={32} />,
      title: 'Asset Management',
      description: 'Complete lifecycle management for transformers, breakers, and more',
      color: '#8b5cf6'
    },
    {
      icon: <Shield size={32} />,
      title: 'Advanced Protection',
      description: 'Comprehensive protection systems monitoring and simulation',
      color: '#ef4444'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Performance Reports',
      description: 'Detailed analytics and customizable reporting dashboard',
      color: '#06b6d4'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime Reliability' },
    { value: '45+', label: 'Assets Monitored' },
    { value: '24/7', label: 'Real-Time Monitoring' },
    { value: '50ms', label: 'Response Time' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-grid"></div>
          <div className="hero-gradient"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            Next-Gen Substation Management
          </div>
          
          <h1 className="hero-title">
            EHV Substation
            <span className="gradient-text">Digital Twin</span>
          </h1>
          
          <p className="hero-description">
            Transform your Extra High Voltage substation operations with real-time monitoring, 
            predictive analytics, and immersive 3D visualization. Experience the future of 
            power infrastructure management.
          </p>
          
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => setShowLogin(true)}>
              <Lock size={20} />
              Sign In to Dashboard
              <ArrowRight size={20} />
            </button>
            <button className="btn-hero-secondary" onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Features
            </button>
          </div>

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-box">
                <div className="stat-value">{stat.value}</div>
                <div className="home-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header-center">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your EHV substation efficiently</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon" style={{ color: feature.color, background: `${feature.color}15` }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section">
        <div className="section-header-center">
          <h2>Built with Modern Technology</h2>
          <p>Leveraging cutting-edge tools for optimal performance</p>
        </div>
        
        <div className="tech-grid">
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>React & TypeScript</span>
          </div>
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>Real-Time SCADA Integration</span>
          </div>
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>AI/ML Analytics</span>
          </div>
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>3D Visualization Engine</span>
          </div>
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>Cloud Infrastructure</span>
          </div>
          <div className="tech-item">
            <CheckCircle size={20} />
            <span>Advanced Security</span>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}>×</button>
            
            <div className="login-header">
              <div className="login-icon">
                <Shield size={32} />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to access your digital twin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@evhsubstation.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Password
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="btn-login">
                <Lock size={18} />
                Sign In
                <ArrowRight size={18} />
              </button>

              <div className="login-demo-note">
                <Bell size={16} />
                <span>Demo credentials: Use any email and password</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Zap size={28} />
            <h3>EHV Substation Digital Twin</h3>
            <p>Next-generation power infrastructure management</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EHV Substation Digital Twin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
