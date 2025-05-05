import React, { useState, useEffect } from 'react';
import { ChevronDown, Database, File, Play, Square, RotateCcw, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

let pollInterval: NodeJS.Timeout | null = null;

const QuantumTrainingDashboard = () => {
  // State for model parameters
  const [qubits, setQubits] = useState(4);
  const [diffusionSteps, setDiffusionSteps] = useState(100);
  const [datasetType, setDatasetType] = useState('Sequence');
  
  // State for training parameters
  const [batchSize, setBatchSize] = useState('32');
  const [learningRate, setLearningRate] = useState('0.01');
  const [epochs, setEpochs] = useState(10);
  
  // State for file paths
  const [dataDirectory, setDataDirectory] = useState('/data/sequences/');
  const [targetFile, setTargetFile] = useState('targets.npy');
  
  // Dropdown state
  const [batchSizeOpen, setBatchSizeOpen] = useState(false);
  const [learningRateOpen, setLearningRateOpen] = useState(false);
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  
  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('00:00:00');
  const [trainingMetrics, setTrainingMetrics] = useState({
    loss: 0,
    accuracy: 0,
    lossChange: 0,
    accuracyChange: 0
  });
  
  // Selected metric for visualization
  const [selectedMetric, setSelectedMetric] = useState('False Negative Rate');
  
  // Sample training metrics data for visualization
  const [trainingData, setTrainingData] = useState([]);
  
  // Simulate training progress when isTraining changes
  useEffect(() => {
    let interval;
    
    if (isTraining) {
      // Reset progress
      setTrainingProgress(0);
      setCurrentEpoch(0);
      setTrainingMetrics({
        loss: 0.8,
        accuracy: 70.5,
        lossChange: 0,
        accuracyChange: 0
      });
      
      // Generate initial training data
      generateTrainingData();
      
      interval = setInterval(() => {
        setTrainingProgress(prev => {
          // Calculate new progress based on epochs
          const newProgress = prev + (100 / epochs / 10);
          
          // Update current epoch
          const newEpoch = Math.floor((newProgress / 100) * epochs);
          if (newEpoch > currentEpoch) {
            setCurrentEpoch(newEpoch);
            
            // Update metrics with some randomness
            const newLoss = Math.max(0.1, trainingMetrics.loss * (0.92 + Math.random() * 0.03));
            const newAccuracy = Math.min(99, trainingMetrics.accuracy + (0.8 + Math.random() * 1.2));
            
            setTrainingMetrics({
              loss: parseFloat(newLoss.toFixed(3)),
              accuracy: parseFloat(newAccuracy.toFixed(1)),
              lossChange: parseFloat((trainingMetrics.loss - newLoss).toFixed(3)),
              accuracyChange: parseFloat((newAccuracy - trainingMetrics.accuracy).toFixed(1))
            });
            
            // Update training data
            if (newEpoch % 2 === 0) {
              generateTrainingData();
            }
          }
          
          // Calculate time remaining
          const remainingPercent = 100 - newProgress;
          const secondsRemaining = Math.floor(remainingPercent * 5);
          const minutes = Math.floor(secondsRemaining / 60);
          const seconds = secondsRemaining % 60;
          setTimeRemaining(`${minutes}m ${seconds}s`);
          
          // Stop at 100%
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            return 100;
          }
          
          return newProgress;
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isTraining, epochs]);
  
  // Generate training data for visualization
  const generateTrainingData = () => {
    const dates = [
      '04/05', '04/06', '04/07', '04/08', '04/09', 
      '04/10', '04/11', '04/12', '04/13', '04/14', '04/15'
    ];
    
    // Generate some realistic-looking data with a pattern and some randomness
    const predictionValues = dates.map(() => Math.random() * 0.3 + 0.2);
    // Add a peak in the middle
    predictionValues[5] = Math.random() * 0.2 + 0.35;
    predictionValues[6] = Math.random() * 0.2 + 0.45;
    
    const thresholdValue = 0.3;
    const baselineValue = 0.25;
    
    const data = dates.map((date, index) => ({
      date,
      prediction: predictionValues[index],
      threshold: thresholdValue,
      baseline: baselineValue
    }));
    
    setTrainingData(data);
  };
  
  const handleStartTraining = async () => {
  setIsTraining(true);
  
  try {
    // Call your API endpoint to start training
    const response = await fetch('http://34.151.91.63:8000/quantum_diffusion_process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "Training document text here", // You might need to provide actual text
        timesteps: diffusionSteps,
        beta_schedule: "linear",
        // Add any other parameters your API expects
        qubits: qubits,
        batch_size: parseInt(batchSize),
        learning_rate: parseFloat(learningRate),
        epochs: epochs,
        data_directory: dataDirectory,
        target_file: targetFile,
        dataset_type: datasetType
      }),
    });
    const data = await response.json();
    if (!data.success) {
      console.error("Training error:", data.error);
      setIsTraining(false);
      // Show error to user
      alert(`Training failed: ${data.error}`);
    } else {
      // Start polling for training progress
      startProgressPolling();
    }
  } catch (error) {
    console.error("API call failed:", error);
    setIsTraining(false);
    alert(`Connection error: ${error.message}`);
  }
};
// Function to periodically check training progress
const startProgressPolling = () => {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch('http://34.151.91.63:8000/training_status');
      const data = await response.json();
      
      if (data.status === 'completed') {
        clearInterval(pollInterval);
        setIsTraining(false);
        setTrainingProgress(100);
        // Update metrics with final values
        setTrainingMetrics({
          loss: data.metrics.loss,
          accuracy: data.metrics.accuracy,
          lossChange: data.metrics.loss_change,
          accuracyChange: data.metrics.accuracy_change
        });
        
        // Update chart with final data
        setTrainingData(data.prediction_drift_data);
      } else if (data.status === 'training') {
        // Update progress
        setTrainingProgress(data.progress);
        setCurrentEpoch(data.current_epoch);
        setTimeRemaining(data.time_remaining);
        
        // Update metrics
        setTrainingMetrics({
          loss: data.metrics.loss,
          accuracy: data.metrics.accuracy,
          lossChange: data.metrics.loss_change,
          accuracyChange: data.metrics.accuracy_change
        });
        
        // Update chart if new data is available
        if (data.prediction_drift_data) {
          setTrainingData(data.prediction_drift_data);
        }
      } else if (data.status === 'error') {
        clearInterval(pollInterval);
        setIsTraining(false);
        alert(`Training error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error polling for status:", error);
    }
  }, 2000); // Poll every 2 seconds
  
  // Store the interval ID to clear it later if needed
  // No need to call pollInterval as a function
};
const handleStopTraining = async () => {
  try {
    const response = await fetch('http://34.151.91.63:8000/stop_training', {
      method: 'POST'
    });
    
    const data = await response.json();
    
    if (data.success) {
      if (pollInterval !== null) {
        // Clear any polling intervals
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      } else {
        alert(`Failed to stop training: ${data.error}`);
      }
    }
  } catch (error) {
    console.error("Error stopping training:", error);
    alert(`Connection error: ${error.message}`);
  }
};
  
  
  
  const handleReset = () => {
    setQubits(4);
    setDiffusionSteps(100);
    setDatasetType('Sequence');
    setBatchSize('32');
    setLearningRate('0.01');
    setEpochs(10);
    setDataDirectory('/data/sequences/');
    setTargetFile('targets.npy');
    setIsTraining(false);
    setTrainingProgress(0);
    setCurrentEpoch(0);
  };
  
  // Available metrics for dropdown
  const metrics = [
    'False Negative Rate',
    'False Positive Rate',
    'Accuracy',
    'Precision',
    'Recall',
    'F1 Score',
    'ROC AUC',
    'Loss'
  ];
  
  useEffect(() => {
    // Initialize training data when component mounts
    generateTrainingData();
  }, []);
  
  return (
    <div className="bg-slate-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Training Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Model Parameters Panel */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Model Parameters</h2>
            
            {/* Number of Qubits */}
            <div className="mb-6">
              <label className="block mb-2">Number of Qubits</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="2" 
                  max="16" 
                  value={qubits} 
                  onChange={(e) => setQubits(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-8 text-center">{qubits}</span>
              </div>
            </div>
            
            {/* Diffusion Steps */}
            <div className="mb-6">
              <label className="block mb-2">Diffusion Steps</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={diffusionSteps} 
                  onChange={(e) => setDiffusionSteps(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 w-12 text-center">{diffusionSteps}</span>
              </div>
            </div>
            
            {/* Dataset Type */}
            <div className="mb-4">
              <label className="block mb-2">Dataset Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className={`py-3 rounded-lg text-center ${datasetType === 'Sequence' ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  onClick={() => setDatasetType('Sequence')}
                >
                  Sequence
                </button>
                <button 
                  className={`py-3 rounded-lg text-center ${datasetType === 'MC Change' ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  onClick={() => setDatasetType('MC Change')}
                >
                  MC Change
                </button>
              </div>
            </div>
          </div>
          
          {/* Training Parameters Panel */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Training Parameters</h2>
            
            {/* Batch Size */}
            <div className="mb-6">
              <label className="block mb-2">Batch Size</label>
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-between bg-slate-700 rounded-lg p-3"
                  onClick={() => setBatchSizeOpen(!batchSizeOpen)}
                >
                  <span>{batchSize}</span>
                  <ChevronDown size={20} />
                </button>
                
                {batchSizeOpen && (
                  <div className="absolute mt-1 w-full bg-slate-700 rounded-lg z-10">
                    {['8', '16', '32', '64', '128'].map((size) => (
                      <div 
                        key={size} 
                        className="p-2 hover:bg-slate-600 cursor-pointer"
                        onClick={() => {
                          setBatchSize(size);
                          setBatchSizeOpen(false);
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Learning Rate */}
            <div className="mb-6">
              <label className="block mb-2">Learning Rate</label>
              <div className="relative">
                <button 
                  className="w-full flex items-center justify-between bg-slate-700 rounded-lg p-3"
                  onClick={() => setLearningRateOpen(!learningRateOpen)}
                >
                  <span>{learningRate}</span>
                  <ChevronDown size={20} />
                </button>
                
                {learningRateOpen && (
                  <div className="absolute mt-1 w-full bg-slate-700 rounded-lg z-10">
                    {['0.001', '0.005', '0.01', '0.05', '0.1'].map((rate) => (
                      <div 
                        key={rate} 
                        className="p-2 hover:bg-slate-600 cursor-pointer"
                        onClick={() => {
                          setLearningRate(rate);
                          setLearningRateOpen(false);
                        }}
                      >
                        {rate}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Epochs */}
            <div className="mb-4">
              <label className="block mb-2">Epochs</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={epochs} 
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-full bg-slate-700 rounded-lg p-3"
              />
            </div>
          </div>
          
          {/* Files Section */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <Database size={20} className="mr-2" />
                <span className="mr-2 whitespace-nowrap">Data Directory:</span>
                <input 
                  type="text" 
                  value={dataDirectory} 
                  onChange={(e) => setDataDirectory(e.target.value)}
                  className="bg-slate-700 rounded-lg p-2 flex-grow"
                />
              </div>
              
              <div className="flex items-center">
                <File size={20} className="mr-2" />
                <span className="mr-2 whitespace-nowrap">Target File:</span>
                <input 
                  type="text" 
                  value={targetFile} 
                  onChange={(e) => setTargetFile(e.target.value)}
                  className="bg-slate-700 rounded-lg p-2 flex-grow"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button 
              className={`flex items-center px-6 py-3 rounded-lg ${isTraining ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={handleStartTraining}
              disabled={isTraining}
            >
              <Play size={20} className="mr-2" />
              Start Training
            </button>
            
            <button 
              className={`flex items-center px-6 py-3 rounded-lg ${!isTraining ? 'bg-gray-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}
              onClick={handleStopTraining}
              disabled={!isTraining}
            >
              <Square size={20} className="mr-2" />
              Stop Training
            </button>
            
            <button 
              className="flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
              onClick={handleReset}
            >
              <RotateCcw size={20} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
        
        {/* Right Column - Visualization */}
        <div className="space-y-6">
          {/* Training Visualization Section */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Prediction Drift Over Time</h2>
                <Info size={18} className="ml-2 text-slate-400" />
              </div>
              
              <div className="flex items-center">
                <span className="mr-2">Metric:</span>
                <div className="relative">
                  <button 
                    className="flex items-center bg-slate-700 rounded-lg px-4 py-2"
                    onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
                  >
                    <span>{selectedMetric}</span>
                    <ChevronDown size={18} className="ml-2" />
                  </button>
                  
                  {metricDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-slate-700 rounded-lg z-10 shadow-lg">
                      {metrics.map((metric) => (
                        <div 
                          key={metric} 
                          className="p-2 hover:bg-slate-600 cursor-pointer"
                          onClick={() => {
                            setSelectedMetric(metric);
                            setMetricDropdownOpen(false);
                          }}
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trainingData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#a0aec0' }} 
                    axisLine={{ stroke: '#2d3748' }}
                    tickLine={{ stroke: '#2d3748' }}
                  />
                  <YAxis 
                    tick={{ fill: '#a0aec0' }} 
                    axisLine={{ stroke: '#2d3748' }}
                    tickLine={{ stroke: '#2d3748' }}
                    domain={[0, 0.7]}
                    ticks={[0.0, 0.2, 0.4, 0.5, 0.7]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a202c', border: 'none', borderRadius: '4px' }}
                    itemStyle={{ color: '#a0aec0' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prediction" 
                    stroke="#06D6A0" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4, fill: '#06D6A0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threshold" 
                    stroke="#718096" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#A0AEC0" 
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Training Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Current Epoch</div>
              <div className="text-2xl font-semibold mt-1">{currentEpoch} / {epochs}</div>
              <div className="text-cyan-400 text-sm mt-1">{Math.round(trainingProgress)}% Complete</div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Training Loss</div>
              <div className="text-2xl font-semibold mt-1">{trainingMetrics.loss}</div>
              <div className={`${trainingMetrics.lossChange > 0 ? 'text-red-400' : 'text-green-400'} text-sm mt-1`}>
                {trainingMetrics.lossChange > 0 ? '↑' : '↓'} {Math.abs(trainingMetrics.lossChange)} from last epoch
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Validation Accuracy</div>
              <div className="text-2xl font-semibold mt-1">{trainingMetrics.accuracy}%</div>
              <div className={`${trainingMetrics.accuracyChange < 0 ? 'text-red-400' : 'text-green-400'} text-sm mt-1`}>
                {trainingMetrics.accuracyChange < 0 ? '↓' : '↑'} {Math.abs(trainingMetrics.accuracyChange)}% from last epoch
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Time Remaining</div>
              <div className="text-2xl font-semibold mt-1">{timeRemaining}</div>
              <div className="text-slate-400 text-sm mt-1">
                ETA: {new Date(Date.now() + (trainingProgress < 100 ? 
                  (100 - trainingProgress) * 5000 / 100 : 0)).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>Overall Progress</span>
              <span>{Math.round(trainingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full" 
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumTrainingDashboard;