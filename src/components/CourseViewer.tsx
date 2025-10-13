import React, { useState } from 'react';
import { Course, Lesson } from '../types/training.types';
import { 
  X, 
  Play, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Download,
  FileText
} from 'lucide-react';
import './CourseViewer.css';

interface CourseViewerProps {
  course: Course | null;
  onClose: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onClose }) => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    course?.lessonsList?.[0] || null
  );
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  if (!course) return null;

  const handleLessonComplete = (lessonId: string) => {
    if (course.lessonsList) {
      const lessonIndex = course.lessonsList.findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1 && !course.lessonsList[lessonIndex].completed) {
        // Mark as completed (in real app, would update backend)
        course.lessonsList[lessonIndex].completed = true;
        
        // Auto-advance to next lesson
        if (lessonIndex < course.lessonsList.length - 1) {
          setCurrentLesson(course.lessonsList[lessonIndex + 1]);
        }
      }
    }
  };

  const completedLessons = course.lessonsList?.filter(l => l.completed).length || 0;
  const totalLessons = course.lessonsList?.length || course.lessons;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="course-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="course-viewer-container">
          {/* Video Player Section */}
          <div className="video-section">
            <div className="video-player">
              {currentLesson ? (
                <>
                  <div className="video-placeholder">
                    {isPlaying ? (
                      <div className="video-playing">
                        <div className="video-controls">
                          <button 
                            className="play-button"
                            onClick={() => setIsPlaying(false)}
                          >
                            ⏸️ Pause
                          </button>
                          <div className="video-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: '45%' }}></div>
                            </div>
                            <span className="time-display">5:30 / 12:00</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="play-button large"
                        onClick={() => setIsPlaying(true)}
                      >
                        <Play size={48} />
                      </button>
                    )}
                  </div>
                  <div className="video-info">
                    <h3>{currentLesson.title}</h3>
                    <div className="video-meta">
                      <span><Clock size={16} /> {currentLesson.duration}</span>
                      <button 
                        className="complete-lesson-btn"
                        onClick={() => handleLessonComplete(currentLesson.id)}
                        disabled={currentLesson.completed}
                      >
                        {currentLesson.completed ? (
                          <>
                            <CheckCircle size={16} /> Completed
                          </>
                        ) : (
                          <>
                            <Circle size={16} /> Mark as Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-lesson-selected">
                  <BookOpen size={64} />
                  <p>Select a lesson to begin</p>
                </div>
              )}
            </div>

            {/* Course Resources */}
            <div className="course-resources">
              <h4>Course Resources</h4>
              <div className="resource-list">
                <button className="resource-item">
                  <FileText size={18} />
                  <span>Course Syllabus</span>
                  <Download size={16} />
                </button>
                <button className="resource-item">
                  <FileText size={18} />
                  <span>Safety Guidelines PDF</span>
                  <Download size={16} />
                </button>
                <button className="resource-item">
                  <FileText size={18} />
                  <span>Equipment Specifications</span>
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="notes-section">
              <h4>My Notes</h4>
              <textarea
                className="notes-textarea"
                placeholder="Take notes while you learn..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
              <button className="save-notes-btn">Save Notes</button>
            </div>
          </div>

          {/* Lessons Sidebar */}
          <div className="lessons-sidebar">
            <div className="course-header">
              <div className="course-icon">{course.thumbnail}</div>
              <div>
                <h2>{course.title}</h2>
                <p className="instructor">by {course.instructor}</p>
              </div>
            </div>

            <div className="course-progress-overview">
              <div className="progress-stats">
                <span>{completedLessons} of {totalLessons} lessons completed</span>
                <span className="progress-percent">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="lessons-list">
              <h3>Course Content</h3>
              {course.lessonsList && course.lessonsList.length > 0 ? (
                course.lessonsList.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    className={`lesson-item ${
                      currentLesson?.id === lesson.id ? 'active' : ''
                    } ${lesson.completed ? 'completed' : ''}`}
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <div className="lesson-number">
                      {lesson.completed ? (
                        <CheckCircle size={20} className="check-icon" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="lesson-info">
                      <span className="lesson-title">{lesson.title}</span>
                      <span className="lesson-duration">
                        <Clock size={14} /> {lesson.duration}
                      </span>
                    </div>
                    <ChevronRight size={18} className="lesson-arrow" />
                  </button>
                ))
              ) : (
                <div className="no-lessons">
                  <p>No lessons available for this course yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
