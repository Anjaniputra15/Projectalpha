import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Play, PauseCircle, RefreshCw, BarChart3, Package, Database, Settings, Info, Calendar, Filter } from 'lucide-react';
import QuantumParallelTemporalVisualization from './QuantumParallelTemporalVisualization';
import DynamicParallelKnowledgeGraph from './DynamicParallelKnowledgeGraph';	
const QuantumLCMDarkDashboard = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState({
    trainLoss: [0.2, 0.5, 0.4, 0.3, 0.2, 0.3, 0.6, 0.4, 0.3, 0.3, 0.2],
    diffusionLoss: [0.25, 0.45, 0.35, 0.28, 0.21, 0.27, 0.5, 0.38, 0.32, 0.28, 0.22],
    quantumEntropy: [0.15, 0.35, 0.30, 0.25, 0.18, 0.22, 0.45, 0.35, 0.30, 0.25, 0.20],
    validationLoss: [0.22, 0.52, 0.42, 0.32, 0.23, 0.31, 0.62, 0.43, 0.33, 0.31, 0.23]
  });
  const [trainingConfig, setTrainingConfig] = useState({
    batchSize: 32,
    learningRate: 0.001,
    epochs: 100,
    nQubits: 8,
    diffusionSteps: 100,
    datasetType: 'sequence'
  });
  //const [selectedTab, setSelectedTab] = useState('quantum');
  
  // Add styles to ensure scrollbar appears properly
  useEffect(() => {
    // Set up CSS for proper scrolling behavior
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html, body {
        height: 100%;
        overflow: auto;
        margin: 0;
        padding: 0;
        background-color: #111827;
      }
      .dashboard-container {
        overflow-y: auto;
        height: calc(100vh - 90px); /* Adjust based on header height */
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Simulated training function
  const startTraining = () => {
    if (isTraining) return;
    
    setIsTraining(true);
    setEpoch(0);
    
    // Simulate training progress
    const trainingInterval = setInterval(() => {
      setEpoch(prev => {
        const newEpoch = prev + 1;
        
        // Update metrics with simulated values
        setTrainingMetrics(prevMetrics => {
          const noise = Math.random() * 0.1;
          const baseLoss = 1.0 * Math.exp(-newEpoch/20) + noise;
          
          return {
            trainLoss: [...prevMetrics.trainLoss, baseLoss],
            diffusionLoss: [...prevMetrics.diffusionLoss, baseLoss * 0.7 + noise],
            quantumEntropy: [...prevMetrics.quantumEntropy, 0.8 - 0.5 * Math.exp(-newEpoch/30) + noise * 0.3],
            validationLoss: [...prevMetrics.validationLoss, baseLoss * 1.2 + noise]
          };
        });
        
        // Stop after reaching configured epochs
        if (newEpoch >= trainingConfig.epochs) {
          clearInterval(trainingInterval);
          setIsTraining(false);
        }
        
        return newEpoch;
      });
    }, 500); // Update every 500ms for demo
  };
  
  const stopTraining = () => {
    setIsTraining(false);
  };

  // Prepare data for drift chart
  const getDriftChartData = () => {
    // Use the last 10 data points from training loss as our drift
    const data = trainingMetrics.trainLoss.slice(-11);
    const dates = [];
    const currentDate = new Date();
    
    // Generate dates for the last 11 days
    for (let i = 10; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
    }
    
    return { data, dates };
  };

  // Prepare data for distribution chart
  const getDistributionData = () => {
    return [
      { label: 'Category 1', prediction: 0.4, baseline: 0.3 },
      { label: 'Category 2', prediction: 0.3, baseline: 0.4 },
      { label: 'Category 3', prediction: 0.1, baseline: 0.2 }
    ];
  };

  // Render prediction drift chart
  const renderDriftChart = () => {
    const { data, dates } = getDriftChartData();
    const maxValue = Math.max(...data) * 1.2;
    const height = 300;
    const width = 800;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    const yTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
    
    // Generate path for the data line
    const linePath = data.map((value, index) => {
      const x = padding.left + (index * (chartWidth / (data.length - 1)));
      const y = height - padding.bottom - (value / maxValue * chartHeight);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return (
        <div className="flex flex-col bg-gray-900 text-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-8 pb-4">

          <div className="flex items-center">
            <h3 className="text-xl font-medium text-gray-200">Prediction Drift Over Time</h3>
            <Info className="ml-2 text-gray-400" size={16} />
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Metric:</span>
            <div className="bg-gray-800 rounded-md px-3 py-1 flex items-center text-white">
              False Negative Rate
              <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <line 
              key={`grid-${i}`}
              x1={padding.left} 
              y1={height - padding.bottom - (tick / maxValue * chartHeight)} 
              x2={width - padding.right} 
              y2={height - padding.bottom - (tick / maxValue * chartHeight)} 
              stroke="#333" 
              strokeWidth="1" 
              strokeDasharray="3,3" 
            />
          ))}
          
          {/* Y-axis labels */}
          {yTicks.map((tick, i) => (
            <text 
              key={`y-${i}`}
              x={padding.left - 10} 
              y={height - padding.bottom - (tick / maxValue * chartHeight)} 
              fontSize="12" 
              fill="#999" 
              textAnchor="end" 
              dominantBaseline="middle"
            >
              {tick.toFixed(1)}
            </text>
          ))}
          
          {/* X-axis labels */}
          {dates.map((date, i) => (
            <text 
              key={`x-${i}`}
              x={padding.left + (i * (chartWidth / (dates.length - 1)))} 
              y={height - padding.bottom + 20} 
              fontSize="12" 
              fill="#999" 
              textAnchor="middle"
            >
              {date}
            </text>
          ))}
          
          {/* Baseline and threshold lines */}
          <line 
            x1={padding.left} 
            y1={height - padding.bottom - (0.1 / maxValue * chartHeight)} 
            x2={width - padding.right} 
            y2={height - padding.bottom - (0.1 / maxValue * chartHeight)} 
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="1.5" 
          />
          
          <line 
            x1={padding.left} 
            y1={height - padding.bottom - (-0.1 / maxValue * chartHeight)} 
            x2={width - padding.right} 
            y2={height - padding.bottom - (-0.1 / maxValue * chartHeight)} 
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="1.5" 
          />
          
          {/* Data line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#20E9B5" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Data points */}
          {data.map((value, index) => (
            <circle 
              key={`point-${index}`}
              cx={padding.left + (index * (chartWidth / (data.length - 1)))} 
              cy={height - padding.bottom - (value / maxValue * chartHeight)}
              r="5"
              fill="#20E9B5"
            />
          ))}
          
          {/* Legend */}
          <g transform={`translate(${padding.left}, ${height - 10})`}>
            <circle cx="5" cy="0" r="4" fill="#20E9B5" />
            <text x="15" y="4" fontSize="12" fill="#999">prediction</text>
            
            <circle cx="95" cy="0" r="4" fill="rgba(255, 255, 255, 0.4)" />
            <text x="105" y="4" fontSize="12" fill="#999">threshold</text>
            
            <circle cx="195" cy="0" r="4" fill="rgba(255, 255, 255, 0.4)" />
            <text x="205" y="4" fontSize="12" fill="#999">baseline</text>
          </g>
        </svg>
      </div>
    );
  };

  // Render distribution comparison chart
  const renderDistributionChart = () => {
    const data = getDistributionData();
    const height = 300;
    const width = 800;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    const barWidth = chartWidth / (data.length * 2 + (data.length - 1)) / 2;
    const groupWidth = barWidth * 2 + 10;
    
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="text-xl font-medium text-gray-200">Distribution Comparison</h3>
            <Info className="ml-2 text-gray-400" size={16} />
          </div>
          <button className="bg-gray-800 text-white rounded-md px-3 py-1">
            Now
          </button>
        </div>
        
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.1, 0.2, 0.3, 0.4].map((tick, i) => (
            <line 
              key={`grid-${i}`}
              x1={padding.left} 
              y1={height - padding.bottom - (tick / 0.4 * chartHeight)} 
              x2={width - padding.right} 
              y2={height - padding.bottom - (tick / 0.4 * chartHeight)} 
              stroke="#333" 
              strokeWidth="1" 
              strokeDasharray="3,3" 
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.1, 0.2, 0.3, 0.4].map((tick, i) => (
            <text 
              key={`y-${i}`}
              x={padding.left - 10} 
              y={height - padding.bottom - (tick / 0.4 * chartHeight)} 
              fontSize="12" 
              fill="#999" 
              textAnchor="end" 
              dominantBaseline="middle"
            >
              {tick.toFixed(1)}
            </text>
          ))}
          
          {/* Bars */}
          {data.map((item, index) => {
            const groupX = padding.left + index * (groupWidth + 40);
            
            return (
              <g key={`group-${index}`}>
                {/* Prediction bar */}
                <rect 
                  x={groupX} 
                  y={height - padding.bottom - (item.prediction / 0.4 * chartHeight)} 
                  width={barWidth} 
                  height={(item.prediction / 0.4 * chartHeight)}
                  fill="#20E9B5"
                />
                
                {/* Baseline bar */}
                <rect 
                  x={groupX + barWidth + 10} 
                  y={height - padding.bottom - (item.baseline / 0.4 * chartHeight)} 
                  width={barWidth} 
                  height={(item.baseline / 0.4 * chartHeight)}
                  fill="#9e7eff"
                />
                
                {/* Category label */}
                <text 
                  x={groupX + barWidth} 
                  y={height - padding.bottom + 20} 
                  fontSize="12" 
                  fill="#999" 
                  textAnchor="middle"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render quantum metrics visualization
  const renderQuantumVisualization = () => {
    const { quantumEntropy } = trainingMetrics;
    const currentEntropy = quantumEntropy[quantumEntropy.length - 1] || 0;
    
    return (
      <div className="mb-8 bg-gray-900 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-medium text-gray-200">Quantum State Visualization</h3>
          <Info className="ml-2 text-gray-400" size={16} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Bloch sphere visualization */}
            <svg width="100%" height="300" viewBox="0 0 400 300">
              {/* Coordinate axes */}
              <line x1="200" y1="150" x2="300" y2="150" stroke="#666" strokeWidth="1" />
              <line x1="200" y1="150" x2="200" y2="50" stroke="#666" strokeWidth="1" />
              <line x1="200" y1="150" x2="150" y2="225" stroke="#666" strokeWidth="1" strokeDasharray="5,5" />
              
              <text x="305" y="150" fill="#999" fontSize="14">X</text>
              <text x="200" y="45" fill="#999" fontSize="14">Z</text>
              <text x="145" y="240" fill="#999" fontSize="14">Y</text>
              
              {/* Bloch sphere */}
              <circle cx="200" cy="150" r="100" fill="none" stroke="#444" strokeWidth="1" />
              <ellipse cx="200" cy="150" rx="100" ry="30" fill="none" stroke="#444" strokeWidth="1" />
              <circle cx="200" cy="150" r="100" fill="none" stroke="#444" strokeWidth="1" transform="rotate(90 200 150)" />
              
              {/* Quantum state vector */}
              <line 
                x1="200" 
                y1="150" 
                x2={200 + 80*Math.sin(epoch*0.1)*Math.cos(epoch*0.05)} 
                y2={150 - 80*Math.cos(epoch*0.1)} 
                stroke="#20E9B5" 
                strokeWidth="2" 
              />
              <circle 
                cx={200 + 80*Math.sin(epoch*0.1)*Math.cos(epoch*0.05)} 
                cy={150 - 80*Math.cos(epoch*0.1)} 
                r="6" 
                fill="#20E9B5" 
              />
              
              {/* State labels */}
              <circle cx="200" cy="50" r="4" fill="#666" />
              <text x="210" y="50" fill="#999" fontSize="12">|0⟩</text>
              
              <circle cx="200" cy="250" r="4" fill="#666" />
              <text x="210" y="250" fill="#999" fontSize="12">|1⟩</text>
            </svg>
            
            <div className="mt-4">
              <h4 className="text-white mb-2">Quantum State</h4>
              <div className="bg-gray-900 rounded-md p-3 font-mono text-green-400">
                |ψ⟩ = {(Math.cos(epoch*0.05)).toFixed(3)}|0⟩ + {(Math.sin(epoch*0.05)).toFixed(3)}e<sup>{(epoch*0.1).toFixed(1)}i</sup>|1⟩
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-white mb-4">Quantum Entropy</h4>
            
            {/* Entropy meter */}
            <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${currentEntropy * 100}%`,
                  background: `linear-gradient(90deg, 
                    ${currentEntropy < 0.3 ? '#10b981' : currentEntropy < 0.7 ? '#f59e0b' : '#ef4444'} 0%, 
                    ${currentEntropy < 0.3 ? '#34d399' : currentEntropy < 0.7 ? '#fbbf24' : '#f87171'} 100%)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-3 text-sm font-medium text-white">
                {(currentEntropy * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mb-6">
              <span>Low</span>
              <span>Optimal</span>
              <span>High</span>
            </div>
            
            {/* Quantum gates */}
            <h4 className="text-white mb-3">Active Quantum Gates</h4>
            <div className="grid grid-cols-4 gap-2">
              {['H', 'X', 'Z', 'CNOT', 'S', 'T', 'Y', 'SWAP'].map((gate, i) => (
                <div 
                  key={i} 
                  className={`rounded-md p-2 text-center ${
                    i % 3 === 0 ? 'bg-indigo-900 text-indigo-300' : 
                    i % 3 === 1 ? 'bg-purple-900 text-purple-300' : 
                    'bg-blue-900 text-blue-300'
                  }`}
                >
                  {gate}
                </div>
              ))}
            </div>
            
            <h4 className="text-white mt-4 mb-3">Qubit Configuration</h4>
            <div className="bg-gray-900 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Active Qubits:</span>
                <span className="text-green-400 font-mono">{trainingConfig.nQubits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Entanglement Depth:</span>
                <span className="text-green-400 font-mono">{Math.ceil(trainingConfig.nQubits / 2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render training controls and progress
  const renderTrainingControls = () => {
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-medium text-gray-200">Training Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-white mb-4">Model Parameters</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Qubits
                </label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="2" 
                    max="16" 
                    value={trainingConfig.nQubits} 
                    onChange={(e) => setTrainingConfig({...trainingConfig, nQubits: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    disabled={isTraining}
                  />
                  <span className="ml-3 text-white font-mono w-8">{trainingConfig.nQubits}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Diffusion Steps
                </label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    step="10"
                    value={trainingConfig.diffusionSteps} 
                    onChange={(e) => setTrainingConfig({...trainingConfig, diffusionSteps: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    disabled={isTraining}
                  />
                  <span className="ml-3 text-white font-mono w-8">{trainingConfig.diffusionSteps}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Dataset Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      trainingConfig.datasetType === 'sequence'
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setTrainingConfig({...trainingConfig, datasetType: 'sequence'})}
                    disabled={isTraining}
                  >
                    Sequence
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      trainingConfig.datasetType === 'mc_change'
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setTrainingConfig({...trainingConfig, datasetType: 'mc_change'})}
                    disabled={isTraining}
                  >
                    MC Change
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-white mb-4">Training Parameters</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Batch Size
                </label>
                <select 
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                  value={trainingConfig.batchSize}
                  onChange={(e) => setTrainingConfig({...trainingConfig, batchSize: parseInt(e.target.value)})}
                  disabled={isTraining}
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                  <option value="64">64</option>
                  <option value="128">128</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Learning Rate
                </label>
                <select 
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                  value={trainingConfig.learningRate}
                  onChange={(e) => setTrainingConfig({...trainingConfig, learningRate: parseFloat(e.target.value)})}
                  disabled={isTraining}
                >
                  <option value="0.1">0.1</option>
                  <option value="0.01">0.01</option>
                  <option value="0.001">0.001</option>
                  <option value="0.0001">0.0001</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Epochs
                </label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                    value={trainingConfig.epochs}
                    onChange={(e) => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})}
                    min="1"
                    max="1000"
                    disabled={isTraining}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data source info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-2 md:mb-0 md:mr-6">
              <Database className="mr-2 text-gray-400" size={18} />
              <span className="text-gray-300">Data Directory:</span>
              <div className="ml-2 px-3 py-1 bg-gray-700 rounded text-sm text-gray-200 truncate max-w-xs">
                {trainingConfig.datasetType === 'sequence' ? '/data/sequences/' : '/data/mc_changes/'}
              </div>
            </div>
            
            <div className="flex items-center">
              <Package className="mr-2 text-gray-400" size={18} />
              <span className="text-gray-300">Target File:</span>
              <div className="ml-2 px-3 py-1 bg-gray-700 rounded text-sm text-gray-200 truncate max-w-xs">
                {trainingConfig.datasetType === 'sequence' ? 'targets.npy' : 'queries.txt'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Training controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-md font-medium ${
              isTraining 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            onClick={startTraining}
            disabled={isTraining}
          >
            <Play className="mr-2" size={18} />
            Start Training
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-md font-medium ${
              !isTraining 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            onClick={stopTraining}
            disabled={!isTraining}
          >
            <PauseCircle className="mr-2" size={18} />
            Stop Training
          </button>
          
          <button
            className="flex items-center px-4 py-2 rounded-md font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
            disabled={isTraining}
          >
            <RefreshCw className="mr-2" size={18} />
            Reset
          </button>
        </div>
        
        {/* Training progress indicator */}
        {isTraining && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Training Progress</span>
              <span className="text-gray-400">{epoch}/{trainingConfig.epochs} epochs</span>
            </div>
            <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${(epoch / trainingConfig.epochs) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{Math.round((epoch / trainingConfig.epochs) * 100)}% complete</span>
              <span>Estimated time remaining: {Math.round((trainingConfig.epochs - epoch) * 0.5)} seconds</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Header with title and filters - sticky at top */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Quantum LCM Dashboard</h2>
          
          <div className="flex space-x-3">
            <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-3 py-2 flex items-center">
              <Calendar className="mr-2" size={16} />
              Last 30 Days
              <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-3 py-2 flex items-center">
              <Filter className="mr-2" size={16} />
              Filter By
              <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-3 py-2 flex items-center">
              Export
              <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V16M12 16L8 12M12 16L16 12M6 20H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      
     <div className="dashboard-container p-6">
        {/* Scrollable content */}
      <DynamicParallelKnowledgeGraph 
    trainingConfig={trainingConfig} 
  />
        <QuantumParallelTemporalVisualization 
    trainingConfig={trainingConfig} 
    epoch={epoch} 
  />
        {/* Main content - drift chart */}
        {renderDriftChart()}
        
        {/* Distribution comparison */}
        {renderDistributionChart()}
        
        {/* Quantum visualization */}
        {renderQuantumVisualization()}
        
        {/* Training controls */}
        {renderTrainingControls()}
      </div>
    </div>
  );
};

export default QuantumLCMDarkDashboard;