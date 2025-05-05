import React from 'react';
import { Info } from 'lucide-react';
import { DistributionItem } from "@/components/Graph/types";

interface DistributionChartProps {
  data: DistributionItem[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
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

export default DistributionChart;