import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, ArrowLeft, Loader2, ChevronRight, Database, LayoutGrid } from 'lucide-react';

// Collection types
interface SonarCollection {
  name: string;
  description: string;
  sentences: string[];
}

// Types for embedding visualization
interface EmbeddingPoint {
  id: string;
  text: string;
  x: number;
  y: number;
  z?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: EmbeddingPoint;
  }>;
}

const SonarEmbeddingVisualizer: React.FC = () => {
  // Views state
  const [view, setView] = useState<'collections' | 'collection-detail'>('collections');
  
  // Collections state
  const [collections, setCollections] = useState<SonarCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<SonarCollection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Embedding visualization state
  const [dimensions, setDimensions] = useState<number>(3);
  const [embeddings, setEmbeddings] = useState<EmbeddingPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawEmbeddings, setShowRawEmbeddings] = useState<boolean>(false);
  const [rawEmbeddingsText, setRawEmbeddingsText] = useState<string>('');

  // API endpoint
  const apiUrl = 'http://34.151.91.63/generate-embeddings';

  // Initialize with demo collections
  useEffect(() => {
    const demoCollections: SonarCollection[] = [
      
      {
        name: 'Scientific Terms',
        description: 'Scientific terminology from various fields',
        sentences: [
          'Quantum mechanics describes nature at the atomic scale.',
          'General relativity explains gravity as a geometric property of spacetime.',
          'DNA contains genetic instructions for development and functioning.',
          'Neural networks consist of connected artificial neurons.',
          'Climate change affects global weather patterns and ecosystems.'
        ]
      },
      {
        name: 'Technical Documentation',
        description: 'Sentences from technical documentation',
        sentences: [
          'The API provides endpoints for data retrieval and manipulation.',
          'Configure the environment variables before starting the server.',
          'Database indexes improve query performance significantly.',
          'Containerization allows applications to run consistently across environments.',
          'Version control systems track changes to source code over time.'
        ]
      }
    ];
    
    setCollections(demoCollections);
  }, []);

  // Handle collection selection
  const handleCollectionClick = (collection: SonarCollection) => {
    setSelectedCollection(collection);
    setView('collection-detail');
    fetchEmbeddings(collection.sentences);
  };

  // Fetch embeddings from API
  const fetchEmbeddings = async (sentences: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: sentences,
          source_lang: 'eng_Latn',
          reduce_dim: true,
          dim_size: dimensions
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store raw embeddings for display
      setRawEmbeddingsText(JSON.stringify(data.embeddings, null, 2));
      
      // Set visualization data
      if (data.reduced_embeddings && data.reduced_embeddings.length > 0) {
        setEmbeddings(data.reduced_embeddings);
      } else {
        setError('No embeddings returned from API');
        createSyntheticEmbeddings(sentences);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      createSyntheticEmbeddings(sentences);
    } finally {
      setLoading(false);
    }
  };
  
  // Create synthetic embeddings for demo/development
  const createSyntheticEmbeddings = (sentences: string[]) => {
    const syntheticEmbeddings: EmbeddingPoint[] = sentences.map((text, idx) => {
      const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const x = Math.sin(hash * 0.1) * 100;
      const y = Math.cos(hash * 0.2) * 100;
      const z = dimensions === 3 ? Math.sin(hash * 0.3) * 100 : undefined;
      
      return {
        id: idx.toString(),
        text,
        x,
        y,
        z
      };
    });
    
    setEmbeddings(syntheticEmbeddings);
  };

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#2a2a2a] p-4 border border-[#444] rounded shadow-lg max-w-md">
          <p className="font-bold text-purple-400 mb-1">Sentence {parseInt(data.id) + 1}</p>
          <p className="text-white">{data.text}</p>
          <div className="mt-2 text-xs text-gray-400">
            <p>Coordinates: ({data.x.toFixed(2)}, {data.y.toFixed(2)}{data.z !== undefined ? `, ${data.z.toFixed(2)}` : ''})</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render collections view
  const renderCollectionsView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">SONAR Embedding Collections</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888] h-4 w-4" />
          <input
            type="text"
            placeholder="Search Collections"
            className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-white placeholder-[#888]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((collection) => (
          <div 
            key={collection.name}
            className="border border-[#444] rounded-lg hover:border-purple-500 hover:bg-[#2a2a2a] cursor-pointer transition-colors p-4 bg-[#1e1e1e]"
            onClick={() => handleCollectionClick(collection)}
          >
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-purple-400 mb-2">{collection.name}</h2>
                <p className="text-[#ccc] text-sm mb-3">{collection.description}</p>
                <div className="text-xs text-[#888]">{collection.sentences.length} sentences</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCollections.length === 0 && (
        <div className="text-center p-8 bg-[#2a2a2a] rounded-lg border border-[#444]">
          <p className="text-[#aaa]">No collections found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );

  // Render collection detail view
  const renderCollectionDetailView = () => (
    <div>
      {selectedCollection && (
        <>
          <div className="flex items-center mb-6">
            <button 
              className="flex items-center text-purple-400 hover:text-purple-300 mr-4"
              onClick={() => setView('collections')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Collections
            </button>
            <h1 className="text-xl font-bold text-white">{selectedCollection.name}</h1>
          </div>
          
          <p className="text-[#aaa] mb-6">{selectedCollection.description}</p>
          
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex-1 min-w-48">
              <label className="block text-[#ccc] mb-2 text-sm">Visualization Dimensions</label>
              <select 
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded text-white"
                value={dimensions}
                onChange={(e) => {
                  setDimensions(Number(e.target.value));
                  if (selectedCollection) {
                    fetchEmbeddings(selectedCollection.sentences);
                  }
                }}
              >
                <option value={2}>2D</option>
                <option value={3}>3D</option>
              </select>
            </div>
            
            <button 
              className="px-4 py-2 bg-[#2a2a2a] text-[#ccc] rounded hover:bg-[#333] transition-colors"
              onClick={() => setShowRawEmbeddings(!showRawEmbeddings)}
            >
              {showRawEmbeddings ? 'Hide Raw Data' : 'Show Raw Data'}
            </button>
          </div>
          
          {/* Embedding visualization */}
          <div className="bg-[#1a1a1a] border border-[#444] rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Embedding Visualization</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : embeddings.length > 0 ? (
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <XAxis type="number" dataKey="x" name="X" unit="" stroke="#666" />
                    <YAxis type="number" dataKey="y" name="Y" unit="" stroke="#666" />
                    {dimensions === 3 && (
                      <ZAxis type="number" dataKey="z" name="Z" range={[60, 200]} unit="" />
                    )}
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter 
                      name="Sentence Embeddings" 
                      data={embeddings} 
                      fill="#a855f7"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-[#2a2a2a] rounded-lg">
                <p className="text-[#888]">No embeddings available</p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-[#aaa]">
              <p>Displaying {embeddings.length} sentence embeddings in {dimensions}D space</p>
              <p className="mt-1">Similar sentences appear closer together in this visualization</p>
            </div>
          </div>
          
          {/* Sentences list */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Sentences</h2>
            <div className="border border-[#444] rounded-lg overflow-hidden bg-[#1a1a1a]">
              {selectedCollection.sentences.map((sentence, idx) => (
                <div key={idx} className="p-3 border-b border-[#444] last:border-b-0 hover:bg-[#2a2a2a]">
                  <span className="text-purple-400 mr-2">{idx + 1}.</span>
                  <span className="text-[#ccc]">{sentence}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Raw embeddings */}
          {showRawEmbeddings && rawEmbeddingsText && (
            <div className="mt-6">
              <h3 className="font-bold mb-2 text-white">Raw Embedding Vectors:</h3>
              <div className="bg-[#2a2a2a] p-4 rounded-lg max-h-64 overflow-auto border border-[#444]">
                <pre className="text-xs text-[#bbb]">{rawEmbeddingsText}</pre>
              </div>
              <p className="text-xs text-[#888] mt-2">These are the full 1024-dimensional vectors from SONAR</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg text-sm">
            <h3 className="font-semibold mb-2 text-purple-300">About SONAR Embeddings</h3>
            <p className="text-[#bbb]">
              SONAR embeddings transform text into 1024-dimensional vectors that capture semantic meaning.
              This visualization reduces those dimensions to make them visible in {dimensions}D space.
              Sentences with similar meanings will cluster together, while unrelated concepts will appear farther apart.
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-white overflow-auto p-6">
      {view === 'collections' ? renderCollectionsView() : renderCollectionDetailView()}
    </div>
  );
};

export default SonarEmbeddingVisualizer;