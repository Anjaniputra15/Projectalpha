import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Database } from 'lucide-react';

// More aggressive scrollbar fix that forces scrolling to be visible
export const IndexPage: React.FC = () => {
  const [indexName, setIndexName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Force scrollbar visibility on mount
  useEffect(() => {
    // Force layout recalculation to ensure scrollbar appears
    const container = document.querySelector('.index-page-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleCreateIndex = () => {
    console.log("Creating index:", indexName, "with files:", uploadedFiles);
    setIndexName('');
    setUploadedFiles([]);
  };

  // The key is to make sure we have explicit size constraints
  // and that we're applying overflow properties consistently
  return (
    <div 
      className="index-page-container w-full h-full overflow-y-auto" 
      style={{ 
        height: "100vh", // Force full viewport height
        display: "block", // Ensure block display
        overflowY: "auto", // Ensure vertical scrolling is enabled
        paddingRight: "8px" // Add some padding to ensure scrollbar has space
      }}
    >
      <div className="max-w-4xl mx-auto py-10 px-6"> {/* Added more padding to ensure content is taller */}
        <h1 className="text-2xl font-bold text-white mb-8">Index Management</h1>
        
        <div className="bg-[#222] rounded-lg p-8 mb-10"> {/* Increased padding */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium text-white">Create New Index</h2>
            <Button 
              onClick={handleCreateIndex}
              disabled={!indexName || uploadedFiles.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Index
            </Button>
          </div>
          
          <div className="space-y-8"> {/* Increased spacing */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Index Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={indexName}
                onChange={(e) => setIndexName(e.target.value)}
                placeholder="Enter index name..."
                className="w-full bg-[#2a2a2a] border-[#444] text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Configure Data Source <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Upload files to be indexed. Upgrade your plan to connect to a data source.
                Indexing costs 1 credit per page, or 2 credits per page for multimodal indexing, plus parsing costs.
              </p>
              
              <div
                className="border-2 border-dashed border-gray-600 rounded-md p-12 text-center cursor-pointer" /* Increased padding */
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-index')?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Drag 'n' drop files here, or click to select files
                  </h3>
                  <p className="text-sm text-gray-400">
                    You can upload multiple files (up to 315 MB each)
                  </p>
                  <input
                    id="file-upload-index"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Files:</h4>
                  <ul className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="text-sm text-gray-400">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Configure Data Sink <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Bring your own vector database or use a fully managed option.
              </p>
              <div className="w-full bg-[#2a2a2a] border border-[#444] text-gray-400 p-3 rounded-md">
                Managed
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#222] rounded-lg p-8 mb-10"> {/* Added bottom margin to ensure more content height */}
          <h2 className="text-xl font-medium text-white mb-6">Existing Indexes</h2>
          
          <div className="text-center py-10"> {/* Increased padding */}
            <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No indexes found. Create one to get started.</p>
          </div>
        </div>
        
        {/* Extra spacer to ensure content is taller than viewport */}
        <div className="py-10"></div>
      </div>
    </div>
  );
};

export default IndexPage;