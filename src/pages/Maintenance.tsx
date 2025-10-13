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
  // LocalStorage keys
  const LS_RECORDS_KEY = 'maintenanceRecords';
  const LS_NOTES_KEY = 'maintenanceNotes';

  // Load from localStorage
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem(LS_RECORDS_KEY);
    return saved ? JSON.parse(saved) : mockMaintenanceRecords;
  });
  const [notes, setNotes] = useState<{ [id: string]: string }>(() => {
    const saved = localStorage.getItem(LS_NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [formData, setFormData] = useState({
    assetId: '',
    type: '',
    priority: '',
    scheduledDate: '',
    description: ''
  });
  const [showNoteModal, setShowNoteModal] = useState<{ open: boolean; jobId: string | null }>({ open: false, jobId: null });
  const [noteInput, setNoteInput] = useState('');
  const [showingNoteId, setShowingNoteId] = useState<string | null>(null);
  const [showReportId, setShowReportId] = useState<string | null>(null);
  
  // Remote diagnostics modals
  const [showTestConsole, setShowTestConsole] = useState(false);
  const [showDGADashboard, setShowDGADashboard] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  // Persist records and notes to localStorage
  React.useEffect(() => {
    localStorage.setItem(LS_RECORDS_KEY, JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);
  React.useEffect(() => {
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes));
  }, [notes]);
  
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

  // Notes logic
  const handleOpenNoteModal = (id: string) => {
    setShowNoteModal({ open: true, jobId: id });
    setNoteInput(notes[id] || '');
  };
  const handleCloseNoteModal = () => {
    setShowNoteModal({ open: false, jobId: null });
    setNoteInput('');
  };
  const handleSaveNote = () => {
    if (showNoteModal.jobId) {
      setNotes({ ...notes, [showNoteModal.jobId]: noteInput });
      setShowNoteModal({ open: false, jobId: null });
      setNoteInput('');
    }
  };
  const handleShowNote = (id: string) => {
    setShowingNoteId(id);
  };
  const handleCloseShowNote = () => {
    setShowingNoteId(null);
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
                {/* Show Note button if note exists */}
                {notes[record.id] && (
                  <div className="meta-item">
                    <button className="btn-secondary" onClick={() => handleShowNote(record.id)}>Show Note</button>
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
                  <button className="btn-secondary" onClick={() => handleOpenNoteModal(record.id)}>Add Notes</button>
                  <button className="btn-primary" onClick={() => handleMarkComplete(record.id)}>Mark Complete</button>
                </>
              )}
              {record.status === 'completed' && (
                <button className="btn-secondary" onClick={() => setShowReportId(record.id)}>View Report</button>
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
            <button className="btn-secondary" onClick={() => setShowTestConsole(true)}>Launch Test Console</button>
            <div className="tech-note">
              <strong>Requires:</strong> IEC 61850 client, relay testing automation scripts, secure VPN access
            </div>
          </div>

          <div className="diagnostic-card">
            <h3>DGA Analysis Dashboard</h3>
            <p>Monitor dissolved gas analysis results and trends for transformers</p>
            <button className="btn-secondary" onClick={() => setShowDGADashboard(true)}>View DGA Reports</button>
            <div className="tech-note">
              <strong>Requires:</strong> Lab data integration API, Duval Triangle visualization, alert thresholds
            </div>
          </div>

        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {/* Add Notes Modal */}
      {showNoteModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Notes</h3>
              <button className="modal-close" onClick={handleCloseNoteModal}>×</button>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows={4}
                placeholder="Enter notes for this maintenance job..."
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCloseNoteModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Show Note Modal */}
      {/* View Report Modal */}
      {showReportId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Maintenance Report</h3>
              <button className="modal-close" onClick={() => setShowReportId(null)}>×</button>
            </div>
            {(() => {
              const record = maintenanceRecords.find(r => r.id === showReportId);
              if (!record) return null;
              return (
                <div>
                  <div className="form-group">
                    <label>Asset</label>
                    <div className="show-note-content">{record.assetId} - {record.assetType}</div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <div className="show-note-content">{record.description}</div>
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <div className="show-note-content">{record.type.charAt(0).toUpperCase() + record.type.slice(1)}</div>
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <div className="show-note-content">{record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}</div>
                  </div>
                  <div className="form-group">
                    <label>Scheduled Date</label>
                    <div className="show-note-content">{new Date(record.scheduledDate).toLocaleDateString()}</div>
                  </div>
                  <div className="form-group">
                    <label>Completed Date</label>
                    <div className="show-note-content">{record.completedDate ? new Date(record.completedDate).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="form-group">
                    <label>Technician</label>
                    <div className="show-note-content">{record.technician || '-'}</div>
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <div className="show-note-content" style={{whiteSpace: 'pre-wrap'}}>{notes[record.id] || 'No notes added.'}</div>
                  </div>
                </div>
              );
            })()}
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setShowReportId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showingNoteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Maintenance Note</h3>
              <button className="modal-close" onClick={handleCloseShowNote}>×</button>
            </div>
            <div className="form-group">
              <label>Note</label>
              <div className="show-note-content" style={{whiteSpace: 'pre-wrap'}}>
                {notes[showingNoteId]}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleCloseShowNote}>Close</button>
            </div>
          </div>
        </div>
      )}
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

      {/* Online Testing Console Modal */}
      {showTestConsole && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '700px'}}>
            <div className="modal-header">
              <h3>Online Testing Console</h3>
              <button className="modal-close" onClick={() => setShowTestConsole(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Select Relay</label>
              <select className="form-control">
                <option value="">Choose relay to test...</option>
                <option value="relay1">Protection Relay R1 (Bay 1)</option>
                <option value="relay2">Protection Relay R2 (Bay 2)</option>
                <option value="relay3">Protection Relay R3 (Transformer)</option>
                <option value="relay4">Protection Relay R4 (Feeder)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Test Type</label>
              <select className="form-control">
                <option value="">Select test type...</option>
                <option value="pickup">Pickup Test</option>
                <option value="timing">Timing Test</option>
                <option value="functional">Functional Test</option>
                <option value="calibration">Calibration Check</option>
              </select>
            </div>

            <div className="form-group">
              <label>Test Parameters</label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={{fontSize: '12px', marginBottom: '4px'}}>Current (A)</label>
                  <input type="number" placeholder="5.0" className="form-control" />
                </div>
                <div>
                  <label style={{fontSize: '12px', marginBottom: '4px'}}>Voltage (V)</label>
                  <input type="number" placeholder="110" className="form-control" />
                </div>
                <div>
                  <label style={{fontSize: '12px', marginBottom: '4px'}}>Angle (°)</label>
                  <input type="number" placeholder="0" className="form-control" />
                </div>
                <div>
                  <label style={{fontSize: '12px', marginBottom: '4px'}}>Frequency (Hz)</label>
                  <input type="number" placeholder="50" className="form-control" />
                </div>
              </div>
            </div>

            {testLogs.length > 0 && (
              <div className="form-group">
                <label>Test Execution Log</label>
                <div className="show-note-content" style={{
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  fontFamily: 'monospace', 
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {testLogs.join('\n')}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowTestConsole(false)}>Close</button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setTestRunning(true);
                  setTestLogs([
                    '[INFO] Connecting to relay via IEC 61850...',
                    '[INFO] Connection established successfully',
                    '[INFO] Reading relay configuration...',
                    '[INFO] Starting test sequence...',
                    '[TEST] Applying test current: 5.0 A',
                    '[TEST] Measuring pickup value: 4.98 A',
                    '[TEST] Measuring trip time: 125 ms',
                    '[PASS] Pickup test completed successfully',
                    '[INFO] Test results saved to database',
                    '[INFO] Disconnecting from relay...'
                  ]);
                  setTimeout(() => setTestRunning(false), 3000);
                }}
                disabled={testRunning}
              >
                {testRunning ? 'Running Test...' : 'Execute Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DGA Analysis Dashboard Modal */}
      {showDGADashboard && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '800px'}}>
            <div className="modal-header">
              <h3>DGA Analysis Dashboard</h3>
              <button className="modal-close" onClick={() => setShowDGADashboard(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Select Transformer</label>
              <select className="form-control">
                <option value="">Choose transformer...</option>
                <option value="t1">TXF-001 - Main Power Transformer</option>
                <option value="t2">TXF-002 - Station Transformer</option>
                <option value="t3">TXF-003 - Reserve Transformer</option>
              </select>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div className="show-note-content">
                <h4 style={{marginTop: 0, marginBottom: '8px', fontSize: '14px'}}>Latest Sample (Dec 2024)</h4>
                <div style={{fontSize: '13px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>H₂ (Hydrogen):</span>
                    <strong>45 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>CH₄ (Methane):</span>
                    <strong>12 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>C₂H₆ (Ethane):</span>
                    <strong>8 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>C₂H₄ (Ethylene):</span>
                    <strong>15 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>C₂H₂ (Acetylene):</span>
                    <strong>2 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span>CO (Carbon Monoxide):</span>
                    <strong>320 ppm</strong>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>CO₂ (Carbon Dioxide):</span>
                    <strong>2400 ppm</strong>
                  </div>
                </div>
              </div>

              <div className="show-note-content">
                <h4 style={{marginTop: 0, marginBottom: '8px', fontSize: '14px'}}>Analysis Results</h4>
                <div style={{fontSize: '13px'}}>
                  <div style={{marginBottom: '8px'}}>
                    <strong>Duval Triangle:</strong>
                    <div className="analysis-box duval-box">
                      Zone: PD (Partial Discharge)
                    </div>
                  </div>
                  <div style={{marginBottom: '8px'}}>
                    <strong>Rogers Ratio:</strong>
                    <div className="analysis-box rogers-box">
                      Normal Aging
                    </div>
                  </div>
                  <div>
                    <strong>Trend Status:</strong>
                    <div className="analysis-box trend-box">
                      Stable - No Action Required
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Historical Trend (Last 12 Months)</label>
              <div className="show-note-content" style={{padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '13px', color: '#6b7280', marginBottom: '12px'}}>
                  Gas Concentration Trends
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '120px', borderBottom: '2px solid #d1d5db'}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '40px', background: '#3b82f6', height: '60px', borderRadius: '4px 4px 0 0'}}></div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>Jan</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '40px', background: '#3b82f6', height: '65px', borderRadius: '4px 4px 0 0'}}></div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>Apr</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '40px', background: '#3b82f6', height: '70px', borderRadius: '4px 4px 0 0'}}></div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>Jul</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '40px', background: '#3b82f6', height: '75px', borderRadius: '4px 4px 0 0'}}></div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>Oct</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '40px', background: '#22c55e', height: '72px', borderRadius: '4px 4px 0 0'}}></div>
                    <span style={{fontSize: '11px', marginTop: '4px'}}>Dec</span>
                  </div>
                </div>
                <div style={{fontSize: '11px', color: '#6b7280', marginTop: '8px'}}>
                  Total Combustible Gas (TCG) in ppm
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Recommendations</label>
              <div className="show-note-content">
                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px'}}>
                  <li>Continue routine DGA monitoring every 3 months</li>
                  <li>Gas levels within acceptable limits for transformer age</li>
                  <li>No immediate maintenance action required</li>
                  <li>Next scheduled analysis: March 2025</li>
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDGADashboard(false)}>Close</button>
              <button className="btn-primary">Export Report</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;
