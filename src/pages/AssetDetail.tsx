import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Activity, TrendingUp, X, CheckCircle, Calendar, Edit as EditIcon, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  mockTransformers, 
  mockCircuitBreakers, 
  mockIsolators, 
  mockCT_CVT, 
  mockProtectionSystems 
} from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import './AssetDetail.css';

const AssetDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { setNotifications } = useNotifications();
  
  // Find the asset based on type and ID
  let asset: any = null;
  let assetType = '';
  
  if (type === 'transformer') {
    asset = mockTransformers.find(t => t.id === id);
    assetType = 'Transformer';
  } else if (type === 'breaker') {
    asset = mockCircuitBreakers.find(cb => cb.id === id);
    assetType = 'Circuit Breaker';
  } else if (type === 'isolator') {
    asset = mockIsolators.find(i => i.id === id);
    assetType = 'Isolator';
  } else if (type === 'ct_cvt') {
    asset = mockCT_CVT.find(d => d.id === id);
    assetType = 'CT/CVT';
  } else if (type === 'protection') {
    asset = mockProtectionSystems.find(p => p.id === id);
    assetType = 'Protection System';
  }

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResults, setDiagnosticsResults] = useState<any>(null);
  
  // Local state for asset modifications
  const [localHealth, setLocalHealth] = useState(asset?.health ?? 0);
  const [localAlerts, setLocalAlerts] = useState<any[]>(asset?.alerts || []);
  const [editForm, setEditForm] = useState({
    name: asset?.name || '',
    status: asset?.status || asset?.position || 'operational'
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    date: '',
    type: 'preventive',
    description: '',
    technician: ''
  });

  useEffect(() => {
    if (asset) {
      setLocalHealth(asset.health ?? 0);
      setLocalAlerts(asset.alerts || []);
      setEditForm({
        name: asset.name,
        status: asset.status || asset.position || 'operational'
      });
    }
  }, [asset]);

  if (!asset) {
    return (
      <div className="asset-detail">
        <div className="error-message">Asset not found</div>
      </div>
    );
  }

  // Handler functions
  const handleRunDiagnostics = () => {
    setShowDiagnosticsModal(true);
    setDiagnosticsRunning(true);
    setDiagnosticsResults(null);

    // Simulate diagnostics running
    setTimeout(() => {
      const delta = Math.round((Math.random() - 0.3) * 10);
      const newHealth = Math.min(100, Math.max(0, localHealth + delta));
      const issues = [];
      
      if (newHealth < 70) {
        issues.push({ severity: 'high', message: 'Health score below threshold' });
      }
      if (type === 'transformer' && asset.temperature > 75) {
        issues.push({ severity: 'medium', message: 'Operating temperature elevated' });
      }
      if (type === 'breaker' && asset.contactWear > 20) {
        issues.push({ severity: 'high', message: 'Contact wear exceeds recommended limit' });
      }

      setLocalHealth(newHealth);
      setDiagnosticsResults({
        health: newHealth,
        timestamp: new Date().toISOString(),
        issues: issues,
        status: issues.length === 0 ? 'passed' : 'warning'
      });
      setDiagnosticsRunning(false);

      // Add notification
      setNotifications(prev => [{
        id: `diag-${Date.now()}`,
        severity: issues.length === 0 ? 'low' : 'medium',
        message: `Diagnostics completed for ${asset.name} - Health: ${newHealth}%`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      }, ...(prev || [])]);
    }, 3000);
  };

  const handleScheduleMaintenance = () => {
    if (!maintenanceForm.date || !maintenanceForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    setNotifications(prev => [{
      id: `maint-${Date.now()}`,
      severity: 'low',
      message: `Maintenance scheduled for ${asset.name} on ${new Date(maintenanceForm.date).toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }, ...(prev || [])]);

    setShowMaintenanceModal(false);
    setMaintenanceForm({
      date: '',
      type: 'preventive',
      description: '',
      technician: ''
    });
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setLocalAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));

    setNotifications(prev => [{
      id: `ack-${Date.now()}`,
      severity: 'low',
      message: `Alert acknowledged for ${asset.name}`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }, ...(prev || [])]);
  };

  const handleSaveEdit = () => {
    setNotifications(prev => [{
      id: `edit-${Date.now()}`,
      severity: 'low',
      message: `Asset ${editForm.name} updated successfully`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }, ...(prev || [])]);
    
    setShowEditModal(false);
  };

  // Generate mock historical data for charts
  const generateHistoricalData = () => {
    const data = [];
    for (let i = 24; i >= 0; i--) {
      data.push({
        time: `${i}h ago`,
        health: asset.health + (Math.random() - 0.5) * 5,
        temperature: type === 'transformer' ? asset.temperature + (Math.random() - 0.5) * 10 : 
                     type === 'breaker' ? asset.temperature + (Math.random() - 0.5) * 5 : 50,
        load: type === 'transformer' ? asset.loadPercentage + (Math.random() - 0.5) * 10 : 0
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();

  return (
    <div className="asset-detail">
      {/* Header */}
      <div className="detail-header">
        <Link to="/assets" className="back-button">
          <ArrowLeft size={20} />
          Back to Assets
        </Link>
        <div className="detail-title-section">
          <div>
            <h1>{asset.name}</h1>
            <p className="detail-subtitle">{assetType} • {asset.id}</p>
          </div>
          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => setShowEditModal(true)}>
              <EditIcon size={16} />
              Edit
            </button>
            <button className="btn-primary" onClick={handleRunDiagnostics}>
              <Play size={16} />
              Run Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="detail-overview">
        <div className="overview-card">
          <div className="overview-label">Status</div>
          <div className={`overview-value status-${asset.status}`}>
            {asset.status || asset.position}
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-label">Health Score</div>
          <div className="overview-value" style={{ 
            color: localHealth >= 90 ? '#22c55e' : localHealth >= 75 ? '#3b82f6' : '#f59e0b' 
          }}>
            {localHealth}%
          </div>
        </div>
        {asset.temperature && (
          <div className="overview-card">
            <div className="overview-label">Temperature</div>
            <div className="overview-value">{asset.temperature}°C</div>
          </div>
        )}
        {asset.loadPercentage && (
          <div className="overview-card">
            <div className="overview-label">Load</div>
            <div className="overview-value">{asset.loadPercentage}%</div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Specifications */}
        <div className="detail-card">
          <h2>Specifications</h2>
          <div className="spec-list">
            {type === 'transformer' && (
              <>
                <div className="spec-row">
                  <span>Type:</span>
                  <span>{asset.type}</span>
                </div>
                <div className="spec-row">
                  <span>Voltage Rating:</span>
                  <span>{asset.voltageRating}</span>
                </div>
                <div className="spec-row">
                  <span>Capacity:</span>
                  <span>{asset.capacity}</span>
                </div>
                <div className="spec-row">
                  <span>Manufacturer:</span>
                  <span>{asset.manufacturer}</span>
                </div>
                <div className="spec-row">
                  <span>Installation Date:</span>
                  <span>{new Date(asset.installationDate).toLocaleDateString()}</span>
                </div>
                <div className="spec-row">
                  <span>Oil Level:</span>
                  <span>{asset.oilLevel}%</span>
                </div>
                <div className="spec-row">
                  <span>Vibration Level:</span>
                  <span>{asset.vibrationLevel} mm/s</span>
                </div>
                <div className="spec-row">
                  <span>Moisture Content:</span>
                  <span>{asset.moistureContent} ppm</span>
                </div>
              </>
            )}
            {type === 'breaker' && (
              <>
                <div className="spec-row">
                  <span>Type:</span>
                  <span>{asset.type}</span>
                </div>
                <div className="spec-row">
                  <span>Voltage Rating:</span>
                  <span>{asset.voltageRating}</span>
                </div>
                <div className="spec-row">
                  <span>Current Rating:</span>
                  <span>{asset.currentRating}</span>
                </div>
                <div className="spec-row">
                  <span>Manufacturer:</span>
                  <span>{asset.manufacturer}</span>
                </div>
                <div className="spec-row">
                  <span>Operation Count:</span>
                  <span>{asset.operationCount}</span>
                </div>
                <div className="spec-row">
                  <span>Contact Wear:</span>
                  <span>{asset.contactWear}%</span>
                </div>
                <div className="spec-row">
                  <span>SF6 Pressure:</span>
                  <span>{asset.sf6Pressure} bar</span>
                </div>
                <div className="spec-row">
                  <span>Trip Time:</span>
                  <span>{asset.tripTime} ms</span>
                </div>
              </>
            )}
            {/* Add similar blocks for other asset types */}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="detail-card">
          <h2>Maintenance</h2>
          <div className="maintenance-info">
            {asset.lastMaintenance && (
              <div className="maintenance-item">
                <span className="maintenance-label">Last Maintenance:</span>
                <span>{new Date(asset.lastMaintenance).toLocaleDateString()}</span>
              </div>
            )}
            {asset.nextMaintenance && (
              <div className="maintenance-item">
                <span className="maintenance-label">Next Maintenance:</span>
                <span className="next-date">{new Date(asset.nextMaintenance).toLocaleDateString()}</span>
              </div>
            )}
            {asset.lastTest && (
              <div className="maintenance-item">
                <span className="maintenance-label">Last Test:</span>
                <span>{new Date(asset.lastTest).toLocaleDateString()}</span>
              </div>
            )}
            {asset.nextTest && (
              <div className="maintenance-item">
                <span className="maintenance-label">Next Test:</span>
                <span className="next-date">{new Date(asset.nextTest).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <button 
            className="btn-secondary full-width"
            onClick={() => setShowMaintenanceModal(true)}
          >
            <Calendar size={16} />
            Schedule Maintenance
          </button>
        </div>

        {/* Alerts */}
        {localAlerts && localAlerts.length > 0 && (
          <div className="detail-card">
            <h2>Active Alerts</h2>
            <div className="alerts-list">
              {localAlerts.map((alert: any) => (
                <div key={alert.id} className={`alert-item ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`}>
                  <AlertTriangle size={18} />
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{new Date(alert.timestamp).toLocaleString()}</div>
                    {!alert.acknowledged && (
                      <button 
                        className="btn-acknowledge"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        <CheckCircle size={14} />
                        Acknowledge
                      </button>
                    )}
                    {alert.acknowledged && (
                      <span className="acknowledged-badge">
                        <CheckCircle size={14} />
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip History for Protection Systems */}
        {asset.tripHistory && asset.tripHistory.length > 0 && (
          <div className="detail-card">
            <h2>Trip History</h2>
            <div className="trip-list">
              {asset.tripHistory.map((trip: any, index: number) => (
                <div key={index} className="trip-item">
                  <div className="trip-reason">{trip.reason}</div>
                  <div className="trip-meta">
                    <span>{new Date(trip.timestamp).toLocaleString()}</span>
                    <span className={trip.cleared ? 'cleared' : 'active'}>
                      {trip.cleared ? 'Cleared' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Charts */}
      <div className="detail-charts">
        <div className="chart-card">
          <h2>Health Score Trend (24h)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={2} name="Health %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {type === 'transformer' && (
          <div className="chart-card">
            <h2>Temperature & Load Trend (24h)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temp °C" />
                <Line yAxisId="right" type="monotone" dataKey="load" stroke="#22c55e" strokeWidth={2} name="Load %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <h3>🔧 Additional Features (Coming Soon)</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <Activity size={32} />
            <h4>Real-time Waveforms</h4>
            <p>Live oscilloscope data from sensors and protection relays</p>
          </div>
          <div className="placeholder-card">
            <TrendingUp size={32} />
            <h4>Predictive Insights</h4>
            <p>AI-powered predictions for failure probability and remaining useful life</p>
          </div>
          <div className="placeholder-card">
            <AlertTriangle size={32} />
            <h4>Fault Analysis</h4>
            <p>Detailed fault event analysis with root cause identification</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Asset</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Asset Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="fault">Fault</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <p className="form-note">
                <AlertTriangle size={16} />
                Note: Changes are for demonstration only and won't persist after page refresh.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div className="modal-overlay" onClick={() => !diagnosticsRunning && setShowDiagnosticsModal(false)}>
          <div className="modal-content diagnostics-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Diagnostic Results</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowDiagnosticsModal(false)}
                disabled={diagnosticsRunning}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {diagnosticsRunning ? (
                <div className="diagnostics-running">
                  <div className="spinner"></div>
                  <h3>Running Diagnostics...</h3>
                  <p>Analyzing {asset.name}</p>
                  <div className="progress-steps">
                    <div className="step completed">✓ Hardware Check</div>
                    <div className="step active">⟳ Performance Analysis</div>
                    <div className="step">○ Generating Report</div>
                  </div>
                </div>
              ) : diagnosticsResults ? (
                <div className="diagnostics-results">
                  <div className={`results-header ${diagnosticsResults.status}`}>
                    {diagnosticsResults.status === 'passed' ? (
                      <>
                        <CheckCircle size={48} />
                        <h3>Diagnostics Passed</h3>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={48} />
                        <h3>Issues Detected</h3>
                      </>
                    )}
                  </div>
                  
                  <div className="results-summary">
                    <div className="summary-item">
                      <span>Health Score</span>
                      <strong style={{ 
                        color: diagnosticsResults.health >= 90 ? '#22c55e' : 
                               diagnosticsResults.health >= 75 ? '#3b82f6' : '#f59e0b' 
                      }}>
                        {diagnosticsResults.health}%
                      </strong>
                    </div>
                    <div className="summary-item">
                      <span>Timestamp</span>
                      <strong>{new Date(diagnosticsResults.timestamp).toLocaleString()}</strong>
                    </div>
                  </div>

                  {diagnosticsResults.issues.length > 0 && (
                    <div className="issues-list">
                      <h4>Detected Issues</h4>
                      {diagnosticsResults.issues.map((issue: any, idx: number) => (
                        <div key={idx} className={`issue-item ${issue.severity}`}>
                          <AlertTriangle size={16} />
                          <span>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {!diagnosticsRunning && (
              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowDiagnosticsModal(false)}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maintenance Scheduling Modal */}
      {showMaintenanceModal && (
        <div className="modal-overlay" onClick={() => setShowMaintenanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Maintenance</h2>
              <button className="modal-close" onClick={() => setShowMaintenanceModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Maintenance Date *</label>
                <input
                  type="date"
                  value={maintenanceForm.date}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Maintenance Type</label>
                <select
                  value={maintenanceForm.type}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, type: e.target.value})}
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="predictive">Predictive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                  placeholder="Describe the maintenance work to be performed..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Assigned Technician</label>
                <input
                  type="text"
                  value={maintenanceForm.technician}
                  onChange={(e) => setMaintenanceForm({...maintenanceForm, technician: e.target.value})}
                  placeholder="Technician name (optional)"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowMaintenanceModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleScheduleMaintenance}>
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetail;
