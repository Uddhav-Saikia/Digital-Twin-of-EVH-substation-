import React, { useState, useEffect } from 'react';
import { Activity, Zap, Gauge, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateSCADAData, mockSensorReadings, mockSystemAlerts } from '../data/mockData';
import './Monitoring.css';

const Monitoring: React.FC = () => {
  const [scadaData, setScadaData] = useState(generateSCADAData(2)); // Last 2 hours
  const [liveUpdate, setLiveUpdate] = useState(true);

  // Simulate live data updates
  useEffect(() => {
    if (!liveUpdate) return;
    
    const interval = setInterval(() => {
      setScadaData(generateSCADAData(2));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [liveUpdate]);

  const latestData = scadaData[scadaData.length - 1];
  const recentData = scadaData.slice(-30); // Last 30 readings

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
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
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
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
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
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="activePower" stroke="#3b82f6" fill="#3b82f680" name="Active Power (MW)" />
              <Area yAxisId="left" type="monotone" dataKey="reactivePower" stroke="#f59e0b" fill="#f59e0b80" name="Reactive Power (MVAR)" />
              <Line yAxisId="right" type="monotone" dataKey="frequency" stroke="#ef4444" strokeWidth={2} name="Frequency (Hz)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Readings */}
      <div className="sensor-section">
        <h2>Sensor Readings</h2>
        <div className="sensor-grid">
          {mockSensorReadings.map(sensor => (
            <div key={sensor.id} className={`sensor-card ${sensor.status}`}>
              <div className="sensor-header">
                <span className="sensor-type">{sensor.sensorType}</span>
                <span className={`sensor-status ${sensor.status}`}>{sensor.status}</span>
              </div>
              <div className="sensor-value">
                {sensor.value} <span className="sensor-unit">{sensor.unit}</span>
              </div>
              <div className="sensor-asset">Asset: {sensor.assetId}</div>
              <div className="sensor-timestamp">
                {new Date(sensor.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="alerts-panel">
        <h2>System Alerts</h2>
        <div className="alerts-container">
          {mockSystemAlerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`}>
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
              {!alert.acknowledged && (
                <button className="ack-button">Acknowledge</button>
              )}
            </div>
          ))}
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
    </div>
  );
};

export default Monitoring;
