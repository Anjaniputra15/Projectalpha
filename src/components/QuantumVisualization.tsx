import React from 'react';
import { Info } from 'lucide-react';
import { TrainingConfig } from "@/components/Graph/types";  

interface QuantumVisualizationProps {
  quantumEntropy: number[];
  epoch: number;
  trainingConfig: TrainingConfig;
}

const QuantumVisualization: React.FC<QuantumVisualizationProps> = ({ 
  quantumEntropy, 
  epoch,
  trainingConfig 
}) => {
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

export default QuantumVisualization;