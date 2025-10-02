import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  mockTransformers, 
  mockCircuitBreakers, 
  mockIsolators, 
  mockCT_CVT, 
  mockProtectionSystems 
} from '../data/mockData';
import './AssetDetail.css';

const AssetDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  
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

  if (!asset) {
    return (
      <div className="asset-detail">
        <div className="error-message">Asset not found</div>
      </div>
    );
  }

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
            <button className="btn-secondary">Edit</button>
            <button className="btn-primary">Run Diagnostics</button>
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
            color: asset.health >= 90 ? '#22c55e' : asset.health >= 75 ? '#3b82f6' : '#f59e0b' 
          }}>
            {asset.health}%
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
          <button className="btn-secondary full-width">Schedule Maintenance</button>
        </div>

        {/* Alerts */}
        {asset.alerts && asset.alerts.length > 0 && (
          <div className="detail-card">
            <h2>Active Alerts</h2>
            <div className="alerts-list">
              {asset.alerts.map((alert: any) => (
                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                  <AlertTriangle size={18} />
                  <div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{new Date(alert.timestamp).toLocaleString()}</div>
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
    </div>
  );
};

export default AssetDetail;
