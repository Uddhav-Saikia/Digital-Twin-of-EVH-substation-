import React from 'react';
import { Brain, TrendingDown, AlertOctagon, Clock, Target, Cpu } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { mockTransformers, mockCircuitBreakers } from '../data/mockData';
import './Analytics.css';

const Analytics: React.FC = () => {
  // Mock predictive data
  const failureProbability = [
    { asset: 'TXF-001', probability: 15, risk: 'low' },
    { asset: 'CB-002', probability: 68, risk: 'high' },
    { asset: 'TXF-002', probability: 32, risk: 'medium' },
    { asset: 'CB-001', probability: 22, risk: 'low' },
    { asset: 'ISO-002', probability: 45, risk: 'medium' },
  ];

  const remainingLife = [
    { asset: 'TXF-001', months: 48, health: 92 },
    { asset: 'TXF-002', months: 36, health: 88 },
    { asset: 'TXF-003', months: 72, health: 95 },
    { asset: 'CB-001', months: 28, health: 90 },
    { asset: 'CB-002', months: 12, health: 85 },
    { asset: 'CB-003', months: 54, health: 94 },
  ];

  const anomalyDetection = [
    { 
      id: 'ANOM-001', 
      asset: 'TXF-002', 
      type: 'Dissolved Gas Analysis', 
      severity: 'high',
      description: 'Elevated hydrogen levels detected in oil sample',
      confidence: 0.87,
      timestamp: '2025-10-01T14:20:00Z'
    },
    { 
      id: 'ANOM-002', 
      asset: 'CB-002', 
      type: 'Contact Wear Pattern', 
      severity: 'medium',
      description: 'Accelerated contact degradation detected',
      confidence: 0.92,
      timestamp: '2025-10-02T06:45:00Z'
    },
    { 
      id: 'ANOM-003', 
      asset: 'TXF-001', 
      type: 'Temperature Deviation', 
      severity: 'low',
      description: 'Unusual temperature increase pattern',
      confidence: 0.73,
      timestamp: '2025-10-02T08:30:00Z'
    },
  ];

  const healthTrend = [
    { month: 'Apr', avgHealth: 88 },
    { month: 'May', avgHealth: 89 },
    { month: 'Jun', avgHealth: 90 },
    { month: 'Jul', avgHealth: 89.5 },
    { month: 'Aug', avgHealth: 91 },
    { month: 'Sep', avgHealth: 91.5 },
    { month: 'Oct', avgHealth: 91.5 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="analytics">
      <div className="page-header">
        <div>
          <h1>Predictive Analytics & AI/ML Insights</h1>
          <p className="page-subtitle">AI-powered predictions for asset health and failure prevention</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Brain size={18} />
            Retrain Models
          </button>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="insights-grid">
        <div className="insight-card critical">
          <div className="insight-icon">
            <AlertOctagon size={32} />
          </div>
          <div className="insight-content">
            <div className="insight-label">High Risk Assets</div>
            <div className="insight-value">2</div>
            <div className="insight-detail">Require immediate attention</div>
          </div>
        </div>

        <div className="insight-card warning">
          <div className="insight-icon">
            <TrendingDown size={32} />
          </div>
          <div className="insight-content">
            <div className="insight-label">Declining Health</div>
            <div className="insight-value">5</div>
            <div className="insight-detail">Assets with negative trends</div>
          </div>
        </div>

        <div className="insight-card info">
          <div className="insight-icon">
            <Clock size={32} />
          </div>
          <div className="insight-content">
            <div className="insight-label">Avg Remaining Life</div>
            <div className="insight-value">42 months</div>
            <div className="insight-detail">Across all critical assets</div>
          </div>
        </div>

        <div className="insight-card success">
          <div className="insight-icon">
            <Target size={32} />
          </div>
          <div className="insight-content">
            <div className="insight-label">Prediction Accuracy</div>
            <div className="insight-value">87.3%</div>
            <div className="insight-detail">Model confidence level</div>
          </div>
        </div>
      </div>

      {/* Failure Probability Chart */}
      <div className="analytics-section">
        <h2>Failure Probability Analysis</h2>
        <p className="section-subtitle">Next 12 months failure risk assessment</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={failureProbability}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="asset" stroke="#6b7280" />
              <YAxis stroke="#6b7280" label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="probability" name="Failure Probability (%)">
                {failureProbability.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Remaining Useful Life */}
      <div className="analytics-section">
        <h2>Remaining Useful Life (RUL) Prediction</h2>
        <p className="section-subtitle">Estimated time before major maintenance or replacement</p>
        <div className="rul-grid">
          {remainingLife.map(item => (
            <div key={item.asset} className="rul-card">
              <div className="rul-header">
                <span className="rul-asset">{item.asset}</span>
                <span className="rul-health" style={{ 
                  color: item.health >= 90 ? '#22c55e' : item.health >= 75 ? '#3b82f6' : '#f59e0b' 
                }}>
                  {item.health}% Health
                </span>
              </div>
              <div className="rul-months">{item.months} months</div>
              <div className="rul-bar">
                <div 
                  className="rul-fill" 
                  style={{ 
                    width: `${(item.months / 72) * 100}%`,
                    background: item.months > 48 ? '#22c55e' : item.months > 24 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="analytics-section">
        <h2>Anomaly Detection</h2>
        <p className="section-subtitle">AI-detected unusual patterns and behaviors</p>
        <div className="anomaly-list">
          {anomalyDetection.map(anomaly => (
            <div key={anomaly.id} className={`anomaly-card ${anomaly.severity}`}>
              <div className="anomaly-header">
                <div>
                  <span className="anomaly-asset">{anomaly.asset}</span>
                  <span className={`anomaly-severity ${anomaly.severity}`}>{anomaly.severity}</span>
                </div>
                <div className="anomaly-confidence">
                  <Cpu size={16} />
                  <span>{(anomaly.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
              <div className="anomaly-type">{anomaly.type}</div>
              <div className="anomaly-description">{anomaly.description}</div>
              <div className="anomaly-footer">
                <span className="anomaly-time">{new Date(anomaly.timestamp).toLocaleString()}</span>
                <button className="btn-link">Investigate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Trend */}
      <div className="analytics-section">
        <h2>Overall System Health Trend</h2>
        <p className="section-subtitle">Average health score across all monitored assets</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis domain={[85, 95]} stroke="#6b7280" label={{ value: 'Health Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgHealth" stroke="#3b82f6" strokeWidth={3} name="Average Health (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ML Models Info */}
      <div className="models-section">
        <h2>Active ML Models</h2>
        <div className="models-grid">
          <div className="model-card">
            <div className="model-header">
              <h3>Transformer Health Predictor</h3>
              <span className="model-status active">Active</span>
            </div>
            <div className="model-details">
              <div className="model-detail">
                <span className="detail-label">Algorithm:</span>
                <span>Random Forest</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Accuracy:</span>
                <span className="accuracy-good">89.2%</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Last Trained:</span>
                <span>2025-09-15</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Features:</span>
                <span>Temperature, Load, DGA, Vibration</span>
              </div>
            </div>
          </div>

          <div className="model-card">
            <div className="model-header">
              <h3>Circuit Breaker Failure Prediction</h3>
              <span className="model-status active">Active</span>
            </div>
            <div className="model-details">
              <div className="model-detail">
                <span className="detail-label">Algorithm:</span>
                <span>XGBoost</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Accuracy:</span>
                <span className="accuracy-excellent">92.7%</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Last Trained:</span>
                <span>2025-09-20</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Features:</span>
                <span>Operation count, Contact wear, SF6 pressure</span>
              </div>
            </div>
          </div>

          <div className="model-card">
            <div className="model-header">
              <h3>Anomaly Detection System</h3>
              <span className="model-status active">Active</span>
            </div>
            <div className="model-details">
              <div className="model-detail">
                <span className="detail-label">Algorithm:</span>
                <span>Isolation Forest</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Accuracy:</span>
                <span className="accuracy-good">85.4%</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Last Trained:</span>
                <span>2025-09-28</span>
              </div>
              <div className="model-detail">
                <span className="detail-label">Features:</span>
                <span>Multi-sensor time series data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <h3>🤖 Advanced ML Capabilities (Implementation Required)</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h4>Deep Learning Models</h4>
            <p>LSTM/GRU networks for time-series forecasting and pattern recognition in sensor data</p>
            <span className="tech-note">Requires: TensorFlow/PyTorch, GPU infrastructure, training data pipeline</span>
          </div>
          <div className="placeholder-card">
            <h4>Reinforcement Learning for Optimization</h4>
            <p>RL agents for optimal load balancing and switching sequence optimization</p>
            <span className="tech-note">Requires: Simulation environment, reward function design, policy training</span>
          </div>
          <div className="placeholder-card">
            <h4>Federated Learning</h4>
            <p>Train models across multiple substations without sharing raw data</p>
            <span className="tech-note">Requires: Federated learning framework, secure aggregation protocols</span>
          </div>
          <div className="placeholder-card">
            <h4>Explainable AI (XAI)</h4>
            <p>SHAP/LIME integration for model interpretability and decision transparency</p>
            <span className="tech-note">Requires: XAI libraries, visualization framework, expert validation</span>
          </div>
          <div className="placeholder-card">
            <h4>AutoML Pipeline</h4>
            <p>Automated model selection, hyperparameter tuning, and feature engineering</p>
            <span className="tech-note">Requires: AutoML platform (H2O.ai, Auto-sklearn), MLOps infrastructure</span>
          </div>
          <div className="placeholder-card">
            <h4>Real-time Inference Engine</h4>
            <p>Low-latency model serving for critical real-time predictions</p>
            <span className="tech-note">Requires: TensorFlow Serving/TorchServe, edge computing nodes, API gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
