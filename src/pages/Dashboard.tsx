import React from 'react';
import { Link } from 'react-router-dom';
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
import { mockDashboardStats, mockSystemAlerts, mockTransformers, mockCircuitBreakers, generateSCADAData } from '../data/mockData';
import MobileWarningPopup from '../components/MobileWarningPopup';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const scadaData = generateSCADAData(6); // Last 6 hours
  const recentData = scadaData.slice(-20); // Last 20 readings

  // Asset health distribution
  const healthDistribution = [
    { name: 'Excellent (90-100%)', value: 18, color: '#22c55e' },
    { name: 'Good (75-89%)', value: 15, color: '#3b82f6' },
    { name: 'Fair (60-74%)', value: 9, color: '#f59e0b' },
    { name: 'Poor (<60%)', value: 3, color: '#ef4444' }
  ];

  // Power consumption over time
  const powerData = recentData.map((d, i) => ({
    time: new Date(d.timestamp).getHours() + ':' + new Date(d.timestamp).getMinutes().toString().padStart(2, '0'),
    power: Math.round(d.activePower),
    reactive: Math.round(d.reactivePower)
  }));

  const criticalAlerts = mockSystemAlerts.filter(a => !a.acknowledged && (a.severity === 'critical' || a.severity === 'high'));

  return (
    <div className="dashboard">
      <MobileWarningPopup />
      <div className="dashboard-header">
        <h1>System Overview</h1>
        <p className="dashboard-subtitle">Real-time monitoring of EHV Substation operations</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#22c55e20' }}>
            <CheckCircle size={24} style={{ color: '#22c55e' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">System Health</div>
            <div className="kpi-value">{mockDashboardStats.overallSystemHealth}%</div>
            <div className="kpi-trend positive">
              <TrendingUp size={16} />
              <span>2.3% from last week</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#3b82f620' }}>
            <Activity size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Operational Assets</div>
            <div className="kpi-value">{mockDashboardStats.operationalAssets}/{mockDashboardStats.totalAssets}</div>
            <div className="kpi-trend neutral">
              <span>93.3% uptime</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: criticalAlerts.length > 0 ? '#ef444420' : '#f59e0b20' }}>
            <AlertTriangle size={24} style={{ color: criticalAlerts.length > 0 ? '#ef4444' : '#f59e0b' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Active Alerts</div>
            <div className="kpi-value">{mockDashboardStats.activeAlerts}</div>
            <div className="kpi-trend negative">
              <span>{criticalAlerts.length} critical/high</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#8b5cf620' }}>
            <Zap size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Power</div>
            <div className="kpi-value">{mockDashboardStats.totalPower} MW</div>
            <div className="kpi-trend neutral">
              <span>73.4% of capacity</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#06b6d420' }}>
            <Gauge size={24} style={{ color: '#06b6d4' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Frequency</div>
            <div className="kpi-value">{mockDashboardStats.systemFrequency} Hz</div>
            <div className="kpi-trend positive">
              <span>Stable</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#ec489920' }}>
            <ThermometerSun size={24} style={{ color: '#ec4899' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Avg Temperature</div>
            <div className="kpi-value">58°C</div>
            <div className="kpi-trend neutral">
              <span>Within limits</span>
            </div>
          </div>
        </div>
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
          <Link to="/assets" className="quick-access-card">
            <div className="qac-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}>
              <Shield size={32} />
            </div>
            <h3>Transformers</h3>
            <p>{mockTransformers.length} units</p>
            <p className="qac-status">{mockTransformers.filter(t => t.status === 'operational').length} operational</p>
          </Link>

          <Link to="/assets" className="quick-access-card">
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
          <Link to="/monitoring" className="view-all-link">View All</Link>
        </div>
        <div className="alerts-list">
          {mockSystemAlerts.slice(0, 5).map(alert => (
            <div key={alert.id} className={`alert-item ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`}>
              <div className="alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  <span className="alert-time">{new Date(alert.timestamp).toLocaleString()}</span>
                  <span className={`alert-severity ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                </div>
              </div>
              {!alert.acknowledged && (
                <button className="alert-ack-btn">Acknowledge</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
