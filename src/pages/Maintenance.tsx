import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, User, Filter } from 'lucide-react';
import { mockMaintenanceRecords } from '../data/mockData';
import './Maintenance.css';

type MaintenanceFilter = 'all' | 'scheduled' | 'in-progress' | 'completed' | 'overdue';

const Maintenance: React.FC = () => {
  const [filter, setFilter] = useState<MaintenanceFilter>('all');

  const filteredRecords = filter === 'all' 
    ? mockMaintenanceRecords 
    : mockMaintenanceRecords.filter(r => r.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="status-icon completed" />;
      case 'in-progress':
        return <Clock size={20} className="status-icon in-progress" />;
      case 'scheduled':
        return <Calendar size={20} className="status-icon scheduled" />;
      case 'overdue':
        return <AlertCircle size={20} className="status-icon overdue" />;
      default:
        return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const stats = {
    scheduled: mockMaintenanceRecords.filter(r => r.status === 'scheduled').length,
    inProgress: mockMaintenanceRecords.filter(r => r.status === 'in-progress').length,
    completed: mockMaintenanceRecords.filter(r => r.status === 'completed').length,
    overdue: mockMaintenanceRecords.filter(r => r.status === 'overdue').length,
  };

  return (
    <div className="maintenance">
      <div className="page-header">
        <div>
          <h1>Maintenance Management</h1>
          <p className="page-subtitle">Plan, schedule, and track maintenance activities</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">Schedule New Maintenance</button>
        </div>
      </div>

      {/* Statistics */}
      <div className="maintenance-stats">
        <div className="stat-card">
          <Calendar className="stat-icon scheduled" size={24} />
          <div className="stat-content">
            <div className="stat-value">{stats.scheduled}</div>
            <div className="stat-label">Scheduled</div>
          </div>
        </div>
        <div className="stat-card">
          <Clock className="stat-icon in-progress" size={24} />
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle className="stat-icon completed" size={24} />
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <AlertCircle className="stat-icon overdue" size={24} />
          <div className="stat-content">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="maintenance-filters">
        <Filter size={18} />
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({mockMaintenanceRecords.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled ({stats.scheduled})
        </button>
        <button 
          className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({stats.inProgress})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
        <button 
          className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          Overdue ({stats.overdue})
        </button>
      </div>

      {/* Maintenance Records */}
      <div className="maintenance-list">
        {filteredRecords.map(record => (
          <div key={record.id} className={`maintenance-card ${record.status}`}>
            <div className="maintenance-header">
              <div className="maintenance-asset">
                <h3>{record.assetId}</h3>
                <span className="asset-type">{record.assetType}</span>
              </div>
              <div className="maintenance-status">
                {getStatusIcon(record.status)}
                <span className={`status-text ${record.status}`}>
                  {record.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="maintenance-body">
              <div className="maintenance-description">
                {record.description}
              </div>

              <div className="maintenance-meta">
                <div className="meta-item">
                  <span className="meta-label">Type:</span>
                  <span className={`maintenance-type ${record.type}`}>
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Priority:</span>
                  <span className={`priority-badge ${getPriorityClass(record.priority)}`}>
                    {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Scheduled:</span>
                  <span>{new Date(record.scheduledDate).toLocaleDateString()}</span>
                </div>
                {record.completedDate && (
                  <div className="meta-item">
                    <span className="meta-label">Completed:</span>
                    <span>{new Date(record.completedDate).toLocaleDateString()}</span>
                  </div>
                )}
                {record.technician && (
                  <div className="meta-item">
                    <User size={14} />
                    <span>{record.technician}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="maintenance-actions">
              {record.status === 'scheduled' && (
                <>
                  <button className="btn-secondary">Reschedule</button>
                  <button className="btn-primary">Start Work</button>
                </>
              )}
              {record.status === 'in-progress' && (
                <>
                  <button className="btn-secondary">Add Notes</button>
                  <button className="btn-primary">Mark Complete</button>
                </>
              )}
              {record.status === 'completed' && (
                <button className="btn-secondary">View Report</button>
              )}
              {record.status === 'overdue' && (
                <>
                  <button className="btn-secondary">Reassign</button>
                  <button className="btn-primary urgent">Start Immediately</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      <div className="maintenance-calendar-section">
        <h2>Maintenance Calendar</h2>
        <div className="calendar-placeholder">
          <Calendar size={64} className="calendar-icon" />
          <h3>Calendar View Coming Soon</h3>
          <p>Visualize maintenance schedule in monthly/weekly calendar format</p>
          <div className="tech-note">
            <strong>Implementation:</strong> Use React Calendar library (react-big-calendar) or FullCalendar
            to display maintenance events with drag-and-drop rescheduling capability
          </div>
        </div>
      </div>

      {/* Remote Diagnostics */}
      <div className="diagnostics-section">
        <h2>Remote Diagnostics</h2>
        <div className="diagnostics-grid">
          <div className="diagnostic-card">
            <h3>Online Testing Capability</h3>
            <p>Perform remote relay testing and calibration without site visits</p>
            <button className="btn-secondary">Launch Test Console</button>
            <div className="tech-note">
              <strong>Requires:</strong> IEC 61850 client, relay testing automation scripts, secure VPN access
            </div>
          </div>

          <div className="diagnostic-card">
            <h3>DGA Analysis Dashboard</h3>
            <p>Monitor dissolved gas analysis results and trends for transformers</p>
            <button className="btn-secondary">View DGA Reports</button>
            <div className="tech-note">
              <strong>Requires:</strong> Lab data integration API, Duval Triangle visualization, alert thresholds
            </div>
          </div>

          <div className="diagnostic-card">
            <h3>Thermal Imaging Analysis</h3>
            <p>Analyze infrared thermography data for hotspot detection</p>
            <button className="btn-secondary">View Thermal Images</button>
            <div className="tech-note">
              <strong>Requires:</strong> FLIR camera data import, temperature differential analysis, annotation tools
            </div>
          </div>

          <div className="diagnostic-card">
            <h3>Partial Discharge Monitoring</h3>
            <p>Real-time partial discharge detection and pattern analysis</p>
            <button className="btn-secondary">View PD Patterns</button>
            <div className="tech-note">
              <strong>Requires:</strong> PD sensor integration, PRPD pattern recognition, noise filtering algorithms
            </div>
          </div>
        </div>
      </div>

      {/* Work Order Management */}
      <div className="placeholder-section">
        <h3>🔧 Work Order Management System</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h4>Mobile Work Orders</h4>
            <p>Mobile app for technicians with offline capability and photo documentation</p>
            <span className="tech-note">Requires: React Native/Flutter app, offline sync, cloud storage</span>
          </div>
          <div className="placeholder-card">
            <h4>Spare Parts Inventory</h4>
            <p>Track spare parts availability, automated reordering, and usage history</p>
            <span className="tech-note">Requires: Inventory database, barcode scanning, ERP integration</span>
          </div>
          <div className="placeholder-card">
            <h4>Compliance Tracking</h4>
            <p>Ensure regulatory compliance and safety procedures are followed</p>
            <span className="tech-note">Requires: Compliance checklist engine, digital signatures, audit trails</span>
          </div>
          <div className="placeholder-card">
            <h4>Vendor Management</h4>
            <p>Manage external contractors, service agreements, and performance metrics</p>
            <span className="tech-note">Requires: Vendor portal, SLA monitoring, invoice management</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
