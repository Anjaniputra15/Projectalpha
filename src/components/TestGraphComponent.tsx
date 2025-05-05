// TestGraphComponent.jsx
import React, { useEffect, useState } from "react";
import { ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";

export function TestGraphComponent({ sectionData }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [container, setContainer] = useState(null);
  
  // Update dimensions on mount and resize
  useEffect(() => {
    if (!container) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };
    
    // Initial measurement
    updateDimensions();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [container]);
  
  // Count entities and edges
  const entityCount = Array.isArray(sectionData?.entities) ? sectionData.entities.length : 0;
  const edgeCount = Array.isArray(sectionData?.edges) ? sectionData.edges.length : 0;
  
  // Simple visualization of nodes and edges
  const renderSimpleGraph = () => {
    if (!entityCount) return null;
    
    const entities = sectionData.entities.slice(0, 10); // Limit to 10 for simplicity
    const edges = sectionData.edges.slice(0, 10);
    
    const nodeRadius = 30;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) / 3;
    
    // Position nodes in a circle
    const nodes = entities.map((entity, index) => {
      const angle = (index / entities.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const entityName = typeof entity === 'string' ? entity : (
        entity.name || entity.label || `Entity ${index}`
      );
      
      return {
        id: index,
        name: entityName,
        x,
        y
      };
    });
    
    // Create a lookup for node positions
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.name] = node;
    });
    
    // Draw lines for edges
    const lines = edges.map((edge, index) => {
      const source = edge[0];
      const target = edge[1];
      
      const sourceNode = nodeMap[source];
      const targetNode = nodeMap[target];
      
      if (!sourceNode || !targetNode) return null;
      
      return (
        <line
          key={`edge-${index}`}
          x1={sourceNode.x}
          y1={sourceNode.y}
          x2={targetNode.x}
          y2={targetNode.y}
          stroke="#6366f1"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
      );
    });
    
    // Draw circles for nodes
    const circles = nodes.map(node => (
      <g key={`node-${node.id}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          fill="#4f46e5"
          stroke="#ffffff"
          strokeWidth={2}
        />
        <text
          x={node.x}
          y={node.y + nodeRadius + 15}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="12px"
        >
          {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
        </text>
      </g>
    ));
    
    return (
      <svg width="100%" height="100%">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>
        {lines}
        {circles}
      </svg>
    );
  };
  
  return (
    <div 
      className="h-full w-full relative bg-gray-900 rounded-md overflow-hidden border-2 border-indigo-500" 
      style={{ minHeight: '400px' }}
    >
      {/* Debug info */}
      <div className="absolute top-0 left-0 bg-black/70 text-white p-2 z-20 text-xs">
        <div>Container: {dimensions.width.toFixed(0)}×{dimensions.height.toFixed(0)}px</div>
        <div>Entities: {entityCount} | Edges: {edgeCount}</div>
        <div>Test component is rendering!</div>
      </div>
      
      {/* Main visualization area with ref */}
      <div 
        ref={setContainer}
        className="absolute inset-0 flex items-center justify-center"
      >
        {dimensions.width > 0 && dimensions.height > 0 ? (
          entityCount > 0 ? (
            renderSimpleGraph()
          ) : (
            <div className="text-white text-center p-4 bg-black/30 rounded-md">
              <h3 className="text-lg font-bold mb-2">No Graph Data</h3>
              <p>Use the Test Graph button to generate sample data</p>
            </div>
          )
        ) : (
          <div className="text-white">Measuring container...</div>
        )}
      </div>
      
      {/* Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button 
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
    </div>
  );
}