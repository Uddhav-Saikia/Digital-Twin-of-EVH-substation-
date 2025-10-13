import React, { useState } from 'react';
import { Brain, TrendingDown, AlertOctagon, Clock, Target, Cpu, X, Activity, Zap, ThermometerSun, TrendingUp, Database } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { mockTransformers, mockCircuitBreakers } from '../data/mockData';
import CustomTooltip from '../components/CustomTooltip';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [showRetrainingModal, setShowRetrainingModal] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainingProgress, setRetrainingProgress] = useState(0);
  const [retrainingResults, setRetrainingResults] = useState<any>(null);
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

  const handleInvestigateAnomaly = (anomaly: any) => {
    setSelectedAnomaly(anomaly);
    setShowInvestigationModal(true);
  };

  const handleCloseInvestigation = () => {
    setShowInvestigationModal(false);
    setSelectedAnomaly(null);
  };

  const handleStartRetraining = () => {
    setShowRetrainingModal(true);
    setIsRetraining(true);
    setRetrainingProgress(0);
    setRetrainingResults(null);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setRetrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 400);

    // Simulate training completion after 8 seconds
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainingProgress(100);
      
      // Generate improvement results
      const results = {
        timestamp: new Date().toISOString(),
        duration: '7.8s',
        models: [
          {
            name: 'Transformer Health Predictor',
            algorithm: 'Random Forest',
            previousAccuracy: 89.2,
            newAccuracy: 92.7,
            improvement: 3.5,
            trainingData: 15420,
            validationLoss: 0.082
          },
          {
            name: 'Breaker Failure Predictor',
            algorithm: 'XGBoost',
            previousAccuracy: 91.5,
            newAccuracy: 94.1,
            improvement: 2.6,
            trainingData: 8930,
            validationLoss: 0.064
          },
          {
            name: 'Anomaly Detector',
            algorithm: 'Isolation Forest + LSTM',
            previousAccuracy: 87.8,
            newAccuracy: 90.3,
            improvement: 2.5,
            trainingData: 22150,
            validationLoss: 0.095
          }
        ],
        metrics: {
          avgImprovement: 2.87,
          totalTrainingData: 46500,
          cpuUsage: '78%',
          memoryUsage: '12.5 GB',
          epochs: 50
        }
      };
      
      setRetrainingResults(results);
    }, 8000);
  };

  const handleCloseRetrainingModal = () => {
    setShowRetrainingModal(false);
    setIsRetraining(false);
    setRetrainingProgress(0);
    setRetrainingResults(null);
  };

  const getAnomalyDetails = (anomaly: any) => {
    // Generate detailed investigation data based on anomaly type
    const baseDetails = {
      affectedSensors: ['SENS-001', 'SENS-003', 'SENS-005'].slice(0, Math.floor(Math.random() * 2) + 1),
      detectionModel: 'Isolation Forest + LSTM',
      dataPoints: Math.floor(Math.random() * 500) + 100,
      historicalComparison: `${(Math.random() * 30 + 10).toFixed(1)}% deviation from baseline`,
      correlatedEvents: Math.floor(Math.random() * 3) + 1,
    };

    if (anomaly.type === 'Dissolved Gas Analysis') {
      return {
        ...baseDetails,
        parameters: [
          { name: 'Hydrogen (H2)', value: '250 ppm', normal: '< 150 ppm', status: 'high' },
          { name: 'Methane (CH4)', value: '85 ppm', normal: '< 120 ppm', status: 'normal' },
          { name: 'Ethylene (C2H4)', value: '45 ppm', normal: '< 50 ppm', status: 'normal' },
          { name: 'Acetylene (C2H2)', value: '12 ppm', normal: '< 35 ppm', status: 'normal' },
        ],
        recommendations: [
          'Schedule immediate oil sample analysis',
          'Monitor hydrogen levels daily',
          'Consider partial discharge testing',
          'Review thermal imaging results',
          'Prepare for potential transformer de-energization'
        ],
        possibleCauses: [
          'Internal partial discharge',
          'Overheating of cellulose insulation',
          'Corona discharge in oil',
          'Hot spot development'
        ],
        urgency: 'High - Action required within 48 hours'
      };
    } else if (anomaly.type === 'Contact Wear Pattern') {
      return {
        ...baseDetails,
        parameters: [
          { name: 'Contact Resistance', value: '145 µΩ', normal: '< 100 µΩ', status: 'high' },
          { name: 'Operating Cycles', value: '8,450', normal: '< 10,000', status: 'warning' },
          { name: 'Arc Duration', value: '25 ms', normal: '< 20 ms', status: 'high' },
          { name: 'Contact Temperature', value: '75°C', normal: '< 65°C', status: 'high' },
        ],
        recommendations: [
          'Schedule contact inspection during next outage',
          'Increase monitoring frequency to weekly',
          'Prepare spare contact kits',
          'Review protection coordination',
          'Consider reducing load temporarily'
        ],
        possibleCauses: [
          'Normal wear from operation cycles',
          'Excessive load switching',
          'Poor contact alignment',
          'Contamination of contact surfaces'
        ],
        urgency: 'Medium - Action required within 2 weeks'
      };
    } else {
      return {
        ...baseDetails,
        parameters: [
          { name: 'Temperature', value: '68°C', normal: '< 65°C', status: 'warning' },
          { name: 'Rate of Change', value: '2.5°C/hr', normal: '< 2°C/hr', status: 'high' },
          { name: 'Ambient Temperature', value: '28°C', normal: '25°C', status: 'normal' },
          { name: 'Load Current', value: '425 A', normal: '< 500 A', status: 'normal' },
        ],
        recommendations: [
          'Monitor temperature trend closely',
          'Check cooling system operation',
          'Verify ambient temperature impact',
          'Review loading conditions',
          'Inspect for obstructions to airflow'
        ],
        possibleCauses: [
          'Cooling system degradation',
          'Blocked ventilation',
          'Ambient temperature increase',
          'Internal thermal hot spot'
        ],
        urgency: 'Low - Monitor and review in 1 month'
      };
    }
  };

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
          <button className="btn-secondary" onClick={handleStartRetraining}>
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
              <Tooltip content={<CustomTooltip />} />
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
                <button className="btn-link" onClick={() => handleInvestigateAnomaly(anomaly)}>
                  Investigate
                </button>
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
              <Tooltip content={<CustomTooltip />} />
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

      {/* Investigation Modal */}
      {showInvestigationModal && selectedAnomaly && (
        <div className="modal-overlay investigation-modal-overlay">
          <div className="modal-content investigation-modal-content">
            <div className="modal-header investigation-modal-header">
              <div className="investigation-title">
                <AlertOctagon size={24} />
                <div>
                  <h3>Anomaly Investigation</h3>
                  <span className="investigation-subtitle">{selectedAnomaly.id} - {selectedAnomaly.asset}</span>
                </div>
              </div>
              <button className="modal-close" onClick={handleCloseInvestigation}>×</button>
            </div>

            <div className="investigation-modal-body">
              {/* Anomaly Summary */}
              <div className="investigation-summary">
                <div className="summary-card">
                  <div className="summary-icon">
                    <Brain size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Detection Type</span>
                    <span className="summary-value">{selectedAnomaly.type}</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <Target size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Confidence</span>
                    <span className="summary-value">{(selectedAnomaly.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon severity-icon">
                    <AlertOctagon size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Severity</span>
                    <span className={`summary-value severity-${selectedAnomaly.severity}`}>
                      {selectedAnomaly.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <Clock size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Detected</span>
                    <span className="summary-value">{new Date(selectedAnomaly.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="investigation-section">
                <h4>Description</h4>
                <p className="investigation-description">{selectedAnomaly.description}</p>
              </div>

              {/* Parameters */}
              <div className="investigation-section">
                <h4>
                  <Activity size={18} />
                  Measured Parameters
                </h4>
                <div className="parameters-grid">
                  {getAnomalyDetails(selectedAnomaly).parameters.map((param: any, index: number) => (
                    <div key={index} className={`parameter-card status-${param.status}`}>
                      <div className="parameter-name">{param.name}</div>
                      <div className="parameter-value">{param.value}</div>
                      <div className="parameter-normal">Normal: {param.normal}</div>
                      <div className={`parameter-status ${param.status}`}>
                        {param.status === 'high' ? '⚠️ Above Normal' : 
                         param.status === 'warning' ? '⚡ Warning' : '✓ Normal'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Possible Causes */}
              <div className="investigation-section">
                <h4>
                  <Zap size={18} />
                  Possible Causes
                </h4>
                <ul className="causes-list">
                  {getAnomalyDetails(selectedAnomaly).possibleCauses.map((cause: string, index: number) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="investigation-section">
                <h4>
                  <TrendingUp size={18} />
                  Recommended Actions
                </h4>
                <ul className="recommendations-list">
                  {getAnomalyDetails(selectedAnomaly).recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Urgency */}
              <div className="investigation-section urgency-section">
                <h4>
                  <ThermometerSun size={18} />
                  Urgency Assessment
                </h4>
                <div className={`urgency-badge severity-${selectedAnomaly.severity}`}>
                  {getAnomalyDetails(selectedAnomaly).urgency}
                </div>
              </div>

              {/* Analysis Details */}
              <div className="investigation-section">
                <h4>Analysis Details</h4>
                <div className="analysis-details-grid">
                  <div className="analysis-detail">
                    <span className="detail-label">Detection Model:</span>
                    <span className="detail-value">{getAnomalyDetails(selectedAnomaly).detectionModel}</span>
                  </div>
                  <div className="analysis-detail">
                    <span className="detail-label">Data Points Analyzed:</span>
                    <span className="detail-value">{getAnomalyDetails(selectedAnomaly).dataPoints}</span>
                  </div>
                  <div className="analysis-detail">
                    <span className="detail-label">Affected Sensors:</span>
                    <span className="detail-value">{getAnomalyDetails(selectedAnomaly).affectedSensors.join(', ')}</span>
                  </div>
                  <div className="analysis-detail">
                    <span className="detail-label">Historical Comparison:</span>
                    <span className="detail-value">{getAnomalyDetails(selectedAnomaly).historicalComparison}</span>
                  </div>
                  <div className="analysis-detail">
                    <span className="detail-label">Correlated Events:</span>
                    <span className="detail-value">{getAnomalyDetails(selectedAnomaly).correlatedEvents}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="investigation-actions">
                <button className="btn-secondary" onClick={handleCloseInvestigation}>Close</button>
                <button className="btn-primary" onClick={() => {
                  alert('Work order created for investigation of ' + selectedAnomaly.id);
                }}>
                  Create Work Order
                </button>
                <button className="btn-primary" onClick={() => {
                  const reportData = {
                    anomaly: selectedAnomaly,
                    details: getAnomalyDetails(selectedAnomaly),
                    exportDate: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `anomaly-investigation-${selectedAnomaly.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retraining Modal */}
      {showRetrainingModal && (
        <div className="modal-overlay retraining-modal-overlay">
          <div className="modal-content retraining-modal-content">
            <div className="modal-header retraining-modal-header">
              <div className="retraining-title">
                <Brain size={24} />
                <div>
                  <h3>Model Retraining</h3>
                  <span className="retraining-subtitle">
                    {isRetraining ? 'Training models with latest data...' : 'Training Complete'}
                  </span>
                </div>
              </div>
              {!isRetraining && <button className="modal-close" onClick={handleCloseRetrainingModal}>×</button>}
            </div>

            <div className="retraining-modal-body">
              {isRetraining ? (
                <>
                  <div className="training-progress-section">
                    <div className="progress-info">
                      <span className="progress-label">Overall Progress</span>
                      <span className="progress-percentage">{retrainingProgress}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${retrainingProgress}%` }}
                      ></div>
                    </div>
                    <div className="training-status">
                      {retrainingProgress < 20 && '🔄 Loading training data...'}
                      {retrainingProgress >= 20 && retrainingProgress < 40 && '🧮 Preprocessing data...'}
                      {retrainingProgress >= 40 && retrainingProgress < 70 && '🤖 Training models...'}
                      {retrainingProgress >= 70 && retrainingProgress < 95 && '📊 Validating models...'}
                      {retrainingProgress >= 95 && '✅ Finalizing...'}
                    </div>
                  </div>

                  <div className="training-details">
                    <div className="training-detail-card">
                      <span className="detail-icon">📦</span>
                      <div>
                        <div className="detail-label">Training Data</div>
                        <div className="detail-value">46,500 samples</div>
                      </div>
                    </div>
                    <div className="training-detail-card">
                      <span className="detail-icon">🎯</span>
                      <div>
                        <div className="detail-label">Models</div>
                        <div className="detail-value">3 active</div>
                      </div>
                    </div>
                    <div className="training-detail-card">
                      <span className="detail-icon">⚡</span>
                      <div>
                        <div className="detail-label">Epochs</div>
                        <div className="detail-value">50 iterations</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : retrainingResults ? (
                <>
                  <div className="training-success">
                    <div className="success-icon">✅</div>
                    <h4>Training Completed Successfully!</h4>
                    <p>All models have been retrained with the latest data</p>
                  </div>

                  <div className="results-summary-cards">
                    <div className="summary-metric-card">
                      <div className="metric-icon improvement">
                        <TrendingUp size={24} />
                      </div>
                      <div className="metric-content">
                        <div className="metric-label">Avg Improvement</div>
                        <div className="metric-value">+{retrainingResults.metrics.avgImprovement}%</div>
                      </div>
                    </div>
                    <div className="summary-metric-card">
                      <div className="metric-icon data">
                        <Database size={24} />
                      </div>
                      <div className="metric-content">
                        <div className="metric-label">Training Data</div>
                        <div className="metric-value">{(retrainingResults.metrics.totalTrainingData / 1000).toFixed(1)}k</div>
                      </div>
                    </div>
                    <div className="summary-metric-card">
                      <div className="metric-icon time">
                        <Clock size={24} />
                      </div>
                      <div className="metric-content">
                        <div className="metric-label">Duration</div>
                        <div className="metric-value">{retrainingResults.duration}</div>
                      </div>
                    </div>
                  </div>

                  <div className="model-results-section">
                    <h4>Model Performance</h4>
                    <div className="model-results-grid">
                      {retrainingResults.models.map((model: any, index: number) => (
                        <div key={index} className="model-result-card">
                          <div className="model-result-header">
                            <h5>{model.name}</h5>
                            <span className="model-algorithm">{model.algorithm}</span>
                          </div>
                          <div className="accuracy-comparison">
                            <div className="accuracy-bar">
                              <div className="accuracy-label">Previous</div>
                              <div className="accuracy-bar-visual">
                                <div 
                                  className="accuracy-bar-fill previous" 
                                  style={{ width: `${model.previousAccuracy}%` }}
                                >
                                  <span>{model.previousAccuracy}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="accuracy-bar">
                              <div className="accuracy-label">New</div>
                              <div className="accuracy-bar-visual">
                                <div 
                                  className="accuracy-bar-fill new" 
                                  style={{ width: `${model.newAccuracy}%` }}
                                >
                                  <span>{model.newAccuracy}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="improvement-badge">
                            <TrendingUp size={14} />
                            +{model.improvement}% improvement
                          </div>
                          <div className="model-stats">
                            <div className="model-stat">
                              <span className="stat-label">Training Data:</span>
                              <span className="stat-value">{model.trainingData.toLocaleString()}</span>
                            </div>
                            <div className="model-stat">
                              <span className="stat-label">Validation Loss:</span>
                              <span className="stat-value">{model.validationLoss}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="training-metrics">
                    <h4>Training Metrics</h4>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <span className="metric-label">CPU Usage:</span>
                        <span className="metric-value">{retrainingResults.metrics.cpuUsage}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Memory Usage:</span>
                        <span className="metric-value">{retrainingResults.metrics.memoryUsage}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Epochs:</span>
                        <span className="metric-value">{retrainingResults.metrics.epochs}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Timestamp:</span>
                        <span className="metric-value">{new Date(retrainingResults.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="retraining-actions">
                    <button className="btn-secondary" onClick={handleCloseRetrainingModal}>Close</button>
                    <button className="btn-primary" onClick={() => {
                      const reportData = {
                        training: retrainingResults,
                        exportDate: new Date().toISOString()
                      };
                      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `model-training-report-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      Export Report
                    </button>
                    <button className="btn-primary" onClick={() => {
                      alert('Models deployed successfully!');
                      handleCloseRetrainingModal();
                    }}>
                      Deploy Models
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
