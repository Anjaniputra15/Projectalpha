import React from 'react';
import { Info } from 'lucide-react';
import { DriftChartData } from "@/components/Graph/types"; // Adjust the import path as necessary	

interface DriftChartProps {
  chartData: DriftChartData;
}

const DriftChart: React.FC<DriftChartProps> = ({ chartData }) => {
  const { data, dates } = chartData;
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

export default DriftChart;