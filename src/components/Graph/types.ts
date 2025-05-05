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

// Concept Layer API response interfaces
export interface ConceptsResponse {
  concepts: string[];
  num_concepts: number;
  config_info: {
    spacy_model: string;
    min_concept_length: number;
    window_size: number;
    max_concepts: number;
    quantum_settings: {
      n_qubits: number;
      n_quantum_layers: number;
    }
  }
}

export interface GraphResponse {
  nodes: string[];
  edges: {
    source: string;
    target: string;
    weight: number;
    hierarchical: boolean;
  }[];
  config_info: {
    spacy_model: string;
    min_concept_length: number;
    window_size: number;
    max_concepts: number;
    use_sentence_boundaries: boolean;
    quantum_settings: {
      n_qubits: number;
      quantum_device: string;
    }
  }
}

export interface ConfigResponse {
  model_dimensions: {
    input_dim: number;
    concept_dim: number;
    hidden_dim: number;
    output_dim: number;
  };
  quantum_settings: {
    n_qubits: number;
    n_quantum_layers: number;
    quantum_device: string;
  };
  graph_settings: {
    max_concepts: number;
    window_size: number;
    min_edge_weight: number;
  };
  nlp_settings: {
    spacy_model: string;
    min_concept_length: number;
    pos_patterns?: Array<{
      POS?: string;
      OP?: string;
      LOWER?: string;
    }>;
  };
  training_settings?: {
    batch_size: number;
    learning_rate: number;
    weight_decay: number;
    dropout_rate: number;
    num_epochs: number;
    early_stopping: number;
  };
  paths?: {
    data_dir: string;
    model_dir: string;
    log_dir: string;
  };
  device: string;
}


export interface ErrorResponse {
  detail: string | { msg: string }[];
}
// Common types used across multiple components

export interface TrainingConfig {
  batchSize: number;
  learningRate: number;
  epochs: number;
  nQubits: number;
  diffusionSteps: number;
  datasetType: 'sequence' | 'mc_change';
}

export interface TrainingMetrics {
  trainLoss: number[];
  diffusionLoss: number[];
  quantumEntropy: number[];
  validationLoss: number[];
}

export interface DriftChartData {
  data: number[];
  dates: string[];
}

export interface DistributionItem {
  label: string;
  prediction: number;
  baseline: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  group: string;
  score: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  velocity?: { x: number; y: number };
  force?: { x: number; y: number };
  active?: boolean;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  active: boolean;
}

export interface OutcomePrediction {
  id: string;
  label: string;
  probability: number;
  description: string;
  requiredConcepts: string[];
  currentProbability?: number;
  isHighlighted?: boolean;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  badgeColor?: string;
  subItems?: NavItem[]; // Array for nested items
  disabled?: boolean; // Add this property to mark items as disabled
}