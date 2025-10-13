import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '../types/training.types';
import { X, Clock, CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react';
import './QuizTaker.css';

interface QuizTakerProps {
  quiz: Quiz | null;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quiz && quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, quizStarted, timeRemaining]);

  if (!quiz) return null;

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setSelectedAnswers(new Array(quiz.questionsList?.length || 0).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz.questionsList?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    onComplete(score);
  };

  const calculateScore = () => {
    if (!quiz.questionsList) return 0;
    let correct = 0;
    quiz.questionsList.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questionsList.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz.questionsList?.[currentQuestionIndex];
  const totalQuestions = quiz.questionsList?.length || quiz.questions;
  const answeredCount = selectedAnswers.filter(a => a !== -1).length;

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="quiz-start-screen">
            <div className="quiz-icon">
              <Award size={64} />
            </div>
            <h2>{quiz.title}</h2>
            <p className="quiz-course">{quiz.course}</p>

            <div className="quiz-info-grid">
              <div className="quiz-info-item">
                <span className="label">Questions</span>
                <span className="value">{totalQuestions}</span>
              </div>
              <div className="quiz-info-item">
                <span className="label">Duration</span>
                <span className="value">{quiz.duration} min</span>
              </div>
              <div className="quiz-info-item">
                <span className="label">Passing Score</span>
                <span className="value">70%</span>
              </div>
              <div className="quiz-info-item">
                <span className="label">Attempts</span>
                <span className="value">{quiz.attempts} / 3</span>
              </div>
            </div>

            <div className="quiz-instructions">
              <h3>Instructions</h3>
              <ul>
                <li>You have {quiz.duration} minutes to complete this quiz</li>
                <li>Each question has only one correct answer</li>
                <li>You can navigate between questions using Previous/Next buttons</li>
                <li>Make sure to answer all questions before submitting</li>
                <li>You need a minimum of 70% to pass this quiz</li>
              </ul>
            </div>

            <button className="start-quiz-btn" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="quiz-results-screen">
            <div className={`result-icon ${passed ? 'pass' : 'fail'}`}>
              {passed ? <CheckCircle size={80} /> : <XCircle size={80} />}
            </div>

            <h2>{passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
            <p className="result-message">
              {passed 
                ? "You've successfully passed this quiz!" 
                : "You didn't pass this time, but don't give up!"}
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
                    strokeDasharray={`${(score / 100) * 565} 565`}
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="score-text">
                  <span className="score-value">{score}%</span>
                  <span className="score-label">Score</span>
                </div>
              </div>
            </div>

            <div className="results-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Correct Answers</span>
                <span className="breakdown-value correct">
                  {quiz.questionsList?.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length || 0}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Wrong Answers</span>
                <span className="breakdown-value wrong">
                  {quiz.questionsList?.filter((q, i) => selectedAnswers[i] !== q.correctAnswer && selectedAnswers[i] !== -1).length || 0}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Skipped</span>
                <span className="breakdown-value skipped">
                  {selectedAnswers.filter(a => a === -1).length}
                </span>
              </div>
            </div>

            <div className="result-actions">
              {!passed && quiz.attempts < 3 && (
                <button 
                  className="retry-btn"
                  onClick={() => {
                    setQuizStarted(false);
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers([]);
                  }}
                >
                  Try Again
                </button>
              )}
              <button className="close-btn" onClick={onClose}>
                {passed ? 'Continue Learning' : 'Back to Training'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quiz-modal quiz-taking" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Quiz Header */}
        <div className="quiz-header">
          <div className="quiz-progress-info">
            <h3>{quiz.title}</h3>
            <p>Question {currentQuestionIndex + 1} of {totalQuestions}</p>
          </div>
          <div className="quiz-timer">
            <Clock size={20} />
            <span className={timeRemaining < 300 ? 'time-warning' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Question Content */}
        <div className="quiz-content">
          {currentQuestion && (
            <>
              <div className="question-section">
                <h2 className="question-text">{currentQuestion.question}</h2>
              </div>

              <div className="answers-section">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`answer-option ${
                      selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="answer-radio">
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <div className="answer-radio-dot"></div>
                      )}
                    </div>
                    <span className="answer-text">{option}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="quiz-footer">
          <div className="answered-count">
            {answeredCount} of {totalQuestions} answered
          </div>
          <div className="quiz-navigation">
            <button
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <button className="nav-btn primary" onClick={handleNext}>
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                className="nav-btn submit" 
                onClick={handleSubmitQuiz}
                disabled={answeredCount < totalQuestions}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
