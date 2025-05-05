import React, { useState, useEffect, useRef } from 'react';
import { Info, Share2, ZoomIn, ZoomOut, PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';

const DynamicParallelKnowledgeGraph = ({ trainingConfig }) => {
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [tick, setTick] = useState(0);
  const svgRef = useRef(null);
  
  // Dragging state
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Define concepts related to adaptive optics system from the image
  const concepts = [
    { id: 'ngs', label: 'Natural Guide Stars (NGS)', group: 'input', score: 0.89 },
    { id: 'ao', label: 'Adaptive Optics (AO)', group: 'system', score: 0.92 },
    { id: 'turbulence', label: 'Atmospheric Turbulence', group: 'environment', score: 0.85 },
    { id: 'sodium', label: 'Sodium Centroid', group: 'measurement', score: 0.78 },
    { id: 'focus_error', label: 'Focus Error', group: 'error', score: 0.81 },
    { id: 'telescopes', label: '2.5 m ANI Telescopes', group: 'hardware', score: 0.94 },
    { id: 'spatial_center', label: 'Seeing/Spatial Center', group: 'measurement', score: 0.74 },
    { id: 'ugs', label: 'LGS Facility', group: 'system', score: 0.88 },
    { id: 'laser', label: 'Laser', group: 'hardware', score: 0.91 },
    { id: 'eco', label: '1.0 m ECO Telescope', group: 'hardware', score: 0.86 },
    { id: 'optics', label: 'Adaptive Optics', group: 'system', score: 0.93 },
    { id: 'deformable', label: 'Deformable Mirror', group: 'hardware', score: 0.87 },
    { id: 'modulation', label: 'Modulation Strength', group: 'parameter', score: 0.79 },
    { id: 'camera', label: 'Camera', group: 'hardware', score: 0.90 },
    { id: 'generator', label: 'AO Generator', group: 'system', score: 0.82 },
    { id: 'sodium_layer', label: 'Sodium Layer', group: 'environment', score: 0.84 },
    { id: 'tilt', label: 'Giant Magneto Tilt', group: 'measurement', score: 0.77 },
    { id: 'vertical_shift', label: 'Vertical Shift', group: 'parameter', score: 0.83 }
  ];
  
  // Outcome predictions
  const outcomeScenarios = [
    { 
      id: 'optimal_correction', 
      label: 'Optimal Wavefront Correction',
      probability: 0.87,
      description: 'High quality correction with minimal residual error',
      requiredConcepts: ['ngs', 'ao', 'deformable', 'optics']
    },
    { 
      id: 'partial_correction', 
      label: 'Partial Wavefront Correction',
      probability: 0.65,
      description: 'Moderate correction with noticeable artifacts',
      requiredConcepts: ['ngs', 'turbulence', 'sodium']
    },
    { 
      id: 'sodium_fluctuation', 
      label: 'Sodium Layer Fluctuation',
      probability: 0.42,
      description: 'Unstable correction due to sodium layer variations',
      requiredConcepts: ['sodium', 'sodium_layer', 'modulation']
    },
    { 
      id: 'focus_compensation', 
      label: 'Focus Error Compensation',
      probability: 0.73,
      description: 'Successful compensation of focus errors',
      requiredConcepts: ['focus_error', 'ao', 'deformable']
    },
    { 
      id: 'turbulence_resilience', 
      label: 'Turbulence Resilience',
      probability: 0.58,
      description: 'System maintains performance under varying turbulence',
      requiredConcepts: ['turbulence', 'optics', 'generator']
    }
  ];
  
  // Initialize graph
  useEffect(() => {
    // Initialize graph immediately
    initializeGraph();
    
    // Start simulation tick
    const interval = setInterval(() => {
      if (simulationRunning) {
        setTick(prev => prev + 1);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update positions on tick
  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      if (simulationRunning) {
        updateNodePositions();
        updatePredictions();
      }
    }
  }, [tick, nodes.length, edges.length, simulationRunning]);
  
  // Initialize graph nodes and edges
  const initializeGraph = () => {
    // Force immediate initialization
    setTimeout(() => {
      // Create nodes from concepts
      const graphNodes = concepts.map(concept => {
        // Calculate position in a circular layout
        const angle = Math.random() * Math.PI * 2;
        const radius = 150 + Math.random() * 100;
        
        return {
          ...concept,
          x: 400 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius,
          size: 10 + concept.score * 10,
          color: getGroupColor(concept.group),
          // Add dynamic properties
          velocity: { x: 0, y: 0 },
          force: { x: 0, y: 0 },
          active: true // Set all nodes initially active
        };
      });
    
    // Create edges between related concepts
    const graphEdges = [];
    
    // Create some logical connections between nodes
    const relationPairs = [
      ['ngs', 'ao'], ['turbulence', 'focus_error'], ['sodium', 'sodium_layer'],
      ['ao', 'optics'], ['turbulence', 'ao'], ['telescopes', 'ngs'],
      ['laser', 'sodium'], ['optics', 'deformable'], ['ngs', 'spatial_center'],
      ['generator', 'optics'], ['camera', 'focus_error'], ['ugs', 'laser'],
      ['modulation', 'laser'], ['tilt', 'focus_error'], ['eco', 'camera'],
      ['vertical_shift', 'sodium'], ['sodium', 'focus_error'], ['optics', 'camera']
    ];
    
    relationPairs.forEach(([source, target]) => {
      graphEdges.push({
        id: `${source}-${target}`,
        source,
        target,
        strength: 0.3 + Math.random() * 0.7,
        active: true // Set all edges initially active
      });
    });
    
    // Set the state with initial values
    setNodes(graphNodes);
    setEdges(graphEdges);
    setPredictions(outcomeScenarios.map(p => ({ ...p, currentProbability: p.probability, isHighlighted: true })));
    }, 0); // End of setTimeout
    setPredictions(outcomeScenarios);
  };
  
  // Update node positions using force-directed algorithm
  const updateNodePositions = () => {
    if (!nodes.length || !edges.length) return;
    
    const updatedNodes = [...nodes];
    const updatedEdges = [...edges];
    
    // Apply forces between nodes (repulsion)
    for (let i = 0; i < updatedNodes.length; i++) {
      for (let j = i + 1; j < updatedNodes.length; j++) {
        const nodeA = updatedNodes[i];
        const nodeB = updatedNodes[j];
        
        if (!nodeA || !nodeB) continue;
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Repulsive force (inverse square)
        const repulsiveForce = 2000 / (distance * distance);
        const fx = (dx / distance) * repulsiveForce;
        const fy = (dy / distance) * repulsiveForce;
        
        // Apply force with opposite direction to each node
        nodeA.force.x -= fx;
        nodeA.force.y -= fy;
        nodeB.force.x += fx;
        nodeB.force.y += fy;
      }
    }
    
    // Apply forces from edges (attraction)
    updatedEdges.forEach(edge => {
      const sourceNode = updatedNodes.find(n => n.id === edge.source);
      const targetNode = updatedNodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Spring force (linear)
        const springForce = 0.005 * distance * edge.strength;
        const fx = (dx / distance) * springForce;
        const fy = (dy / distance) * springForce;
        
        // Apply force to each node
        sourceNode.force.x += fx;
        sourceNode.force.y += fy;
        targetNode.force.x -= fx;
        targetNode.force.y -= fy;
        
        // Update edge activity based on node activity
        edge.active = (sourceNode.active && targetNode.active) || 
                      (Math.sin(tick * 0.05 + parseInt(edge.source, 36) % 10 * 0.2) > 0.7);
      }
    });
    
    // Center gravity force
    updatedNodes.forEach(node => {
      const dx = 400 + offset.x - node.x;
      const dy = 300 + offset.y - node.y;
      
      node.force.x += dx * 0.0005;
      node.force.y += dy * 0.0005;
      
      // Update position based on forces
      node.velocity.x = (node.velocity.x + node.force.x) * 0.6;
      node.velocity.y = (node.velocity.y + node.force.y) * 0.6;
      
      node.x += node.velocity.x;
      node.y += node.velocity.y;
      
      // Reset forces for next iteration
      node.force = { x: 0, y: 0 };
      
      // Randomly update node activity
      if (Math.random() < 0.01) {
        node.active = !node.active;
      }
      
      // Update activity based on sine wave
      node.active = Math.sin(tick * 0.03 + parseInt(node.id, 36) % 10 * 0.3) > 0.5;
    });
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };
  
  // Update predictions based on active nodes
  const updatePredictions = () => {
    if (!nodes.length || !predictions.length) return;
    
    const activeNodeIds = nodes.filter(n => n.active).map(n => n.id);
    
    // Update prediction probabilities based on active nodes
    const updatedPredictions = predictions.map(prediction => {
      // Calculate how many required concepts are active
      const requiredActive = prediction.requiredConcepts.filter(id => 
        activeNodeIds.includes(id)
      ).length;
      
      // Adjust probability based on active nodes
      const baseProb = prediction.probability;
      const coverage = requiredActive / (prediction.requiredConcepts.length || 1); // Avoid division by zero
      
      // Dynamic probability with some randomness
      const dynamicProb = baseProb * (0.5 + coverage * 0.5) + 
                          (Math.sin(tick * 0.02 + (parseInt(prediction.id, 36) || 0) % 10 * 0.5) * 0.1);
      
      return {
        ...prediction,
        currentProbability: Math.max(0.1, Math.min(0.99, dynamicProb)),
        isHighlighted: coverage > 0.7
      };
    });
    
    setPredictions(updatedPredictions);
  };
  
  // Get color based on node group
  const getGroupColor = (group) => {
    const colorMap = {
      'input': '#4ade80',       // Green
      'system': '#60a5fa',      // Blue
      'environment': '#f87171', // Red
      'measurement': '#a78bfa',  // Purple
      'error': '#f97316',       // Orange
      'hardware': '#facc15',    // Yellow
      'parameter': '#c084fc'    // Violet
    };
    
    return colorMap[group] || '#94a3b8'; // Default gray
  };
  
  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click only
      setDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  // Find edge between two nodes
  const findEdge = (sourceId, targetId) => {
    return edges.find(e => 
      (e.source === sourceId && e.target === targetId) || 
      (e.source === targetId && e.target === sourceId)
    );
  };
  
  // Calculate the center position for the graph
  const centerX = 400 + offset.x;
  const centerY = 300 + offset.y;
  
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-xl font-medium text-gray-200">Parallel Knowledge Graph</h3>
          <Info className="ml-2 text-gray-400" size={16} />
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-2 py-1 flex items-center"
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.2))}
          >
            <ZoomIn size={16} />
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-2 py-1 flex items-center"
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
          >
            <ZoomOut size={16} />
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-2 py-1 flex items-center"
            onClick={() => setSimulationRunning(prev => !prev)}
          >
            {simulationRunning ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-2 py-1 flex items-center"
            onClick={() => {
              setOffset({ x: 0, y: 0 });
              initializeGraph();
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 relative h-[600px] overflow-hidden">
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            className="cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Graph background */}
            <g transform={`scale(${zoomLevel}) translate(${offset.x / zoomLevel}, ${offset.y / zoomLevel})`}>
              {/* Connect concepts with outcomes */}
              {predictions.map(prediction => 
                prediction.requiredConcepts.map(conceptId => {
                  const concept = nodes.find(n => n.id === conceptId);
                  if (!concept) return null;
                  
                  // Calculate outcome point at edge of visualization
                  const angle = Math.atan2(600 - concept.y, 800 - concept.x);
                  const edgeX = concept.x + Math.cos(angle) * 200;
                  const edgeY = concept.y + Math.sin(angle) * 200;
                  
                  const isActive = concept.active && prediction.isHighlighted;
                  
                  return (
                    <line
                      key={`outcome-${prediction.id}-${conceptId}`}
                      x1={concept.x}
                      y1={concept.y}
                      x2={edgeX}
                      y2={edgeY}
                      stroke={isActive ? '#a855f7' : '#3f3f46'}
                      strokeWidth={isActive ? 2 : 0.5}
                      strokeDasharray={isActive ? '0' : '3,3'}
                      opacity={isActive ? 0.8 : 0.2}
                    />
                  );
                })
              )}
            
              {/* Draw edges */}
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                
                if (!source || !target) return null;
                
                // Draw a curved line between nodes
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2 + (Math.sin(tick * 0.03) * 10);
                const pathData = `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
                
                return (
                  <path
                    key={edge.id}
                    d={pathData}
                    stroke={edge.active ? getGroupColor(source.group) : '#3f3f46'}
                    strokeWidth={edge.active ? edge.strength * 3 : 1}
                    fill="none"
                    opacity={edge.active ? 0.7 : 0.3}
                    strokeDasharray={edge.active ? "0" : "3,3"}
                  />
                );
              })}
              
              {/* Draw nodes */}
              {nodes.map(node => (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  opacity={node.active ? 1 : 0.5}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Pulse effect for active nodes */}
                  {node.active && (
                    <circle
                      r={node.size * 1.5}
                      fill={node.color}
                      opacity={0.2 + 0.2 * Math.sin(tick * 0.1)}
                    />
                  )}
                  
                  {/* Node circle */}
                  <circle
                    r={node.size}
                    fill={node.color}
                    stroke={activeNode === node.id ? "#ffffff" : "rgba(0,0,0,0.3)"}
                    strokeWidth={activeNode === node.id ? 2 : 1}
                  />
                  
                  {/* Label */}
                  <text
                    y={node.size + 10}
                    fill={node.active ? "#e2e8f0" : "#94a3b8"}
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight={node.active ? "bold" : "normal"}
                  >
                    {node.label.split(' ')[0]}
                  </text>
                  
                  {/* Score */}
                  <text
                    y={-node.size - 5}
                    fill={node.active ? "#e2e8f0" : "#94a3b8"}
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {(node.score * 100).toFixed(0)}%
                  </text>
                </g>
              ))}
            </g>
          </svg>
          
          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 p-2 rounded">
            <div className="text-xs text-gray-300 mb-1">Node Colors:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
                <span>Input</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                <span>System</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
                <span>Environment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
                <span>Measurement</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
                <span>Error</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                <span>Hardware</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-[600px] overflow-y-auto">
          <h4 className="text-lg font-medium text-gray-200 mb-4">Outcome Predictions</h4>
          
          <div className="space-y-4">
            {predictions.map(prediction => {
              // Calculate fill width based on probability
              const fillWidth = `${prediction.currentProbability * 100}%`;
              
              // Determine color based on probability
              const barColor = prediction.currentProbability > 0.7 
                ? 'bg-green-500' 
                : prediction.currentProbability > 0.4 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500';
              
              return (
                <div 
                  key={prediction.id}
                  className={`bg-gray-700 rounded-lg p-3 border-l-4 transition-all duration-300 ${
                    prediction.isHighlighted 
                      ? 'border-purple-500 shadow-lg shadow-purple-900/20' 
                      : 'border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-white">{prediction.label}</h5>
                    <span className={`text-lg font-bold ${
                      prediction.currentProbability > 0.7 
                        ? 'text-green-400' 
                        : prediction.currentProbability > 0.4 
                          ? 'text-yellow-400' 
                          : 'text-red-400'
                    }`}>
                      {(prediction.currentProbability * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  {/* Probability bar */}
                  <div className="w-full h-2 bg-gray-600 rounded-full mb-2 overflow-hidden">
                    <div 
                      className={`h-full ${barColor} transition-all duration-300`} 
                      style={{ width: fillWidth }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{prediction.description}</p>
                  
                  {/* Required concepts */}
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Required Concepts:</div>
                    <div className="flex flex-wrap gap-1">
                      {prediction.requiredConcepts.map(conceptId => {
                        const concept = nodes.find(n => n.id === conceptId);
                        if (!concept) return null;
                        
                        return (
                          <span 
                            key={conceptId}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              concept.active 
                                ? 'bg-opacity-70 text-white' 
                                : 'bg-opacity-30 text-gray-300'
                            }`}
                            style={{ backgroundColor: concept.active ? concept.color : '#4b5563' }}
                          >
                            {concept.label.split(' ')[0]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Graph stats */}
          <div className="mt-auto pt-4 border-t border-gray-700">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Knowledge Graph Stats</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-700 rounded p-2">
                <div className="text-gray-400">Active Nodes</div>
                <div className="text-xl font-bold text-blue-400">
                  {nodes.filter(n => n.active).length} / {nodes.length}
                </div>
              </div>
              <div className="bg-gray-700 rounded p-2">
                <div className="text-gray-400">Active Connections</div>
                <div className="text-xl font-bold text-purple-400">
                  {edges.filter(e => e.active).length} / {edges.length}
                </div>
              </div>
              <div className="bg-gray-700 rounded p-2 col-span-2">
                <div className="text-gray-400">Temporal Confidence</div>
                <div className="w-full h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                    style={{ 
                      width: `${(nodes.filter(n => n.active).length / nodes.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicParallelKnowledgeGraph;