import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sky, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { mockTransformers, mockCircuitBreakers, mockIsolators, mockCT_CVT, mockProtectionSystems } from '../data/mockData';

// Ground component
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#4a7c4e" roughness={0.8} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#606060" roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, -0.04, 10]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#707070" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Control Building component
function ControlBuilding({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 6, 8]} />
        <meshStandardMaterial color="#b8956a" roughness={0.7} />
      </mesh>

      <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[12.5, 1, 8.5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>

      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-4.5 + i * 1.5, 3.5, -4.1]} castShadow>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#3a5f7d" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// Professional Transformer component
function ProfessionalTransformer({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const transformerData = {
    name: `Transformer ${label}`,
    type: 'Transformer',
    status: 'operational',
    health: 95,
    temperature: 45,
    voltage: '400kV/220kV',
    capacity: '100 MVA',
    lastMaintenance: '2024-01-15'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 2.5, 0]} 
        castShadow 
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(transformerData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <boxGeometry args={[4, 5, 3]} />
        <meshStandardMaterial 
          color={hovered ? "#5a9bd4" : "#4a7ba7"} 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>

      <mesh position={[0, 5.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1, 8]} />
        <meshStandardMaterial color="#666666" roughness={0.4} metalness={0.8} />
      </mesh>

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-1 + i * 1, 3, 1.6]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
          <meshStandardMaterial color="#8b6f47" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.6, 4]} />
        <meshStandardMaterial color="#505050" roughness={0.8} />
      </mesh>

      {/* Label with background */}
      <mesh position={[0, 6.5, 0.01]}>
        <planeGeometry args={[label.length * 0.3, 0.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <Text
        position={[0, 6.5, 0]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Professional Circuit Breaker component
function ProfessionalCircuitBreaker({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const breakerData = {
    name: `Circuit Breaker ${label || 'CB'}`,
    type: 'Circuit Breaker',
    status: 'operational',
    health: 92,
    temperature: 38,
    voltage: '400kV',
    capacity: '63 kA',
    operations: 1250
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.5, 0]} 
        castShadow 
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(breakerData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <boxGeometry args={[1.5, 3, 1.5]} />
        <meshStandardMaterial 
          color={hovered ? "#3d6b4d" : "#2d5a3d"} 
          roughness={0.3} 
          metalness={0.6} 
        />
      </mesh>

      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#cc6600" roughness={0.4} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 2]} />
        <meshStandardMaterial color="#404040" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Professional Busbar component
function ProfessionalBusbar({ position, length }: { position: [number, number, number]; length: number }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={i} position={[0, 4 + i * 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, length, 16]} />
            <meshStandardMaterial color="#cc3333" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: Math.floor(length / 3) }).map((_, i) => (
        <mesh key={i} position={[0, 4.5, -length/2 + i * 3]} castShadow>
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshStandardMaterial color="#606060" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Professional Isolator component
function ProfessionalIsolator({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const isolatorData = {
    name: `Isolator ${label || 'ISO'}`,
    type: 'Isolator',
    status: 'operational',
    health: 88,
    temperature: 32,
    voltage: '400kV',
    position: 'Closed',
    operations: 850
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 2, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(isolatorData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
        <meshStandardMaterial 
          color={hovered ? "#a0a0a0" : "#888888"} 
          roughness={0.4} 
          metalness={0.7} 
        />
      </mesh>

      <mesh position={[0, 4.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial color="#cc9933" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#404040" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Current Transformer (CT) component
function CurrentTransformer({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const ctData = {
    name: `Current Transformer ${label || 'CT'}`,
    type: 'Current Transformer',
    id: label || 'CT',
    status: 'Operational',
    health: 88,
    temperature: '42°C',
    voltage: '400kV',
    capacity: '2000/5A',
    lastMaintenance: '2024-01-05'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.5, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(ctData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <cylinderGeometry args={[0.8, 0.8, 3, 12]} />
        <meshStandardMaterial 
          color={hovered ? "#e8f4fd" : "#d1e7dd"} 
          roughness={0.3} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Support structure */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

// Voltage Transformer (VT) component
function VoltageTransformer({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const vtData = {
    name: `Voltage Transformer ${label || 'VT'}`,
    type: 'Voltage Transformer',
    id: label || 'VT',
    status: 'Operational',
    health: 95,
    temperature: '38°C',
    voltage: '400kV/110V',
    capacity: '100VA',
    lastMaintenance: '2024-01-12'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.2, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(vtData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <cylinderGeometry args={[0.6, 0.6, 2.4, 12]} />
        <meshStandardMaterial 
          color={hovered ? "#fff3cd" : "#f8d7da"} 
          roughness={0.4} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Support structure */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

// Surge Arrester component
function SurgeArrester({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const surgeData = {
    name: `Surge Arrester ${label || 'SA'}`,
    type: 'Surge Arrester',
    id: label || 'SA',
    status: 'Operational',
    health: 98,
    temperature: '28°C',
    voltage: '420kV',
    capacity: '10kA',
    lastMaintenance: '2024-01-08'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.8, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(surgeData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <cylinderGeometry args={[0.2, 0.2, 3.6, 8]} />
        <meshStandardMaterial 
          color={hovered ? "#d4edda" : "#c3e6cb"} 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Support structure */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3.6, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

// Capacitor Bank component
function CapacitorBank({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const capacitorData = {
    name: `Capacitor Bank ${label || 'CB'}`,
    type: 'Capacitor Bank',
    id: label || 'CB',
    status: 'Operational',
    health: 90,
    temperature: '45°C',
    voltage: '400kV',
    capacity: '50MVAR',
    lastMaintenance: '2024-01-15'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(capacitorData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <boxGeometry args={[2, 2, 1.5]} />
        <meshStandardMaterial 
          color={hovered ? "#f8d7da" : "#f5c6cb"} 
          roughness={0.3} 
          metalness={0.4}
        />
      </mesh>
      
      {/* Support structure */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

// Reactor component
function Reactor({ position, label, onHover, onLeave }: { 
  position: [number, number, number]; 
  label?: string;
  onHover: (data: any, event?: any) => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const reactorData = {
    name: `Reactor ${label || 'R'}`,
    type: 'Reactor',
    id: label || 'R',
    status: 'Operational',
    health: 87,
    temperature: '52°C',
    voltage: '400kV',
    capacity: '30MVAR',
    lastMaintenance: '2024-01-18'
  };

  return (
    <group position={position}>
      <mesh 
        position={[0, 1.5, 0]} 
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(reactorData, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onLeave();
        }}
      >
        <cylinderGeometry args={[1.2, 1.2, 3, 12]} />
        <meshStandardMaterial 
          color={hovered ? "#d1ecf1" : "#bee5eb"} 
          roughness={0.4} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Support structure */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 3, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

// Enhanced Transmission Tower component
function TransmissionTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main tower structure */}
      <mesh position={[0, 10, 0]} castShadow>
        <boxGeometry args={[0.4, 20, 0.4]} />
        <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Cross braces */}
      <mesh position={[0, 10, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.3, 20, 0.3]} />
        <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Horizontal cross arms */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[0, 15 - i * 3, 0]}>
          {/* Left arm */}
          <mesh position={[3, 0, 0]} castShadow>
            <boxGeometry args={[6, 0.2, 0.2]} />
            <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Right arm */}
          <mesh position={[-3, 0, 0]} castShadow>
            <boxGeometry args={[6, 0.2, 0.2]} />
            <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Support braces */}
          <mesh position={[2, -1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[2, 0.1, 0.1]} />
            <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[-2, -1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <boxGeometry args={[2, 0.1, 0.1]} />
            <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Insulator strings on cross arms */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`insulators-${i}`} position={[0, 15 - i * 3, 0]}>
          {/* Left side insulators */}
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={`left-${j}`} position={[2.5 + j * 0.5, -0.5, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.1} metalness={0.1} />
            </mesh>
          ))}
          {/* Right side insulators */}
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={`right-${j}`} position={[-2.5 - j * 0.5, -0.5, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.1} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Tower base */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Foundation */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[3, 3, 1, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Warning lights */}
      <mesh position={[0, 19, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Power Lines component
// Enhanced Power Lines component
function PowerLines() {
  // Create multiple transmission line paths
  const createTransmissionLine = (startPos: [number, number, number], endPos: [number, number, number], height: number) => {
    const points = [
      new THREE.Vector3(startPos[0], height, startPos[2]),
      new THREE.Vector3((startPos[0] + endPos[0]) / 2, height + 2, (startPos[2] + endPos[2]) / 2),
      new THREE.Vector3(endPos[0], height, endPos[2]),
    ];
    return new THREE.CatmullRomCurve3(points);
  };

  // Main transmission lines from towers to substation
  const mainLines = [
    createTransmissionLine([-45, 0, -15], [-15, 0, -8], 18),
    createTransmissionLine([-45, 0, 15], [-15, 0, 8], 18),
    createTransmissionLine([45, 0, -15], [15, 0, -8], 18),
    createTransmissionLine([45, 0, 15], [15, 0, 8], 18),
  ];

  // Internal substation bus connections
  const busConnections = [
    createTransmissionLine([-15, 0, 0], [-10, 0, 0], 6),
    createTransmissionLine([15, 0, 0], [10, 0, 0], 6),
    createTransmissionLine([-5, 0, 5], [-5, 0, -5], 4),
    createTransmissionLine([5, 0, 5], [5, 0, -5], 4),
  ];

  // Component interconnections
  const componentConnections = [
    createTransmissionLine([-5, 0, 5], [-8, 0, 6], 3),
    createTransmissionLine([-5, 0, -5], [-8, 0, -6], 3),
    createTransmissionLine([5, 0, 5], [8, 0, 6], 3),
    createTransmissionLine([5, 0, -5], [8, 0, -6], 3),
  ];

  return (
    <group>
      {/* Main transmission lines (3 conductors per line) */}
      {mainLines.map((curve, lineIndex) => (
        Array.from({ length: 3 }).map((_, conductorIndex) => (
          <mesh key={`main-${lineIndex}-${conductorIndex}`} position={[0, conductorIndex * 0.3 - 0.3, 0]}>
            <tubeGeometry args={[curve, 100, 0.08, 8, false]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.8} />
          </mesh>
        ))
      ))}

      {/* Bus connections (single conductor) */}
      {busConnections.map((curve, index) => (
        <mesh key={`bus-${index}`}>
          <tubeGeometry args={[curve, 100, 0.06, 8, false]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Component interconnections */}
      {componentConnections.map((curve, index) => (
        <mesh key={`comp-${index}`}>
          <tubeGeometry args={[curve, 100, 0.04, 8, false]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}

      {/* Insulator strings */}
      {mainLines.map((curve, lineIndex) => (
        Array.from({ length: 3 }).map((_, conductorIndex) => (
          Array.from({ length: 5 }).map((_, insulatorIndex) => (
            <mesh 
              key={`insulator-${lineIndex}-${conductorIndex}-${insulatorIndex}`}
              position={[
                curve.points[1].x + (insulatorIndex - 2) * 2,
                curve.points[1].y + conductorIndex * 0.3 - 0.3,
                curve.points[1].z
              ]}
            >
              <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.1} metalness={0.1} />
            </mesh>
          ))
        ))
      ))}
    </group>
  );
}

interface Component3DProps {
  position: [number, number, number];
  type: 'transformer' | 'breaker' | 'isolator' | 'ct_cvt' | 'protection';
  data: any;
  onHover: (data: any) => void;
  onLeave: () => void;
}

const Component3D: React.FC<Component3DProps> = ({ position, type, data, onHover, onLeave }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const getComponentGeometry = () => {
    switch (type) {
      case 'transformer':
        // Main transformer body with cooling fins
        return new THREE.BoxGeometry(2.5, 3, 1.8);
      case 'breaker':
        // Circuit breaker with realistic proportions
        return new THREE.BoxGeometry(1.2, 0.6, 0.6);
      case 'isolator':
        // Insulator with ribbed design
        return new THREE.CylinderGeometry(0.2, 0.25, 2.5, 12);
      case 'ct_cvt':
        // Capacitor/bushing with smooth design
        return new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
      case 'protection':
        // Protection relay cabinet
        return new THREE.BoxGeometry(0.8, 1.2, 0.6);
      default:
        return new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }
  };

  const getComponentMaterial = () => {
    switch (type) {
      case 'transformer':
        return new THREE.MeshStandardMaterial({
          color: '#9ca3af',
          metalness: 0.3,
          roughness: 0.7,
          emissive: '#000000'
        });
      case 'breaker':
        return new THREE.MeshStandardMaterial({
          color: '#dc2626',
          metalness: 0.8,
          roughness: 0.2,
          emissive: '#000000'
        });
      case 'isolator':
        return new THREE.MeshStandardMaterial({
          color: '#7c2d12',
          metalness: 0.1,
          roughness: 0.9,
          emissive: '#000000'
        });
      case 'ct_cvt':
        return new THREE.MeshStandardMaterial({
          color: '#ffffff',
          metalness: 0.2,
          roughness: 0.3,
          emissive: '#000000'
        });
      case 'protection':
        return new THREE.MeshStandardMaterial({
          color: '#374151',
          metalness: 0.4,
          roughness: 0.6,
          emissive: '#000000'
        });
      default:
        return new THREE.MeshStandardMaterial({
          color: '#6b7280',
          metalness: 0.5,
          roughness: 0.5
        });
    }
  };

  const geometry = useMemo(() => getComponentGeometry(), [type]);
  const material = useMemo(() => getComponentMaterial(), [type]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(data);
      }}
      onPointerOut={() => {
        setHovered(false);
        onLeave();
      }}
    >
      {/* Background plane for text */}
      <mesh position={[0, 1.5, 0.01]}>
        <planeGeometry args={[data.name.length * 0.2, 0.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        strokeWidth={0.01}
        strokeColor="#ffffff"
        outlineWidth={0.02}
        outlineColor="#ffffff"
      >
        {data.name}
      </Text>
    </mesh>
  );
};

interface TooltipProps {
  data: any;
  position: [number, number, number];
}

const Tooltip: React.FC<TooltipProps> = ({ data, position }) => {
  return (
    <Html position={position} center>
      <div className="tooltip-3d">
        <div className="tooltip-header">
          <h4>{data.name}</h4>
          <span className={`status-badge ${data.status}`}>{data.status}</span>
        </div>
        <div className="tooltip-content">
          <div className="tooltip-row">
            <span>Health:</span>
            <span className="health-value">{data.health}%</span>
          </div>
          {data.temperature && (
            <div className="tooltip-row">
              <span>Temperature:</span>
              <span>{data.temperature}°C</span>
            </div>
          )}
          {data.loadPercentage && (
            <div className="tooltip-row">
              <span>Load:</span>
              <span>{data.loadPercentage}%</span>
            </div>
          )}
          {data.operationCount && (
            <div className="tooltip-row">
              <span>Operations:</span>
              <span>{data.operationCount}</span>
            </div>
          )}
          {data.voltageRating && (
            <div className="tooltip-row">
              <span>Voltage:</span>
              <span>{data.voltageRating}</span>
            </div>
          )}
          {data.capacity && (
            <div className="tooltip-row">
              <span>Capacity:</span>
              <span>{data.capacity}</span>
            </div>
          )}
        </div>
      </div>
    </Html>
  );
};

interface Substation3DSceneProps {
  zoomLevel?: number;
  onResetView?: () => void;
}

const Substation3DScene: React.FC<Substation3DSceneProps> = ({ 
  zoomLevel = 1, 
  onResetView 
}) => {
  const [hoveredComponent, setHoveredComponent] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number}>({x: 20, y: 20});
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, 8, 10]);

  const handleComponentHover = (data: any, event?: any) => {
    setHoveredComponent(data);
    
    // Calculate dynamic position based on mouse position
    if (event) {
      const containerRect = document.querySelector('.substation-3d-container')?.getBoundingClientRect();
      
      if (containerRect) {
        const x = event.clientX - containerRect.left;
        const y = event.clientY - containerRect.top;
        
        // Adjust position to keep tooltip within viewport
        const tooltipWidth = 320; // Reduced size
        const tooltipHeight = 250; // Reduced size
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        let finalX = x + 10;
        let finalY = y - 10;
        
        // Adjust if tooltip would go off right edge
        if (finalX + tooltipWidth > containerWidth) {
          finalX = x - tooltipWidth - 10;
        }
        
        // Adjust if tooltip would go off bottom edge
        if (finalY + tooltipHeight > containerHeight) {
          finalY = y - tooltipHeight - 10;
        }
        
        // Ensure tooltip doesn't go off left or top edges
        finalX = Math.max(10, finalX);
        finalY = Math.max(10, finalY);
        
        setTooltipPosition({ x: finalX, y: finalY });
      }
    }
  };

  const handleComponentLeave = () => {
    setHoveredComponent(null);
  };

  // Handle camera reset
  React.useEffect(() => {
    if (onResetView) {
      setCameraPosition([10, 8, 10]);
    }
  }, [onResetView]);


  // Handle zoom level changes
  React.useEffect(() => {
    const factor = 1 / zoomLevel;
    const newPosition: [number, number, number] = [
      10 * factor,
      8 * factor,
      10 * factor
    ];
    setCameraPosition(newPosition);
  }, [zoomLevel]);

  // Generate positions for components in a realistic substation layout
  const componentPositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {};
    
    // Transformers - Central area (main transformer)
    mockTransformers.forEach((transformer, index) => {
      positions[transformer.id] = [0, 1.25, 0]; // Centered, elevated
    });
    
    // Circuit Breakers - Left switchgear area
    mockCircuitBreakers.forEach((breaker, index) => {
      positions[breaker.id] = [-6 + index * 1.5, 0.2, -2];
    });
    
    // Isolators - Support structures around the yard
    mockIsolators.forEach((isolator, index) => {
      const angle = (index / mockIsolators.length) * Math.PI * 2;
      positions[isolator.id] = [
        Math.cos(angle) * 4, 
        1, 
        Math.sin(angle) * 4
      ];
    });
    
    // CT/CVT - White capacitors/bushings on support structures
    mockCT_CVT.forEach((ct, index) => {
      positions[ct.id] = [-4 + index * 2, 2.5, -3];
    });
    
    // Protection Systems - Right side gantry area
    mockProtectionSystems.forEach((protection, index) => {
      positions[protection.id] = [6, 0.4, -2 + index * 1.5];
    });
    
    return positions;
  }, []);

  return (
    <div className="substation-3d-container">

        <Canvas 
          shadows
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={100}
              maxPolarAngle={Math.PI / 2.2}
              enableDamping={true}
              dampingFactor={0.05}
            />

            <ambientLight intensity={0.4} />
            <directionalLight
              position={[50, 50, 25]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={200}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            <hemisphereLight intensity={0.3} groundColor="#5a4a3a" />

            <Sky sunPosition={[100, 20, 100]} />
        
            <Ground />
        
            {/* Professional Transformers */}
            <ProfessionalTransformer position={[-5, 0, 5]} label="T1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalTransformer position={[-5, 0, -5]} label="T2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalTransformer position={[5, 0, 5]} label="T3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
        
            {/* Professional Circuit Breakers */}
            <ProfessionalCircuitBreaker position={[-10, 0, 8]} label="CB1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[-10, 0, 2]} label="CB2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[-10, 0, -2]} label="CB3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[-10, 0, -8]} label="CB4" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[10, 0, 8]} label="CB5" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[10, 0, 2]} label="CB6" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[10, 0, -2]} label="CB7" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalCircuitBreaker position={[10, 0, -8]} label="CB8" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Professional Busbars */}
            <ProfessionalBusbar position={[-15, 0, 0]} length={20} />
            <ProfessionalBusbar position={[15, 0, 0]} length={20} />

            {/* Professional Isolators */}
            <ProfessionalIsolator position={[-12, 0, 10]} label="ISO1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[-12, 0, 5]} label="ISO2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[-12, 0, 0]} label="ISO3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[-12, 0, -5]} label="ISO4" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[-12, 0, -10]} label="ISO5" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[12, 0, 10]} label="ISO6" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[12, 0, 5]} label="ISO7" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[12, 0, 0]} label="ISO8" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[12, 0, -5]} label="ISO9" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <ProfessionalIsolator position={[12, 0, -10]} label="ISO10" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Current Transformers */}
            <CurrentTransformer position={[-8, 0, 6]} label="CT1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CurrentTransformer position={[-8, 0, -6]} label="CT2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CurrentTransformer position={[8, 0, 6]} label="CT3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CurrentTransformer position={[8, 0, -6]} label="CT4" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Voltage Transformers */}
            <VoltageTransformer position={[-6, 0, 8]} label="VT1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <VoltageTransformer position={[-6, 0, -8]} label="VT2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <VoltageTransformer position={[6, 0, 8]} label="VT3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <VoltageTransformer position={[6, 0, -8]} label="VT4" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Surge Arresters */}
            <SurgeArrester position={[-7, 0, 7]} label="SA1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <SurgeArrester position={[-7, 0, -7]} label="SA2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <SurgeArrester position={[7, 0, 7]} label="SA3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <SurgeArrester position={[7, 0, -7]} label="SA4" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Capacitor Banks */}
            <CapacitorBank position={[-20, 0, 12]} label="CB1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CapacitorBank position={[-20, 0, -12]} label="CB2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CapacitorBank position={[20, 0, 12]} label="CB3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <CapacitorBank position={[20, 0, -12]} label="CB4" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Reactors */}
            <Reactor position={[-18, 0, 15]} label="R1" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <Reactor position={[-18, 0, -15]} label="R2" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <Reactor position={[18, 0, 15]} label="R3" onHover={handleComponentHover} onLeave={handleComponentLeave} />
            <Reactor position={[18, 0, -15]} label="R4" onHover={handleComponentHover} onLeave={handleComponentLeave} />

            {/* Control Buildings */}
            <ControlBuilding position={[-28, 0, 8]} />
            <ControlBuilding position={[-28, 0, -5]} />

            {/* Transmission Towers */}
            <TransmissionTower position={[-45, 0, -15]} />
            <TransmissionTower position={[-45, 0, 15]} />
            <TransmissionTower position={[45, 0, -15]} />
            <TransmissionTower position={[45, 0, 15]} />
            
            {/* Additional transmission towers for more realistic layout */}
            <TransmissionTower position={[-60, 0, 0]} />
            <TransmissionTower position={[60, 0, 0]} />
            <TransmissionTower position={[-30, 0, -25]} />
            <TransmissionTower position={[-30, 0, 25]} />
            <TransmissionTower position={[30, 0, -25]} />
            <TransmissionTower position={[30, 0, 25]} />

            {/* Power Lines */}
            <PowerLines />
            
          </Suspense>
        </Canvas>
        
        



        {/* Enhanced Component Tooltip */}
        {hoveredComponent && (
          <div 
            className="component-tooltip"
            style={{
              position: 'absolute',
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              minWidth: '260px',
              maxWidth: '300px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              overflow: 'hidden',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Premium Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: hoveredComponent.status === 'Operational' ? '#10b981' : '#ef4444',
                      boxShadow: '0 0 0 3px rgba(255,255,255,0.3), 0 0 20px rgba(16, 185, 129, 0.4)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <h3 style={{ 
                      margin: '0', 
                      fontSize: '22px', 
                      fontWeight: '700', 
                      letterSpacing: '-0.02em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {hoveredComponent.name}
                    </h3>
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    opacity: 0.9, 
                    fontWeight: '500',
                    letterSpacing: '0.01em'
                  }}>
                    {hoveredComponent.type} • ID: {hoveredComponent.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Content */}
            <div style={{ padding: '20px' }}>
              {/* Status Section */}
              <div style={{ 
                marginBottom: '16px',
                padding: '14px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: hoveredComponent.status === 'Operational' ? '#10b981' : '#ef4444',
                      animation: 'pulse 2s infinite',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
                    }}></div>
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: hoveredComponent.status === 'Operational' ? '#10b981' : '#ef4444'
                    }}>
                      {hoveredComponent.status}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: '#475569'
                  }}>
                    {hoveredComponent.health}% Health
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${hoveredComponent.health}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${hoveredComponent.health > 80 ? '#10b981' : hoveredComponent.health > 60 ? '#f59e0b' : '#ef4444'} 0%, ${hoveredComponent.health > 80 ? '#34d399' : hoveredComponent.health > 60 ? '#fbbf24' : '#f87171'} 100%)`,
                    borderRadius: '4px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}></div>
                </div>
              </div>

              {/* Technical Specs */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: '#1e293b',
                  letterSpacing: '-0.01em'
                }}>
                  Technical Specifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLDivElement).style.background = '#f1f5f9';
                    (e.target as HTMLDivElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLDivElement).style.background = '#f8fafc';
                    (e.target as HTMLDivElement).style.transform = 'translateY(0)';
                  }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Temperature</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                      {hoveredComponent.temperature}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLDivElement).style.background = '#f1f5f9';
                    (e.target as HTMLDivElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLDivElement).style.background = '#f8fafc';
                    (e.target as HTMLDivElement).style.transform = 'translateY(0)';
                  }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Voltage</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                      {hoveredComponent.voltage}
                    </span>
                  </div>
                  {hoveredComponent.capacity && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLDivElement).style.background = '#f1f5f9';
                      (e.target as HTMLDivElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLDivElement).style.background = '#f8fafc';
                      (e.target as HTMLDivElement).style.transform = 'translateY(0)';
                    }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Capacity</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {hoveredComponent.capacity}
                      </span>
                    </div>
                  )}
                  {hoveredComponent.lastMaintenance && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLDivElement).style.background = '#f1f5f9';
                      (e.target as HTMLDivElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLDivElement).style.background = '#f8fafc';
                      (e.target as HTMLDivElement).style.transform = 'translateY(0)';
                    }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Last Maintenance</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {hoveredComponent.lastMaintenance}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Dynamic Pointer */}
            <div 
              className="tooltip-pointer"
              style={{
                position: 'absolute',
                width: '0',
                height: '0',
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderTop: '16px solid white',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                ...(tooltipPosition.x < 200 ? {
                  left: '80px',
                  bottom: '-16px'
                } : tooltipPosition.x > 400 ? {
                  right: '80px',
                  bottom: '-16px'
                } : {
                  left: '50%',
                  bottom: '-16px',
                  transform: 'translateX(-50%)'
                })
              }}
            ></div>
          </div>
        )}

    </div>
  );
};

export default Substation3DScene;
