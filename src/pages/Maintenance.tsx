import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, User, Filter } from 'lucide-react';
import { mockMaintenanceRecords } from '../data/mockData';
import './Maintenance.css';

type MaintenanceFilter = 'all' | 'scheduled' | 'in-progress' | 'completed' | 'overdue';

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetType: string;
  description: string;
  type: string;
  priority: string;
  status: MaintenanceFilter;
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
}

const Maintenance: React.FC = () => {
  const [filter, setFilter] = useState<MaintenanceFilter>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
  const [formData, setFormData] = useState({
    assetId: '',
    type: '',
    priority: '',
    scheduledDate: '',
    description: ''
  });
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredRecords = filter === 'all' 
    ? maintenanceRecords 
    : maintenanceRecords.filter(r => r.status === filter);

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
    scheduled: maintenanceRecords.filter(r => r.status === 'scheduled').length,
    inProgress: maintenanceRecords.filter(r => r.status === 'in-progress').length,
    completed: maintenanceRecords.filter(r => r.status === 'completed').length,
    overdue: maintenanceRecords.filter(r => r.status === 'overdue').length,
  };

  const handleScheduleMaintenance = () => {
    setShowScheduleModal(true);
  };

  const handleCloseModal = () => {
    setShowScheduleModal(false);
  };

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get asset type from assetId
    const assetMap: Record<string, string> = {
      'TXF-001': 'Main Power Transformer',
      'CB-001': '400kV Bus Section Breaker',
      'CB-002': '220kV Line Breaker'
    };
    
    // Create new maintenance record
    const newRecord: MaintenanceRecord = {
      id: `MNT-${Date.now()}`,
      assetId: formData.assetId,
      assetType: assetMap[formData.assetId] || 'Unknown Asset',
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      status: 'scheduled',
      scheduledDate: formData.scheduledDate,
      technician: 'Pending Assignment'
    };
    
    // Add to records list
    setMaintenanceRecords([newRecord, ...maintenanceRecords]);
    
    // Reset form
    setFormData({
      assetId: '',
      type: '',
      priority: '',
      scheduledDate: '',
      description: ''
    });
    
    alert('Maintenance scheduled successfully!');
    setShowScheduleModal(false);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        hasEvent: false
      });
    }
    
    // Current month days
    const maintenanceDates = [10, 15, 25]; // Sample maintenance dates
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        hasEvent: maintenanceDates.includes(day)
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 35 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        hasEvent: false
      });
    }
    
    return days;
  };

  const handleStartWork = (id: string) => {
    setMaintenanceRecords(maintenanceRecords.map(record =>
      record.id === id ? { ...record, status: 'in-progress' as MaintenanceFilter } : record
    ));
  };

  const handleMarkComplete = (id: string) => {
    setMaintenanceRecords(maintenanceRecords.map(record =>
      record.id === id ? { 
        ...record, 
        status: 'completed' as MaintenanceFilter, 
        completedDate: new Date().toISOString() 
      } : record
    ));
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      setMaintenanceRecords(maintenanceRecords.filter(record => record.id !== id));
    }
  };

  return (
    <div className="maintenance">
      <div className="page-header">
        <div>
          <h1>Maintenance Management</h1>
          <p className="page-subtitle">Plan, schedule, and track maintenance activities</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleScheduleMaintenance}>Schedule New Maintenance</button>
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
          All ({maintenanceRecords.length})
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
                  <button className="btn-secondary" onClick={() => handleStartWork(record.id)}>Start Work</button>
                  <button className="btn-secondary" onClick={() => handleDeleteRecord(record.id)}>Delete</button>
                </>
              )}
              {record.status === 'in-progress' && (
                <>
                  <button className="btn-secondary">Add Notes</button>
                  <button className="btn-primary" onClick={() => handleMarkComplete(record.id)}>Mark Complete</button>
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
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="btn-secondary" onClick={handlePreviousMonth}>Previous Month</button>
            <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button className="btn-secondary" onClick={handleNextMonth}>Next Month</button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>
            <div className="calendar-days">
              {generateCalendarDays().map((dayInfo, index) => (
                <div 
                  key={index} 
                  className={`calendar-day ${dayInfo.isCurrentMonth ? 'current-month' : 'other-month'} ${dayInfo.hasEvent ? 'has-event' : ''}`}
                >
                  <span className="day-number">{dayInfo.day}</span>
                  {dayInfo.hasEvent && <div className="event-dot"></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot scheduled"></div>
              <span>Scheduled Maintenance</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot in-progress"></div>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot overdue"></div>
              <span>Overdue</span>
            </div>
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

      {/* Schedule Maintenance Modal */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule New Maintenance</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmitSchedule}>
              <div className="form-group">
                <label>Asset ID</label>
                <select 
                  required 
                  value={formData.assetId}
                  onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="">Select Asset</option>
                  <option value="TXF-001">TXF-001 - Main Power Transformer</option>
                  <option value="CB-001">CB-001 - 400kV Bus Section Breaker</option>
                  <option value="CB-002">CB-002 - 220kV Line Breaker</option>
                </select>
              </div>
              <div className="form-group">
                <label>Maintenance Type</label>
                <select 
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="predictive">Predictive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="">Select Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Scheduled Date</label>
                <input 
                  type="date" 
                  required 
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows={3} 
                  placeholder="Enter maintenance description..." 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Schedule Maintenance</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
