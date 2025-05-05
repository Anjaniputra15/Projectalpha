// File: components/QPLCGNGraphGenerator.tsx

import React, { useState, useEffect } from 'react';
import { useQPLCGNGraph } from '../hooks/use-qplcgn-graph';
import { useNotes } from '../hooks/useNotes';
import { GraphNode, GraphEdge } from '../lib/types';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Network, 
  RefreshCcw, 
  Atom, 
  Zap, 
  Info, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

declare global {
  interface Window {
    scinterApi?: {
      visualizeGraph: (graph: any) => void;
    };
  }
}

const QPLCGNGraphGenerator: React.FC = () => {
  const { 
    generateGraph, 
    loading, 
    error, 
    graphData, 
    toggleParallelism, 
    setParallelismLevel,
    parallelismEnabled,
    parallelismThreshold,
    detectAllParallelConcepts,
    toggleQuantumMode,
    analyzeQuantumParallelism,
    quantumEnabled,
    quantumAdvantage
  } = useQPLCGNGraph();
  
  const { currentNote } = useNotes();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetectingParallels, setIsDetectingParallels] = useState(false);
  const [isQuantumProcessing, setIsQuantumProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuantumDetails, setShowQuantumDetails] = useState(false);

  // Generate graph with current settings
  const handleGenerateGraph = async () => {
    if (!currentNote?.content) {
      alert('Please select a note first');
      return;
    }

    setIsGenerating(true);
    try {
      // Pass all options to the graph generation
      const result = await generateGraph(currentNote.content, {
        emphasizeParallelism: parallelismEnabled,
        parallelismThreshold,
        useQuantum: quantumEnabled
      });

      // Check if Scinter API is available and call it with proper type safety
      if (window.scinterApi && result) {
        window.scinterApi.visualizeGraph(result.graph);
      } else {
        console.warn('scinterApi is not available on the window object.');
      }
    } catch (err) {
      console.error('Error generating graph:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle quantum mode
  const handleToggleQuantumMode = (enabled: boolean) => {
    toggleQuantumMode(enabled);
  };

  // Toggle parallelism visualization
  const handleParallelismToggle = (enabled: boolean) => {
    toggleParallelism(enabled);
    
    // If we already have graph data, update the visualization
    if (graphData && window.scinterApi) {
      window.scinterApi.visualizeGraph(graphData);
    }
  };

  // Change parallelism threshold
  const handleThresholdChange = (value: number[]) => {
    const threshold = value[0];
    setParallelismLevel(threshold);
    
    // If we already have graph data, update the visualization
    if (graphData && window.scinterApi) {
      window.scinterApi.visualizeGraph(graphData);
    }
  };

  // Detect all parallel relationships
  const handleDetectParallels = async () => {
    if (!currentNote?.content) {
      alert('Please select a note first');
      return;
    }

    setIsDetectingParallels(true);
    try {
      const result = await detectAllParallelConcepts(currentNote.content);
      
      if (window.scinterApi && result) {
        window.scinterApi.visualizeGraph(result);
      }
    } catch (err) {
      console.error('Error detecting parallel concepts:', err);
    } finally {
      setIsDetectingParallels(false);
    }
  };

  // Run quantum parallelism analysis
  const handleQuantumAnalysis = async () => {
    if (!currentNote?.content) {
      alert('Please select a note first');
      return;
    }

    setIsQuantumProcessing(true);
    try {
      const result = await analyzeQuantumParallelism(currentNote.content);
      
      if (result?.success && window.scinterApi) {
        // The graph data should already be updated in the hook
        window.scinterApi.visualizeGraph(graphData);
        
        // Show quantum details after successful analysis
        setShowQuantumDetails(true);
      }
    } catch (err) {
      console.error('Error in quantum analysis:', err);
    } finally {
      setIsQuantumProcessing(false);
    }
  };

  return (
    <div className="qplcgn-container p-2 space-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              quantumEnabled 
                ? "bg-purple-600 text-white hover:bg-purple-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleGenerateGraph}
            disabled={loading || isGenerating || !currentNote}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">
                  <RefreshCcw size={14} />
                </span>
                Processing...
              </>
            ) : (
              <>
                {quantumEnabled ? <Atom size={14} /> : <Database size={14} />}
                Generate {quantumEnabled ? 'Quantum' : 'QPLCGN'} Graph
              </>
            )}
          </button>
          
          <button
            className="flex items-center text-xs text-blue-500 hover:text-blue-700"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
        </div>
        
        {showSettings && (
          <div className="bg-slate-100 p-3 rounded-md space-y-4 text-sm dark:bg-slate-800 dark:text-white">
            {/* Quantum Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Atom size={16} className={quantumEnabled ? "text-purple-600" : "text-gray-400"} />
                <span className="font-medium">Quantum Mode</span>
              </div>
              <Switch 
                checked={quantumEnabled} 
                onCheckedChange={handleToggleQuantumMode}
              />
            </div>
            
            {/* Quantum-specific controls */}
            {quantumEnabled && (
              <div className="pl-2 border-l-2 border-purple-300">
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                  onClick={handleQuantumAnalysis}
                  disabled={isQuantumProcessing || !graphData}
                >
                  {isQuantumProcessing ? (
                    <>
                      <span className="animate-spin">
                        <RefreshCcw size={14} />
                      </span>
                      Quantum Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Run Quantum Analysis
                    </>
                  )}
                </button>
                
                {/* Quantum Advantage Details */}
                {quantumAdvantage && (
                  <div className="mt-2">
                    <button 
                      onClick={() => setShowQuantumDetails(!showQuantumDetails)}
                      className="flex items-center justify-between w-full text-xs text-purple-700 dark:text-purple-300"
                    >
                      <span className="flex items-center gap-1">
                        <Info size={12} />
                        Quantum Details
                      </span>
                      {showQuantumDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    
                    {showQuantumDetails && (
                      <div className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span>Entanglement Entropy:</span>
                          <span className="font-mono">{quantumAdvantage.entanglement_entropy.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Circuit Depth:</span>
                          <span className="font-mono">{quantumAdvantage.circuit_depth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Qubit Count:</span>
                          <span className="font-mono">{quantumAdvantage.qubit_count}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Regular Parallelism Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Network size={16} className={parallelismEnabled ? "text-blue-600" : "text-gray-400"} />
                <span className="font-medium">Show Parallelism</span>
              </div>
              <Switch 
                checked={parallelismEnabled} 
                onCheckedChange={handleParallelismToggle}
              />
            </div>
            
            {parallelismEnabled && (
              <>
                <div className="space-y-2 pl-2 border-l-2 border-blue-300">
                  <div className="flex justify-between">
                    <span>Parallelism Threshold</span>
                    <span className="text-blue-600 font-medium">{(parallelismThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    value={[parallelismThreshold]} 
                    min={0.1} 
                    max={0.9} 
                    step={0.05}
                    onValueChange={handleThresholdChange} 
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Less Strict</span>
                    <span>More Strict</span>
                  </div>
                
                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                    onClick={handleDetectParallels}
                    disabled={isDetectingParallels || !graphData}
                  >
                    {isDetectingParallels ? (
                      <>
                        <span className="animate-spin">
                          <RefreshCcw size={14} />
                        </span>
                        Detecting Parallels...
                      </>
                    ) : (
                      <>
                        <Network size={14} />
                        Detect Parallel Concepts
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-md text-sm dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}
      
      {graphData && graphData.nodes.length > 0 && (
        <div className="bg-white shadow-sm border rounded-md p-3 mt-4 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-medium text-sm mb-2">Extracted Concepts</h3>
          <div className="max-h-32 overflow-y-auto">
            <ul className="text-xs space-y-1">
              {graphData.nodes.map(node => (
                <li 
                  key={node.id} 
                  className="flex items-center"
                  style={{
                    color: node.color || 'inherit'
                  }}
                >
                  {(node.parallelGroup || node.quantumParallel) && (
                    <span 
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        node.quantumParallel ? 'ring-1 ring-purple-500' : ''
                      }`}
                      style={{ backgroundColor: node.color || '#888' }}
                    />
                  )}
                  {node.quantumParallel && (
                    <Atom size={10} className="mr-1 text-purple-500" />
                  )}
                  {node.label}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Status message about parallelism */}
          <div className="mt-3 pt-3 border-t text-xs text-gray-500 dark:text-gray-400">
            {quantumEnabled && graphData.nodes.filter(n => n.quantumParallel).length > 0 ? (
              <p className="flex items-center gap-1">
                <Atom size={12} className="text-purple-500" />
                <span>
                  Quantum parallel concepts detected and highlighted with 
                  <span className="inline-block w-2 h-2 rounded-full mx-1 bg-purple-500"></span>
                  color.
                </span>
              </p>
            ) : parallelismEnabled && graphData.nodes.filter(n => n.parallelGroup).length > 0 ? (
              <p>
                Parallel concepts are color-coded and grouped visually in the graph.
              </p>
            ) : (
              <p>
                No parallel concepts detected. Try lowering the threshold or using "Detect Parallel Concepts".
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Initialize window.scinterApi if it doesn't exist yet
if (typeof window !== 'undefined' && !window.scinterApi) {
  window.scinterApi = {
    visualizeGraph: (graph) => {
      console.log('Visualizing graph:', graph);
      // Visualization logic will be implemented in Layout.tsx
    },
  };
}

export default QPLCGNGraphGenerator;