import { useEffect, useRef, useState, useMemo } from "react";
import cytoscape from "cytoscape";
//import cola from "cytoscape-cola";
import { RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

// Register extensions
//cytoscape.use(cola);

// Node type definitions
interface NodeObject {
  id: string;
  label: string;
  labelProps?: {
    style?: {
      fill?: string;
      fontSize?: number;
      fontWeight?: string;
    };
    position?: string;
  };
  size?: number;
  color?: string;
}

// Edge type definitions
interface EdgeObject {
  from: string;
  to: string;
  label: string;
}

export function Graph({ nodes = [], edges = [] }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredElement, setHoveredElement] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Process incoming data to ensure proper format
  const processedNodes = useMemo(() => {
    try {
      return nodes.map((node, index) => {
        // Handle different possible node formats
        if (typeof node === 'string') {
          // If node is just a string, create a proper node object
          return {
            id: node,
            label: node
          };
        } else if (typeof node === 'object' && node !== null) {
          // If node is already an object, ensure it has the necessary properties
          return {
            id: node.id || node.label || String(index),
            label: node.label || node.id || node.name || 'Unknown',
            ...node
          };
        }
        // Fallback for any other type
        return { id: String(index), label: String(node) || 'Unknown' };
      });
    } catch (err) {
      console.error("Error processing nodes:", err);
      setError("Error processing node data");
      return [];
    }
  }, [nodes]);
  
  const processedEdges = useMemo(() => {
    try {
      return edges.map((edge, index) => {
        // Handle different possible edge formats
        if (Array.isArray(edge)) {
          // If edge is an array like [source, target, label]
          return {
            id: `edge-${index}`,
            from: edge[0],
            to: edge[1],
            label: edge[2] || 'RELATED_TO'
          };
        } else if (typeof edge === 'object' && edge !== null) {
          // Ensure edge has from/to properties (might be source/target in some data)
          return {
            id: edge.id || `edge-${index}`,
            from: edge.from || edge.source || '',
            to: edge.to || edge.target || '',
            label: edge.label || edge.type || 'RELATED_TO',
            ...edge
          };
        }
        // Fallback for any other type
        return { id: `edge-${index}`, from: '', to: '', label: 'RELATED_TO' };
      }).filter(edge => edge.from && edge.to); // Filter out edges with missing endpoints
    } catch (err) {
      console.error("Error processing edges:", err);
      setError("Error processing edge data");
      return [];
    }
  }, [edges]);

  // Get node type and colors
  const getNodeType = (label) => {
    if (!label) return "default";
    
    const lowerLabel = label.toLowerCase();

    if (
      lowerLabel.includes("app") ||
      lowerLabel.includes("component") ||
      lowerLabel.includes("graph")
    ) {
      return "central";
    } else if (
      lowerLabel.includes("data") ||
      lowerLabel.includes("node") ||
      lowerLabel.includes("edge")
    ) {
      return "data";
    } else if (
      lowerLabel.includes("react") ||
      lowerLabel.includes("neo4j") ||
      lowerLabel.includes("frontend") ||
      lowerLabel.includes("backend")
    ) {
      return "technology";
    } else if (
      lowerLabel.includes("research") ||
      lowerLabel.includes("quality") ||
      lowerLabel.includes("notes")
    ) {
      return "concept";
    }

    return "default";
  };

  const getNodeColor = (nodeType) => {
    switch (nodeType) {
      case "central":
        return "#ff5e7c"; // Soft red
      case "technology":
        return "#56cbf9"; // Bright blue
      case "data":
        return "#7ed957"; // Soft green
      case "concept":
        return "#ffc555"; // Soft yellow
      default:
        return "#b4a7d6"; // Soft purple
    }
  };

  const getNodeSize = (nodeType) => {
    switch (nodeType) {
      case "central":
        return 60;
      case "technology":
        return 50;
      case "data":
        return 45;
      case "concept":
        return 45;
      default:
        return 40;
    }
  };

  const getEdgeColor = (label) => {
    if (!label) return "rgba(255, 255, 255, 0.6)";

    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes("uses") || lowerLabel.includes("built_with")) {
      return "rgba(86, 203, 249, 0.8)"; // Blue
    } else if (
      lowerLabel.includes("creates") ||
      lowerLabel.includes("generates")
    ) {
      return "rgba(126, 217, 87, 0.8)"; // Green
    } else if (
      lowerLabel.includes("improves") ||
      lowerLabel.includes("suited_for")
    ) {
      return "rgba(255, 197, 85, 0.8)"; // Yellow
    } else if (lowerLabel.includes("renders")) {
      return "rgba(255, 94, 124, 0.8)"; // Red
    }

    return "rgba(255, 255, 255, 0.6)"; // Default light gray
  };

  // Process data for Cytoscape format
  const graphElements = useMemo(() => {
    try {
      if (!processedNodes.length && !processedEdges.length) {
        return [];
      }
      
      // Process nodes
      const cytoscapeNodes = processedNodes.map((node) => {
        const nodeType = getNodeType(node.label || "");
        const color = node.color || getNodeColor(nodeType);
        const size = getNodeSize(nodeType);

        return {
          data: {
            id: node.id,
            label: node.label || node.id,
            nodeType,
            color,
            size,
            originalNode: node,
          },
          classes: nodeType,
        };
      });

      // Process edges
      const cytoscapeEdges = processedEdges.map((edge, index) => {
        return {
          data: {
            id: `edge-${index}`,
            source: edge.from,
            target: edge.to,
            label: edge.label || "RELATED_TO",
            color: getEdgeColor(edge.label),
            originalEdge: edge,
          },
          classes: edge.label
            ? edge.label.toLowerCase().replace(/\s+/g, "_")
            : "default_edge",
        };
      });

      return [...cytoscapeNodes, ...cytoscapeEdges];
    } catch (err) {
      console.error("Error creating graph elements:", err);
      setError("Error creating graph visualization");
      return [];
    }
  }, [processedNodes, processedEdges]);

  // Update container dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 600;
      setDimensions({ width, height });

      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit();
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize Cytoscape
  
  useEffect(() => {
    const containerBounds = containerRef.current.getBoundingClientRect();
    //if (!containerRef.current || !graphElements.length) return;
    if (containerBounds.width === 0 || containerBounds.height === 0) {
      console.log("Container has zero dimensions, delaying cytoscape initialization");
      setTimeout(() => {
        // Force a re-render after a short delay
        setDimensions({ ...dimensions });
      }, 100);
      return;
    }

    // Clean up any existing instance
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    try {
      const cy = cytoscape({
        container: containerRef.current,
        elements: graphElements,
        style: [
          // Base node style
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
              "overlay-padding": "10px",
            },
          },
    
          // Node type-specific styles
          {
            selector: "node.central",
            style: {
              "z-index": 20,
              "border-width": 3,
              "border-opacity": 0.5,
              "font-weight": "bold",
            },
          },
          {
            selector: "node.technology",
            style: {
              "background-opacity": 0.9,
              "border-width": 2,
              "border-opacity": 0.4,
            },
          },
          {
            selector: "node.data",
            style: {
              "background-opacity": 0.8,
              "border-width": 1.5,
              "border-opacity": 0.3,
            },
          },
          {
            selector: "node.concept",
            style: {
              "background-opacity": 0.8,
              "border-width": 1.5,
              "border-opacity": 0.3,
            },
          },
    
          // Edge styles
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "line-color": "data(color)",
              "target-arrow-color": "data(color)",
              "source-arrow-color": "data(color)",
              "target-arrow-shape": "triangle",
              "arrow-scale": 1.5,
              "line-opacity": 0.7,
              width: 2.5,
              "z-index": 1,
              "overlay-padding": "10px",
              "text-background-opacity": 1,
              "text-background-color": "rgba(0, 0, 0, 0.7)",
              "text-background-padding": "4px",
              "text-background-shape": "roundrectangle",
              color: "#ffffff",
              "font-size": "12px",
              "text-max-width": "100px",
            },
          },
    
          // Show edge labels on hover
          {
            selector: "edge:selected, edge.hover",
            style: {
              label: "data(label)",
              width: 3.5,
              "line-opacity": 1,
              "z-index": 5,
              "overlay-padding": "10px",
              "text-background-opacity": 1,
              "text-background-color": "rgba(0, 0, 0, 0.7)",
              "text-background-padding": "4px",
              "text-background-shape": "roundrectangle",
            },
          },
    
          // Hover states
          {
            selector: "node:selected, node.hover",
            style: {
              "border-width": 4,
              "border-color": "#ffffff",
              "border-opacity": 0.9,
              "background-opacity": 1,
              "text-background-opacity": 1,
              "font-weight": "bold",
              "background-blacken": -0.1,
              "z-index": 20,
            },
          },
        ],
        // Changed from cola to cose layout
        layout: {
          name: "cose",
          fit: true,
          padding: 50,
          nodeDimensionsIncludeLabels: true,
          idealEdgeLength: 100,
          nodeRepulsion: 5000,
          edgeElasticity: 0.45,
          gravity: 0.25,
          randomize: false,
          componentSpacing: 40,
          avoidOverlap: true
        }as any,
        // Added options to help with mouse interaction errors
        minZoom: 0.1,
        maxZoom: 2,
        wheelSensitivity: 0.3,
        boxSelectionEnabled: false,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        autoungrabify: false,
        autounselectify: false
      });
    
      // Setup event handlers with error handling
      cy.on("mouseover", "node", (e) => {
        try {
          const node = e.target;
          node.addClass("hover");
    
          // Get all connected edges
          const connectedEdges = node.connectedEdges();
    
          // Organize relationships
          const incomingRelations = [];
          const outgoingRelations = [];
    
          connectedEdges.forEach((edge) => {
            try {
              const sourceId = edge.source().id();
              const targetId = edge.target().id();
              const sourceLabel = edge.source().data("label");
              const targetLabel = edge.target().data("label");
              const relationLabel = edge
                .data("label")
                .toLowerCase()
                .replace(/_/g, " ");
    
              if (sourceId === node.id()) {
                // Outgoing relationship
                outgoingRelations.push({
                  relation: relationLabel,
                  node: targetLabel,
                });
              } else {
                // Incoming relationship
                incomingRelations.push({
                  relation: relationLabel,
                  node: sourceLabel,
                });
              }
            } catch (edgeErr) {
              console.error("Error processing edge:", edgeErr);
            }
          });
    
          setHoveredElement({
            id: node.id(),
            type: "node",
            label: node.data("label"),
            nodeType: node.data("nodeType"),
            connections: connectedEdges.length,
            incomingRelations,
            outgoingRelations,
          });
        } catch (err) {
          console.error("Error in node mouseover event:", err);
        }
      });
    
      // Add error handling to other event handlers too
      cy.on("mouseout", "node", (e) => {
        try {
          e.target.removeClass("hover");
          setHoveredElement(null);
        } catch (err) {
          console.error("Error in node mouseout event:", err);
        }
      });
    
      // Save reference
      cyRef.current = cy;
      setInitialized(true);
      setError(null);
    } catch (err) {
      console.error("Error initializing cytoscape:", err);
      setError("Failed to initialize graph visualization");
    }

    // Return cleanup function
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [graphElements]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (!cyRef.current) return;
    const currentZoom = cyRef.current.zoom();
    cyRef.current.animate({ zoom: currentZoom * 1.3, duration: 200 });
  };

  const handleZoomOut = () => {
    if (!cyRef.current) return;
    const currentZoom = cyRef.current.zoom();
    cyRef.current.animate({ zoom: currentZoom / 1.3, duration: 200 });
  };

  const handleCenterGraph = () => {
    if (!cyRef.current) return;
    cyRef.current.fit(undefined, 50);
    cyRef.current.center();
  };

  // Debug logging
  useEffect(() => {
    console.log("Graph render debug:", {
      rawNodes: nodes?.length || 0,
      rawEdges: edges?.length || 0,
      processedNodes: processedNodes?.length || 0,
      processedEdges: processedEdges?.length || 0,
      graphElements: graphElements?.length || 0
    });
  }, [nodes, edges, processedNodes, processedEdges, graphElements]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#121220",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Error display */}
      {error && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 20,
          padding: "20px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#ff5e7c", marginBottom: "10px" }}>Graph Visualization Error</h3>
          <p>{error}</p>
          <div style={{ marginTop: "15px", fontSize: "12px", maxWidth: "80%" }}>
            <p>Debug info: {processedNodes.length} nodes, {processedEdges.length} edges</p>
            <p>Please check your graph data format or try again.</p>
          </div>
        </div>
      )}

      {/* Graph Container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Control Panel */}
      <div
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "transparent",
          borderRadius: "6px",
        }}
      >
        <button
          style={controlButtonStyle}
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          style={controlButtonStyle}
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          style={controlButtonStyle}
          onClick={handleCenterGraph}
          title="Center Graph"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Info Panel for hovered elements */}
      {hoveredElement && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "15px",
            borderRadius: "6px",
            color: "white",
            maxWidth: "300px",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.4)",
            border:
              hoveredElement.type === "node"
                ? `1px solid ${getNodeColor(hoveredElement.nodeType)}`
                : "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {hoveredElement.type === "node" ? (
            <>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: getNodeColor(hoveredElement.nodeType),
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "4px",
                }}
              >
                {hoveredElement.label}
              </div>

              {hoveredElement.outgoingRelations.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "4px",
                      opacity: 0.8,
                    }}
                  >
                    Outgoing Relationships:
                  </div>
                  {hoveredElement.outgoingRelations.map((rel, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "13px",
                        marginBottom: "4px",
                        paddingLeft: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {hoveredElement.label}
                      </span>{" "}
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "rgba(255, 255, 255, 0.8)",
                          padding: "0 4px",
                        }}
                      >
                        {rel.relation}
                      </span>{" "}
                      <span style={{ fontWeight: "bold" }}>{rel.node}</span>
                    </div>
                  ))}
                </div>
              )}

              {hoveredElement.incomingRelations.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "4px",
                      opacity: 0.8,
                    }}
                  >
                    Incoming Relationships:
                  </div>
                  {hoveredElement.incomingRelations.map((rel, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "13px",
                        marginBottom: "4px",
                        paddingLeft: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{rel.node}</span>{" "}
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "rgba(255, 255, 255, 0.8)",
                          padding: "0 4px",
                        }}
                      >
                        {rel.relation}
                      </span>{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {hoveredElement.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {hoveredElement.incomingRelations.length === 0 &&
                hoveredElement.outgoingRelations.length === 0 && (
                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "4px",
                      fontStyle: "italic",
                      opacity: 0.7,
                    }}
                  >
                    No relationships connected to this node.
                  </div>
                )}
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "4px",
                }}
              >
                Relationship
              </div>
              <div
                style={{
                  fontSize: "13px",
                  marginBottom: "4px",
                  lineHeight: "1.5",
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  {hoveredElement.source}
                </span>{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 4px",
                  }}
                >
                  {hoveredElement.label.toLowerCase().replace(/_/g, " ")}
                </span>{" "}
                <span style={{ fontWeight: "bold" }}>
                  {hoveredElement.target}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Control button styles
const controlButtonStyle = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  transition: "background-color 0.2s, transform 0.2s",
  outline: "none",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

export default Graph;