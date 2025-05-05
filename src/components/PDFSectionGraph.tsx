// PDFSectionGraph.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import cytoscape from "cytoscape";
// DO NOT import cola
import { RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";

// We need to patch Cytoscape to prevent any cola layout from running
const originalLayout = cytoscape('layout', 'cola');
if (originalLayout) {
  // Override the cola layout with a simple grid layout to prevent errors
  cytoscape('layout', 'cola', function(options) {
    // Just return a grid layout instead
    return this.layout({ name: 'grid', fit: true, padding: 30 });
  });
}

export function PDFSectionGraph({ sectionData }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  // Use state instead of ref for initialization status to force re-render when needed
  const [isInitialized, setIsInitialized] = useState(false);

  const getEdgeColor = (label) => {
    if (!label) return "rgba(255, 255, 255, 0.6)";
    
    const lowerLabel = typeof label === 'string' ? label.toLowerCase() : '';
    
    if (lowerLabel.includes("uses") || lowerLabel.includes("with")) {
      return "rgba(86, 203, 249, 0.8)"; // Blue
    } else if (lowerLabel.includes("is_") || lowerLabel.includes("has_")) {
      return "rgba(126, 217, 87, 0.8)"; // Green
    } else if (lowerLabel.includes("affects") || lowerLabel.includes("causes")) {
      return "rgba(255, 197, 85, 0.8)"; // Yellow
    } else if (lowerLabel.includes("measures") || lowerLabel.includes("detects")) {
      return "rgba(255, 94, 124, 0.8)"; // Red
    }
    
    return "rgba(255, 255, 255, 0.6)"; // Default light gray
  };

  // Extract nodes and edges from the section data with better validation
  const { nodes, edges } = useMemo(() => {
    // Ensure sectionData and its properties exist
    if (!sectionData || !sectionData.entities) {
      console.warn("Missing or invalid section data:", sectionData);
      return { nodes: [], edges: [] };
    }

    // Handle the specific format from your PDF API with better validation
    const extractedNodes = (sectionData.entities || []).map((entity, index) => ({
      id: `node-${index}`,
      label: typeof entity === 'string' ? entity : `Entity ${index}`,
      nodeType: 'CONCEPT', // Default type, could be refined
      color: '#b4a7d6'
    }));
    
    // Validate edges properly
    const validEdges = (sectionData.edges || []).filter(edge => 
      Array.isArray(edge) && edge.length >= 2 && edge[0] && edge[1]
    );
    
    const extractedEdges = validEdges.map((edge, index) => ({
      id: `edge-${index}`,
      from: edge[0],
      to: edge[1],
      label: edge[2] || "RELATED_TO"
    }));
    
    return { nodes: extractedNodes, edges: extractedEdges };
  }, [sectionData]);

  // Transform nodes and edges for Cytoscape with improved validation
  const graphElements = useMemo(() => {
    // If no nodes, return empty array to prevent errors
    if (!nodes.length) return [];
    
    // Create a map for node label to ID lookup
    const nodeMap = {};
    nodes.forEach(node => {
      if (node.label) {
        nodeMap[node.label] = node.id;
      }
    });

    // Create Cytoscape-compatible node objects with initial positions
    const nodeCount = nodes.length;
    const rows = Math.ceil(Math.sqrt(nodeCount));
    const cols = Math.ceil(nodeCount / rows);
    const spacing = 100;
    
    const cytoscapeNodes = nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        data: {
          id: node.id,
          label: node.label,
          nodeType: node.nodeType,
          color: node.color,
          size: 45, // Default size
        },
        position: {
          x: col * spacing, 
          y: row * spacing
        },
        classes: node.nodeType?.toLowerCase() || 'default'
      };
    });

    // Only process edges if we have nodes
    if (!cytoscapeNodes.length) return [];

    // Filter out edges with invalid source/target references
    const validEdges = edges.filter(edge => {
      const sourceId = nodeMap[edge.from] || edge.from;
      const targetId = nodeMap[edge.to] || edge.to;
      return sourceId && targetId;
    });

    // Create Cytoscape-compatible edge objects
    const cytoscapeEdges = validEdges.map(edge => {
      // Find source and target IDs using the labels
      const sourceId = nodeMap[edge.from] || edge.from;
      const targetId = nodeMap[edge.to] || edge.to;
      
      return {
        data: {
          id: edge.id,
          source: sourceId,
          target: targetId,
          label: edge.label || "",
          color: getEdgeColor(edge.label),
        },
        classes: edge.label?.toLowerCase().replace(/\s+/g, "_") || "default_edge"
      };
    });

    return [...cytoscapeNodes, ...cytoscapeEdges];
  }, [nodes, edges]);

  // Completely destroy and reinitialize cytoscape when data changes
  useEffect(() => {
    // Clean up any existing instance
    if (cyRef.current) {
      try {
        // Remove all event listeners
        cyRef.current.removeAllListeners();
        // Destroy the instance
        cyRef.current.destroy();
      } catch (err) {
        console.error("Error cleaning up Cytoscape:", err);
      }
      cyRef.current = null;
    }

    // Mark as not initialized
    setIsInitialized(false);
  }, [sectionData]);

  // Initialize Cytoscape once we're sure previous instance was destroyed
  useEffect(() => {
    // Skip if already initialized or no data/container
    if (isInitialized || !containerRef.current || !graphElements.length) {
      return;
    }

    console.log("Preparing to initialize Cytoscape:", {
      containerExists: !!containerRef.current,
      elementsCount: graphElements.length,
      containerDimensions: containerRef.current ? {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      } : null
    });
    
    const initTimer = setTimeout(() => {
      try {
        // Patching global cytoscape to avoid using cola
        // Removed invalid call to cytoscape('layout')
        if (originalLayout) {
          // Override cola layout to prevent it from being used
          cytoscape('layout', 'cola', function(options) {
            return this.layout({ name: 'grid', fit: true, padding: 30 });
          });
        }
        
        // Create cytoscape instance with the preset layout (using our predefined positions)
        const cy = cytoscape({
          container: containerRef.current,
          elements: graphElements,
          style: [
            // Node styles
            {
              selector: "node",
              style: {
                "background-color": "data(color)",
                label: "data(label)",
                width: "data(size)",
                height: "data(size)",
                "text-valign": "bottom",
                "text-halign": "center",
                "text-margin-y": 10,
                "font-size": "14px",
                color: "#fff",
                "text-background-color": "rgba(0, 0, 0, 0.7)",
                "text-background-opacity": 1,
                "text-background-padding": "5px",
                "text-background-shape": "roundrectangle",
                "text-border-opacity": 0,
                "text-max-width": "150px",
                "text-wrap": "ellipsis",
                "border-width": 2,
                "border-color": "#ffffff",
                "border-opacity": 0.3,
                "z-index": 10,
              },
            },
            // Edge styles
            {
              selector: "edge",
              style: {
                "curve-style": "bezier",
                "line-color": "data(color)",
                "target-arrow-color": "data(color)",
                "target-arrow-shape": "triangle",
                "arrow-scale": 1.5,
                "line-opacity": 0.7,
                width: 2.5,
                "z-index": 1,
              },
            },
            // Hover states
            {
              selector: "edge:selected, edge.hover",
              style: {
                label: "data(label)",
                width: 3.5,
                "line-opacity": 1,
                "z-index": 5,
              },
            },
            {
              selector: "node:selected, node.hover",
              style: {
                "border-width": 4,
                "border-color": "#ffffff",
                "border-opacity": 0.9,
                "background-opacity": 1,
                "z-index": 20,
              },
            },
          ],
          // Critical: use the preset layout to avoid running any automatic layout algorithm
          layout: {
            name: 'preset',
            fit: true,
            padding: 50
          },
          userZoomingEnabled: true,
          userPanningEnabled: true,
          minZoom: 0.2,
          maxZoom: 2,
        });

        // Event handlers for hover effects with safeguards
        cy.on("mouseover", "node", (e) => {
          try {
            const node = e.target;
            node.addClass("hover");
            
            // Get connected edges and relationships
            const connectedEdges = node.connectedEdges();
            const incomingRelations = [];
            const outgoingRelations = [];

            connectedEdges.forEach((edge) => {
              const source = edge.source();
              const target = edge.target();
              
              if (!source || !target) return;
              
              const sourceLabel = source.data("label") || "Unknown";
              const targetLabel = target.data("label") || "Unknown";
              const relationLabel = (edge.data("label") || "related to").toLowerCase().replace(/_/g, " ");

              if (edge.source().id() === node.id()) {
                outgoingRelations.push({
                  relation: relationLabel,
                  node: targetLabel,
                });
              } else {
                incomingRelations.push({
                  relation: relationLabel,
                  node: sourceLabel,
                });
              }
            });

            setHoveredElement({
              type: "node",
              label: node.data("label") || "Unknown",
              incomingRelations,
              outgoingRelations,
            });
          } catch (err) {
            console.error("Error in node mouseover event:", err);
          }
        });

        cy.on("mouseout", "node", (e) => {
          try {
            e.target.removeClass("hover");
            setHoveredElement(null);
          } catch (err) {
            console.error("Error in node mouseout event:", err);
          }
        });

        cy.on("mouseover", "edge", (e) => {
          try {
            const edge = e.target;
            edge.addClass("hover");
            
            const source = edge.source();
            const target = edge.target();
            
            if (!source || !target) return;
            
            setHoveredElement({
              type: "edge",
              label: edge.data("label") || "related to",
              source: source.data("label") || "Unknown",
              target: target.data("label") || "Unknown",
            });
          } catch (err) {
            console.error("Error in edge mouseover event:", err);
          }
        });

        cy.on("mouseout", "edge", (e) => {
          try {
            e.target.removeClass("hover");
            setHoveredElement(null);
          } catch (err) {
            console.error("Error in edge mouseout event:", err);
          }
        });

        cy.on("tap", (e) => {
          try {
            if (e.target === cy) {
              cy.elements().removeClass("hover");
              setHoveredElement(null);
            }
          } catch (err) {
            console.error("Error in tap event:", err);
          }
        });

        // Save reference
        cyRef.current = cy;
        
        // Fit the graph after everything is set up
        setTimeout(() => {
          try {
            cy.fit(undefined, 50);
          } catch (err) {
            console.error("Error fitting graph:", err);
          }
        }, 200);
        
        console.log("Cytoscape initialized successfully with", cy.nodes().length, "nodes and", cy.edges().length, "edges");
        
        // Mark as initialized
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing Cytoscape:", err);
      }
    }, 300);
    
    return () => {
      clearTimeout(initTimer);
    };
  }, [graphElements, isInitialized]);
  
  // Add a resize listener to handle container size changes
  useEffect(() => {
    const handleResize = () => {
      if (cyRef.current) {
        cyRef.current.resize();
        setTimeout(() => {
          try {
            cyRef.current.fit(undefined, 50);
          } catch (err) {
            console.error("Error fitting graph after resize:", err);
          }
        }, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Controls for zoom/center
  const handleZoomIn = () => {
    if (cyRef.current) {
      try {
        const currentZoom = cyRef.current.zoom();
        cyRef.current.animate({ zoom: currentZoom * 1.3, duration: 200 });
      } catch (err) {
        console.error("Error during zoom in:", err);
      }
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      try {
        const currentZoom = cyRef.current.zoom();
        cyRef.current.animate({ zoom: currentZoom / 1.3, duration: 200 });
      } catch (err) {
        console.error("Error during zoom out:", err);
      }
    }
  };

  const handleCenterGraph = () => {
    if (cyRef.current) {
      try {
        cyRef.current.fit(undefined, 50);
        cyRef.current.center();
      } catch (err) {
        console.error("Error during graph centering:", err);
      }
    }
  };

  // UI rendering
  return (
    <div className="h-full relative bg-[#121220] rounded-md overflow-hidden" style={{ minHeight: '300px' }}>
      {/* Graph container */}
      <div ref={containerRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      
      {/* Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          onClick={handleCenterGraph}
          className="bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/50"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
      
      {/* Info panel for hover with safeguards */}
      {hoveredElement && (
        <div className="absolute top-3 left-3 bg-black/80 text-white p-3 rounded-md max-w-xs text-sm border border-purple-400/30">
          {hoveredElement.type === "node" ? (
            <>
              <div className="font-bold mb-2 text-purple-300">{hoveredElement.label}</div>
              {hoveredElement.outgoingRelations && hoveredElement.outgoingRelations.length > 0 && (
                <div>
                  <div className="text-xs opacity-70 mb-1">Outgoing:</div>
                  {hoveredElement.outgoingRelations.map((rel, i) => (
                    <div key={i} className="text-xs mb-1 pl-2">
                      <span className="font-medium">{hoveredElement.label}</span>{" "}
                      <span className="italic text-blue-300">{rel.relation}</span>{" "}
                      <span className="font-medium">{rel.node}</span>
                    </div>
                  ))}
                </div>
              )}
              {hoveredElement.incomingRelations && hoveredElement.incomingRelations.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs opacity-70 mb-1">Incoming:</div>
                  {hoveredElement.incomingRelations.map((rel, i) => (
                    <div key={i} className="text-xs mb-1 pl-2">
                      <span className="font-medium">{rel.node}</span>{" "}
                      <span className="italic text-blue-300">{rel.relation}</span>{" "}
                      <span className="font-medium">{hoveredElement.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="font-bold mb-2 text-blue-300">Relationship</div>
              <div className="text-xs">
                <span className="font-medium">{hoveredElement.source}</span>{" "}
                <span className="italic text-blue-300">
                  {typeof hoveredElement.label === 'string' 
                    ? hoveredElement.label.toLowerCase().replace(/_/g, " ") 
                    : "related to"}
                </span>{" "}
                <span className="font-medium">{hoveredElement.target}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}