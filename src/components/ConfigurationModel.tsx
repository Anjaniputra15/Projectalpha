// src/components/ConfigurationComponent.tsx
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigResponse, ErrorResponse } from '@/components/Graph/types';

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

export const ConfigurationComponent: React.FC = () => {
  const [configData, setConfigData] = useState<ConfigResponse | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'model' | 'quantum' | 'graph' | 'nlp' | 'training'>('model');
  const { toast } = useToast();

  // Fetch configuration on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

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
      
      toast({
        title: "Success",
        description: "Configuration loaded successfully.",
      });
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

  if (isLoadingConfig) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a] p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-3" />
        <p className="text-[#ddd]">Loading configuration...</p>
      </div>
    );
  }

  if (error && !configData) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a] p-8">
        <div className="max-w-md bg-[#222] border border-red-800/30 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-white mb-2">Error Loading Configuration</h3>
              <p className="text-[#bbb] mb-4">{error}</p>
              <button 
                onClick={fetchConfig}
                className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#111] text-[#eee] overflow-auto">
      <h1 className="text-2xl font-semibold mb-2 text-purple-300">Model Configuration</h1>
      <p className="text-[#999] mb-6">QPLCGN model configuration settings and parameters.</p>

      {configData && (
        <div className="grid gap-6 mb-6">
          <Card className="bg-[#222] border-[#444]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#ddd]">Configuration Overview</CardTitle>
              <CardDescription className="text-[#999]">
                Core configuration parameters for the quantum-enhanced concept layer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-purple-900/20 text-purple-300">
                  {configData.quantum_settings.n_qubits} Qubits
                </Badge>
                <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
                  {configData.quantum_settings.n_quantum_layers} Q-Layers
                </Badge>
                <Badge variant="outline" className="bg-green-900/20 text-green-300">
                  Device: {configData.device}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Model Dimensions */}
            <Card className="bg-[#222] border-[#444]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#ddd]">Model Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Input Dimension:</span>
                    <span className="text-purple-300">{configData.model_dimensions.input_dim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Concept Dimension:</span>
                    <span className="text-purple-300">{configData.model_dimensions.concept_dim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Hidden Dimension:</span>
                    <span className="text-purple-300">{configData.model_dimensions.hidden_dim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Output Dimension:</span>
                    <span className="text-purple-300">{configData.model_dimensions.output_dim}</span>
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
                    <span className="text-blue-300">{configData.quantum_settings.n_qubits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Quantum Layers:</span>
                    <span className="text-blue-300">{configData.quantum_settings.n_quantum_layers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Quantum Device:</span>
                    <span className="text-blue-300">{configData.quantum_settings.quantum_device}</span>
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
                    <span className="text-green-300">{configData.graph_settings.max_concepts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Window Size:</span>
                    <span className="text-green-300">{configData.graph_settings.window_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Min Edge Weight:</span>
                    <span className="text-green-300">{configData.graph_settings.min_edge_weight}</span>
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
                    <span className="text-amber-300">{configData.nlp_settings.spacy_model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#aaa]">Min Concept Length:</span>
                    <span className="text-amber-300">{configData.nlp_settings.min_concept_length}</span>
                  </div>
                  {configData.nlp_settings.pos_patterns && (
                    <div className="mt-2">
                      <span className="text-[#aaa] block mb-1">POS Patterns:</span>
                      <div className="bg-[#1a1a1a] p-2 rounded text-xs overflow-y-auto max-h-[80px]">
                        {configData.nlp_settings.pos_patterns.map((pattern, index) => (
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
          </div>

          {/* Additional settings if available */}
          {(configData.training_settings || configData.paths) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {/* Training Settings */}
              {configData.training_settings && (
                <Card className="bg-[#222] border-[#444]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-[#ddd]">Training Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Batch Size:</span>
                        <span className="text-teal-300">{configData.training_settings.batch_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Learning Rate:</span>
                        <span className="text-teal-300">{configData.training_settings.learning_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Weight Decay:</span>
                        <span className="text-teal-300">{configData.training_settings.weight_decay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Dropout Rate:</span>
                        <span className="text-teal-300">{configData.training_settings.dropout_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Epochs:</span>
                        <span className="text-teal-300">{configData.training_settings.num_epochs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Early Stopping:</span>
                        <span className="text-teal-300">{configData.training_settings.early_stopping}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Paths */}
              {configData.paths && (
                <Card className="bg-[#222] border-[#444]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-[#ddd]">Storage Paths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Data Directory:</span>
                        <span className="text-indigo-300">{configData.paths.data_dir}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Model Directory:</span>
                        <span className="text-indigo-300">{configData.paths.model_dir}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#aaa]">Log Directory:</span>
                        <span className="text-indigo-300">{configData.paths.log_dir}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigurationComponent;