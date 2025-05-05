import React, { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Download, Info } from "lucide-react";

// Sample data - replace with your actual data
const lineChartData = [
  { date: "08/20", prediction: 0.2, threshold: 0.1, baseline: -0.1 },
  { date: "08/21", prediction: 0.5, threshold: 0.1, baseline: -0.1 },
  { date: "08/22", prediction: 0.4, threshold: 0.1, baseline: -0.1 },
  { date: "08/23", prediction: 0.3, threshold: 0.1, baseline: -0.1 },
  { date: "08/24", prediction: 0.2, threshold: 0.1, baseline: -0.1 },
  { date: "08/25", prediction: 0.3, threshold: 0.1, baseline: -0.1 },
  { date: "08/26", prediction: 0.6, threshold: 0.1, baseline: -0.1 },
  { date: "08/27", prediction: 0.4, threshold: 0.1, baseline: -0.1 },
  { date: "08/28", prediction: 0.3, threshold: 0.1, baseline: -0.1 },
  { date: "08/29", prediction: 0.3, threshold: 0.1, baseline: -0.1 },
  { date: "08/30", prediction: 0.2, threshold: 0.1, baseline: -0.1 },
];

const barChartData = [
  { name: "Group A", current: 0.4, baseline: 0.3 },
  { name: "Group B", current: 0.3, baseline: 0.4 },
  { name: "Group C", current: 0.1, baseline: 0.2 },
];

const AnalyticPage: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState("drift");
  
  return (
    <div className="p-6 h-full overflow-auto bg-[#121212]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-sm py-1 h-8 border-[#444] gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 Days
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
          
          <Button variant="outline" className="text-sm py-1 h-8 border-[#444] gap-1">
            Filter By
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm py-1 h-8 border-[#444]">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Prediction Drift Over Time Graph */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Prediction Drift Over Time</h3>
            <Info className="h-4 w-4 text-[#888]" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#888]">Metric:</span>
            <Button variant="outline" className="text-sm py-1 h-8 border-[#444] gap-1">
              False Negative Rate
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                labelStyle={{ color: "#eee" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#40E0D0" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="threshold" stroke="#888" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="baseline" stroke="#888" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Distribution Comparison */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">Distribution Comparison</h3>
            <Info className="h-4 w-4 text-[#888]" />
          </div>
          
          <Button variant="outline" className="text-sm py-1 h-8 border-[#444] gap-1">
            Now
          </Button>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                labelStyle={{ color: "#eee" }}
              />
              <Legend />
              <Bar dataKey="current" fill="#40E0D0" />
              <Bar dataKey="baseline" fill="#9370DB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;