import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const QuantumParallelTemporalVisualization = ({ trainingConfig, epoch }) => {
  const [animationState, setAnimationState] = useState(0);
  
  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  // Generate quantum parallel paths based on configuration
  const generateQuantumPaths = () => {
    const paths = [];
    const numPaths = trainingConfig.nQubits * 2;
    const baseRadius = 150;
    
    for (let i = 0; i < numPaths; i++) {
      const angle = (i / numPaths) * Math.PI * 2;
      const offset = Math.sin(animationState * 0.02 + i * 0.5) * 15;
      const r = baseRadius + offset;
      
      // Generate path points
      const points = [];
      for (let j = 0; j <= 10; j++) {
        const t = j / 10;
        const radialOffset = Math.sin(t * Math.PI * 2 + animationState * 0.05) * 20;
        const x = 300 + Math.cos(angle + t * 0.5) * (r + radialOffset);
        const y = 250 + Math.sin(angle + t * 0.5) * (r + radialOffset);
        points.push([x, y]);
      }
      
      // Create path string
      const pathStr = points.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0]},${pt[1]}`).join(' ');
      
      // Add to paths
      paths.push({
        path: pathStr,
        color: `hsl(${(i * 25 + animationState) % 360}, 80%, 60%)`,
        opacity: 0.7 + Math.sin(animationState * 0.03 + i) * 0.3
      });
    }
    
    return paths;
  };
  
  // Generate temporal connections between quantum paths
  const generateTemporalConnections = () => {
    const connections = [];
    const paths = generateQuantumPaths();
    const numConnections = Math.min(20, trainingConfig.nQubits * 4);
    
    for (let i = 0; i < numConnections; i++) {
      const path1 = i % paths.length;
      const path2 = (i + 3) % paths.length;
      
      // Get points from the paths
      const pt1 = getPointFromPath(paths[path1].path, (animationState + i * 10) % 100 / 100);
      const pt2 = getPointFromPath(paths[path2].path, (animationState + i * 10 + 50) % 100 / 100);
      
      if (pt1 && pt2) {
        connections.push({
          x1: pt1[0],
          y1: pt1[1],
          x2: pt2[0],
          y2: pt2[1],
          color: `rgba(150, 255, 220, ${0.2 + Math.sin(animationState * 0.05 + i) * 0.1})`,
          width: 1 + Math.sin(animationState * 0.05 + i * 0.2) * 0.5
        });
      }
    }
    
    return connections;
  };
  
  // Helper function to get a point along a path
  const getPointFromPath = (pathStr, fraction) => {
    const parts = pathStr.split(' ');
    const numSegments = (parts.length - 1) / 2;
    const segmentIndex = Math.floor(fraction * numSegments) * 2 + 1;
    
    if (segmentIndex < parts.length) {
      const coords = parts[segmentIndex].split(',');
      return [parseFloat(coords[0]), parseFloat(coords[1])];
    }
    
    return null;
  };
  
  // Generate quantum gates/nodes
  const generateQuantumNodes = () => {
    const nodes = [];
    const numNodes = trainingConfig.nQubits * 2;
    
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      const radius = 80 + Math.sin(animationState * 0.05 + i * 0.5) * 40;
      
      const x = 300 + Math.cos(angle) * radius;
      const y = 250 + Math.sin(angle) * radius;
      
      nodes.push({
        x,
        y,
        size: 5 + Math.sin(animationState * 0.1 + i) * 2,
        color: `hsl(${(i * 40 + 180) % 360}, 70%, 60%)`,
        label: ['H', 'X', 'Z', 'Y', 'S', 'T', 'R', 'CNOT'][i % 8]
      });
    }
    
    return nodes;
  };
  
  // Generate activation wave effect
  const generateActivationWave = () => {
    const wave = {
      cx: 300,
      cy: 250,
      r: 30 + Math.sin(animationState * 0.05) * 10,
      color: 'rgba(32, 233, 181, 0.1)',
      pulses: []
    };
    
    // Add pulse waves
    for (let i = 0; i < 4; i++) {
      const pulseRadius = ((animationState + i * 25) % 100) * 2;
      const opacity = Math.max(0, 1 - pulseRadius / 200);
      
      wave.pulses.push({
        r: pulseRadius,
        opacity
      });
    }
    
    return wave;
  };
  
  // Compute geometric temporal centers
  const computeGeometricCenters = () => {
    const numPoints = 8;
    const centers = [];
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const t = (animationState / 100) * Math.PI * 2;
      
      // Lissajous curve for temporal modulation
      const x = 300 + Math.cos(angle + t) * Math.cos(t * 2) * 80;
      const y = 250 + Math.sin(angle + t) * Math.cos(t * 3) * 80;
      
      centers.push({
        x,
        y,
        size: 4 + Math.sin(t + i) * 2,
        color: `rgba(255, 255, 255, ${0.5 + Math.sin(t + i) * 0.3})`
      });
    }
    
    return centers;
  };
  
  // Generate state complexity indicators
  const generateStateComplexity = () => {
    const stateComponents = {
      spatialComplexity: 0.2 + Math.sin(animationState * 0.03) * 0.15,
      temporalEntanglement: 0.3 + Math.cos(animationState * 0.02) * 0.15,
      phaseCoherence: 0.5 + Math.sin(animationState * 0.04 + 1) * 0.2,
      dimensionalScaling: 0.6 + Math.cos(animationState * 0.05 + 2) * 0.15
    };
    
    return stateComponents;
  };
  
  // Paths, connections and nodes
  const quantumPaths = generateQuantumPaths();
  const temporalConnections = generateTemporalConnections();
  const quantumNodes = generateQuantumNodes();
  const activationWave = generateActivationWave();
  const geometricCenters = computeGeometricCenters();
  const stateComplexity = generateStateComplexity();
  
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium text-gray-200">Quantum Parallel Temporal Geometrical Neural Network</h3>
        <Info className="ml-2 text-gray-400" size={16} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <svg width="100%" height="500" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
            {/* Background effect */}
            <rect x="0" y="0" width="600" height="500" fill="#131926" />
            <circle cx="300" cy="250" r="200" fill="url(#quantum-gradient)" opacity="0.3" />
            
            {/* Activation wave pulses */}
            {activationWave.pulses.map((pulse, i) => (
              <circle 
                key={`pulse-${i}`}
                cx={activationWave.cx} 
                cy={activationWave.cy} 
                r={pulse.r} 
                fill="none" 
                stroke={activationWave.color}
                strokeWidth="2"
                opacity={pulse.opacity}
              />
            ))}
            
            {/* Temporal connections */}
            {temporalConnections.map((conn, i) => (
              <line
                key={`conn-${i}`}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke={conn.color}
                strokeWidth={conn.width}
              />
            ))}
            
            {/* Quantum paths */}
            {quantumPaths.map((pathData, i) => (
              <path
                key={`path-${i}`}
                d={pathData.path}
                fill="none"
                stroke={pathData.color}
                strokeWidth="2"
                opacity={pathData.opacity}
              />
            ))}
            
            {/* Geometric centers */}
            {geometricCenters.map((center, i) => (
              <circle
                key={`center-${i}`}
                cx={center.x}
                cy={center.y}
                r={center.size}
                fill={center.color}
              />
            ))}
            
            {/* Quantum nodes/gates */}
            {quantumNodes.map((node, i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={node.color}
                />
                <text
                  x={node.x}
                  y={node.y + node.size + 10}
                  fontSize="10"
                  fill="#aaa"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
            
            {/* Central element */}
            <circle
              cx="300"
              cy="250"
              r="15"
              fill="url(#central-gradient)"
            />
            
            {/* Definitions */}
            <defs>
              <radialGradient id="quantum-gradient">
                <stop offset="0%" stopColor="#20E9B5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#131926" stopOpacity="0" />
              </radialGradient>
              
              <radialGradient id="central-gradient">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#20E9B5" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
          <h4 className="text-white mb-4">Temporal Geometric Parameters</h4>
          
          {/* State complexity metrics */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Spatial Complexity</span>
                <span className="text-sm text-green-400">{(stateComplexity.spatialComplexity * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-out"
                  style={{ width: `${stateComplexity.spatialComplexity * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Temporal Entanglement</span>
                <span className="text-sm text-blue-400">{(stateComplexity.temporalEntanglement * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${stateComplexity.temporalEntanglement * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Phase Coherence</span>
                <span className="text-sm text-purple-400">{(stateComplexity.phaseCoherence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${stateComplexity.phaseCoherence * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Dimensional Scaling</span>
                <span className="text-sm text-indigo-400">{(stateComplexity.dimensionalScaling * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${stateComplexity.dimensionalScaling * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quantum temporal properties */}
          <div className="bg-gray-900 rounded-md p-3 mb-4">
            <h5 className="text-gray-300 mb-2 text-sm">Parallel Processing Units</h5>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="bg-gray-800 rounded p-1 text-center text-xs"
                  style={{ 
                    opacity: 0.5 + 0.5 * Math.sin(animationState * 0.05 + i * 0.5),
                    color: `hsl(${(i * 40 + 180) % 360}, 70%, 60%)`
                  }}
                >
                  T{i+1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Temporal geometry formula */}
          <div className="bg-gray-900 rounded-md p-3 mt-auto">
            <h5 className="text-gray-300 mb-2 text-sm">Temporal Geometric Formula</h5>
            <div className="font-mono text-green-400 text-xs leading-relaxed">
              Φ(t, θ) = ∑<sub>i</sub> e<sup>iθ<sub>i</sub></sup>|ψ<sub>i</sub>(t)⟩⊗|φ<sub>i</sub>(t)⟩<br/>
              ∇<sub>t</sub>Φ = H<sub>geo</sub>Φ + λ∇<sup>2</sup><sub>θ</sub>Φ<br/>
              B<sub>μν</sub> = ∂<sub>μ</sub>A<sub>ν</sub> - ∂<sub>ν</sub>A<sub>μ</sub> + i[A<sub>μ</sub>,A<sub>ν</sub>]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumParallelTemporalVisualization;