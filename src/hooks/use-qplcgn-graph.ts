// File: hooks/use-qplcgn-graph.tsx

import { useState } from 'react';
import axios from 'axios';

// Define types for the graph data
interface Node {
  id: string;
  label: string;
  group?: string;
  type?: string;
  parallelGroup?: number;
  color?: string;
  quantumParallel?: boolean;
}

interface Edge {
  source: string;
  target: string;
  weight?: number;
  type?: string;
  isParallel?: boolean;
  isQuantumParallel?: boolean;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface ConceptAnalysisResult {
  concepts: string[];
  graph: GraphData;
}

interface RelationshipPrediction {
  hierarchical: number;
  parallel: number;
}

interface GraphOptions {
  emphasizeParallelism?: boolean;
  parallelismThreshold?: number;
  colorScheme?: string;
  useQuantum?: boolean;
}

interface QuantumAdvantage {
  entanglement_entropy: number;
  circuit_depth: number;
  qubit_count: number;
}

interface QuantumAnalysisResult {
  success: boolean;
  concepts: string[];
  parallelism_matrix: number[][];
  parallel_groups: string[][];
  quantum_advantage: QuantumAdvantage;
  error?: string;
}

// The custom hook for QPLCGN model integration
export const useQPLCGNGraph = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [parallelismEnabled, setParallelismEnabled] = useState(false);
  const [parallelismThreshold, setParallelismThreshold] = useState(0.6); // Default threshold
  const [quantumEnabled, setQuantumEnabled] = useState(false);
  const [quantumAdvantage, setQuantumAdvantage] = useState<QuantumAdvantage | null>(null);

  // API endpoint configuration
  const API_URL = 'https://colpali.api.scinter.org:5000';

  // Toggle quantum processing
  const toggleQuantumMode = (enabled: boolean) => {
    setQuantumEnabled(enabled);
    
    // If we're turning on quantum mode and we have a graph,
    // automatically analyze with quantum processing
    if (enabled && graphData && graphData.nodes.length > 0) {
      analyzeQuantumParallelism();
    }
  };

  // Toggle parallelism visualization
  const toggleParallelism = (enabled: boolean) => {
    setParallelismEnabled(enabled);
    
    // If we already have graph data, update it to show/hide parallelism
    if (graphData) {
      const updatedGraph = emphasizeParallelism(graphData, enabled, parallelismThreshold);
      setGraphData(updatedGraph);
    }
  };

  // Set the threshold for what's considered a parallel relationship
  const setParallelismLevel = (threshold: number) => {
    setParallelismThreshold(threshold);
    
    // Update the existing graph with the new threshold if parallelism is enabled
    if (graphData && parallelismEnabled) {
      const updatedGraph = emphasizeParallelism(graphData, true, threshold);
      setGraphData(updatedGraph);
    }
  };

  // Helper function to identify and highlight parallel relationships
  const emphasizeParallelism = (graph: GraphData, enabled: boolean, threshold: number): GraphData => {
    if (!enabled) {
      // Remove parallelism markers but keep the original graph structure
      return {
        nodes: graph.nodes.map(node => ({
          ...node,
          parallelGroup: undefined,
          color: undefined,
          quantumParallel: node.quantumParallel // Preserve quantum info
        })),
        edges: graph.edges.map(edge => ({
          ...edge,
          isParallel: undefined,
          isQuantumParallel: edge.isQuantumParallel // Preserve quantum info
        }))
      };
    }

    // Step 1: First pass to identify parallel edges based on type or predicted relationships
    const parallelEdges = graph.edges.filter(edge => 
      (edge.type === 'PARALLEL_TO' || 
       edge.type === 'SIMILAR_TO' || 
       edge.type === 'CONCURRENT_WITH' ||
       edge.type === 'RELATES_TO') // We'll check these for potential parallelism
    );

    // Step 2: Group nodes that are connected by parallel edges
    const parallelGroups: Record<string, number> = {};
    let groupCounter = 0;
    
    // For each potential parallel edge, check or predict the relationship
    parallelEdges.forEach(edge => {
      // For now, we'll use a simple approach to group related concepts
      const source = edge.source;
      const target = edge.target;
      
      // Mark this edge as parallel for visualization
      edge.isParallel = true;
      
      // Assign nodes to parallel groups
      if (!parallelGroups[source] && !parallelGroups[target]) {
        // Create new group
        groupCounter++;
        parallelGroups[source] = groupCounter;
        parallelGroups[target] = groupCounter;
      } else if (parallelGroups[source] && !parallelGroups[target]) {
        // Add target to source's group
        parallelGroups[target] = parallelGroups[source];
      } else if (!parallelGroups[source] && parallelGroups[target]) {
        // Add source to target's group
        parallelGroups[source] = parallelGroups[target];
      }
      // If both already have groups, we could merge groups, but we'll keep it simple for now
    });

    // Color palette for parallel groups
    const colorPalette = [
      '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3',
      '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'
    ];

    // Step 3: Update nodes with their parallel group information
    const updatedNodes = graph.nodes.map(node => {
      const group = parallelGroups[node.id];
      if (group) {
        return {
          ...node,
          parallelGroup: group,
          color: node.quantumParallel ? '#7b3ff5' : colorPalette[group % colorPalette.length]
        };
      }
      return node;
    });

    return {
      nodes: updatedNodes,
      edges: graph.edges
    };
  };

  // Helper function to apply quantum parallel groups to the graph
  const applyQuantumParallelGroups = (graph: GraphData | null, parallelGroups: string[][]): GraphData => {
    if (!graph) return { nodes: [], edges: [] };
    
    // Create a copy of the graph
    const updatedGraph = { 
      nodes: [...graph.nodes],
      edges: [...graph.edges]
    };
    
    // Map to track which nodes are in parallel groups
    const nodeParallelMap: Record<string, number> = {};
    
    // Process each parallel group
    parallelGroups.forEach((group, groupIndex) => {
      // Mark each node in the group
      group.forEach(conceptLabel => {
        // Find the node with this label
        const nodeIndex = updatedGraph.nodes.findIndex(
          node => node.label === conceptLabel || node.id === conceptLabel
        );
        
        if (nodeIndex >= 0) {
          // Update the node with quantum parallelism info
          updatedGraph.nodes[nodeIndex] = {
            ...updatedGraph.nodes[nodeIndex],
            quantumParallel: true,
            color: '#7b3ff5', // Special color for quantum parallel nodes
            parallelGroup: groupIndex + 1 // Use group index as the group identifier
          };
          
          // Add to mapping
          nodeParallelMap[updatedGraph.nodes[nodeIndex].id] = groupIndex + 1;
        }
      });
    });
    
    // Create edges between parallel nodes in the same group
    Object.entries(nodeParallelMap).forEach(([nodeId, groupId]) => {
      // Find other nodes in the same group
      const parallelNodeIds = Object.entries(nodeParallelMap)
        .filter(([id, group]) => id !== nodeId && group === groupId)
        .map(([id]) => id);
      
      // Create edges to other nodes in group
      parallelNodeIds.forEach(targetId => {
        // Check if edge already exists
        const edgeExists = updatedGraph.edges.some(edge => 
          (edge.source === nodeId && edge.target === targetId) ||
          (edge.source === targetId && edge.target === nodeId)
        );
        
        // Add new edge if it doesn't exist
        if (!edgeExists) {
          updatedGraph.edges.push({
            source: nodeId,
            target: targetId,
            type: 'QUANTUM_PARALLEL',
            isParallel: true,
            isQuantumParallel: true,
            weight: 1.0
          });
        } else {
          // Update existing edge with quantum information
          const edgeIndex = updatedGraph.edges.findIndex(edge => 
            (edge.source === nodeId && edge.target === targetId) ||
            (edge.source === targetId && edge.target === nodeId)
          );
          
          if (edgeIndex >= 0) {
            updatedGraph.edges[edgeIndex] = {
              ...updatedGraph.edges[edgeIndex],
              type: 'QUANTUM_PARALLEL',
              isParallel: true,
              isQuantumParallel: true
            };
          }
        }
      });
    });
    
    return updatedGraph;
  };

  // Extract concepts and generate graph from document text with options
  const generateGraph = async (documentText: string, options: GraphOptions = {}) => {
    setLoading(true);
    setError(null);
    
    const { 
      emphasizeParallelism: showParallelism = parallelismEnabled, 
      parallelismThreshold: threshold = parallelismThreshold,
      useQuantum = quantumEnabled
    } = options;
    
    try {
      // Standard concept extraction
      const response = await axios.post<ConceptAnalysisResult>(`${API_URL}/extract_concepts`, {
        text: documentText,
        emphasize_parallelism: showParallelism,
        parallelism_threshold: threshold
      });
      
      let { concepts, graph } = response.data;
      
      // Update state with results
      setConcepts(concepts);
      setGraphData(graph);
      
      // Apply parallelism visualization if requested
      if (showParallelism) {
        graph = emphasizeParallelism(graph, true, threshold);
      }
      
      // If quantum mode is enabled, perform quantum analysis
      if (useQuantum) {
        try {
          const quantumResult = await analyzeQuantumParallelism(documentText, concepts);
          if (quantumResult && quantumResult.success) {
            // Apply quantum results to the graph
            graph = applyQuantumParallelGroups(graph, quantumResult.parallel_groups);
            setGraphData(graph);
          }
        } catch (quantumErr) {
          console.warn('Quantum analysis failed, falling back to classical:', quantumErr);
          // Continue with classical results, no need to fail the whole operation
        }
      }
      
      // Return the data for potential further processing
      return { concepts, graph };
    } catch (err) {
      console.error('Error generating graph with QPLCGN model:', err);
      setError('Failed to generate graph. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Predict relationship between two concepts with parallelism detection
  const predictRelationship = async (concept1: string, concept2: string, context: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<RelationshipPrediction>(`${API_URL}/predict_relationship`, {
        concept1,
        concept2,
        context
      });
      
      const result = response.data;
      
      // If we have a graph and the relationship has a high parallelism score,
      // we can update our graph to reflect this
      if (graphData && result.parallel > parallelismThreshold && parallelismEnabled) {
        // Find the nodes for these concepts
        const node1 = graphData.nodes.find(n => n.label === concept1 || n.id === concept1);
        const node2 = graphData.nodes.find(n => n.label === concept2 || n.id === concept2);
        
        if (node1 && node2) {
          // Create or update edge showing parallelism
          const existingEdgeIndex = graphData.edges.findIndex(e => 
            (e.source === node1.id && e.target === node2.id) ||
            (e.source === node2.id && e.target === node1.id)
          );
          
          const newEdge = {
            source: node1.id,
            target: node2.id,
            type: 'PARALLEL_TO',
            weight: result.parallel,
            isParallel: true
          };
          
          const updatedEdges = [...graphData.edges];
          if (existingEdgeIndex >= 0) {
            updatedEdges[existingEdgeIndex] = newEdge;
          } else {
            updatedEdges.push(newEdge);
          }
          
          // Update the graph with new parallelism information
          const updatedGraph = emphasizeParallelism(
            { nodes: graphData.nodes, edges: updatedEdges },
            true,
            parallelismThreshold
          );
          
          setGraphData(updatedGraph);
        }
      }
      
      return result;
    } catch (err) {
      console.error('Error predicting relationship:', err);
      setError('Failed to predict relationship. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Use quantum processing to analyze parallelism
  const analyzeQuantumParallelism = async (documentText?: string, conceptList?: string[]) => {
    setLoading(true);
    setError(null);
    
    const requestData: any = {};
    
    // Use provided document text or concepts if available
    if (documentText) {
      requestData.text = documentText;
    }
    
    if (conceptList && conceptList.length > 0) {
      requestData.concepts = conceptList;
    } else if (concepts.length > 0) {
      requestData.concepts = concepts;
    } else if (!documentText && !graphData) {
      setError('No document or concepts available for quantum analysis');
      setLoading(false);
      return null;
    }
    
    // If neither concepts nor text is provided, but we have graph data, use node labels
    if (!requestData.concepts && !requestData.text && graphData) {
      requestData.concepts = graphData.nodes.map(node => node.label);
    }
    
    try {
      // Call the quantum analysis endpoint
      const response = await axios.post<QuantumAnalysisResult>(
        `${API_URL}/quantum_parallel_analysis`, 
        requestData
      );
      
      if (response.data.success) {
        // Store quantum advantage metrics
        setQuantumAdvantage(response.data.quantum_advantage);
        
        // If we have graph data, apply the quantum parallelism results
        if (graphData && response.data.parallel_groups.length > 0) {
          const updatedGraph = applyQuantumParallelGroups(
            graphData, 
            response.data.parallel_groups
          );
          setGraphData(updatedGraph);
        }
        
        return response.data;
      } else {
        setError(response.data.error || 'Quantum analysis failed');
        return null;
      }
    } catch (err) {
      console.error('Error in quantum parallelism analysis:', err);
      setError('Quantum analysis failed. The quantum layer may not be available.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Detect parallel concepts in the entire graph
  const detectAllParallelConcepts = async (context: string) => {
    if (!graphData || graphData.nodes.length < 2) {
      return;
    }
    
    // If quantum mode is enabled, use quantum analysis
    if (quantumEnabled) {
      return analyzeQuantumParallelism(context);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a copy of the current graph
      const graph = { ...graphData };
      const newEdges = [...graph.edges];
      
      // Get all unique pairs of concepts
      const nodes = graph.nodes;
      const pairs = [];
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          pairs.push([nodes[i], nodes[j]]);
        }
      }
      
      // Process in batches to avoid overwhelming the API
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < pairs.length; i += batchSize) {
        batches.push(pairs.slice(i, i + batchSize));
      }
      
      // Process each batch sequentially
      for (const batch of batches) {
        const promises = batch.map(([node1, node2]) => 
          predictRelationship(node1.label, node2.label, context)
            .then(result => ({ node1, node2, result }))
        );
        
        const results = await Promise.all(promises);
        
        // Add edges for strong parallel relationships
        for (const { node1, node2, result } of results) {
          if (result && result.parallel > parallelismThreshold) {
            // Add new parallel edge
            newEdges.push({
              source: node1.id,
              target: node2.id,
              type: 'PARALLEL_TO',
              weight: result.parallel,
              isParallel: true
            });
          }
        }
      }
      
      // Update graph with new parallelism information
      const updatedGraph = emphasizeParallelism(
        { nodes: graph.nodes, edges: newEdges },
        true,
        parallelismThreshold
      );
      
      setGraphData(updatedGraph);
      return updatedGraph;
      
    } catch (err) {
      console.error('Error detecting parallel concepts:', err);
      setError('Failed to detect all parallel relationships. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert graph data to the format expected by Scinter
  const convertToScinterFormat = () => {
    if (!graphData) return null;
    
    // Format nodes and edges for Scinter visualization
    return {
      nodes: graphData.nodes.map(node => ({
        ...node,
        color: node.color, // Use parallel group colors if available
        size: node.quantumParallel ? 30 : (node.parallelGroup ? 25 : 20), // Size based on parallelism
        borderWidth: node.quantumParallel ? 3 : 1,
        borderColor: node.quantumParallel ? '#7b3ff5' : undefined,
        labelColor: node.quantumParallel ? '#ffffff' : undefined
      })),
      edges: graphData.edges.map(edge => ({
        ...edge,
        // Style edges differently based on type
        style: edge.isQuantumParallel ? 'dotted' : (edge.isParallel ? 'dashed' : 'solid'),
        width: edge.isQuantumParallel ? 3 : (edge.isParallel ? 2 : 1),
        color: edge.isQuantumParallel ? '#7b3ff5' : (edge.isParallel ? '#9370db' : '#aaaaaa'),
        animated: edge.isQuantumParallel
      }))
    };
  };

  return {
    loading,
    error,
    concepts,
    graphData,
    quantumEnabled,
    quantumAdvantage,
    generateGraph,
    predictRelationship,
    convertToScinterFormat,
    toggleParallelism,
    setParallelismLevel,
    parallelismEnabled,
    parallelismThreshold,
    detectAllParallelConcepts,
    toggleQuantumMode,
    analyzeQuantumParallelism
  };
};