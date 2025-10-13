import React, { useState } from 'react';
import { Simulation, SimulationScenario, SimulationStep } from '../types/training.types';
import { 
  X, 
  Play, 
  CheckCircle, 
  XCircle, 
  Award, 
  Clock, 
  Target,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import './SimulationLauncher.css';

interface SimulationLauncherProps {
  simulation: Simulation | null;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const SimulationLauncher: React.FC<SimulationLauncherProps> = ({ 
  simulation, 
  onClose, 
  onComplete 
}) => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  if (!simulation) return null;

  const startSimulation = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    setSimulationStarted(true);
    setTimeRemaining(scenario.timeLimit);
    setCurrentStepIndex(0);
    setScore(0);
    setSelectedAnswers([]);
  };

  const handleAnswer = (optionIndex: number) => {
    if (!selectedScenario || !selectedScenario.steps) return;

    const currentStep = selectedScenario.steps[currentStepIndex];
    const isCorrect = optionIndex === currentStep.correctOption;
    
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next step or show results
    setTimeout(() => {
      if (currentStepIndex < (selectedScenario.steps?.length || 0) - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / (selectedScenario.steps?.length || 1)) * 100);
        setShowResults(true);
        onComplete(finalScore);
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Scenario Selection Screen
  if (!simulationStarted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="simulation-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="simulation-start-screen">
            <div className="simulation-header">
              <div className="sim-icon" style={{ color: simulation.color }}>
                {simulation.icon}
              </div>
              <div>
                <h2>{simulation.title}</h2>
                <p className="sim-description">{simulation.description}</p>
              </div>
            </div>

            <div className="simulation-stats">
              <div className="stat-item">
                <Target size={20} />
                <div>
                  <span className="stat-value">{simulation.bestScore || 0}%</span>
                  <span className="stat-label">Best Score</span>
                </div>
              </div>
              <div className="stat-item">
                <Play size={20} />
                <div>
                  <span className="stat-value">{simulation.attempts}</span>
                  <span className="stat-label">Attempts</span>
                </div>
              </div>
              <div className="stat-item">
                <Clock size={20} />
                <div>
                  <span className="stat-value">{simulation.duration}</span>
                  <span className="stat-label">Average Time</span>
                </div>
              </div>
              <div className="stat-item">
                <Award size={20} />
                <div>
                  <span className={`stat-value difficulty-${simulation.difficulty}`}>
                    {simulation.difficulty}
                  </span>
                  <span className="stat-label">Difficulty</span>
                </div>
              </div>
            </div>

            <div className="scenarios-section">
              <h3>Choose a Scenario</h3>
              <div className="scenarios-grid">
                {simulation.scenarios && simulation.scenarios.length > 0 ? (
                  simulation.scenarios.map((scenario, index) => (
                    <div key={scenario.id} className="scenario-card">
                      <div className="scenario-number">Scenario {index + 1}</div>
                      <h4>{scenario.title}</h4>
                      <p>{scenario.description}</p>
                      <div className="scenario-meta">
                        <span><Clock size={14} /> {Math.floor(scenario.timeLimit / 60)} min</span>
                        <span><Target size={14} /> {scenario.steps?.length || 0} steps</span>
                      </div>
                      <div className="scenario-challenges">
                        {scenario.challenges.map((challenge, i) => (
                          <span key={i} className="challenge-tag">{challenge}</span>
                        ))}
                      </div>
                      <button 
                        className="start-scenario-btn"
                        onClick={() => startSimulation(scenario)}
                      >
                        <Play size={18} /> Start Scenario
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-scenarios">
                    <AlertCircle size={48} />
                    <p>No scenarios available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && selectedScenario) {
    const finalScore = Math.round((score / (selectedScenario.steps?.length || 1)) * 100);
    const passed = finalScore >= 70;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="simulation-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="simulation-results">
            <div className={`result-icon ${passed ? 'pass' : 'fail'}`}>
              {passed ? <CheckCircle size={80} /> : <XCircle size={80} />}
            </div>

            <h2>{passed ? 'Simulation Complete!' : 'Keep Practicing!'}</h2>
            <p className="result-subtitle">
              {passed 
                ? 'Excellent work! You handled the situation professionally.' 
                : "You've completed the simulation. Review and try again!"}
            </p>

            <div className="score-display">
              <div className="score-circle">
                <svg viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={passed ? '#10b981' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={`${(finalScore / 100) * 565} 565`}
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="score-text">
                  <span className="score-value">{finalScore}%</span>
                  <span className="score-label">Final Score</span>
                </div>
              </div>
            </div>

            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-label">Correct Decisions</span>
                <span className="summary-value correct">{score} / {selectedScenario.steps?.length || 0}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time Taken</span>
                <span className="summary-value">{formatTime(selectedScenario.timeLimit - timeRemaining)}</span>
              </div>
            </div>

            <div className="result-actions">
              <button 
                className="retry-btn"
                onClick={() => {
                  setSimulationStarted(false);
                  setShowResults(false);
                  setSelectedScenario(null);
                  setCurrentStepIndex(0);
                  setScore(0);
                  setSelectedAnswers([]);
                }}
              >
                Try Another Scenario
              </button>
              <button className="close-btn" onClick={onClose}>
                Back to Training
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simulation Running Screen
  const currentStep = selectedScenario?.steps?.[currentStepIndex];
  const answeredCurrentStep = selectedAnswers.length > currentStepIndex;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="simulation-modal simulation-active" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Simulation Header */}
        <div className="simulation-header-bar">
          <div className="sim-info">
            <span className="sim-icon-small">{simulation.icon}</span>
            <div>
              <h3>{selectedScenario?.title}</h3>
              <p>Step {currentStepIndex + 1} of {selectedScenario?.steps?.length || 0}</p>
            </div>
          </div>
          <div className="sim-score-display">
            <Award size={20} />
            <span>{score} / {selectedScenario?.steps?.length || 0}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="sim-progress-bar">
          <div 
            className="sim-progress-fill"
            style={{ 
              width: `${((currentStepIndex + 1) / (selectedScenario?.steps?.length || 1)) * 100}%` 
            }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="simulation-content">
          {currentStep && (
            <>
              <div className="step-instruction">
                <AlertCircle size={24} className="instruction-icon" />
                <h2>{currentStep.instruction}</h2>
              </div>

              <div className="step-options">
                {currentStep.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentStepIndex] === index;
                  const isCorrect = index === currentStep.correctOption;
                  const showFeedback = answeredCurrentStep;

                  let buttonClass = 'step-option';
                  if (showFeedback) {
                    if (isSelected && isCorrect) buttonClass += ' correct';
                    else if (isSelected && !isCorrect) buttonClass += ' incorrect';
                    else if (isCorrect) buttonClass += ' correct-answer';
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => !answeredCurrentStep && handleAnswer(index)}
                      disabled={answeredCurrentStep}
                    >
                      <span className="option-number">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option}</span>
                      {showFeedback && isSelected && (
                        isCorrect ? (
                          <CheckCircle size={20} className="result-icon" />
                        ) : (
                          <XCircle size={20} className="result-icon" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {answeredCurrentStep && (
                <div className={`step-feedback ${
                  selectedAnswers[currentStepIndex] === currentStep.correctOption ? 'success' : 'error'
                }`}>
                  <div className="feedback-header">
                    {selectedAnswers[currentStepIndex] === currentStep.correctOption ? (
                      <>
                        <CheckCircle size={20} />
                        <strong>Correct!</strong>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        <strong>Incorrect</strong>
                      </>
                    )}
                  </div>
                  <p>{currentStep.feedback}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationLauncher;
