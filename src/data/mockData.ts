// Mock Data for EHV Substation Digital Twin

export interface Transformer {
  id: string;
  name: string;
  type: string;
  voltageRating: string;
  capacity: string;
  manufacturer: string;
  installationDate: string;
  status: 'operational' | 'maintenance' | 'fault' | 'offline';
  health: number; // 0-100
  temperature: number;
  oilLevel: number;
  loadPercentage: number;
  vibrationLevel: number;
  moistureContent: number;
  lastMaintenance: string;
  nextMaintenance: string;
  alerts: Alert[];
}

export interface CircuitBreaker {
  id: string;
  name: string;
  type: string;
  voltageRating: string;
  currentRating: string;
  manufacturer: string;
  installationDate: string;
  status: 'closed' | 'open' | 'fault' | 'maintenance';
  health: number;
  operationCount: number;
  lastOperation: string;
  contactWear: number;
  sf6Pressure: number;
  temperature: number;
  tripTime: number; // milliseconds
  alerts: Alert[];
}

export interface Isolator {
  id: string;
  name: string;
  type: string;
  voltageRating: string;
  position: 'open' | 'closed' | 'intermediate';
  status: 'operational' | 'fault' | 'maintenance';
  health: number;
  operationCount: number;
  contactResistance: number;
  lastOperation: string;
}

export interface CT_CVT {
  id: string;
  name: string;
  type: 'CT' | 'CVT';
  voltageRating: string;
  accuracy: string;
  burden: string;
  status: 'operational' | 'fault' | 'maintenance';
  health: number;
  primaryCurrent?: number;
  secondaryCurrent?: number;
  ratio: string;
  saturationLevel: number;
  temperature: number;
}

export interface ProtectionSystem {
  id: string;
  name: string;
  type: string;
  protectionZone: string;
  status: 'armed' | 'triggered' | 'maintenance' | 'disabled';
  health: number;
  lastTest: string;
  nextTest: string;
  tripHistory: TripEvent[];
  relayModel: string;
  firmwareVersion: string;
}

export interface TripEvent {
  timestamp: string;
  reason: string;
  zone: string;
  cleared: boolean;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface SCADAData {
  timestamp: string;
  voltage_l1: number;
  voltage_l2: number;
  voltage_l3: number;
  current_l1: number;
  current_l2: number;
  current_l3: number;
  activePower: number;
  reactivePower: number;
  frequency: number;
  powerFactor: number;
}

export interface SensorReading {
  id: string;
  sensorType: string;
  assetId: string;
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetType: string;
  type: 'preventive' | 'corrective' | 'predictive';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface SimulationScenario {
  id: string;
  name: string;
  type: 'fault' | 'load' | 'switching' | 'protection';
  description: string;
  parameters: Record<string, any>;
  lastRun?: string;
  results?: any;
}

// Mock Transformers
export const mockTransformers: Transformer[] = [
  {
    id: 'TXF-001',
    name: 'Main Power Transformer T1',
    type: 'Auto Transformer',
    voltageRating: '400/220 kV',
    capacity: '315 MVA',
    manufacturer: 'ABB',
    installationDate: '2018-06-15',
    status: 'operational',
    health: 92,
    temperature: 68.5,
    oilLevel: 98.2,
    loadPercentage: 73.4,
    vibrationLevel: 2.3,
    moistureContent: 12.5, // ppm (parts per million)
    lastMaintenance: '2024-08-10',
    nextMaintenance: '2025-02-10',
    alerts: [
      {
        id: 'ALT-T1-001',
        severity: 'medium',
        message: 'Oil temperature trending upward',
        timestamp: '2025-10-02T08:30:00Z',
        acknowledged: false
      }
    ]
  },
  {
    id: 'TXF-002',
    name: 'Station Transformer T2',
    type: 'Power Transformer',
    voltageRating: '220/132 kV',
    capacity: '200 MVA',
    manufacturer: 'Siemens',
    installationDate: '2019-03-20',
    status: 'operational',
    health: 88,
    temperature: 72.1,
    oilLevel: 96.5,
    loadPercentage: 65.2,
    vibrationLevel: 3.1,
    moistureContent: 15.2, // ppm
    lastMaintenance: '2024-09-05',
    nextMaintenance: '2025-03-05',
    alerts: []
  },
  {
    id: 'TXF-003',
    name: 'Auxiliary Transformer T3',
    type: 'Distribution Transformer',
    voltageRating: '132/33 kV',
    capacity: '50 MVA',
    manufacturer: 'Schneider Electric',
    installationDate: '2020-01-10',
    status: 'operational',
    health: 95,
    temperature: 58.3,
    oilLevel: 99.1,
    loadPercentage: 45.8,
    vibrationLevel: 1.8,
    moistureContent: 8.4, // ppm
    lastMaintenance: '2024-07-22',
    nextMaintenance: '2025-01-22',
    alerts: []
  }
];

// Mock Circuit Breakers
export const mockCircuitBreakers: CircuitBreaker[] = [
  {
    id: 'CB-001',
    name: '400kV Bus Section Breaker',
    type: 'SF6 Circuit Breaker',
    voltageRating: '420 kV',
    currentRating: '4000 A',
    manufacturer: 'ABB',
    installationDate: '2018-05-10',
    status: 'closed',
    health: 90,
    operationCount: 1247,
    lastOperation: '2025-09-28T14:22:00Z',
    contactWear: 15.3,
    sf6Pressure: 6.2,
    temperature: 42.5,
    tripTime: 45,
    alerts: [
      {
        id: 'ALT-CB-001',
        severity: 'low',
        message: 'Approaching maintenance cycle threshold',
        timestamp: '2025-10-01T10:00:00Z',
        acknowledged: true
      }
    ]
  },
  {
    id: 'CB-002',
    name: '220kV Line Breaker L1',
    type: 'SF6 Circuit Breaker',
    voltageRating: '245 kV',
    currentRating: '3150 A',
    manufacturer: 'Siemens',
    installationDate: '2019-02-15',
    status: 'closed',
    health: 85,
    operationCount: 2134,
    lastOperation: '2025-09-30T09:15:00Z',
    contactWear: 22.7,
    sf6Pressure: 5.9,
    temperature: 45.2,
    tripTime: 48,
    alerts: [
      {
        id: 'ALT-CB-002',
        severity: 'high',
        message: 'Contact wear exceeds 20% threshold',
        timestamp: '2025-10-02T06:45:00Z',
        acknowledged: false
      }
    ]
  },
  {
    id: 'CB-003',
    name: '132kV Feeder Breaker F1',
    type: 'Vacuum Circuit Breaker',
    voltageRating: '145 kV',
    currentRating: '2000 A',
    manufacturer: 'GE',
    installationDate: '2020-07-08',
    status: 'closed',
    health: 94,
    operationCount: 856,
    lastOperation: '2025-09-29T16:40:00Z',
    contactWear: 8.2,
    sf6Pressure: 0, // Vacuum breaker
    temperature: 38.7,
    tripTime: 35,
    alerts: []
  }
];

// Mock Isolators
export const mockIsolators: Isolator[] = [
  {
    id: 'ISO-001',
    name: '400kV Bus Isolator A',
    type: 'Vertical Break Isolator',
    voltageRating: '420 kV',
    position: 'closed',
    status: 'operational',
    health: 91,
    operationCount: 423,
    contactResistance: 12.5,
    lastOperation: '2025-09-15T11:30:00Z'
  },
  {
    id: 'ISO-002',
    name: '220kV Line Isolator L1',
    type: 'Horizontal Break Isolator',
    voltageRating: '245 kV',
    position: 'closed',
    status: 'operational',
    health: 88,
    operationCount: 567,
    contactResistance: 15.2,
    lastOperation: '2025-09-20T08:45:00Z'
  },
  {
    id: 'ISO-003',
    name: '132kV Earthing Isolator',
    type: 'Earthing Switch',
    voltageRating: '145 kV',
    position: 'open',
    status: 'operational',
    health: 95,
    operationCount: 234,
    contactResistance: 8.3,
    lastOperation: '2025-08-30T14:20:00Z'
  }
];

// Mock CT/CVT Equipment
export const mockCT_CVT: CT_CVT[] = [
  {
    id: 'CT-001',
    name: '400kV Current Transformer CT1',
    type: 'CT',
    voltageRating: '420 kV',
    accuracy: '0.2S',
    burden: '30 VA',
    status: 'operational',
    health: 93,
    primaryCurrent: 2850,
    secondaryCurrent: 5.7,
    ratio: '2000/5',
    saturationLevel: 45.2,
    temperature: 52.3
  },
  {
    id: 'CVT-001',
    name: '220kV Capacitive Voltage Transformer',
    type: 'CVT',
    voltageRating: '245 kV',
    accuracy: '0.5',
    burden: '50 VA',
    status: 'operational',
    health: 89,
    ratio: '220000/110',
    saturationLevel: 38.7,
    temperature: 48.9
  },
  {
    id: 'CT-002',
    name: '132kV Current Transformer CT2',
    type: 'CT',
    voltageRating: '145 kV',
    accuracy: '0.2',
    burden: '25 VA',
    status: 'operational',
    health: 96,
    primaryCurrent: 1450,
    secondaryCurrent: 3.625,
    ratio: '1600/5',
    saturationLevel: 32.1,
    temperature: 45.2
  }
];

// Mock Protection Systems
export const mockProtectionSystems: ProtectionSystem[] = [
  {
    id: 'PROT-001',
    name: 'Main Transformer Differential Protection',
    type: 'Differential Relay',
    protectionZone: 'Zone 1 - Transformer T1',
    status: 'armed',
    health: 97,
    lastTest: '2024-09-15',
    nextTest: '2025-03-15',
    tripHistory: [
      {
        timestamp: '2024-05-12T03:22:15Z',
        reason: 'Differential fault detected - False alarm',
        zone: 'Zone 1',
        cleared: true
      }
    ],
    relayModel: 'ABB REF615',
    firmwareVersion: 'v2.5.1'
  },
  {
    id: 'PROT-002',
    name: 'Bus Bar Protection System',
    type: 'Bus Differential',
    protectionZone: 'Zone 2 - 400kV Bus',
    status: 'armed',
    health: 94,
    lastTest: '2024-08-20',
    nextTest: '2025-02-20',
    tripHistory: [],
    relayModel: 'Siemens 7SS52',
    firmwareVersion: 'v3.1.2'
  },
  {
    id: 'PROT-003',
    name: 'Line Distance Protection',
    type: 'Distance Relay',
    protectionZone: 'Zone 3 - 220kV Lines',
    status: 'armed',
    health: 91,
    lastTest: '2024-07-10',
    nextTest: '2025-01-10',
    tripHistory: [
      {
        timestamp: '2024-08-03T18:45:30Z',
        reason: 'Zone 2 fault - Lightning strike',
        zone: 'Zone 3',
        cleared: true
      },
      {
        timestamp: '2024-03-15T12:10:05Z',
        reason: 'Zone 1 fault - Tree contact',
        zone: 'Zone 3',
        cleared: true
      }
    ],
    relayModel: 'GE D60',
    firmwareVersion: 'v5.2.0'
  }
];

// Mock SCADA Data (time series)
export const generateSCADAData = (hours: number = 24): SCADAData[] => {
  const data: SCADAData[] = [];
  const now = new Date();
  
  for (let i = hours * 60; i >= 0; i -= 5) { // 5-minute intervals
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    
    data.push({
      timestamp: timestamp.toISOString(),
      voltage_l1: 398 + Math.sin(i / 100) * 8 + Math.random() * 2,
      voltage_l2: 399 + Math.cos(i / 100) * 7 + Math.random() * 2,
      voltage_l3: 397 + Math.sin(i / 120) * 9 + Math.random() * 2,
      current_l1: 2800 + Math.sin(i / 80) * 400 + Math.random() * 50,
      current_l2: 2850 + Math.cos(i / 90) * 380 + Math.random() * 50,
      current_l3: 2820 + Math.sin(i / 85) * 390 + Math.random() * 50,
      activePower: 1950 + Math.sin(i / 100) * 250 + Math.random() * 30,
      reactivePower: 420 + Math.cos(i / 110) * 80 + Math.random() * 15,
      frequency: 50.0 + (Math.random() - 0.5) * 0.1, // Hz, nominal 50Hz ±0.05Hz
      powerFactor: Math.max(0.88, Math.min(0.98, 0.93 + Math.sin(i / 150) * 0.04)) // Clamped between 0.88-0.98
    });
  }
  
  return data;
};

// Mock Sensor Readings
export const mockSensorReadings: SensorReading[] = [
  {
    id: 'SENS-001',
    sensorType: 'Temperature',
    assetId: 'TXF-001',
    value: 68.5,
    unit: '°C',
    timestamp: new Date().toISOString(),
    status: 'normal'
  },
  {
    id: 'SENS-002',
    sensorType: 'Vibration',
    assetId: 'TXF-001',
    value: 2.3,
    unit: 'mm/s',
    timestamp: new Date().toISOString(),
    status: 'normal'
  },
  {
    id: 'SENS-003',
    sensorType: 'SF6 Pressure',
    assetId: 'CB-001',
    value: 6.2,
    unit: 'bar',
    timestamp: new Date().toISOString(),
    status: 'normal'
  },
  {
    id: 'SENS-004',
    sensorType: 'Contact Wear',
    assetId: 'CB-002',
    value: 22.7,
    unit: '%',
    timestamp: new Date().toISOString(),
    status: 'warning'
  }
];

// Mock Maintenance Records
export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'MAINT-001',
    assetId: 'TXF-001',
    assetType: 'Transformer',
    type: 'preventive',
    status: 'scheduled',
    scheduledDate: '2025-02-10',
    description: 'Quarterly oil analysis and thermal imaging',
    priority: 'medium'
  },
  {
    id: 'MAINT-002',
    assetId: 'CB-002',
    assetType: 'Circuit Breaker',
    type: 'corrective',
    status: 'scheduled',
    scheduledDate: '2025-10-15',
    description: 'Contact replacement due to excessive wear',
    priority: 'high'
  },
  {
    id: 'MAINT-003',
    assetId: 'PROT-001',
    assetType: 'Protection System',
    type: 'preventive',
    status: 'completed',
    scheduledDate: '2024-09-15',
    completedDate: '2024-09-15',
    technician: 'John Smith',
    description: 'Semi-annual relay testing and calibration',
    priority: 'high'
  },
  {
    id: 'MAINT-004',
    assetId: 'TXF-002',
    assetType: 'Transformer',
    type: 'predictive',
    status: 'in-progress',
    scheduledDate: '2025-10-05',
    technician: 'Sarah Johnson',
    description: 'DGA analysis showing elevated hydrogen levels',
    priority: 'critical'
  }
];

// Mock Simulation Scenarios
export const mockSimulationScenarios: SimulationScenario[] = [
  {
    id: 'SIM-001',
    name: 'Single Line to Ground Fault',
    type: 'fault',
    description: 'Simulate L1 to ground fault at 400kV bus section',
    parameters: {
      faultLocation: '400kV Bus A',
      faultType: 'L-G',
      faultResistance: '5 Ohms',
      duration: '100ms'
    },
    lastRun: '2024-09-20T10:30:00Z',
    results: {
      faultCurrent: '45.2 kA',
      clearingTime: '85ms',
      protectionOperated: ['PROT-002'],
      breakersOperated: ['CB-001']
    }
  },
  {
    id: 'SIM-002',
    name: 'Transformer Overload Scenario',
    type: 'load',
    description: 'Test transformer behavior under 120% load condition',
    parameters: {
      targetTransformer: 'TXF-001',
      loadLevel: '120%',
      duration: '30 minutes',
      ambientTemp: '35°C'
    }
  },
  {
    id: 'SIM-003',
    name: 'Bus Transfer Operation',
    type: 'switching',
    description: 'Simulate transfer from Bus A to Bus B without interruption',
    parameters: {
      fromBus: '400kV Bus A',
      toBus: '400kV Bus B',
      method: 'Hot transfer'
    }
  }
];

// System-wide alerts
export const mockSystemAlerts: Alert[] = [
  {
    id: 'SYS-ALT-001',
    severity: 'high',
    message: 'Circuit Breaker CB-002 contact wear exceeds threshold',
    timestamp: '2025-10-02T06:45:00Z',
    acknowledged: false
  },
  {
    id: 'SYS-ALT-002',
    severity: 'medium',
    message: 'Transformer T1 oil temperature trending upward',
    timestamp: '2025-10-02T08:30:00Z',
    acknowledged: false
  },
  {
    id: 'SYS-ALT-003',
    severity: 'low',
    message: 'Scheduled maintenance due for Protection System PROT-003',
    timestamp: '2025-10-01T00:00:00Z',
    acknowledged: true
  },
  {
    id: 'SYS-ALT-004',
    severity: 'critical',
    message: 'Transformer T2 DGA analysis shows elevated hydrogen',
    timestamp: '2025-10-01T14:20:00Z',
    acknowledged: false
  },
  {
    id: 'SYS-ALT-005',
    severity: 'medium',
    message: 'Isolator ISO-002 operation count nearing maintenance threshold',
    timestamp: '2025-09-30T15:30:00Z',
    acknowledged: true
  },
  {
    id: 'SYS-ALT-006',
    severity: 'low',
    message: 'CT-005 secondary current reading slightly elevated',
    timestamp: '2025-09-30T10:20:00Z',
    acknowledged: true
  },
  {
    id: 'SYS-ALT-007',
    severity: 'high',
    message: 'SF6 pressure in CB-001 trending downward',
    timestamp: '2025-09-29T18:45:00Z',
    acknowledged: false
  },
  {
    id: 'SYS-ALT-008',
    severity: 'critical',
    message: 'Protection relay PROT-001 self-test failure',
    timestamp: '2025-09-29T09:15:00Z',
    acknowledged: false
  },
  {
    id: 'SYS-ALT-009',
    severity: 'medium',
    message: 'Bus voltage fluctuation detected on 220kV bus',
    timestamp: '2025-09-28T21:00:00Z',
    acknowledged: true
  },
  {
    id: 'SYS-ALT-010',
    severity: 'low',
    message: 'Routine inspection scheduled for Bay 3 equipment',
    timestamp: '2025-09-28T08:00:00Z',
    acknowledged: true
  }
];

// User Profile Data
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
  permissions: string[];
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    darkMode: boolean;
    language: string;
  };
}

export const mockUserProfile: UserProfile = {
  id: 'USER-001',
  username: 'admin',
  email: 'admin@evhsubstation.com',
  fullName: 'System Administrator',
  role: 'Administrator',
  department: 'Operations',
  phone: '+91 98765 43210',
  joinDate: '2023-01-15',
  lastLogin: '2025-10-07T10:30:00Z',
  permissions: [
    'view_all_assets',
    'modify_assets',
    'manage_users',
    'view_analytics',
    'run_simulations',
    'acknowledge_alerts',
    'generate_reports'
  ],
  preferences: {
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en'
  }
};

// Dashboard Statistics
export const mockDashboardStats = {
  totalAssets: 45,
  operationalAssets: 42,
  assetsInMaintenance: 2,
  faultedAssets: 1,
  overallSystemHealth: 91.5,
  activeAlerts: mockSystemAlerts.filter(a => !a.acknowledged).length,
  totalPower: 1950,
  systemFrequency: 50.02,
  voltageStability: 99.2,
  uptime: 99.87
};
