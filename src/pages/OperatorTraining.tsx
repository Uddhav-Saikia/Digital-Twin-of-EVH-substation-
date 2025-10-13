import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Target,
  Star,
  Lock,
  Filter,
  Search,
  ChevronRight,
  Trophy,
  BarChart3
} from 'lucide-react';
import './OperatorTraining.css';
import { Course, Certification, Quiz, Simulation } from '../types/training.types';
import { coursesData, certificationsData, quizzesData, simulationsData } from '../data/trainingData';
import CourseViewer from '../components/CourseViewer';
import QuizTaker from '../components/QuizTaker';
import SimulationLauncher from '../components/SimulationLauncher';
import CertificationManager from '../components/CertificationManager';

const OperatorTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'certifications' | 'quizzes' | 'simulations'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  
  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [showCertManager, setShowCertManager] = useState(false);

  // Filter courses
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'All' || course.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Calculate statistics
  const totalCoursesEnrolled = coursesData.filter(c => c.status === 'in-progress' || c.progress).length;
  const averageProgress = coursesData
    .filter(c => c.progress !== undefined)
    .reduce((acc, c) => acc + (c.progress || 0), 0) / totalCoursesEnrolled || 0;
  // UI requirement: always display 0 certifications in the UI
  const activeCertifications = 0;
  const quizzesCompleted = quizzesData.filter(q => q.attempts > 0).length;

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    // In a real app, update backend here
  };

  const handleSimulationComplete = (score: number) => {
    console.log('Simulation completed with score:', score);
    // In a real app, update backend here
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="overview-tab">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome to Operator Training</h1>
          <p>Enhance your skills with our comprehensive training programs designed for EHV substation operators</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff' }}>
              <BookOpen size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalCoursesEnrolled}</span>
              <span className="stat-label">Courses Enrolled</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fdf4' }}>
              <TrendingUp size={24} style={{ color: '#10b981' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{Math.round(averageProgress)}%</span>
              <span className="stat-label">Average Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <Award size={24} style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Certifications</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f3e8ff' }}>
              <CheckCircle size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{quizzesCompleted}</span>
              <span className="stat-label">Quizzes Taken</span>
            </div>
          </div>
        </div>
      </div>

      <div className="continue-learning">
        <h2>Continue Learning</h2>
        <div className="courses-grid">
          {coursesData.filter(c => c.status === 'in-progress').map(course => (
            <div key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
              <div className="course-thumbnail">{course.thumbnail}</div>
              <div className="course-content">
                <div className="course-header">
                  <span className={`course-level ${course.level.toLowerCase()}`}>{course.level}</span>
                  <span className="course-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    {course.rating}
                  </span>
                </div>
                <h3>{course.title}</h3>
                <p className="course-instructor">by {course.instructor}</p>
                <div className="course-meta">
                  <span><Clock size={14} /> {course.duration}</span>
                  <span><Users size={14} /> {course.enrolled}</span>
                </div>
                {course.progress !== undefined && (
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{course.progress}% complete</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => setActiveTab('courses')}>
            <BookOpen size={32} />
            <span>Browse All Courses</span>
          </button>
          <button className="action-card" onClick={() => setActiveTab('quizzes')}>
            <CheckCircle size={32} />
            <span>Take a Quiz</span>
          </button>
          <button className="action-card" onClick={() => setActiveTab('simulations')}>
            <Target size={32} />
            <span>Start Simulation</span>
          </button>
          <button className="action-card" onClick={() => setShowCertManager(true)}>
            <Award size={32} />
            <span>View Certifications</span>
          </button>
        </div>
      </div>

      <div className="leaderboard-section">
        <h2>
          <Trophy size={24} />
          Top Performers This Month
        </h2>
        <div className="leaderboard">
          {[
            { rank: 1, name: 'John Smith', score: 2850, avatar: '👤' },
            { rank: 2, name: 'Sarah Johnson', score: 2720, avatar: '👤' },
            { rank: 3, name: 'Michael Chen', score: 2680, avatar: '👤' },
            { rank: 4, name: 'Emma Davis', score: 2590, avatar: '👤' },
            { rank: 5, name: 'David Wilson', score: 2510, avatar: '👤' }
          ].map(user => (
            <div key={user.rank} className={`leaderboard-item ${user.rank <= 3 ? 'top' : ''}`}>
              <span className="rank">#{user.rank}</span>
              <span className="avatar">{user.avatar}</span>
              <span className="name">{user.name}</span>
              <span className="score">{user.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Courses Tab
  const renderCourses = () => (
    <div className="courses-tab">
      <div className="courses-header">
        <h2>All Courses</h2>
        <div className="courses-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={18} />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Operations">Operations</option>
              <option value="Safety">Safety</option>
              <option value="Technology">Technology</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div 
            key={course.id} 
            className={`course-card ${course.status === 'locked' ? 'locked' : ''}`}
            onClick={() => course.status !== 'locked' && setSelectedCourse(course)}
          >
            <div className="course-thumbnail">{course.thumbnail}</div>
            <div className="course-content">
              <div className="course-header">
                <span className={`course-level ${course.level.toLowerCase()}`}>{course.level}</span>
                <span className="course-rating">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {course.rating}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="course-instructor">by {course.instructor}</p>
              <div className="course-meta">
                <span><Clock size={14} /> {course.duration}</span>
                <span><Users size={14} /> {course.enrolled}</span>
                <span><BookOpen size={14} /> {course.lessons} lessons</span>
              </div>
              {course.status === 'locked' ? (
                <div className="course-locked">
                  <Lock size={16} />
                  <span>Complete prerequisites to unlock</span>
                </div>
              ) : course.progress !== undefined ? (
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{course.progress}% complete</span>
                </div>
              ) : (
                <button className="enroll-button">
                  <Play size={16} />
                  Start Course
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Certifications Tab
  const renderCertifications = () => (
    <div className="certifications-tab">
      <div className="cert-stats-row">
        <div className="cert-stat">
          <CheckCircle size={32} color="#10b981" />
          <div>
            <span className="stat-number">0</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="cert-stat">
          <Clock size={32} color="#f59e0b" />
          <div>
            <span className="stat-number">0</span>
            <span className="stat-label">Expiring</span>
          </div>
        </div>
        <div className="cert-stat">
          <Trophy size={32} color="#ef4444" />
          <div>
            <span className="stat-number">0</span>
            <span className="stat-label">Expired</span>
          </div>
        </div>
      </div>
      

      <div className="certifications-grid">
        {certificationsData.map(cert => (
          <div key={cert.id} className={`certification-card ${cert.status}`}>
            <div className="cert-badge">
              <Award size={48} />
            </div>
            <div className="cert-info">
              <h3>{cert.name}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <div className="cert-details">
                <span>ID: {cert.credentialId}</span>
                <span>Valid until: {cert.validUntil}</span>
                {cert.score && <span>Score: {cert.score}%</span>}
              </div>
              <span className={`cert-status ${cert.status}`}>
                {cert.status === 'active' && '✓ Active'}
                {cert.status === 'expiring' && '⚠ Expiring Soon'}
                {cert.status === 'expired' && '✗ Expired'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Quizzes Tab
  const renderQuizzes = () => (
    <div className="quizzes-tab">
      <h2>Knowledge Assessments</h2>
      <div className="quizzes-grid">
        {quizzesData.map(quiz => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-header">
              <div className="quiz-icon">
                <CheckCircle size={32} />
              </div>
              <span className={`quiz-status ${quiz.status}`}>
                {quiz.status === 'not-started' ? 'Not Started' : 'In Progress'}
              </span>
            </div>
            <h3>{quiz.title}</h3>
            <p className="quiz-course">{quiz.course}</p>
            <div className="quiz-meta">
              <span><BarChart3 size={16} /> {quiz.questions} questions</span>
              <span><Clock size={16} /> {quiz.duration} min</span>
            </div>
            <div className="quiz-stats">
              <div className="quiz-stat">
                <span className="label">Attempts</span>
                <span className="value">{quiz.attempts} / 3</span>
              </div>
              {quiz.bestScore !== undefined && (
                <div className="quiz-stat">
                  <span className="label">Best Score</span>
                  <span className="value">{quiz.bestScore}%</span>
                </div>
              )}
            </div>
            <button 
              className="start-quiz-btn"
              onClick={() => setSelectedQuiz(quiz)}
            >
              <Play size={18} />
              {quiz.attempts === 0 ? 'Start Quiz' : 'Retake Quiz'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Simulations Tab
  const renderSimulations = () => (
    <div className="simulations-tab">
      <h2>Interactive Simulations</h2>
      <p className="tab-description">Practice real-world scenarios in a safe virtual environment</p>
      
      <div className="simulations-grid">
        {simulationsData.map(sim => (
          <div 
            key={sim.id} 
            className={`simulation-card ${sim.locked ? 'locked' : ''}`}
            onClick={() => !sim.locked && setSelectedSimulation(sim)}
          >
            <div className="sim-header">
              <div className="sim-icon" style={{ background: sim.color }}>
                <span style={{ fontSize: '32px' }}>{sim.icon}</span>
              </div>
              <span className={`sim-difficulty ${sim.difficulty}`}>
                {sim.difficulty}
              </span>
            </div>
            <h3>{sim.title}</h3>
            <p className="sim-description">{sim.description}</p>
            <div className="sim-stats">
              <div className="sim-stat">
                <span className="label">Best Score</span>
                <span className="value">{sim.bestScore}%</span>
              </div>
              <div className="sim-stat">
                <span className="label">Attempts</span>
                <span className="value">{sim.attempts}</span>
              </div>
              <div className="sim-stat">
                <span className="label">Duration</span>
                <span className="value">{sim.duration}</span>
              </div>
            </div>
            {sim.locked ? (
              <div className="sim-locked">
                <Lock size={18} />
                <span>{sim.unlockRequirement || 'Locked'}</span>
              </div>
            ) : (
              <button className="launch-sim-btn">
                <Play size={18} />
                Launch Simulation
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="training-page">
      <div className="training-container">
        <div className="training-header">
          <div className="header-content">
            <GraduationCap size={40} />
            <div>
              <h1>Operator Training</h1>
              <p>Professional development and skill enhancement</p>
            </div>
          </div>
        </div>

        <div className="training-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={20} />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={20} />
            Courses
          </button>
          <button 
            className={`tab-button ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            <Award size={20} />
            Certifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <CheckCircle size={20} />
            Quizzes
          </button>
          <button 
            className={`tab-button ${activeTab === 'simulations' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulations')}
          >
            <Target size={20} />
            Simulations
          </button>
        </div>

        <div className="training-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'certifications' && renderCertifications()}
          {activeTab === 'quizzes' && renderQuizzes()}
          {activeTab === 'simulations' && renderSimulations()}
        </div>
      </div>

      {/* Modals */}
      {selectedCourse && (
        <CourseViewer 
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {selectedQuiz && (
        <QuizTaker 
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onComplete={handleQuizComplete}
        />
      )}

      {selectedSimulation && (
        <SimulationLauncher 
          simulation={selectedSimulation}
          onClose={() => setSelectedSimulation(null)}
          onComplete={handleSimulationComplete}
        />
      )}

      {showCertManager && (
        <CertificationManager 
          certifications={certificationsData}
          onClose={() => setShowCertManager(false)}
        />
      )}
    </div>
  );
};

export default OperatorTraining;
