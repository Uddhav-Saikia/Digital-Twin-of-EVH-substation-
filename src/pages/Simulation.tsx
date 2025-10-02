import React, { useState } from 'react';
import { Play, Copy, Trash2, Settings, AlertTriangle } from 'lucide-react';
import { mockSimulationScenarios } from '../data/mockData';
import './Simulation.css';

const Simulation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = (scenarioId: string) => {
    setIsRunning(true);
    // Simulate running for 3 seconds
    setTimeout(() => {
      setIsRunning(false);
      alert(`Simulation ${scenarioId} completed successfully!`);
    }, 3000);
  };

  return (
    <div className="simulation">
      <div className="page-header">
        <div>
          <h1>Simulation & Scenario Testing</h1>
          <p className="page-subtitle">Test fault scenarios, switching operations, and training simulations</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
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
          {mockSimulationScenarios.map(scenario => (
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
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button className="btn-icon" title="Duplicate">
                  <Copy size={16} />
                </button>
                <button className="btn-icon" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
