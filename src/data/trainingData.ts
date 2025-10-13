import { Course, Certification, Quiz, Simulation, QuizQuestion, Lesson, SimulationScenario, SimulationStep } from '../types/training.types';

// Course Lessons Data
const ehvOperationsLessons: Lesson[] = [
  { id: 'L001', title: 'Introduction to EHV Systems', duration: '12 min', completed: true, videoUrl: 'https://example.com/video1' },
  { id: 'L002', title: 'Equipment Overview', duration: '18 min', completed: true, videoUrl: 'https://example.com/video2' },
  { id: 'L003', title: 'Safety Protocols', duration: '25 min', completed: true, videoUrl: 'https://example.com/video3' },
  { id: 'L004', title: 'Switching Procedures', duration: '30 min', completed: false, videoUrl: 'https://example.com/video4' },
  { id: 'L005', title: 'Load Management', duration: '22 min', completed: false, videoUrl: 'https://example.com/video5' },
];

const scadaSystemsLessons: Lesson[] = [
  { id: 'L101', title: 'SCADA Architecture', duration: '20 min', completed: true, videoUrl: 'https://example.com/video6' },
  { id: 'L102', title: 'Data Acquisition', duration: '25 min', completed: true, videoUrl: 'https://example.com/video7' },
  { id: 'L103', title: 'Remote Control Operations', duration: '30 min', completed: false, videoUrl: 'https://example.com/video8' },
  { id: 'L104', title: 'Alarm Management', duration: '18 min', completed: false, videoUrl: 'https://example.com/video9' },
];

// Courses Data
export const coursesData: Course[] = [
  {
    id: 'CRS-001',
    title: 'EHV Substation Operations Fundamentals',
    category: 'Operations',
    level: 'Beginner',
    duration: '8 hours',
    enrolled: 245,
    rating: 4.8,
    progress: 65,
    status: 'in-progress',
    instructor: 'Dr. Sarah Mitchell',
    lessons: 24,
    description: 'Comprehensive introduction to EHV substation operations, safety protocols, and equipment handling. Learn the fundamentals of high-voltage electrical systems and proper operational procedures.',
    thumbnail: '🏭',
    lastAccessed: '2025-10-10',
    lessonsList: ehvOperationsLessons
  },
  {
    id: 'CRS-002',
    title: 'Advanced SCADA Systems',
    category: 'Technology',
    level: 'Advanced',
    duration: '12 hours',
    enrolled: 189,
    rating: 4.9,
    progress: 30,
    status: 'in-progress',
    instructor: 'James Rodriguez',
    lessons: 36,
    description: 'Deep dive into SCADA system architecture, data acquisition, and remote control operations. Master advanced monitoring and control techniques.',
    thumbnail: '💻',
    lastAccessed: '2025-10-08',
    lessonsList: scadaSystemsLessons
  },
  {
    id: 'CRS-003',
    title: 'Electrical Safety & Hazard Prevention',
    category: 'Safety',
    level: 'Beginner',
    duration: '6 hours',
    enrolled: 412,
    rating: 4.9,
    progress: 0,
    status: 'available',
    instructor: 'Mark Thompson',
    lessons: 18,
    description: 'Essential safety protocols, arc flash protection, and emergency response procedures. Protect yourself and your team with industry-leading safety practices.',
    thumbnail: '⚡'
  },
  {
    id: 'CRS-004',
    title: 'Circuit Breaker Maintenance',
    category: 'Maintenance',
    level: 'Intermediate',
    duration: '10 hours',
    enrolled: 156,
    rating: 4.7,
    status: 'available',
    instructor: 'Lisa Chang',
    lessons: 28,
    description: 'Hands-on training for circuit breaker inspection, testing, and maintenance procedures. Learn diagnostic techniques and troubleshooting methods.',
    thumbnail: '🔌'
  },
  {
    id: 'CRS-005',
    title: 'Transformer Diagnostics',
    category: 'Maintenance',
    level: 'Advanced',
    duration: '15 hours',
    enrolled: 134,
    rating: 4.8,
    status: 'available',
    instructor: 'Dr. Michael Chen',
    lessons: 42,
    description: 'Advanced diagnostic techniques including DGA, thermal imaging, and predictive maintenance strategies for power transformers.',
    thumbnail: '🔧'
  },
  {
    id: 'CRS-006',
    title: 'Emergency Response & Crisis Management',
    category: 'Safety',
    level: 'Intermediate',
    duration: '8 hours',
    enrolled: 298,
    rating: 4.9,
    status: 'available',
    instructor: 'Captain Robert Hayes',
    lessons: 20,
    description: 'Comprehensive emergency response training including fire safety, evacuation procedures, and incident management protocols.',
    thumbnail: '🚨'
  },
  {
    id: 'CRS-007',
    title: 'Protection Systems & Relay Settings',
    category: 'Technology',
    level: 'Advanced',
    duration: '14 hours',
    enrolled: 167,
    rating: 4.7,
    status: 'locked',
    instructor: 'Dr. Emily Watson',
    lessons: 38,
    description: 'Advanced protection relay coordination, settings calculations, and testing procedures. Requires completion of CRS-002.',
    thumbnail: '🛡️'
  },
  {
    id: 'CRS-008',
    title: 'Load Management & Grid Optimization',
    category: 'Operations',
    level: 'Intermediate',
    duration: '10 hours',
    enrolled: 201,
    rating: 4.6,
    status: 'available',
    instructor: 'John Williams',
    lessons: 30,
    description: 'Learn load forecasting, demand management, and grid optimization strategies for efficient power distribution.',
    thumbnail: '📊'
  }
];

// Certifications Data
export const certificationsData: Certification[] = [
  {
    id: 'CERT-001',
    name: 'Certified EHV Operations Specialist',
    issuer: 'International Power Systems Institute',
    validUntil: '2026-12-31',
    status: 'active',
    score: 92,
    credentialId: 'IPSI-2024-EHV-00345',
    description: 'Professional certification in EHV substation operations',
    requirements: 'Complete CRS-001 with 85%+ score'
  },
  {
    id: 'CERT-002',
    name: 'SCADA Systems Professional',
    issuer: 'Automation Engineering Board',
    validUntil: '2025-11-15',
    status: 'expiring',
    score: 88,
    credentialId: 'AEB-2023-SCADA-01289',
    description: 'Advanced SCADA systems certification',
    requirements: 'Complete CRS-002 with 80%+ score'
  },
  {
    id: 'CERT-003',
    name: 'Electrical Safety Officer Level 3',
    issuer: 'National Electrical Safety Council',
    validUntil: '2025-08-20',
    status: 'expired',
    score: 95,
    credentialId: 'NESC-2022-ESO3-00567',
    description: 'Senior level electrical safety certification',
    requirements: 'Complete CRS-003 and pass safety exam'
  }
];

// Quiz Questions Data
const ehvQuizQuestions: QuizQuestion[] = [
  {
    id: 'Q1',
    question: 'What is the primary purpose of a circuit breaker in an EHV substation?',
    options: [
      'To measure voltage',
      'To interrupt fault currents and isolate equipment',
      'To transform voltage levels',
      'To store electrical energy'
    ],
    correctAnswer: 1,
    explanation: 'Circuit breakers are designed to interrupt fault currents and isolate equipment for safety and maintenance.'
  },
  {
    id: 'Q2',
    question: 'What does EHV stand for?',
    options: [
      'Electric High Voltage',
      'Extra High Voltage',
      'Enhanced Voltage',
      'Elevated High Voltage'
    ],
    correctAnswer: 1,
    explanation: 'EHV stands for Extra High Voltage, typically referring to voltages above 230kV.'
  },
  {
    id: 'Q3',
    question: 'Which safety equipment is mandatory when working near energized equipment?',
    options: [
      'Safety glasses only',
      'Hard hat only',
      'Complete PPE including arc flash protection',
      'Steel-toed boots only'
    ],
    correctAnswer: 2,
    explanation: 'Complete Personal Protective Equipment (PPE) including arc flash protection is mandatory for safety.'
  },
  {
    id: 'Q4',
    question: 'What is the purpose of a disconnect switch?',
    options: [
      'To provide visible isolation of equipment',
      'To interrupt load current',
      'To measure power',
      'To regulate voltage'
    ],
    correctAnswer: 0,
    explanation: 'Disconnect switches provide visible isolation of equipment for maintenance, but cannot interrupt load current.'
  },
  {
    id: 'Q5',
    question: 'What is the typical voltage level for EHV transmission lines?',
    options: [
      '11 kV - 33 kV',
      '110 kV - 132 kV',
      '230 kV - 765 kV',
      '1 kV - 10 kV'
    ],
    correctAnswer: 2,
    explanation: 'EHV transmission lines typically operate at 230 kV to 765 kV or higher.'
  }
];

const scadaQuizQuestions: QuizQuestion[] = [
  {
    id: 'Q6',
    question: 'What does SCADA stand for?',
    options: [
      'System Control and Data Acquisition',
      'Supervisory Control and Data Acquisition',
      'Substation Control and Data Analysis',
      'Secure Control and Digital Automation'
    ],
    correctAnswer: 1,
    explanation: 'SCADA stands for Supervisory Control and Data Acquisition.'
  },
  {
    id: 'Q7',
    question: 'Which protocol is commonly used in SCADA systems?',
    options: [
      'HTTP',
      'FTP',
      'IEC 61850',
      'SMTP'
    ],
    correctAnswer: 2,
    explanation: 'IEC 61850 is a widely used international standard for SCADA communication in substations.'
  },
  {
    id: 'Q8',
    question: 'What is the primary function of RTUs in a SCADA system?',
    options: [
      'Display data to operators',
      'Store historical data',
      'Interface with field devices and collect data',
      'Generate reports'
    ],
    correctAnswer: 2,
    explanation: 'Remote Terminal Units (RTUs) interface with field devices to collect and transmit data to the SCADA master station.'
  }
];

// Quizzes Data
export const quizzesData: Quiz[] = [
  {
    id: 'QZ-001',
    title: 'EHV Operations - Module 1 Assessment',
    course: 'EHV Substation Operations Fundamentals',
    questions: 25,
    duration: 30,
    attempts: 0,
    status: 'not-started',
    questionsList: ehvQuizQuestions
  },
  {
    id: 'QZ-002',
    title: 'SCADA Systems - Final Exam',
    course: 'Advanced SCADA Systems',
    questions: 50,
    duration: 90,
    attempts: 0,
    status: 'not-started',
    questionsList: scadaQuizQuestions
  },
  {
    id: 'QZ-003',
    title: 'Safety Protocols - Certification Test',
    course: 'Electrical Safety & Hazard Prevention',
    questions: 40,
    duration: 60,
    attempts: 0,
    status: 'not-started',
    questionsList: ehvQuizQuestions
  },
  {
    id: 'QZ-004',
    title: 'Circuit Breaker Knowledge Check',
    course: 'Circuit Breaker Maintenance',
    questions: 20,
    duration: 25,
    attempts: 0,
    status: 'not-started',
    questionsList: ehvQuizQuestions
  }
];

// Simulation Steps
const switchyardSteps: SimulationStep[] = [
  {
    id: 'S1',
    instruction: 'You need to isolate Transformer T1 for maintenance. What is the first step?',
    options: [
      'Open the circuit breaker immediately',
      'Verify the transformer is unloaded',
      'Open the disconnect switch',
      'Turn off all alarms'
    ],
    correctOption: 1,
    feedback: 'Always verify the equipment is unloaded before any switching operation.'
  },
  {
    id: 'S2',
    instruction: 'The transformer is now unloaded. What is the next step?',
    options: [
      'Open the disconnect switch',
      'Open the circuit breaker',
      'Tag the equipment',
      'Call for maintenance crew'
    ],
    correctOption: 1,
    feedback: 'Open the circuit breaker first to interrupt the current before using the disconnect switch.'
  },
  {
    id: 'S3',
    instruction: 'Circuit breaker is open. Now what?',
    options: [
      'Start maintenance',
      'Open HV side disconnect switches',
      'Remove all PPE',
      'Document the operation'
    ],
    correctOption: 1,
    feedback: 'Open the high voltage side disconnect switches to provide visible isolation.'
  }
];

const emergencySteps: SimulationStep[] = [
  {
    id: 'E1',
    instruction: 'Fire alarm activated in the control room! What is your immediate action?',
    options: [
      'Call 911',
      'Activate emergency procedures and evacuate',
      'Check SCADA screens',
      'Wait for instructions'
    ],
    correctOption: 1,
    feedback: 'Immediately activate emergency procedures and begin evacuation following the established protocol.'
  },
  {
    id: 'E2',
    instruction: 'While evacuating, you notice smoke near the transformer bay. What should you do?',
    options: [
      'Investigate the source',
      'Continue evacuation and report location to emergency services',
      'Try to extinguish it yourself',
      'Open all doors to ventilate'
    ],
    correctOption: 1,
    feedback: 'Continue evacuation immediately and report the exact location to emergency services.'
  }
];

// Simulation Scenarios
const switchyardScenarios: SimulationScenario[] = [
  {
    id: 'SC1',
    title: 'Transformer Isolation Procedure',
    description: 'Safely isolate a power transformer for scheduled maintenance',
    timeLimit: 300,
    challenges: ['Equipment selection', 'Switching sequence', 'Safety verification'],
    steps: switchyardSteps
  }
];

const emergencyScenarios: SimulationScenario[] = [
  {
    id: 'SC2',
    title: 'Fire Emergency Response',
    description: 'Respond to a fire alarm and manage evacuation procedures',
    timeLimit: 180,
    challenges: ['Quick decision making', 'Safety protocol', 'Communication'],
    steps: emergencySteps
  }
];

// Simulations Data
export const simulationsData: Simulation[] = [
  {
    id: 'SIM-001',
    title: 'Switchyard Operations Simulator',
    description: 'Practice switching sequences, load transfers, and equipment isolation in a realistic 3D environment.',
    difficulty: 'beginner',
    duration: '45 min average',
    bestScore: 87,
    attempts: 12,
    icon: '⚡',
    color: '#3b82f6',
    locked: false,
    scenarios: switchyardScenarios
  },
  {
    id: 'SIM-002',
    title: 'Emergency Response Training',
    description: 'Handle critical situations including equipment failures, fires, and grid disturbances.',
    difficulty: 'intermediate',
    duration: '60 min average',
    bestScore: 92,
    attempts: 8,
    icon: '🚨',
    color: '#ef4444',
    locked: false,
    scenarios: emergencyScenarios
  },
  {
    id: 'SIM-003',
    title: 'SCADA Control Room Simulator',
    description: 'Master SCADA operations, alarm management, and real-time decision making.',
    difficulty: 'intermediate',
    duration: '90 min average',
    bestScore: 78,
    attempts: 5,
    icon: '💻',
    color: '#22c55e',
    locked: false,
    scenarios: switchyardScenarios
  },
  {
    id: 'SIM-004',
    title: 'Advanced Fault Analysis',
    description: 'Diagnose complex fault scenarios using protection system data and event records.',
    difficulty: 'advanced',
    duration: '120 min average',
    bestScore: 0,
    attempts: 0,
    icon: '🎯',
    color: '#8b5cf6',
    locked: true,
    unlockRequirement: 'Complete "Protection Systems & Relay Settings" course to unlock',
    scenarios: []
  }
];
