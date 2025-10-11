import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Gauge,
  ThermometerSun,
  Shield
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockSystemAlerts, mockTransformers, mockCircuitBreakers, mockIsolators, mockCT_CVT, mockProtectionSystems, generateSCADAData } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import MobileWarningPopup from '../components/MobileWarningPopup';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const scadaData = generateSCADAData(6); // Last 6 hours
  const recentData = scadaData.slice(-20); // Last 20 readings

  // Calculate dynamic stats from actual data
  const allAssets = [
    ...mockTransformers,
    ...mockCircuitBreakers,
    ...mockIsolators,
    ...mockCT_CVT,
    ...mockProtectionSystems
  ];

  const totalAssets = allAssets.length;
  const operationalAssets = allAssets.filter(asset => {
    if ('status' in asset) {
      return asset.status === 'operational' || asset.status === 'closed';
    }
    return true;
  }).length;

  const totalHealth = allAssets.reduce((sum, asset) => sum + (asset.health || 0), 0);
  const overallSystemHealth = (totalHealth / allAssets.length).toFixed(1);

  const activeAlerts = notifications.filter(n => !n.acknowledged).length;
  const criticalAlertsCount = notifications.filter(n => !n.acknowledged && (n.severity === 'critical' || n.severity === 'high')).length;

  // Calculate asset health distribution from actual data
  const healthDistribution = [
    { 
      name: 'Excellent (90-100%)', 
      value: allAssets.filter(a => a.health >= 90).length, 
      color: '#22c55e' 
    },
    { 
      name: 'Good (75-89%)', 
      value: allAssets.filter(a => a.health >= 75 && a.health < 90).length, 
      color: '#3b82f6' 
    },
    { 
      name: 'Fair (60-74%)', 
      value: allAssets.filter(a => a.health >= 60 && a.health < 75).length, 
      color: '#f59e0b' 
    },
    { 
      name: 'Poor (<60%)', 
      value: allAssets.filter(a => a.health < 60).length, 
      color: '#ef4444' 
    }
  ];

  // Calculate total power from transformers
  const totalPower = mockTransformers.reduce((sum, t) => {
    const capacity = parseFloat(t.capacity.replace(/[^0-9.]/g, ''));
    const load = t.loadPercentage / 100;
    return sum + (capacity * load);
  }, 0).toFixed(0);

  // Get average frequency from recent SCADA data
  const avgFrequency = recentData.length > 0 
    ? (recentData.reduce((sum, d) => sum + d.frequency, 0) / recentData.length).toFixed(2)
    : '50.00';

  // Get average temperature from transformers
  const avgTemperature = mockTransformers.length > 0
    ? Math.round(mockTransformers.reduce((sum, t) => sum + t.temperature, 0) / mockTransformers.length)
    : 58;

  // Power consumption over time
  const powerData = recentData.map((d, i) => ({
    time: new Date(d.timestamp).getHours() + ':' + new Date(d.timestamp).getMinutes().toString().padStart(2, '0'),
    power: Math.round(d.activePower),
    reactive: Math.round(d.reactivePower)
  }));

  return (
    <div className="dashboard">
      <MobileWarningPopup />
      <div className="dashboard-header">
        <h1>System Overview</h1>
        <p className="dashboard-subtitle">Real-time monitoring of EHV Substation operations</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Link to="/assets" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: '#22c55e20' }}>
            <CheckCircle size={24} style={{ color: '#22c55e' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">System Health</div>
            <div className="kpi-value">{overallSystemHealth}%</div>
            <div className="kpi-trend positive">
              <TrendingUp size={16} />
              <span>2.3% from last week</span>
            </div>
          </div>
        </Link>

        <Link to="/assets" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: '#3b82f620' }}>
            <Activity size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Operational Assets</div>
            <div className="kpi-value">{operationalAssets}/{totalAssets}</div>
            <div className="kpi-trend neutral">
              <span>{((operationalAssets / totalAssets) * 100).toFixed(1)}% uptime</span>
            </div>
          </div>
        </Link>

        <Link to="/notifications" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: criticalAlertsCount > 0 ? '#ef444420' : '#f59e0b20' }}>
            <AlertTriangle size={24} style={{ color: criticalAlertsCount > 0 ? '#ef4444' : '#f59e0b' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Active Alerts</div>
            <div className="kpi-value">{activeAlerts}</div>
            <div className="kpi-trend negative">
              <span>{criticalAlertsCount} critical/high</span>
            </div>
          </div>
        </Link>

        <Link to="/monitoring" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: '#8b5cf620' }}>
            <Zap size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Power</div>
            <div className="kpi-value">{totalPower} MW</div>
            <div className="kpi-trend neutral">
              <span>73.4% of capacity</span>
            </div>
          </div>
        </Link>

        <Link to="/monitoring" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: '#06b6d420' }}>
            <Gauge size={24} style={{ color: '#06b6d4' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Frequency</div>
            <div className="kpi-value">{avgFrequency} Hz</div>
            <div className="kpi-trend positive">
              <span>Stable</span>
            </div>
          </div>
        </Link>

        <Link to="/assets?filter=transformers" className="kpi-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="kpi-icon" style={{ background: '#ec489920' }}>
            <ThermometerSun size={24} style={{ color: '#ec4899' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Avg Temperature</div>
            <div className="kpi-value">{avgTemperature}°C</div>
            <div className="kpi-trend neutral">
              <span>Within limits</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Power Flow (Last 2 Hours)</h3>
            <span className="chart-subtitle">Active & Reactive Power</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="power" stroke="#3b82f6" name="Active Power (MW)" strokeWidth={2} />
              <Line type="monotone" dataKey="reactive" stroke="#f59e0b" name="Reactive Power (MVAR)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Asset Health Distribution</h3>
            <span className="chart-subtitle">Current status of all assets</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {healthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="quick-access-section">
        <h2>Quick Access</h2>
        <div className="quick-access-grid">
          <Link to="/assets?filter=transformers" className="quick-access-card">
            <div className="qac-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}>
              <Shield size={32} />
            </div>
            <h3>Transformers</h3>
            <p>{mockTransformers.length} units</p>
            <p className="qac-status">{mockTransformers.filter(t => t.status === 'operational').length} operational</p>
          </Link>

          <Link to="/assets?filter=breakers" className="quick-access-card">
            <div className="qac-icon" style={{ background: '#22c55e20', color: '#22c55e' }}>
              <Zap size={32} />
            </div>
            <h3>Circuit Breakers</h3>
            <p>{mockCircuitBreakers.length} units</p>
            <p className="qac-status">{mockCircuitBreakers.filter(cb => cb.status === 'closed').length} closed</p>
          </Link>

          <Link to="/monitoring" className="quick-access-card">
            <div className="qac-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
              <Activity size={32} />
            </div>
            <h3>SCADA Monitor</h3>
            <p>Real-time data</p>
            <p className="qac-status">All systems active</p>
          </Link>

          <Link to="/analytics" className="quick-access-card">
            <div className="qac-icon" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>
              <TrendingUp size={32} />
            </div>
            <h3>Analytics</h3>
            <p>AI/ML insights</p>
            <p className="qac-status">5 predictions</p>
          </Link>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-section">
        <div className="alerts-header">
          <h2>Recent Alerts</h2>
          <Link to="/notifications" className="view-all-link">View All</Link>
        </div>
        <div className="alerts-list">
          {notifications.filter(n => !n.acknowledged).slice(0, 5).map(notification => (
            <div key={notification.id} className={`alert-item ${notification.severity}`}>
              <div className="alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="alert-content">
                <div className="alert-message">{notification.message}</div>
                <div className="alert-meta">
                  <span className="alert-time">{new Date(notification.timestamp).toLocaleString()}</span>
                  <span className={`alert-severity ${notification.severity}`}>{notification.severity.toUpperCase()}</span>
                </div>
              </div>
              <Link 
                to="/notifications"
                className="alert-ack-btn"
              >
                View
              </Link>
            </div>
          ))}
          {notifications.filter(n => !n.acknowledged).length === 0 && (
            <div className="no-alerts">
              <CheckCircle size={48} style={{ color: '#10b981', opacity: 0.5 }} />
              <p>All alerts have been acknowledged</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
