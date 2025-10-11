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
  const [scenarios, setScenarios] = useState<SimulationScenario[]>(mockSimulationScenarios);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    targetAsset: '',
    parameters: ''
  });

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
      
      // Mock simulation results
      const scenario = mockSimulationScenarios.find(s => s.id === scenarioId);
      const mockResults = {
        status: 'completed',
        executionTime: '3.2s',
        faultCurrent: `${(Math.random() * 50 + 20).toFixed(1)} kA`,
        clearingTime: `${(Math.random() * 100 + 50).toFixed(0)} ms`,
        protectionOperated: ['PROT-001', 'PROT-002'],
        breakersOperated: ['CB-001'],
        voltageProfile: 'Normal',
        stabilityMargin: `${(Math.random() * 20 + 15).toFixed(1)}%`
      };
      
      setSimulationResults(mockResults);
      alert(`Simulation ${scenarioId} completed successfully!\nExecution Time: ${mockResults.executionTime}`);
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
    setSimulationResults(null);
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

        <div className="sim-type-card training">
          <div className="sim-type-icon">
            <Play size={32} />
          </div>
          <h3>Operator Training</h3>
          <p>Interactive training scenarios for substation operators</p>
          <ul className="sim-capabilities">
            <li>Normal operations</li>
            <li>Emergency procedures</li>
            <li>Protection coordination</li>
            <li>Communication protocols</li>
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
                  <span>Last run: {new Date(scenario.lastRun).toLocaleDateString()}</span>
                </div>
              )}

              {scenario.results && (
                <div className="scenario-results">
                  <h4>Last Results:</h4>
                  <div className="results-summary">
                    {Object.entries(scenario.results).map(([key, value]) => (
                      <div key={key} className="result-item">
                        <span className="result-key">{key}:</span>
                        <span className="result-value">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                      </div>
                    ))}
                  </div>
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

      {/* Results Display */}
      {simulationResults && !isRunning && (
        <div className="simulation-results">
          <div className="results-header">
            <h3>Simulation Results</h3>
            <button className="btn-close-results" onClick={handleCloseResults} title="Close Results">
              <X size={20} />
            </button>
          </div>
          <div className="results-grid">
            <div className="result-item">
              <label>Status:</label>
              <span className="success">{simulationResults.status}</span>
            </div>
            <div className="result-item">
              <label>Execution Time:</label>
              <span>{simulationResults.executionTime}</span>
            </div>
            <div className="result-item">
              <label>Fault Current:</label>
              <span>{simulationResults.faultCurrent}</span>
            </div>
            <div className="result-item">
              <label>Clearing Time:</label>
              <span>{simulationResults.clearingTime}</span>
            </div>
            <div className="result-item">
              <label>Protection Operated:</label>
              <span>{simulationResults.protectionOperated.join(', ')}</span>
            </div>
            <div className="result-item">
              <label>Breakers Operated:</label>
              <span>{simulationResults.breakersOperated.join(', ')}</span>
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
