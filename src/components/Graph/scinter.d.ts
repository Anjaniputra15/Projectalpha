// src/lib/types.ts
// This file contains all shared type definitions

// Graph types
export interface GraphNode {
  id: string;
  label: string;
  // Styling properties
  labelProps?: {
    style?: {
      fill?: string;
      fontSize?: number;
      fontWeight?: string;
      textShadow?: string;
    };
    position?: string;
  };
  size?: number;
  color?: string;
  // Metadata for additional information
  metadata?: {
    labels?: string[];
    properties?: Record<string, any>;
    [key: string]: any;
  };
}

// Edge between nodes in a graph visualization
export interface GraphEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  color?: string | {
    color: string;
    opacity?: number;
  };
  width?: number;
  // Metadata for additional information
  metadata?: {
    type?: string;
    properties?: Record<string, any>;
    [key: string]: any;
  };
}

// Props for the Graph component
export interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (nodeId: string) => void;
  layout?: string;
}

// Hypothesis validation types
export interface HypothesisResult {
  hypothesis: string;
  validation_score: number;
  p_value: number;
  supporting_evidence: {
    text: string;
    source: string;
    confidence: number;
  }[];
  contradicting_evidence: {
    text: string;
    source: string;
    confidence: number;
  }[];
  methods: {
    name: string;
    description: string;
  }[];
  figures: {
    title: string;
    description: string;
    type: "chart" | "table" | "image";
    image_data?: string; // base64 encoded image
  }[];
  sources: {
    title: string;
    authors: string[];
    journal?: string;
    year?: number;
    url?: string;
    doi?: string;
  }[];
  conclusion: string;
  timestamp: string;
}

// File system types
export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemItem[];
  parentId?: string;
  created?: string;
  updated?: string;
}

// Extend the Window interface to include scinterApi
interface Window {
  scinterApi?: {
    visualizeGraph: (graph: any) => void; // Define the method used in your code
    [key: string]: any; // Allow additional methods if needed
  };
}