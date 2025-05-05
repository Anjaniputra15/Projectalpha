import React, { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import DriftChart from "@/components/DriftChart";
import DistributionChart from "@/components/DistributionChart";
import QuantumVisualization from "@/components/QuantumVisualization";
import TrainingControls from "@/components/TrainingControl";
import QuantumParallelTemporalVisualization from "@/components/QuantumParallelTemporalVisualization";
import DynamicParallelKnowledgeGraph from "@/components/DynamicParallelKnowledgeGraph";
import { TrainingConfig, TrainingMetrics } from "@/components/Graph/types";

const QuantumLCMDashboard: React.FC = () => {
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics>({
    trainLoss: [0.2, 0.5, 0.4, 0.3, 0.2, 0.3, 0.6, 0.4, 0.3, 0.3, 0.2],
    diffusionLoss: [0.25, 0.45, 0.35, 0.28, 0.21, 0.27, 0.5, 0.38, 0.32, 0.28, 0.22],
    quantumEntropy: [0.15, 0.35, 0.30, 0.25, 0.18, 0.22, 0.45, 0.35, 0.30, 0.25, 0.20],
    validationLoss: [0.22, 0.52, 0.42, 0.32, 0.23, 0.31, 0.62, 0.43, 0.33, 0.31, 0.23]
  });
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    batchSize: 32,
    learningRate: 0.001,
    epochs: 100,
    nQubits: 8,
    diffusionSteps: 100,
    datasetType: 'sequence'
  });
  
  // Setup CSS for proper scrolling behavior
  useEffect(() => {
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
        height: calc(100vh - 90px);
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
        {/* Knowledge Graph */}
        <DynamicParallelKnowledgeGraph 
          trainingConfig={trainingConfig} 
        />
        
        {/* Quantum Parallel Temporal Visualization */}
        <QuantumParallelTemporalVisualization 
          trainingConfig={trainingConfig} 
          epoch={epoch} 
        />
        
        {/* Drift Chart */}
        <DriftChart 
          chartData={getDriftChartData()}
        />
        
        {/* Distribution Comparison */}
        <DistributionChart 
          data={getDistributionData()}
        />
        
        {/* Quantum State Visualization */}
        <QuantumVisualization 
          quantumEntropy={trainingMetrics.quantumEntropy}
          epoch={epoch}
          trainingConfig={trainingConfig}
        />
        
        {/* Training Controls */}
        <TrainingControls 
          isTraining={isTraining}
          epoch={epoch}
          trainingConfig={trainingConfig}
          setTrainingConfig={setTrainingConfig}
          startTraining={startTraining}
          stopTraining={stopTraining}
        />
      </div>
    </div>
  );
};

export default QuantumLCMDashboard;