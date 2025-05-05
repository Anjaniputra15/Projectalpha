import { GraphNode, GraphEdge } from "@/lib/types";
import { DataSet } from "vis-data";
import { getNodeColor } from "./config";

export function prepareGraphData(nodes: GraphNode[], edges: GraphEdge[]) {
  // Transform nodes for vis-network format
  const visNodes = nodes.map(node => ({
    id: node.id,
    label: node.label
    // Let the global config handle styling
  }));

  // Transform edges for vis-network format
  const visEdges = edges.map((edge, index) => ({
    id: `e${index}`,
    from: edge.from,
    to: edge.to, 
    label: edge.label || ""
  }));

  return {
    nodes: new DataSet(visNodes),
    edges: new DataSet(visEdges)
  };
}
