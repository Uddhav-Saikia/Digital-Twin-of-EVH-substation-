// Training Module Type Definitions

export interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  enrolled: number;
  rating: number;
  progress?: number;
  status: 'locked' | 'in-progress' | 'available';
  instructor: string;
  lessons: number;
  description: string;
  thumbnail: string;
  lastAccessed?: string;
  videoUrl?: string;
  lessonsList?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  status: 'active' | 'expiring' | 'expired';
  score?: number;
  credentialId: string;
  description?: string;
  requirements?: string;
}

export interface Quiz {
  id: string;
  title: string;
  course: string;
  questions: number;
  duration: number;
  attempts: number;
  bestScore?: number;
  status: 'not-started' | 'in-progress';
  questionsList?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  bestScore: number;
  attempts: number;
  icon: string;
  color: string;
  locked: boolean;
  unlockRequirement?: string;
  scenarios?: SimulationScenario[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  challenges: string[];
  steps?: SimulationStep[];
}

export interface SimulationStep {
  id: string;
  instruction: string;
  options: string[];
  correctOption: number;
  feedback: string;
}

export interface InstructorMessage {
  id: string;
  subject: string;
  message: string;
  instructor?: string;
  timestamp: string;
  status: 'sent' | 'replied';
  reply?: string;
}
