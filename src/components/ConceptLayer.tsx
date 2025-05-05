import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Info, Download } from 'lucide-react';

const LCMTrainingVisualization = () => {
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [graph, setGraph] = useState({
    nodes: [
      { id: 'Giant', value: 77, color: '#a388fa', x: 320, y: 420 },
      { id: 'Deformable', value: 87, color: '#ffd026', x: 490, y: 420 },
      { id: 'AO', value: 82, color: '#75b8ff', x: 660, y: 420 },
      { id: '1.0', value: 85, color: '#a39426', x: 355, y: 520 },
      { id: 'Camera', value: 90, color: '#c6b918', x: 445, y: 530 },
      { id: 'Adaptive', value: 93, color: '#8ad4ff', x: 560, y: 550 },
      { id: 'Scaling/Spatial', value: 74, color: '#9979c1', x: 670, y: 550 },
      { id: 'Vertical', value: 83, color: '#d59fff', x: 240, y: 620 },
      { id: 'Focus', value: 81, color: '#bb6a35', x: 400, y: 620 },
      { id: 'Natural', value: 89, color: '#2d9d5c', x: 610, y: 630 },
      { id: 'Sodium', value: 78, color: '#a37fc7', x: 490, y: 680 },
      { id: 'Sodium', value: 92, color: '#3b78b5', x: 560, y: 710 },
      { id: 'Sodium', value: 84, color: '#c55858', x: 750, y: 680 },
      { id: 'Adaptive', value: 85, color: '#4a8dbd', x: 560, y: 740 },
      { id: 'Laser', value: 91, color: '#f0c724', x: 650, y: 740 },
      { id: 'Heat', value: 80, color: '#f76a6a', x: 470, y: 750 },
    ],
    edges: [
      { source: 'Deformable', target: 'Adaptive' },
      { source: 'AO', target: 'Adaptive' },
      { source: 'Adaptive', target: 'Sodium' },
      { source: 'AO', target: 'Scaling/Spatial' },
      { source: 'Scaling/Spatial', target: 'Sodium' },
      { source: 'Adaptive', target: 'Laser' },
      { source: 'Sodium', target: 'Laser' },
      { source: 'Heat', target: 'Adaptive' },
    ]
  });

  const [outcomes, setOutcomes] = useState([
    {
      name: "Optimal Wavefront Correction",
      score: 75,
      description: "High quality correction with minimal residual error",
      concepts: ["Natural", "Adaptive", "Deformable", "Adaptive"],
      color: "#2ecc71"
    },
    {
      name: "Partial Wavefront Correction",
      score: 42,
      description: "Moderate correction with noticeable artifacts",
      concepts: ["Natural", "Atmospheric", "Sodium"],
      color: "#f1c40f"
    },
    {
      name: "Sodium Layer Fluctuation",
      score: 24,
      description: "Unstable correction due to sodium layer variations",
      concepts: ["Sodium", "Atmospheric", "Turbulence"],
      color: "#e74c3c"
    }
  ]);

  // Function to update the graph during training
  const updateGraph = (progress) => {
    // Clone the current graph
    const updatedNodes = [...graph.nodes];
    
    // Update node values based on training progress
    updatedNodes.forEach((node, index) => {
      // Different evolution patterns for different nodes
      if (progress < 30) {
        // Early training phase - some values decrease as the model learns
        if (['Giant', 'Sodium', 'Heat'].includes(node.id)) {
          node.value = Math.max(60, Math.floor(node.value - (progress/20)));
        } else if (['Adaptive', 'Natural', 'Deformable'].includes(node.id)) {
          node.value = Math.min(98, Math.floor(node.value + (progress/15)));
        }
      } else if (progress < 60) {
        // Mid training phase - refinement
        if (['1.0', 'Camera', 'Focus'].includes(node.id)) {
          node.value = Math.min(95, Math.floor(node.value + ((progress-30)/20)));
        } else if (node.id === 'Laser') {
          node.value = Math.max(85, Math.min(98, Math.floor(91 + Math.sin((progress-30)/10) * 5)));
        }
      } else {
        // Late training phase - convergence
        if (['Adaptive', 'Deformable', 'Natural', 'AO'].includes(node.id)) {
          node.value = Math.min(99, Math.floor(node.value + ((progress-60)/80)));
        } else if (node.id === 'Sodium') {
          // Sodium fluctuates
          node.value = Math.max(70, Math.min(94, Math.floor(78 + Math.sin(progress/5) * 10)));
        }
      }
    });

    // Update edges - add new connections as training progresses
    let updatedEdges = [...graph.edges];
    
    if (progress > 35 && !updatedEdges.some(e => e.source === 'Natural' && e.target === 'Adaptive')) {
      updatedEdges.push({ source: 'Natural', target: 'Adaptive' });
    }
    
    if (progress > 55 && !updatedEdges.some(e => e.source === 'Focus' && e.target === 'Sodium')) {
      updatedEdges.push({ source: 'Focus', target: 'Sodium' });
    }
    
    if (progress > 75 && !updatedEdges.some(e => e.source === 'Giant' && e.target === 'Deformable')) {
      updatedEdges.push({ source: 'Giant', target: 'Deformable' });
    }
    
    if (progress > 85 && !updatedEdges.some(e => e.source === 'Natural' && e.target === 'Laser')) {
      updatedEdges.push({ source: 'Natural', target: 'Laser' });
    }

    // Update the graph state
    setGraph({
      nodes: updatedNodes,
      edges: updatedEdges
    });

    // Update outcome predictions based on training progress
    const updatedOutcomes = [...outcomes];
    
    updatedOutcomes[0].score = Math.min(95, Math.floor(75 + (progress/8))); // Optimal improves steadily
    updatedOutcomes[1].score = Math.floor(42 + (progress/5) - (progress > 70 ? (progress-70)/3 : 0)); // Partial improves then drops
    updatedOutcomes[2].score = Math.max(5, Math.floor(24 - (progress/10) + (progress > 80 ? (progress-80)/4 : 0))); // Sodium fluctuation decreases then rises slightly
    
    setOutcomes(updatedOutcomes);
  };

  useEffect(() => {
    if (isTraining && !isPaused) {
      const timer = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setIsTraining(false);
            return 100;
          }
          // Update graph every 5% progress
          if (newProgress % 5 === 0) {
            updateGraph(newProgress);
          }
          return newProgress;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isTraining, isPaused]);
  
  // Separate useEffect to properly handle graph updates
  useEffect(() => {
    // Directly update graph whenever training progress changes
    if (trainingProgress > 0 && trainingProgress % 5 === 0 && isTraining && !isPaused) {
      updateGraph(trainingProgress);
    }
  }, [trainingProgress]);

  const startTraining = () => {
    setTrainingProgress(0);
    setIsTraining(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTraining = () => {
    setTrainingProgress(0);
    setIsTraining(false);
    setIsPaused(false);
    // Reset graph and outcomes to initial state
    setGraph({
      nodes: [
        { id: 'Giant', value: 77, color: '#a388fa', x: 320, y: 420 },
        { id: 'Deformable', value: 87, color: '#ffd026', x: 490, y: 420 },
        { id: 'AO', value: 82, color: '#75b8ff', x: 660, y: 420 },
        { id: '1.0', value: 85, color: '#a39426', x: 355, y: 520 },
        { id: 'Camera', value: 90, color: '#c6b918', x: 445, y: 530 },
        { id: 'Adaptive', value: 93, color: '#8ad4ff', x: 560, y: 550 },
        { id: 'Scaling/Spatial', value: 74, color: '#9979c1', x: 670, y: 550 },
        { id: 'Vertical', value: 83, color: '#d59fff', x: 240, y: 620 },
        { id: 'Focus', value: 81, color: '#bb6a35', x: 400, y: 620 },
        { id: 'Natural', value: 89, color: '#2d9d5c', x: 610, y: 630 },
        { id: 'Sodium', value: 78, color: '#a37fc7', x: 490, y: 680 },
        { id: 'Sodium', value: 92, color: '#3b78b5', x: 560, y: 710 },
        { id: 'Sodium', value: 84, color: '#c55858', x: 750, y: 680 },
        { id: 'Adaptive', value: 85, color: '#4a8dbd', x: 560, y: 740 },
        { id: 'Laser', value: 91, color: '#f0c724', x: 650, y: 740 },
        { id: 'Heat', value: 80, color: '#f76a6a', x: 470, y: 750 },
      ],
      edges: [
        { source: 'Deformable', target: 'Adaptive' },
        { source: 'AO', target: 'Adaptive' },
        { source: 'Adaptive', target: 'Sodium' },
        { source: 'AO', target: 'Scaling/Spatial' },
        { source: 'Scaling/Spatial', target: 'Sodium' },
        { source: 'Adaptive', target: 'Laser' },
        { source: 'Sodium', target: 'Laser' },
        { source: 'Heat', target: 'Adaptive' },
      ]
    });
    setOutcomes([
      {
        name: "Optimal Wavefront Correction",
        score: 75,
        description: "High quality correction with minimal residual error",
        concepts: ["Natural", "Adaptive", "Deformable", "Adaptive"],
        color: "#2ecc71"
      },
      {
        name: "Partial Wavefront Correction",
        score: 42,
        description: "Moderate correction with noticeable artifacts",
        concepts: ["Natural", "Atmospheric", "Sodium"],
        color: "#f1c40f"
      },
      {
        name: "Sodium Layer Fluctuation",
        score: 24,
        description: "Unstable correction due to sodium layer variations",
        concepts: ["Sodium", "Atmospheric", "Turbulence"],
        color: "#e74c3c"
      }
    ]);
  };

  const renderNode = (node) => {
    const size = (node.value / 100) * 60 + 20;
    return (
      <g key={node.id}>
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={size/2} 
          fill={node.color} 
          opacity={0.9}
          stroke="#ffffff" 
          strokeWidth="1"
        />
        <text 
          x={node.x} 
          y={node.y+size/2+15} 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize="12"
        >
          {node.id}
        </text>
        <text 
          x={node.x} 
          y={node.y} 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize="12"
          fontWeight="bold"
        >
          {node.value}%
        </text>
      </g>
    );
  };

  const renderEdge = (edge) => {
    const source = graph.nodes.find(n => n.id === edge.source);
    const target = graph.nodes.find(n => n.id === edge.target);
    
    if (!source || !target) return null;
    
    return (
      <line 
        key={`${source.id}-${target.id}`}
        x1={source.x} 
        y1={source.y} 
        x2={target.x} 
        y2={target.y} 
        stroke="#546e7a" 
        strokeWidth="2" 
        opacity="0.6"
      />
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Quantum LCM Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md">
            <span>Last 30 Days</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md">
            <span>Filter By</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          <button className="bg-gray-800 px-4 py-2 rounded-md flex items-center space-x-2">
            <span>Export</span>
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-medium">Parallel Knowledge Graph</h2>
                <Info size={16} className="ml-2 text-gray-400" />
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-700 rounded-md">
                  <ZoomIn size={16} />
                </button>
                <button className="p-2 bg-gray-700 rounded-md">
                  <ZoomOut size={16} />
                </button>
                <button className="p-2 bg-gray-700 rounded-md">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="200 350 600 450">
                {graph.edges.map(renderEdge)}
                {graph.nodes.map(renderNode)}
              </svg>
            </div>
          </div>
        </div>
        
        <div className="w-80 p-4">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-medium mb-4">Outcome Predictions</h2>
            
            <div className="space-y-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{outcome.name}</h3>
                    <span style={{ color: outcome.color }} className="font-bold">{outcome.score}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="h-2 rounded-full" 
                      style={{ 
                        width: `${outcome.score}%`, 
                        backgroundColor: outcome.color
                      }} 
                    />
                  </div>
                  
                  <p className="text-sm text-gray-300">{outcome.description}</p>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">Required Concepts:</p>
                    <div className="flex flex-wrap gap-2">
                      {outcome.concepts.map((concept, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 text-xs rounded-full" 
                          style={{ 
                            backgroundColor: concept === "Deformable" ? "#ffd026" : 
                                            concept === "Adaptive" ? "#8ad4ff" : 
                                            concept === "Natural" ? "#2d9d5c" : 
                                            concept === "Sodium" ? "#a37fc7" : 
                                            concept === "Atmospheric" ? "#e67e22" :
                                            concept === "Turbulence" ? "#9b59b6" : "#4a8dbd"
                          }}
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Training Control</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Training Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="h-3 rounded-full bg-blue-500" style={{ width: `${trainingProgress}%` }} />
                </div>
                <p className="text-right text-sm mt-1">{trainingProgress}%</p>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={startTraining}
                  disabled={isTraining && !isPaused}
                  className={`flex-1 py-2 rounded-md font-medium ${isTraining && !isPaused ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isTraining && !isPaused ? 'Training...' : isPaused ? 'Resume' : 'Start Training'}
                </button>
                
                {isTraining && (
                  <button 
                    onClick={togglePause}
                    className={`px-4 py-2 rounded-md font-medium ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                )}
                
                <button 
                  onClick={resetTraining}
                  className="px-4 py-2 rounded-md font-medium bg-red-600 hover:bg-red-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCMTrainingVisualization;