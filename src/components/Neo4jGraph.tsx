import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReadCypher } from 'use-neo4j';
import { GraphNode, GraphEdge } from '@/lib/types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Neo4jGraphProps {
  onGraphUpdate: (nodes: GraphNode[], edges: GraphEdge[]) => void;
}

export const Neo4jGraph: React.FC<Neo4jGraphProps> = ({ onGraphUpdate }) => {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [nodeLimit, setNodeLimit] = useState<number>(50);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const previousDataRef = useRef<{ nodes: GraphNode[], edges: GraphEdge[] } | null>(null);

  // Enhanced Cypher query that finds more meaningful relationships
  // Replace your current Cypher query in Neo4jGraph.tsx with this simpler version
  const query = `
// Get a limited set of nodes
MATCH (n)
WITH n LIMIT ${nodeLimit}

// Find relationships between these nodes
OPTIONAL MATCH (n)-[r]-(m)
WHERE m <> n // To exclude self-relationships

// Collect unique nodes
WITH collect(DISTINCT n) + collect(DISTINCT m) as allNodes, collect(DISTINCT r) as allRels

// Transform nodes into the format we need
UNWIND allNodes as node
WITH collect({
  id: toString(id(node)),
  name: COALESCE(node.name, node.title, toString(id(node))),
  labels: labels(node),
  properties: properties(node)
}) as nodes, allRels

// Transform relationships into the format we need
UNWIND allRels as rel
WITH nodes, collect({
  id: toString(id(rel)),
  fromId: toString(id(startNode(rel))),
  toId: toString(id(endNode(rel))),
  fromName: COALESCE(startNode(rel).name, startNode(rel).title, toString(id(startNode(rel)))),
  toName: COALESCE(endNode(rel).name, endNode(rel).title, toString(id(endNode(rel)))),
  type: type(rel),
  properties: properties(rel)
}) as relationships

RETURN nodes, relationships
`;

  // Use useReadCypher hook from use-neo4j
  const { loading, first, error, run: runQuery } = useReadCypher(query);

  // Process results only when data changes
  const processResults = useCallback(() => {
    if (!first) return;

    try {
      // Extract nodes from the query result
      const rawNodes = first.get('nodes') || [];
      const nodes: GraphNode[] = rawNodes
        .filter((node: any) => node && node.id) // Ensure node has an id
        .map((node: any) => {
          // Set node color based on label
          let color = '#4287f5'; // Default blue
          if (node.labels && node.labels.length > 0) {
            // Assign different colors based on node label
            const label = node.labels[0].toLowerCase();
            if (label === 'person') color = '#f54242'; // Red
            else if (label === 'company') color = '#42f584'; // Green
            else if (label === 'event') color = '#f5a142'; // Orange
            else if (label === 'project') color = '#9842f5'; // Purple
            else if (label === 'location') color = '#42d9f5'; // Light blue
            else if (label === 'product') color = '#f542e5'; // Pink
            else if (label === 'organization') color = '#c9f542'; // Yellow-green
          }
          return {
            id: node.id,
            label: node.name || node.id,
            size: 30,
            color: color,
            metadata: {
              labels: node.labels,
              properties: node.properties
            }
          };
        });

      // Extract edges from the query result
      const rawRelationships = first.get('relationships') || [];
      const edges: GraphEdge[] = rawRelationships
        .filter((rel: any) => rel && rel.fromId && rel.toId) // Ensure relationship has valid nodes
        .map((rel: any) => {
          // Format relationship label to be more readable
          const formattedType = rel.type ? rel.type.replace(/_/g, ' ').toLowerCase() : '';
          return {
            id: rel.id,
            from: rel.fromId,
            to: rel.toId,
            label: formattedType,
            color: '#ffffff80', // Semi-transparent white
            metadata: {
              type: rel.type,
              properties: rel.properties
            }
          };
        });

      // Only update if data is different from previous data
      const currentData = JSON.stringify({ nodes, edges });
      const previousData = previousDataRef.current
        ? JSON.stringify(previousDataRef.current)
        : null;

      if (currentData !== previousData || isInitialLoad) {
        // Update graph in parent component
        onGraphUpdate(nodes, edges);
        // Save current data for comparison
        previousDataRef.current = { nodes, edges };
        setIsInitialLoad(false);
      }

      setConnectionError(null);
    } catch (err) {
      setConnectionError(`Error processing graph data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [first, onGraphUpdate, isInitialLoad]);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      if (error.message && error.message.includes("driver not defined")) {
        setConnectionError("Neo4j driver not available. Make sure Neo4jProvider is properly configured.");
      } else {
        setConnectionError(`Neo4j query error: ${error.message}`);
      }
    }
  }, [error]);

  // Process results when data changes
  useEffect(() => {
    if (first && !loading) {
      processResults();
    }
  }, [first, loading, processResults]);

  // Initial query run
  useEffect(() => {
    if (isInitialLoad) {
      runQuery();
    }
  }, [isInitialLoad, runQuery]);

  // Refresh the graph data manually
  const handleRefresh = useCallback(() => {
    setIsInitialLoad(true);
    runQuery();
  }, [runQuery]);

  // Change the node limit
  const handleNodeLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value);
    setNodeLimit(limit);
    setIsInitialLoad(true);
  }, []);

  // Show error state if there's a connection issue
  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-red-500 p-4 border border-red-500 rounded bg-red-500/10">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p className="font-medium mb-2">Connection Error</p>
        <p className="text-sm text-center">{connectionError}</p>
      </div>
    );
  }

  // Show loading state only on initial load
  if (loading && isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white/80">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p>Loading Neo4j graph data...</p>
      </div>
    );
  }

  // Show success message and controls
  return (
    <div className="flex justify-between items-center bg-gray-800/50 rounded p-2 mb-2">
      <div className="text-white/80 text-sm pl-2">
        Neo4j graph data loaded successfully
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span className="text-white/70 text-xs mr-2">Nodes:</span>
          <select
            value={nodeLimit}
            onChange={handleNodeLimitChange}
            className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs flex items-center gap-1"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>
    </div>
  );
};