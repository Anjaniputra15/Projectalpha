import React from 'react';
import { Play, PauseCircle, RefreshCw, Database, Package } from 'lucide-react';
import { TrainingConfig } from "@/components/Graph/types";

interface TrainingControlsProps {
  isTraining: boolean;
  epoch: number;
  trainingConfig: TrainingConfig;
  setTrainingConfig: React.Dispatch<React.SetStateAction<TrainingConfig>>;
  startTraining: () => void;
  stopTraining: () => void;
}

const TrainingControls: React.FC<TrainingControlsProps> = ({ 
  isTraining, 
  epoch, 
  trainingConfig, 
  setTrainingConfig,
  startTraining,
  stopTraining
}) => {
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

export default TrainingControls;