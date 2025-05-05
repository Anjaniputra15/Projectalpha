// src/components/ConceptLayerTraining.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Network, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConceptsResponse, GraphResponse, ConfigResponse, ErrorResponse } from '@/components/Graph/types';
import styles from './ConceptLayerTraining.module.css';
// Try different URLs depending on environment
const getApiBaseUrl = () => {
  // Production URL
  if (window.location.hostname.includes('scinter.org')) {
    return 'https://colpali.api.scinter.org:8000';
  }
  
  // Development URL - try HTTP if on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Default fallback
  return 'https://colpali.api.scinter.org:8000';
};

const API_BASE_URL = getApiBaseUrl();

export const ConceptLayerTraining: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [extractedConcepts, setExtractedConcepts] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [configData, setConfigData] = useState<ConfigResponse | null>(null);
  const [isExtractingConcepts, setIsExtractingConcepts] = useState<boolean>(false);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState<boolean>(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'graph' | 'config'>('concepts');
  const { toast } = useToast();

  // Fetch configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      setError(null);
      
      try {
        // Use a timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_BASE_URL}/config`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data: ConfigResponse = await response.json();
        setConfigData(data);
        setActiveTab('concepts'); // Reset to concepts tab after successful config load
      } catch (err) {
        console.error('Failed to load configuration:', err);
        let errorMessage = 'Failed to load configuration.';
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timed out. The API server might be unavailable.';
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = 'Connection error. Please check if the API server is running or if there are SSL/HTTPS issues.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        toast({
          title: "Configuration Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Create a fallback configuration for development/testing
        setConfigData({
          model_dimensions: { input_dim: 300, concept_dim: 64, hidden_dim: 128, output_dim: 64 },
          quantum_settings: { n_qubits: 8, n_quantum_layers: 2, quantum_device: "default.qubit" },
          graph_settings: { max_concepts: 50, window_size: 3, min_edge_weight: 0.1 },
          nlp_settings: { 
            spacy_model: "en_core_web_lg", 
            min_concept_length: 3,
            pos_patterns: [{ POS: "NOUN", OP: "+" }]
          },
          device: "cuda"
        });
      } finally {
        setIsLoadingConfig(false);
      }
    };
    
    fetchConfig();
  }, [toast]);

  const handleExtractConcepts = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to extract concepts.');
      toast({
        title: "Error",
        description: "Please enter some text to extract concepts.",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingConcepts(true);
    setError(null);
    setExtractedConcepts([]);

    try {
      const response = await fetch(`${API_BASE_URL}/concepts/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        let errorMsg = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData: ErrorResponse = await response.json();
          if (typeof errorData.detail === 'string') {
            errorMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
            errorMsg = errorData.detail[0].msg;
          }
        } catch (e) {
          // Ignore if error response is not JSON
        }
        throw new Error(errorMsg);
      }

      const data: ConceptsResponse = await response.json();
      setExtractedConcepts(data.concepts);
      
      toast({
        title: "Success",
        description: `Extracted ${data.num_concepts} concepts.`,
      });

    } catch (err) {
      console.error('Failed to extract concepts:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExtractingConcepts(false);
    }
  };

  const handleGenerateGraph = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate a concept graph.');
      toast({
        title: "Error",
        description: "Please enter some text to generate a concept graph.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingGraph(true);
    setError(null);
    setGraphData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/graph/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          use_sentence_boundaries: true
        }),
      });

      if (!response.ok) {
        let errorMsg = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData: ErrorResponse = await response.json();
          if (typeof errorData.detail === 'string') {
            errorMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
            errorMsg = errorData.detail[0].msg;
          }
        } catch (e) {
          // Ignore if error response is not JSON
        }
        throw new Error(errorMsg);
      }

      const data: GraphResponse = await response.json();
      setGraphData(data);
      setActiveTab('graph'); // Switch to graph tab automatically
      
      toast({
        title: "Success",
        description: `Generated graph with ${data.nodes.length} concepts and ${data.edges.length} relationships.`,
      });

    } catch (err) {
      console.error('Failed to generate concept graph:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingGraph(false);
    }
  };

  // Simple Graph Visualization Component
  const SimpleGraphVisualization: React.FC<{ data: GraphResponse }> = ({ data }) => {
    if (!data || !data.nodes.length) {
      return (
        <div className="flex items-center justify-center h-full text-[#aaa]">
          No graph data available
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-md font-medium text-[#ddd] mb-2">Graph Overview</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-purple-900/20 text-purple-300">
              {data.nodes.length} Concepts
            </Badge>
            <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
              {data.edges.length} Relationships
            </Badge>
            <Badge variant="outline" className="bg-green-900/20 text-green-300">
              {data.config_info.quantum_settings.n_qubits} Qubits
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-y-auto">
          {/* Nodes List */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Concepts (Nodes)</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-2">
                {data.nodes.map((node, index) => (
                  <Badge 
                    key={`${node}-${index}`}
                    className="bg-purple-900/30 border border-purple-700/40 text-purple-200 px-2 py-1 text-sm"
                  >
                    {node}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edges List */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Top Relationships (Edges)</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {data.edges
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, 15) // Show top 15 relationships by weight
                  .map((edge, index) => (
                    <div 
                      key={`${edge.source}-${edge.target}-${index}`}
                      className={`text-xs p-2 rounded ${
                        edge.hierarchical 
                          ? 'bg-blue-900/20 border-l-2 border-blue-500' 
                          : 'bg-purple-900/20 border-l-2 border-purple-500'
                      }`}
                    >
                      <span className="font-medium">{edge.source}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{edge.target}</span>
                      <span className="ml-2 text-[#999]">
                        (weight: {edge.weight.toFixed(2)})
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Simple Config Visualization Component
  const ConfigVisualization: React.FC<{ data: ConfigResponse | null }> = ({ data }) => {
    if (!data) {
      return (
        <div className="flex items-center justify-center h-full text-[#aaa]">
          {isLoadingConfig ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading configuration...
            </>
          ) : (
            "No configuration data available"
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-md font-medium text-[#ddd] mb-2">Configuration Overview</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-purple-900/20 text-purple-300">
              {data.quantum_settings.n_qubits} Qubits
            </Badge>
            <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
              {data.quantum_settings.n_quantum_layers} Q-Layers
            </Badge>
            <Badge variant="outline" className="bg-green-900/20 text-green-300">
              Device: {data.device}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] custom-scrollbar">
          {/* Model Dimensions */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Model Dimensions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Input Dimension:</span>
                  <span className="text-purple-300">{data.model_dimensions.input_dim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Concept Dimension:</span>
                  <span className="text-purple-300">{data.model_dimensions.concept_dim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Hidden Dimension:</span>
                  <span className="text-purple-300">{data.model_dimensions.hidden_dim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Output Dimension:</span>
                  <span className="text-purple-300">{data.model_dimensions.output_dim}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantum Settings */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Quantum Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Number of Qubits:</span>
                  <span className="text-blue-300">{data.quantum_settings.n_qubits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Quantum Layers:</span>
                  <span className="text-blue-300">{data.quantum_settings.n_quantum_layers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Quantum Device:</span>
                  <span className="text-blue-300">{data.quantum_settings.quantum_device}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graph Settings */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Graph Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Max Concepts:</span>
                  <span className="text-green-300">{data.graph_settings.max_concepts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Window Size:</span>
                  <span className="text-green-300">{data.graph_settings.window_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Min Edge Weight:</span>
                  <span className="text-green-300">{data.graph_settings.min_edge_weight}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NLP Settings */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">NLP Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#aaa]">SpaCy Model:</span>
                  <span className="text-amber-300">{data.nlp_settings.spacy_model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#aaa]">Min Concept Length:</span>
                  <span className="text-amber-300">{data.nlp_settings.min_concept_length}</span>
                </div>
                {data.nlp_settings.pos_patterns && (
                  <div className="mt-2">
                    <span className="text-[#aaa] block mb-1">POS Patterns:</span>
                    <div className="bg-[#1a1a1a] p-2 rounded text-xs overflow-y-auto max-h-[80px]">
                      {data.nlp_settings.pos_patterns.map((pattern, index) => (
                        <div key={index} className="mb-1 text-amber-200/70">
                          {JSON.stringify(pattern)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Settings */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Training Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {data.training_settings ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Batch Size:</span>
                    <span className="text-teal-300">{data.training_settings.batch_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Learning Rate:</span>
                    <span className="text-teal-300">{data.training_settings.learning_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Weight Decay:</span>
                    <span className="text-teal-300">{data.training_settings.weight_decay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Dropout Rate:</span>
                    <span className="text-teal-300">{data.training_settings.dropout_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Epochs:</span>
                    <span className="text-teal-300">{data.training_settings.num_epochs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Early Stopping:</span>
                    <span className="text-teal-300">{data.training_settings.early_stopping}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[#888] text-xs">Training settings not available</p>
              )}
            </CardContent>
          </Card>

          {/* Paths */}
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ddd]">Storage Paths</CardTitle>
            </CardHeader>
            <CardContent>
              {data.paths ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Data Directory:</span>
                    <span className="text-indigo-300">{data.paths.data_dir}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Model Directory:</span>
                    <span className="text-indigo-300">{data.paths.model_dir}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Log Directory:</span>
                    <span className="text-indigo-300">{data.paths.log_dir}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[#888] text-xs">Path settings not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#111] text-[#eee]">
      <h1 className="text-2xl font-semibold mb-2 text-purple-300">Concept Layer Testing</h1>
      <p className="text-[#999] mb-6">Extract domain-specific concepts from technical documents using the quantum-enhanced SONAR encoder.</p>

      <div className="grid gap-6 md:grid-cols-2 h-full flex-grow">
        {/* Input Section */}
        <Card className="bg-[#222] border-[#444] flex flex-col">
          <CardHeader>
            <CardTitle className="text-[#ddd]">Input Text</CardTitle>
            <CardDescription className="text-[#999]">
              Enter the text you want to analyze for concepts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="grid w-full gap-1.5 flex-grow mb-4">
              <Label htmlFor="message-2" className="text-[#bbb]">Your Text</Label>
              <Textarea
                placeholder="Paste or type your text here..."
                id="message-2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] flex-grow bg-[#1f1f1f] border-[#555] text-[#ddd] focus:border-purple-500 resize-none"
                disabled={isExtractingConcepts || isGeneratingGraph}
              />
              <p className="text-sm text-[#888] mt-2">
                Example: "The EUV lithography system uses a 13.5nm wavelength laser to project patterns onto the wafer stage."
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              <Button
                onClick={handleExtractConcepts}
                disabled={isExtractingConcepts || isGeneratingGraph || !inputText.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
              >
                {isExtractingConcepts ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  'Extract Concepts'
                )}
              </Button>
              
              <Button
                onClick={handleGenerateGraph}
                disabled={isExtractingConcepts || isGeneratingGraph || !inputText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                variant="secondary"
              >
                {isGeneratingGraph ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Network className="mr-2 h-4 w-4" />
                    Generate Graph
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section with Tabs */}
        <Card className="bg-[#222] border-[#444] flex flex-col">
          <CardHeader className="pb-0">
            <Tabs 
              defaultValue="concepts" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'concepts' | 'graph' | 'config')}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-[#ddd]">
                  {activeTab === 'concepts' ? 'Extracted Concepts' : 
                   activeTab === 'graph' ? 'Concept Graph' : 
                   'Configuration'}
                </CardTitle>
                
                <TabsList className="bg-[#333]">
                  <TabsTrigger 
                    value="concepts" 
                    className={activeTab === 'concepts' ? 'data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-200' : ''}
                    disabled={!extractedConcepts.length && activeTab !== 'concepts'}
                  >
                    Concepts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="graph" 
                    className={activeTab === 'graph' ? 'data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-200' : ''}
                    disabled={!graphData && activeTab !== 'graph'}
                  >
                    Graph
                  </TabsTrigger>
                  <TabsTrigger 
                    value="config" 
                    className={activeTab === 'config' ? 'data-[state=active]:bg-green-900/50 data-[state=active]:text-green-200' : ''}
                  >
                    <Info className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <CardDescription className="text-[#999]">
                {activeTab === 'concepts' 
                  ? 'Domain-specific concepts identified in the input text.' 
                  : activeTab === 'graph'
                  ? 'Relationships between extracted concepts.'
                  : 'QPLCGN model configuration settings.'}
              </CardDescription>
            
              <TabsContent value="concepts" className="mt-2 flex-grow overflow-y-auto custom-scrollbar">
                {/* Loading States */}
                {isExtractingConcepts ? (
                  <div className="flex items-center justify-center h-full text-[#aaa]">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading concepts...
                  </div>
                ) : null}
                
                {/* Error State */}
                {error && activeTab === 'concepts' && (
                  <div className="text-red-400 bg-red-900/20 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error:</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {!error && !isExtractingConcepts && extractedConcepts.length === 0 && (
                  <p className="text-[#888] text-center mt-10">
                    Results will appear here after extraction.
                  </p>
                )}
                
                {/* Results */}
                {!isExtractingConcepts && !error && extractedConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {extractedConcepts.map((concept, index) => (
                      <Badge
                        key={`${concept}-${index}`}
                        className="bg-purple-900/50 border border-purple-700/60 text-purple-200 px-2 py-1 text-sm"
                      >
                        {concept}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="graph" className="mt-2 flex-grow overflow-y-auto custom-scrollbar">
                {/* Loading States */}
                {isGeneratingGraph ? (
                  <div className="flex items-center justify-center h-full text-[#aaa]">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating graph...
                  </div>
                ) : null}
                
                {/* Error State */}
                {error && activeTab === 'graph' && (
                  <div className="text-red-400 bg-red-900/20 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error:</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {!error && !isGeneratingGraph && !graphData && (
                  <p className="text-[#888] text-center mt-10">
                    Generate a graph to visualize concept relationships.
                  </p>
                )}
                
                {/* Results */}
                {!isGeneratingGraph && !error && graphData && (
                  <SimpleGraphVisualization data={graphData} />
                )}
              </TabsContent>
              
              <TabsContent value="config" className="mt-2 flex-grow overflow-y-auto custom-scrollbar">
                <ConfigVisualization data={configData} />
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent className="flex-grow px-0 py-0">
            {/* Content is handled by TabsContent above */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConceptLayerTraining;