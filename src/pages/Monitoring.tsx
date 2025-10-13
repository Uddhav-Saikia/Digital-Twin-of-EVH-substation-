import React, { useState, useEffect } from 'react';
import { Activity, Zap, Gauge, TrendingUp, AlertCircle, Wifi, WifiOff, Database, Radio, Server, X, Clock, HardDrive, Network } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateSCADAData, mockSensorReadings, mockSystemAlerts } from '../data/mockData';
import sensorDatabase from '../database/sensorData.json';
import CustomTooltip from '../components/CustomTooltip';
import './Monitoring.css';

const Monitoring: React.FC = () => {
  const [scadaData, setScadaData] = useState(generateSCADAData(2)); // Last 2 hours
  const [liveUpdate, setLiveUpdate] = useState(true);
  const [sensors, setSensors] = useState(sensorDatabase.sensors);
  const [selectedIngestionSource, setSelectedIngestionSource] = useState<any>(null);
  const [showIngestionModal, setShowIngestionModal] = useState(false);
  const [sensorFilter, setSensorFilter] = useState<string>('all');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  // Load acknowledged alerts from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('acknowledgedAlerts');
    if (stored) {
      setAcknowledgedAlerts(JSON.parse(stored));
    }
  }, []);

  // Get visible alerts (excluding acknowledged ones)
  const alerts = mockSystemAlerts.filter(alert => !acknowledgedAlerts.includes(alert.id));

  // Simulate live data updates
  useEffect(() => {
    if (!liveUpdate) return;
    
    const interval = setInterval(() => {
      setScadaData(generateSCADAData(2));
      // Simulate sensor value changes
      setSensors(prevSensors => 
        prevSensors.map(sensor => {
          if (sensor.status === 'online') {
            const variation = (Math.random() - 0.5) * 0.1;
            const newValue = sensor.value * (1 + variation);
            return {
              ...sensor,
              value: Math.max(sensor.threshold.min, Math.min(sensor.threshold.max, newValue)),
              lastUpdate: new Date().toISOString()
            };
          }
          return sensor;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [liveUpdate]);

  const latestData = scadaData[scadaData.length - 1];
  const recentData = scadaData.slice(-30); // Last 30 readings

  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;

  const handleIngestionCardClick = (sourceType: string, sourceData: any) => {
    setSelectedIngestionSource({ type: sourceType, data: sourceData });
    setShowIngestionModal(true);
  };

  const handleCloseIngestionModal = () => {
    setShowIngestionModal(false);
    setSelectedIngestionSource(null);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    const updatedAcknowledged = [...acknowledgedAlerts, alertId];
    setAcknowledgedAlerts(updatedAcknowledged);
    sessionStorage.setItem('acknowledgedAlerts', JSON.stringify(updatedAcknowledged));
  };

  const getFilteredSensors = () => {
    switch (sensorFilter) {
      case 'scada':
        return sensors.filter(s => s.dataSource === 'SCADA');
      case 'iot':
        return sensors.filter(s => s.dataSource === 'IoT');
      case 'online':
        return sensors.filter(s => s.status === 'online');
      default:
        return sensors;
    }
  };

  const filteredSensors = getFilteredSensors();

  return (
    <div className="monitoring">
      <div className="page-header">
        <div>
          <h1>Real-Time Monitoring & SCADA</h1>
          <p className="page-subtitle">Live data from substation sensors and control systems</p>
        </div>
        <div className="header-actions">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={liveUpdate} 
              onChange={(e) => setLiveUpdate(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Live Updates</span>
          </label>
        </div>
      </div>

      {/* Data Ingestion Status */}
      <div className="data-ingestion-section">
        <h2>Data Ingestion & Sources</h2>
        <div className="ingestion-grid">
          <div 
            className="ingestion-card scada clickable" 
            onClick={() => handleIngestionCardClick('scada', sensorDatabase.scadaSystems[0])}
          >
            <div className="ingestion-icon">
              <Server size={32} />
            </div>
            <div className="ingestion-content">
              <h3>SCADA System</h3>
              <div className="ingestion-status online">
                <Wifi size={16} />
                <span>Online - IEC 61850</span>
              </div>
              <div className="ingestion-stats">
                <div className="stat">
                  <span className="stat-label">Data Rate:</span>
                  <span className="stat-value">{sensorDatabase.scadaSystems[0].dataRate}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sensors:</span>
                  <span className="stat-value">{sensorDatabase.scadaSystems[0].connectedSensors} active</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="ingestion-card iot clickable"
            onClick={() => handleIngestionCardClick('iot', sensorDatabase.iotGateways[0])}
          >
            <div className="ingestion-icon">
              <Radio size={32} />
            </div>
            <div className="ingestion-content">
              <h3>IoT Gateway</h3>
              <div className="ingestion-status online">
                <Wifi size={16} />
                <span>Online - LoRaWAN</span>
              </div>
              <div className="ingestion-stats">
                <div className="stat">
                  <span className="stat-label">Signal:</span>
                  <span className="stat-value">{sensorDatabase.iotGateways[0].signalStrength} dBm</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Devices:</span>
                  <span className="stat-value">{sensorDatabase.iotGateways[0].connectedDevices} connected</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="ingestion-card database clickable"
            onClick={() => handleIngestionCardClick('database', sensorDatabase.historicalDatabases[0])}
          >
            <div className="ingestion-icon">
              <Database size={32} />
            </div>
            <div className="ingestion-content">
              <h3>Historical Database</h3>
              <div className="ingestion-status online">
                <Wifi size={16} />
                <span>Online - InfluxDB</span>
              </div>
              <div className="ingestion-stats">
                <div className="stat">
                  <span className="stat-label">Data Points:</span>
                  <span className="stat-value">{(sensorDatabase.historicalDatabases[0].dataPoints / 1000000).toFixed(1)}M</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Retention:</span>
                  <span className="stat-value">{sensorDatabase.historicalDatabases[0].retention}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ingestion-card summary">
            <div className="ingestion-icon">
              <Activity size={32} />
            </div>
            <div className="ingestion-content">
              <h3>Sensor Status</h3>
              <div className="sensor-summary">
                <div className="summary-item online">
                  <Wifi size={20} />
                  <span>{onlineSensors} Online</span>
                </div>
                <div className="summary-item warning">
                  <AlertCircle size={20} />
                  <span>{warningSensors} Warning</span>
                </div>
                <div className="summary-item offline">
                  <WifiOff size={20} />
                  <span>{offlineSensors} Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="realtime-metrics">
        <div className="metric-card voltage">
          <div className="metric-icon">
            <Zap size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Voltage (3-Phase)</div>
            <div className="metric-values">
              <div className="phase-value">
                <span className="phase-label">L1:</span>
                <span className="phase-number">{latestData?.voltage_l1.toFixed(2)} kV</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">L2:</span>
                <span className="phase-number">{latestData?.voltage_l2.toFixed(2)} kV</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">L3:</span>
                <span className="phase-number">{latestData?.voltage_l3.toFixed(2)} kV</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card current">
          <div className="metric-icon">
            <Activity size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Current (3-Phase)</div>
            <div className="metric-values">
              <div className="phase-value">
                <span className="phase-label">L1:</span>
                <span className="phase-number">{latestData?.current_l1.toFixed(0)} A</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">L2:</span>
                <span className="phase-number">{latestData?.current_l2.toFixed(0)} A</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">L3:</span>
                <span className="phase-number">{latestData?.current_l3.toFixed(0)} A</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card power">
          <div className="metric-icon">
            <TrendingUp size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Power</div>
            <div className="metric-values">
              <div className="phase-value">
                <span className="phase-label">Active:</span>
                <span className="phase-number">{latestData?.activePower.toFixed(1)} MW</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">Reactive:</span>
                <span className="phase-number">{latestData?.reactivePower.toFixed(1)} MVAR</span>
              </div>
              <div className="phase-value">
                <span className="phase-label">PF:</span>
                <span className="phase-number">{latestData?.powerFactor.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card frequency">
          <div className="metric-icon">
            <Gauge size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-label">System Frequency</div>
            <div className="metric-value-large">
              {latestData?.frequency.toFixed(3)} Hz
            </div>
            <div className="metric-status">
              <span className="status-indicator normal"></span>
              <span>Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCADA Charts */}
      <div className="monitoring-charts">
        <div className="chart-section">
          <h2>Voltage Trends (3-Phase)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="#6b7280"
              />
              <YAxis domain={[390, 410]} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <Legend />
              <Line type="monotone" dataKey="voltage_l1" stroke="#ef4444" name="L1 (kV)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="voltage_l2" stroke="#3b82f6" name="L2 (kV)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="voltage_l3" stroke="#22c55e" name="L3 (kV)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>Current Trends (3-Phase)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <Legend />
              <Line type="monotone" dataKey="current_l1" stroke="#ef4444" name="L1 (A)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="current_l2" stroke="#3b82f6" name="L2 (A)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="current_l3" stroke="#22c55e" name="L3 (A)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>Power & Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={recentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="#6b7280"
              />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" domain={[49.8, 50.2]} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="activePower" stroke="#3b82f6" fill="#3b82f680" name="Active Power (MW)" />
              <Area yAxisId="left" type="monotone" dataKey="reactivePower" stroke="#f59e0b" fill="#f59e0b80" name="Reactive Power (MVAR)" />
              <Line yAxisId="right" type="monotone" dataKey="frequency" stroke="#ef4444" strokeWidth={2} name="Frequency (Hz)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Sensor Readings */}
      <div className="sensor-section">
        <div className="sensor-section-header">
          <h2>Live Sensor Data</h2>
          <div className="sensor-filters">
            <button 
              className={`filter-btn ${sensorFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSensorFilter('all')}
            >
              All ({sensors.length})
            </button>
            <button 
              className={`filter-btn ${sensorFilter === 'scada' ? 'active' : ''}`}
              onClick={() => setSensorFilter('scada')}
            >
              SCADA ({sensors.filter(s => s.dataSource === 'SCADA').length})
            </button>
            <button 
              className={`filter-btn ${sensorFilter === 'iot' ? 'active' : ''}`}
              onClick={() => setSensorFilter('iot')}
            >
              IoT ({sensors.filter(s => s.dataSource === 'IoT').length})
            </button>
            <button 
              className={`filter-btn ${sensorFilter === 'online' ? 'active' : ''}`}
              onClick={() => setSensorFilter('online')}
            >
              Online ({onlineSensors})
            </button>
          </div>
        </div>
        <div className="sensor-grid">
          {filteredSensors.map(sensor => (
            <div key={sensor.id} className={`sensor-card ${sensor.status}`}>
              <div className="sensor-header">
                <div className="sensor-title">
                  <span className="sensor-type">{sensor.type}</span>
                  {sensor.status === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}
                </div>
                <span className={`sensor-badge ${sensor.dataSource.toLowerCase()}`}>
                  {sensor.dataSource}
                </span>
              </div>
              <div className="sensor-info">
                <div className="sensor-name">{sensor.name}</div>
                <div className="sensor-location">{sensor.location}</div>
              </div>
              <div className="sensor-value">
                {sensor.value.toFixed(1)} <span className="sensor-unit">{sensor.unit}</span>
              </div>
              <div className="sensor-threshold">
                Range: {sensor.threshold.min} - {sensor.threshold.max} {sensor.unit}
              </div>
              <div className="sensor-footer">
                <span className={`sensor-status-badge ${sensor.status}`}>
                  {sensor.status.toUpperCase()}
                </span>
                <span className="sensor-timestamp">
                  {new Date(sensor.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="alerts-panel">
        <h2>System Alerts</h2>
        <div className="alerts-container">
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <AlertCircle size={48} />
              <p>No active alerts. All systems operating normally.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`alert-card ${alert.severity}`}>
                <div className="alert-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="alert-body">
                  <div className="alert-header">
                    <span className={`severity-badge ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                    <span className="alert-time">{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="alert-message">{alert.message}</div>
                </div>
                <button 
                  className="ack-button"
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <h3>🔌 Advanced Features (Integration Required)</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h4>SCADA System Integration</h4>
            <p>Direct connection to substation SCADA system via IEC 61850, DNP3, or Modbus protocols</p>
            <span className="tech-note">Requires: Protocol converters, secure communication channels</span>
          </div>
          <div className="placeholder-card">
            <h4>IoT Sensor Network</h4>
            <p>Wireless sensor mesh for temperature, vibration, humidity, and gas monitoring</p>
            <span className="tech-note">Requires: LoRaWAN gateway, sensor deployment</span>
          </div>
          <div className="placeholder-card">
            <h4>Historical Data Repository</h4>
            <p>Time-series database integration (InfluxDB/TimescaleDB) for long-term trend analysis</p>
            <span className="tech-note">Requires: Database setup, data migration scripts</span>
          </div>
          <div className="placeholder-card">
            <h4>Event Correlation Engine</h4>
            <p>Automated event detection and correlation across multiple data sources</p>
            <span className="tech-note">Requires: CEP engine, rule definition framework</span>
          </div>
        </div>
      </div>

      {/* Ingestion Source Details Modal */}
      {showIngestionModal && selectedIngestionSource && (
        <div className="modal-overlay">
          <div className="modal-content ingestion-modal-content">
            <div className="modal-header">
              <h3>
                {selectedIngestionSource.type === 'scada' && 'SCADA System Details'}
                {selectedIngestionSource.type === 'iot' && 'IoT Gateway Details'}
                {selectedIngestionSource.type === 'database' && 'Historical Database Details'}
              </h3>
              <button className="modal-close" onClick={handleCloseIngestionModal}>×</button>
            </div>

            <div className="ingestion-modal-body">
              {selectedIngestionSource.type === 'scada' && (
                <>
                  <div className="detail-section">
                    <h4>System Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">System ID:</span>
                        <span className="detail-value">{selectedIngestionSource.data.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Protocol:</span>
                        <span className="detail-value">{selectedIngestionSource.data.protocol}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-online">{selectedIngestionSource.data.status}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Data Rate:</span>
                        <span className="detail-value">{selectedIngestionSource.data.dataRate}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Connected Sensors:</span>
                        <span className="detail-value">{selectedIngestionSource.data.connectedSensors}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Update:</span>
                        <span className="detail-value">{new Date(selectedIngestionSource.data.lastUpdate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Communication Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Network Latency:</span>
                        <span className="detail-value">2-5 ms</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Packet Loss:</span>
                        <span className="detail-value">0.001%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Connection Type:</span>
                        <span className="detail-value">Fiber Optic</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Redundancy:</span>
                        <span className="detail-value">Dual Path</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Monitored Parameters</h4>
                    <ul className="parameter-list">
                      <li>Voltage (3-phase)</li>
                      <li>Current (3-phase)</li>
                      <li>Active & Reactive Power</li>
                      <li>Frequency</li>
                      <li>Circuit Breaker Status</li>
                      <li>Protection Relay Status</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedIngestionSource.type === 'iot' && (
                <>
                  <div className="detail-section">
                    <h4>Gateway Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Gateway ID:</span>
                        <span className="detail-value">{selectedIngestionSource.data.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Protocol:</span>
                        <span className="detail-value">{selectedIngestionSource.data.protocol}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-online">{selectedIngestionSource.data.status}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Signal Strength:</span>
                        <span className="detail-value">{selectedIngestionSource.data.signalStrength} dBm</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Connected Devices:</span>
                        <span className="detail-value">{selectedIngestionSource.data.connectedDevices}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Sync:</span>
                        <span className="detail-value">{new Date(selectedIngestionSource.data.lastSync).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Network Configuration</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Frequency Band:</span>
                        <span className="detail-value">868 MHz (EU)</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Range:</span>
                        <span className="detail-value">Up to 5 km</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Data Rate:</span>
                        <span className="detail-value">0.3-50 kbps</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Battery Status:</span>
                        <span className="detail-value">95%</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Connected Sensors</h4>
                    <ul className="parameter-list">
                      <li>Environmental Sensors (Temperature, Humidity)</li>
                      <li>Vibration Monitors</li>
                      <li>Door/Access Sensors</li>
                      <li>Power Quality Meters</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedIngestionSource.type === 'database' && (
                <>
                  <div className="detail-section">
                    <h4>Database Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Database ID:</span>
                        <span className="detail-value">{selectedIngestionSource.data.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{selectedIngestionSource.data.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-online">{selectedIngestionSource.data.status}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Data Points:</span>
                        <span className="detail-value">{(selectedIngestionSource.data.dataPoints / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Retention Policy:</span>
                        <span className="detail-value">{selectedIngestionSource.data.retention}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Backup:</span>
                        <span className="detail-value">{new Date(selectedIngestionSource.data.lastBackup).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Storage Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Storage Used:</span>
                        <span className="detail-value">245 GB</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Storage Available:</span>
                        <span className="detail-value">755 GB</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Compression Ratio:</span>
                        <span className="detail-value">4.2:1</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Write Throughput:</span>
                        <span className="detail-value">50k points/sec</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Query Performance</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Avg Query Time:</span>
                        <span className="detail-value">125 ms</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Cache Hit Rate:</span>
                        <span className="detail-value">87%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Active Queries:</span>
                        <span className="detail-value">12</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCloseIngestionModal}>Close</button>
              <button className="btn-primary" onClick={() => alert('Diagnostics report generated!')}>
                Run Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
