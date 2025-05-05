import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, ChevronRight, Zap, Link2, ExternalLink, Info, Search, Download, Share2, BookOpen, Maximize2, Layers, Book, Upload, X, Check, AlertCircle, File } from 'lucide-react';

const DocumentAnalysisComponent = () => {
  const [activeTab, setActiveTab] = useState('sections');
  const [expandedSections, setExpandedSections] = useState({
    'section-1': true,
    'section-2': false,
    'section-3': false,
    'section-4': false,
    'section-5': false
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(true); // Set to true for demo
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Open file selector
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process files
  const handleFiles = (filesList) => {
    // Start upload process
    setShowUploadModal(false);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          setDocumentUploaded(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Mock data for ASML document
  const documentData = {
    title: "ASML Annual Report 2024: EUV Lithography Advancements",
    uploadDate: "April 15, 2025",
    fileType: "PDF",
    fileSize: "4.2 MB",
    sections: [
      {
        id: 'section-1',
        title: 'Executive Summary',
        content: 'ASML continues to lead the semiconductor lithography market with advanced EUV technology, enabling the production of more powerful and energy-efficient chips for various applications.',
        keywords: ['EUV lithography', 'semiconductor', 'market leadership', 'financial performance'],
        connections: 12
      },
      {
        id: 'section-2',
        title: 'High-NA EUV Technology',
        content: 'Our next-generation High-NA EUV systems have reached significant milestones with the first delivery to customers expected in Q3 2025. This technology enables the continuation of Moore\'s Law beyond the 2nm node.',
        keywords: ['High-NA EUV', '2nm node', 'Moore\'s Law', 'technology roadmap', 'manufacturing'],
        connections: 18
      },
      {
        id: 'section-3',
        title: 'Market Analysis & Competition',
        content: 'Increased competition from Chinese manufacturers has been observed, though ASML maintains its technological edge. Global semiconductor demand continues to grow, driven by AI, cloud computing, and automotive applications.',
        keywords: ['market share', 'competition', 'Chinese manufacturers', 'AI demand', 'automotive'],
        connections: 15
      },
      {
        id: 'section-4',
        title: 'Financial Performance',
        content: 'ASML reported €28.3 billion in revenue for 2024, representing a 14% increase over the previous year. Gross margin increased to 52.6% while R&D expenditure reached €3.8 billion.',
        keywords: ['revenue', 'gross margin', 'R&D expenditure', 'shareholder value', 'financial metrics'],
        connections: 9
      },
      {
        id: 'section-5',
        title: 'Environmental, Social & Governance',
        content: 'ASML has made significant progress on its sustainability goals, reducing carbon emissions by 22% compared to the 2019 baseline. The company has also expanded its diversity initiatives and enhanced its governance framework.',
        keywords: ['ESG', 'carbon emissions', 'sustainability', 'diversity', 'governance'],
        connections: 7
      }
    ],
    entities: [
      { id: 1, name: 'EUV Lithography', type: 'technology', connections: 28 },
      { id: 2, name: 'High-NA', type: 'technology', connections: 21 },
      { id: 3, name: 'Moore\'s Law', type: 'concept', connections: 14 },
      { id: 4, name: 'Peter Wennink', type: 'person', connections: 7 },
      { id: 5, name: 'TSMC', type: 'organization', connections: 12 },
      { id: 6, name: 'Samsung', type: 'organization', connections: 10 },
      { id: 7, name: 'Intel', type: 'organization', connections: 11 },
      { id: 8, name: '2nm node', type: 'technology', connections: 16 },
      { id: 9, name: 'China export restrictions', type: 'event', connections: 18 },
      { id: 10, name: 'NXE:3800E', type: 'product', connections: 9 },
      { id: 11, name: 'Twinscan', type: 'product', connections: 8 },
      { id: 12, name: 'Carbon emissions', type: 'concept', connections: 6 },
      { id: 13, name: 'Veldhoven', type: 'location', connections: 5 },
      { id: 14, name: 'Semiconductor demand', type: 'concept', connections: 19 },
      { id: 15, name: 'Artificial Intelligence', type: 'concept', connections: 15 }
    ],
    connections: [
      { source: 1, target: 2, strength: 0.9 },
      { source: 1, target: 8, strength: 0.85 },
      { source: 1, target: 3, strength: 0.7 },
      { source: 1, target: 5, strength: 0.65 },
      { source: 1, target: 6, strength: 0.6 },
      { source: 1, target: 7, strength: 0.6 },
      { source: 1, target: 10, strength: 0.9 },
      { source: 1, target: 11, strength: 0.7 },
      { source: 2, target: 3, strength: 0.8 },
      { source: 2, target: 8, strength: 0.95 },
      { source: 3, target: 14, strength: 0.6 },
      { source: 4, target: 9, strength: 0.5 },
      { source: 5, target: 6, strength: 0.4 },
      { source: 5, target: 7, strength: 0.4 },
      { source: 5, target: 8, strength: 0.75 },
      { source: 6, target: 7, strength: 0.5 },
      { source: 6, target: 8, strength: 0.7 },
      { source: 7, target: 8, strength: 0.7 },
      { source: 9, target: 5, strength: 0.6 },
      { source: 9, target: 6, strength: 0.5 },
      { source: 9, target: 13, strength: 0.3 },
      { source: 10, target: 11, strength: 0.7 },
      { source: 12, target: 13, strength: 0.4 },
      { source: 14, target: 15, strength: 0.85 },
      { source: 14, target: 5, strength: 0.7 },
      { source: 14, target: 6, strength: 0.7 },
      { source: 14, target: 7, strength: 0.7 },
      { source: 15, target: 8, strength: 0.75 }
    ]
  };

  // Knowledge Graph component with D3-like visualization and movable nodes
  const KnowledgeGraph = () => {
    const [nodes, setNodes] = useState(() => {
      // Initialize node positions
      return documentData.entities.map(entity => ({
        ...entity,
        x: 100 + (entity.id * 40) % 600,
        y: 100 + (entity.id * 35) % 400,
        isDragging: false
      }));
    });
    
    const [selectedNode, setSelectedNode] = useState(null);
    
    const nodeRadius = (connections) => {
      const base = 20;
      const scale = 0.4;
      return base + connections * scale;
    };

    const getEntityColor = (type) => {
      switch(type) {
        case 'technology': return '#8b5cf6'; // purple
        case 'concept': return '#3b82f6'; // blue
        case 'person': return '#ef4444'; // red
        case 'organization': return '#10b981'; // green
        case 'event': return '#f97316'; // orange
        case 'product': return '#06b6d4'; // cyan
        case 'location': return '#f59e0b'; // amber
        default: return '#6b7280'; // gray
      }
    };
    
    // Mouse event handlers for dragging
    const handleMouseDown = (event, nodeId) => {
      // Start dragging the selected node
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === nodeId 
            ? { ...node, isDragging: true } 
            : node
        )
      );
      setSelectedNode(nodeId);
      
      // Prevent text selection during drag
      event.preventDefault();
    };
    
    const handleMouseMove = (event) => {
      if (!selectedNode) return;
      
      // Get coordinates relative to SVG
      const svgElement = event.currentTarget;
      const pt = svgElement.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgP = pt.matrixTransform(svgElement.getScreenCTM().inverse());
      
      // Update the node position
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === selectedNode 
            ? { ...node, x: svgP.x, y: svgP.y } 
            : node
        )
      );
    };
    
    const handleMouseUp = () => {
      // Stop dragging
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.isDragging 
            ? { ...node, isDragging: false } 
            : node
        )
      );
      setSelectedNode(null);
    };
    
    // Ensure mouse up is captured even if outside SVG
    useEffect(() => {
      if (selectedNode) {
        const handleGlobalMouseUp = () => {
          handleMouseUp();
        };
        
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
          window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
      }
    }, [selectedNode]);

    // Create an interactive representation of the graph
    return (
      <div className="relative h-full min-h-96 w-full bg-gray-950 rounded-lg overflow-hidden">
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-full min-h-96"
          style={{ filter: 'drop-shadow(0px 0px 15px rgba(139, 92, 246, 0.15))' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.2)" />
            </marker>
          </defs>
          
          {/* Connections/Edges */}
          {documentData.connections.map((conn, idx) => {
            const source = nodes.find(e => e.id === conn.source);
            const target = nodes.find(e => e.id === conn.target);
            if (!source || !target) return null;
            
            return (
              <line
                key={`edge-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={conn.strength * 2}
                strokeOpacity={0.7}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map(node => {
            const r = nodeRadius(node.connections);
            
            return (
              <g 
                key={`node-${node.id}`}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ cursor: 'grab' }}
                className={node.isDragging ? 'cursor-grabbing' : 'cursor-grab'}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={getEntityColor(node.type)}
                  fillOpacity={0.8}
                  stroke={getEntityColor(node.type)}
                  strokeWidth={node.isDragging ? 3 : 2}
                  strokeOpacity={1}
                />
                <text
                  x={node.x}
                  y={node.y + r + 12}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="500"
                  pointerEvents="none"
                >
                  {node.name}
                </text>
                <text
                  x={node.x}
                  y={node.y + r + 25}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="10"
                  pointerEvents="none"
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Entity Types</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-xs">Technology</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs">Concept</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs">Person</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs">Organization</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-xs">Event</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              <span className="text-xs">Product</span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md" title="Fullscreen">
            <Maximize2 size={16} />
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md" title="Find entity">
            <Search size={16} />
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md" title="Reset positions">
            <Layers size={16} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-80 p-2 rounded-lg">
          <p className="text-xs text-gray-400">Drag nodes to reposition them</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-6 px-4">
        {/* Document Upload Button (Only shown when no document is uploaded) */}
        {!documentUploaded && !isUploading && (
          <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
            <FileText size={48} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-medium mb-2">No Document Uploaded</h2>
            <p className="text-gray-400 mb-6">Upload a document to analyze its structure and extract knowledge</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-md"
            >
              <Upload size={18} className="inline mr-2" />
              Upload Document
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-900 p-3 rounded-md mr-4">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-medium">Processing document...</h3>
                  <p className="text-sm text-gray-400">Analyzing content and extracting knowledge</p>
                </div>
              </div>
              <div className="text-blue-400">
                {uploadProgress}%
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Document Header */}
        {documentUploaded && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="bg-purple-900 p-3 rounded-md mr-4">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold mb-1">{documentData.title}</h1>
                  <div className="flex text-sm text-gray-400">
                    <span>Uploaded: {documentData.uploadDate}</span>
                    <span className="mx-2">•</span>
                    <span>{documentData.fileType}</span>
                    <span className="mx-2">•</span>
                    <span>{documentData.fileSize}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                  <Download size={18} />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
                  title="Upload new document"
                >
                  <Upload size={18} />
                </button>
                <button className="bg-purple-700 hover:bg-purple-600 p-2 rounded-md">
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        {documentUploaded && (
          <div className="flex border-b border-gray-700 mb-6">
            <button 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'sections' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('sections')}
            >
              <BookOpen size={16} className="inline mr-2" />
              Document Sections
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'knowledge' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('knowledge')}
            >
              <Zap size={16} className="inline mr-2" />
              Knowledge Graph
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'entities' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('entities')}
            >
              <Link2 size={16} className="inline mr-2" />
              Entities
            </button>
          </div>
        )}
        
        {/* Content based on active tab */}
        {documentUploaded && (
          <div className="mb-6">
            {activeTab === 'sections' && (
              <div className="bg-gray-800 rounded-lg">
                {documentData.sections.map((section) => (
                  <div key={section.id} className="border-b border-gray-700 last:border-b-0">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center">
                        <Book size={18} className="text-purple-400 mr-3" />
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-purple-400 mr-3">
                          {section.connections} connections
                        </span>
                        {expandedSections[section.id] 
                          ? <ChevronDown size={18} className="text-gray-400" />
                          : <ChevronRight size={18} className="text-gray-400" />
                        }
                      </div>
                    </div>
                    
                    {expandedSections[section.id] && (
                      <div className="p-4 bg-gray-850 border-t border-gray-700">
                        <p className="text-gray-300 mb-4">
                          {section.content}
                        </p>
                        <div className="mb-2">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {section.keywords.map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="bg-gray-700 text-purple-300 text-xs rounded-full px-3 py-1"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'knowledge' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 mb-4">
                  This knowledge graph visualizes relationships between key entities in the document. 
                  Larger nodes indicate more connections. Colors represent different entity types.
                </p>
                <div className="h-96">
                  <KnowledgeGraph />
                </div>
              </div>
            )}
            
            {activeTab === 'entities' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex mb-6">
                  <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search entities..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-gray-300"
                    />
                  </div>
                  <div className="ml-4">
                    <select className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-300">
                      <option>All Types</option>
                      <option>Technology</option>
                      <option>Organization</option>
                      <option>Person</option>
                      <option>Concept</option>
                      <option>Event</option>
                      <option>Product</option>
                      <option>Location</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentData.entities.map(entity => {
                    const color = entity.type === 'technology' ? 'purple' : 
                                entity.type === 'concept' ? 'blue' :
                                entity.type === 'person' ? 'red' :
                                entity.type === 'organization' ? 'green' :
                                entity.type === 'event' ? 'orange' :
                                entity.type === 'product' ? 'cyan' : 'amber';
                    
                    return (
                      <div 
                        key={entity.id} 
                        className="bg-gray-850 border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">{entity.name}</h3>
                          <span className={`text-${color}-400 text-xs bg-${color}-900 bg-opacity-20 rounded-full px-2 py-1`}>
                            {entity.type}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Link2 size={14} className="mr-1" />
                          <span>{entity.connections} connections</span>
                        </div>
                        <button className="mt-3 text-purple-400 text-sm hover:text-purple-300 flex items-center">
                          <ExternalLink size={14} className="mr-1" />
                          Explore connections
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Document Analysis Metrics */}
        {documentUploaded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Sections</h3>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold">{documentData.sections.length}</span>
                <span className="text-green-400 text-sm">Main topics identified</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Entities</h3>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold">{documentData.entities.length}</span>
                <span className="text-purple-400 text-sm">Key elements extracted</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Connections</h3>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold">{documentData.connections.length}</span>
                <span className="text-blue-400 text-sm">Relationships mapped</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-10 mb-6 text-center ${
                  dragActive ? 'border-purple-500 bg-purple-900 bg-opacity-10' : 'border-gray-700 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt,.rtf,.md"
                />
                
                <Upload size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">Drag files here or</h3>
                <p className="text-gray-400 mb-6">Support for PDF, Word, Text and Markdown files</p>
                <button 
                  onClick={openFileSelector}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                  Browse Files
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Supported File Types</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center bg-gray-800 p-3 rounded-md">
                    <div className="bg-red-900 p-2 rounded-md mr-3">
                      <FileText size={16} />
                    </div>
                    <span>PDF Documents</span>
                  </div>
                  <div className="flex items-center bg-gray-800 p-3 rounded-md">
                    <div className="bg-blue-900 p-2 rounded-md mr-3">
                      <FileText size={16} />
                    </div>
                    <span>Word Documents</span>
                  </div>
                  <div className="flex items-center bg-gray-800 p-3 rounded-md">
                    <div className="bg-gray-700 p-2 rounded-md mr-3">
                      <File size={16} />
                    </div>
                    <span>Plain Text</span>
                  </div>
                  <div className="flex items-center bg-gray-800 p-3 rounded-md">
                    <div className="bg-purple-900 p-2 rounded-md mr-3">
                      <File size={16} />
                    </div>
                    <span>Markdown</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <div className="text-gray-400 text-sm">Max file size: 50MB</div>
                <div>
                  <button 
                    onClick={() => setShowUploadModal(false)} 
                    className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleFiles([{ name: "sample-document.pdf" }])}
                    className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalysisComponent;