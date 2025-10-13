import React, { useState } from 'react';
import { Play, Copy, Trash2, Settings, AlertTriangle, X } from 'lucide-react';
import { mockSimulationScenarios } from '../data/mockData';
import './Simulation.css';

interface SimulationScenario {
  id: string;
  name: string;
  type: string;
  description: string;
  parameters: Record<string, any>;
  lastRun?: string;
  results?: any;
}

const Simulation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>(mockSimulationScenarios);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    targetAsset: '',
    parameters: ''
  });

  const generateScenarioResults = (scenario: SimulationScenario) => {
    const baseTime = Math.random() * 2 + 2; // 2-4 seconds
    
    switch (scenario.type) {
      case 'fault':
        return {
          status: 'completed',
          executionTime: `${baseTime.toFixed(1)}s`,
          scenarioName: scenario.name,
          faultType: scenario.parameters.faultType || 'L-G',
          faultCurrent: `${(Math.random() * 30 + 15).toFixed(1)} kA`,
          clearingTime: `${(Math.random() * 80 + 40).toFixed(0)} ms`,
          protectionOperated: ['PROT-001', 'PROT-003', 'PROT-005'].slice(0, Math.floor(Math.random() * 2) + 1),
          breakersOperated: ['CB-001', 'CB-004', 'CB-007'].slice(0, Math.floor(Math.random() * 2) + 1),
          voltageProfile: Math.random() > 0.3 ? 'Normal' : 'Degraded',
          stabilityMargin: `${(Math.random() * 15 + 10).toFixed(1)}%`,
          peakVoltage: `${(Math.random() * 150 + 380).toFixed(1)} kV`,
          faultLocation: scenario.parameters.targetAsset || 'Bus A',
          affectedZones: Math.floor(Math.random() * 3) + 1
        };
      
      case 'load':
        return {
          status: 'completed',
          executionTime: `${baseTime.toFixed(1)}s`,
          scenarioName: scenario.name,
          analysisType: 'Load Flow',
          totalLoad: `${(Math.random() * 100 + 150).toFixed(1)} MW`,
          totalGeneration: `${(Math.random() * 100 + 160).toFixed(1)} MW`,
          systemLosses: `${(Math.random() * 3 + 1).toFixed(2)} MW`,
          minVoltage: `${(Math.random() * 10 + 385).toFixed(1)} kV`,
          maxVoltage: `${(Math.random() * 10 + 405).toFixed(1)} kV`,
          powerFactor: (Math.random() * 0.1 + 0.9).toFixed(3),
          converged: true,
          iterations: Math.floor(Math.random() * 20) + 5,
          loadingPercentage: `${(Math.random() * 30 + 60).toFixed(1)}%`,
          criticalBuses: ['Bus-01', 'Bus-15', 'Bus-28'].slice(0, Math.floor(Math.random() * 2) + 1)
        };
      
      case 'switching':
        return {
          status: 'completed',
          executionTime: `${baseTime.toFixed(1)}s`,
          scenarioName: scenario.name,
          operationType: 'Bus Transfer',
          sequenceSteps: Math.floor(Math.random() * 5) + 4,
          breakersOperated: ['CB-001', 'CB-002', 'CB-005', 'CB-009'].slice(0, Math.floor(Math.random() * 3) + 2),
          switchingTime: `${(Math.random() * 500 + 200).toFixed(0)} ms`,
          loadInterruption: Math.random() > 0.7 ? 'None' : `${(Math.random() * 50).toFixed(0)} ms`,
          voltageTransient: `${(Math.random() * 5 + 2).toFixed(1)}%`,
          successRate: '100%',
          interlockStatus: 'All interlocks satisfied',
          postSwitchVoltage: `${(Math.random() * 5 + 398).toFixed(1)} kV`,
          safetyChecks: 'All passed'
        };
      
      case 'protection':
        return {
          status: 'completed',
          executionTime: `${baseTime.toFixed(1)}s`,
          scenarioName: scenario.name,
          coordinationType: 'Time-Current Coordination',
          protectionZones: Math.floor(Math.random() * 3) + 2,
          primaryProtection: `${(Math.random() * 100 + 50).toFixed(0)} ms`,
          backupProtection: `${(Math.random() * 200 + 300).toFixed(0)} ms`,
          coordinationMargin: `${(Math.random() * 150 + 100).toFixed(0)} ms`,
          selectivity: Math.random() > 0.2 ? 'Maintained' : 'Marginal',
          relaySettings: 'Verified',
          ctRatios: '1000/5A',
          faultCleared: true,
          healthyEquipment: 'All preserved'
        };
      
      default:
        return {
          status: 'completed',
          executionTime: `${baseTime.toFixed(1)}s`,
          scenarioName: scenario.name,
          message: 'Simulation completed successfully'
        };
    }
  };

  const runSimulation = (scenarioId: string) => {
    setIsRunning(true);
    setRunningScenarioId(scenarioId);
    setSimulationProgress(0);
    setSimulationResults(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate running for 3 seconds
    setTimeout(() => {
      setIsRunning(false);
      setRunningScenarioId(null);
      setSimulationProgress(100);
      
      // Get scenario and generate unique results
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        const results = generateScenarioResults(scenario);
        setSimulationResults(results);
        setShowResultsModal(true);
        
        // Update scenario with last run time and results
        setScenarios(prevScenarios => 
          prevScenarios.map(s => 
            s.id === scenarioId 
              ? { ...s, lastRun: new Date().toISOString(), results } 
              : s
          )
        );
      }
    }, 3000);
  };

  const handleCreateScenario = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleSubmitScenario = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse JSON parameters
      const parsedParams = formData.parameters ? JSON.parse(formData.parameters) : {};
      
      // Create new scenario
      const newScenario: SimulationScenario = {
        id: `SIM-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        parameters: {
          targetAsset: formData.targetAsset,
          ...parsedParams
        }
      };
      
      // Add to scenarios list
      setScenarios([newScenario, ...scenarios]);
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        description: '',
        targetAsset: '',
        parameters: ''
      });
      
      alert('Scenario created successfully!');
      setShowCreateModal(false);
    } catch (error) {
      alert('Invalid JSON format in parameters field. Please check and try again.');
    }
  };

  const handleCloseResults = () => {
    setShowResultsModal(false);
  };

  const handleDeleteScenario = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const handleDuplicateScenario = (scenario: SimulationScenario) => {
    const duplicatedScenario: SimulationScenario = {
      ...scenario,
      id: `SIM-${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      lastRun: undefined,
      results: undefined
    };
    setScenarios([duplicatedScenario, ...scenarios]);
  };

  return (
    <div className="simulation">
      <div className="page-header">
        <div>
          <h1>Simulation & Scenario Testing</h1>
          <p className="page-subtitle">Test fault scenarios, switching operations, and training simulations</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreateScenario}>
            <Play size={18} />
            Create New Scenario
          </button>
        </div>
      </div>

      {/* Simulation Types */}
      <div className="simulation-types">
        <div className="sim-type-card fault">
          <div className="sim-type-icon">
            <AlertTriangle size={32} />
          </div>
          <h3>Fault Simulation</h3>
          <p>Test protection system response to various fault scenarios</p>
          <ul className="sim-capabilities">
            <li>Single line to ground (L-G)</li>
            <li>Line to line (L-L)</li>
            <li>Three-phase fault (3Ph)</li>
            <li>Evolving faults</li>
          </ul>
        </div>

        <div className="sim-type-card load">
          <div className="sim-type-icon">
            <Settings size={32} />
          </div>
          <h3>Load Flow Analysis</h3>
          <p>Analyze power flow under different loading conditions</p>
          <ul className="sim-capabilities">
            <li>Steady-state analysis</li>
            <li>Contingency analysis</li>
            <li>Voltage profile</li>
            <li>Loss optimization</li>
          </ul>
        </div>

        <div className="sim-type-card switching">
          <div className="sim-type-icon">
            <Play size={32} />
          </div>
          <h3>Switching Operations</h3>
          <p>Simulate complex switching sequences and operations</p>
          <ul className="sim-capabilities">
            <li>Bus transfer operations</li>
            <li>Breaker coordination</li>
            <li>Restoration procedures</li>
            <li>Energization sequences</li>
          </ul>
        </div>
      </div>

      {/* Saved Scenarios */}
      <div className="scenarios-section">
        <h2>Saved Scenarios</h2>
        <div className="scenarios-grid">
          {scenarios.map(scenario => (
            <div 
              key={scenario.id} 
              className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <div className="scenario-header">
                <h3>{scenario.name}</h3>
                <span className={`scenario-type ${scenario.type}`}>{scenario.type}</span>
              </div>
              
              <p className="scenario-description">{scenario.description}</p>
              
              <div className="scenario-parameters">
                <h4>Parameters:</h4>
                <div className="parameter-list">
                  {Object.entries(scenario.parameters).map(([key, value]) => (
                    <div key={key} className="parameter-item">
                      <span className="param-key">{key}:</span>
                      <span className="param-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {scenario.lastRun && (
                <div className="scenario-meta">
                  <span>Last run: {new Date(scenario.lastRun).toLocaleDateString()} at {new Date(scenario.lastRun).toLocaleTimeString()}</span>
                </div>
              )}

              <div className="scenario-actions">
                <button 
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    runSimulation(scenario.id);
                  }}
                  disabled={isRunning}
                >
                  <Play size={16} />
                  {runningScenarioId === scenario.id ? `Running... ${simulationProgress}%` : 'Run'}
                </button>
                <button 
                  className="btn-icon" 
                  title="Duplicate" 
                  disabled={isRunning}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateScenario(scenario);
                  }}
                >
                  <Copy size={16} />
                </button>
                <button 
                  className="btn-icon" 
                  title="Delete" 
                  disabled={isRunning}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteScenario(scenario.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="simulation-progress">
          <h3>Simulation Running...</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${simulationProgress}%` }}></div>
          </div>
          <p>{simulationProgress}% Complete</p>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && simulationResults && (
        <div className="modal-overlay results-modal-overlay">
          <div className="modal-content results-modal-content">
            <div className="modal-header results-modal-header">
              <div className="results-title">
                <h3>Simulation Results</h3>
                <span className="results-status success">
                  {simulationResults.status.toUpperCase()}
                </span>
              </div>
              <button className="modal-close" onClick={handleCloseResults}>×</button>
            </div>
            
            <div className="results-modal-body">
              <div className="results-scenario-info">
                <h4>{simulationResults.scenarioName}</h4>
                <div className="results-meta">
                  <span>Execution Time: {simulationResults.executionTime}</span>
                  <span>Completed: {new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="results-grid">
                {Object.entries(simulationResults).map(([key, value]) => {
                  // Skip meta fields
                  if (key === 'status' || key === 'executionTime' || key === 'scenarioName') return null;
                  
                  return (
                    <div key={key} className="result-item">
                      <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                      <span className={typeof value === 'boolean' ? (value ? 'success' : 'error') : ''}>
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="results-actions">
                <button className="btn-secondary" onClick={handleCloseResults}>Close</button>
                <button className="btn-primary" onClick={() => {
                  // Export results logic
                  const resultsText = JSON.stringify(simulationResults, null, 2);
                  const blob = new Blob([resultsText], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `simulation-results-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Simulation Scenario</h3>
              <button className="modal-close" onClick={handleCloseCreateModal}>×</button>
            </div>
            <form onSubmit={handleSubmitScenario}>
              <div className="form-group">
                <label>Scenario Name</label>
                <input 
                  type="text" 
                  placeholder="Enter scenario name..." 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Simulation Type</label>
                <select 
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="fault">Fault Simulation</option>
                  <option value="load">Load Flow Analysis</option>
                  <option value="switching">Switching Operations</option>
                  <option value="protection">Protection Coordination</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows={3} 
                  placeholder="Enter scenario description..." 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Target Asset</label>
                <select 
                  required
                  value={formData.targetAsset}
                  onChange={(e) => setFormData({...formData, targetAsset: e.target.value})}
                >
                  <option value="">Select Asset</option>
                  <option value="TXF-001">TXF-001 - Main Power Transformer</option>
                  <option value="CB-001">CB-001 - 400kV Bus Section Breaker</option>
                  <option value="400kV-Bus">400kV Bus A</option>
                </select>
              </div>
              <div className="form-group">
                <label>Parameters (JSON)</label>
                <textarea 
                  rows={4} 
                  placeholder='{"faultType": "L-G", "faultResistance": "5 Ohms", "duration": "100ms"}'
                  required
                  value={formData.parameters}
                  onChange={(e) => setFormData({...formData, parameters: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseCreateModal}>Cancel</button>
                <button type="submit" className="btn-primary">Create Scenario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulation Engine Info */}
      <div className="simulation-engine">
        <h2>Simulation Engine</h2>
        <div className="engine-info">
          <div className="engine-card">
            <h3>Current Configuration</h3>
            <div className="config-list">
              <div className="config-item">
                <span>Solver:</span>
                <span>Newton-Raphson</span>
              </div>
              <div className="config-item">
                <span>Time Step:</span>
                <span>1 ms</span>
              </div>
              <div className="config-item">
                <span>Convergence Tolerance:</span>
                <span>0.0001</span>
              </div>
              <div className="config-item">
                <span>Max Iterations:</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="engine-card">
            <h3>System Model</h3>
            <div className="model-stats">
              <div className="model-stat">
                <span className="stat-value">45</span>
                <span className="stat-label">Buses</span>
              </div>
              <div className="model-stat">
                <span className="stat-value">3</span>
                <span className="stat-label">Transformers</span>
              </div>
              <div className="model-stat">
                <span className="stat-value">12</span>
                <span className="stat-label">Lines</span>
              </div>
              <div className="model-stat">
                <span className="stat-value">15</span>
                <span className="stat-label">Breakers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Section */}
      <div className="placeholder-section">
        <h3>⚡ Advanced Simulation Capabilities</h3>
        <div className="placeholder-grid">
          <div className="placeholder-card">
            <h4>EMT/EMTP Simulation</h4>
            <p>Electromagnetic transient analysis for detailed waveform studies</p>
            <span className="tech-note">Requires: PSCAD/EMTDC, ATP-EMTP, or MATLAB Simulink integration</span>
          </div>
          <div className="placeholder-card">
            <h4>Real-Time Hardware-in-Loop (HIL)</h4>
            <p>Test protection relays with real-time simulation of power system</p>
            <span className="tech-note">Requires: RTDS, OPAL-RT, or similar real-time simulator</span>
          </div>
          <div className="placeholder-card">
            <h4>Arc Flash Analysis</h4>
            <p>Calculate arc flash incident energy and PPE requirements</p>
            <span className="tech-note">Requires: IEEE 1584 implementation, protective device coordination</span>
          </div>
          <div className="placeholder-card">
            <h4>Harmonic Analysis</h4>
            <p>Frequency scan and harmonic distortion assessment</p>
            <span className="tech-note">Requires: Frequency domain solver, filter design tools</span>
          </div>
          <div className="placeholder-card">
            <h4>Stability Studies</h4>
            <p>Transient stability and small-signal stability analysis</p>
            <span className="tech-note">Requires: Dynamic models, PSS/E or PowerFactory integration</span>
          </div>
          <div className="placeholder-card">
            <h4>Co-Simulation Platform</h4>
            <p>Integration with multiple simulation tools (OpenDSS, GridLAB-D, etc.)</p>
            <span className="tech-note">Requires: FMI/FMU support, data exchange protocols, synchronization</span>
          </div>
        </div>
      </div>

      {/* Training Module */}
      <div className="training-module">
        <h2>Operator Training Scenarios</h2>
        <div className="training-grid">
          <div className="training-card">
            <div className="training-level beginner">Beginner</div>
            <h3>Normal Operations</h3>
            <p>Basic switching operations and routine monitoring</p>
            <div className="training-lessons">
              <div className="lesson-item">✓ System startup procedures</div>
              <div className="lesson-item">✓ Load monitoring and adjustment</div>
              <div className="lesson-item">✓ SCADA navigation</div>
              <div className="lesson-item">✓ Alarm acknowledgment</div>
            </div>
            <button className="btn-secondary">Start Training</button>
          </div>

          <div className="training-card">
            <div className="training-level intermediate">Intermediate</div>
            <h3>Switching Procedures</h3>
            <p>Complex switching sequences and bus transfer operations</p>
            <div className="training-lessons">
              <div className="lesson-item">✓ Bus transfer without interruption</div>
              <div className="lesson-item">✓ Breaker maintenance isolation</div>
              <div className="lesson-item">✓ Line energization</div>
              <div className="lesson-item">✓ Synchronization checks</div>
            </div>
            <button className="btn-secondary">Start Training</button>
          </div>

          <div className="training-card">
            <div className="training-level advanced">Advanced</div>
            <h3>Emergency Response</h3>
            <p>Fault handling and system restoration</p>
            <div className="training-lessons">
              <div className="lesson-item">✓ Fault identification and isolation</div>
              <div className="lesson-item">✓ Protection system coordination</div>
              <div className="lesson-item">✓ Black start procedures</div>
              <div className="lesson-item">✓ Emergency load shedding</div>
            </div>
            <button className="btn-secondary">Start Training</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
