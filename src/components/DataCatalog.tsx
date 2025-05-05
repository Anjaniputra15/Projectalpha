import React, { useState } from 'react';
import { Database, Search, Filter, ChevronDown, Tag, Clock, Users, FileText, Calendar, AlertCircle, Check, X, Shield, Star, BarChart, RefreshCw, Grid, List, ExternalLink, Info, Edit, Copy } from 'lucide-react';

const DataCatalogComponent = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Mock data for data catalog
  const categories = [
    'All', 
    'Manufacturing Data', 
    'Lithography Metrics', 
    'Market Research', 
    'EUV Performance',
    'Competitor Analysis',
    'Patents',
    'Customer Data'
  ];

  const dataQualityLevels = {
    high: { label: 'High Quality', color: 'text-green-400', icon: <Check size={14} className="mr-1" /> },
    medium: { label: 'Medium Quality', color: 'text-yellow-400', icon: <AlertCircle size={14} className="mr-1" /> },
    low: { label: 'Low Quality', color: 'text-red-400', icon: <AlertCircle size={14} className="mr-1" /> },
  };

  const dataSources = [
    {
      id: 1,
      name: 'NXE:3800E Performance Metrics',
      category: 'Lithography Metrics',
      owner: 'Systems Engineering',
      lastUpdated: '2025-04-10',
      quality: 'high',
      recordCount: '24,831',
      description: 'Comprehensive dataset containing performance metrics from NXE:3800E EUV lithography systems, including throughput, overlay accuracy, and focus uniformity measurements across multiple customer installations.',
      tags: ['EUV', 'NXE:3800E', 'performance', 'throughput'],
      popularity: 85,
      permissions: 'restricted',
      format: 'structured',
      sizeMB: 456,
      schema: [
        { name: 'system_id', type: 'string', description: 'Unique system identifier' },
        { name: 'customer_site', type: 'string', description: 'Anonymized customer location' },
        { name: 'wafer_throughput', type: 'number', description: 'Wafers per hour' },
        { name: 'overlay_accuracy', type: 'number', description: 'Measured in nanometers' },
        { name: 'focus_uniformity', type: 'number', description: 'Standard deviation in nm' },
        { name: 'uptime_percentage', type: 'number', description: 'System availability percentage' },
        { name: 'measurement_date', type: 'date', description: 'Date of data collection' }
      ]
    },
    {
      id: 2,
      name: 'Competitor Lithography Systems Analysis',
      category: 'Competitor Analysis',
      owner: 'Market Intelligence',
      lastUpdated: '2025-03-28',
      quality: 'medium',
      recordCount: '152',
      description: 'Detailed analysis of competitor lithography systems, including technical specifications, performance benchmarks, and customer adoption rates compared to ASML systems.',
      tags: ['competitors', 'market-analysis', 'lithography-systems', 'benchmarking'],
      popularity: 64,
      permissions: 'internal',
      format: 'semi-structured',
      sizeMB: 89,
      schema: [
        { name: 'competitor_name', type: 'string', description: 'Company name' },
        { name: 'system_model', type: 'string', description: 'Model name/number' },
        { name: 'release_date', type: 'date', description: 'Market release date' },
        { name: 'market_share', type: 'number', description: 'Estimated market share percentage' },
        { name: 'node_capability', type: 'number', description: 'Smallest node size in nm' },
        { name: 'technology_type', type: 'string', description: 'DUV, EUV, etc.' },
        { name: 'key_customers', type: 'array', description: 'List of known customers' }
      ]
    },
    {
      id: 3,
      name: 'High-NA EUV Development Data',
      category: 'EUV Performance',
      owner: 'R&D Department',
      lastUpdated: '2025-04-05',
      quality: 'high',
      recordCount: '5,241',
      description: 'Research and development data for High-NA EUV technology, including optical performance metrics, throughput projections, and test results from prototype systems.',
      tags: ['High-NA', 'EUV', 'R&D', 'next-gen'],
      popularity: 78,
      permissions: 'highly-restricted',
      format: 'structured',
      sizeMB: 2340,
      schema: [
        { name: 'test_id', type: 'string', description: 'Unique test identifier' },
        { name: 'prototype_version', type: 'string', description: 'System prototype version' },
        { name: 'na_value', type: 'number', description: 'Numerical aperture value' },
        { name: 'resolution', type: 'number', description: 'Resolution in nm' },
        { name: 'test_pattern', type: 'string', description: 'Pattern used for testing' },
        { name: 'power_usage', type: 'number', description: 'Power consumption in kW' }
      ]
    },
    {
      id: 4,
      name: 'Semiconductor Equipment Market Projections',
      category: 'Market Research',
      owner: 'Business Development',
      lastUpdated: '2025-02-15',
      quality: 'medium',
      recordCount: '86',
      description: 'Five-year projections for the semiconductor equipment market, segmented by region, technology type, and customer segment, with specific focus on lithography equipment demand.',
      tags: ['market-projections', 'forecasting', 'global', 'lithography-demand'],
      popularity: 92,
      permissions: 'internal',
      format: 'structured',
      sizeMB: 15,
      schema: [
        { name: 'segment', type: 'string', description: 'Market segment (logic, memory, etc.)' },
        { name: 'region', type: 'string', description: 'Geographical region' },
        { name: 'year', type: 'number', description: 'Forecast year' },
        { name: 'market_size', type: 'number', description: 'Projected market size in EUR millions' },
        { name: 'growth_rate', type: 'number', description: 'Year-over-year growth percentage' },
        { name: 'confidence_level', type: 'string', description: 'Confidence in projection' }
      ]
    },
    {
      id: 5,
      name: 'DUV-to-EUV Migration Analysis',
      category: 'Manufacturing Data',
      owner: 'Applications Engineering',
      lastUpdated: '2025-03-30',
      quality: 'high',
      recordCount: '1,245',
      description: 'Analysis of customer migration patterns from DUV to EUV lithography, including process adaptation challenges, performance improvements, and cost-benefit analysis from multiple fabs.',
      tags: ['DUV', 'EUV', 'migration', 'customer-adoption'],
      popularity: 45,
      permissions: 'internal',
      format: 'structured',
      sizeMB: 78,
      schema: [
        { name: 'customer_id', type: 'string', description: 'Anonymized customer identifier' },
        { name: 'fab_location', type: 'string', description: 'Manufacturing facility location' },
        { name: 'previous_system', type: 'string', description: 'Previous DUV system model' },
        { name: 'new_system', type: 'string', description: 'New EUV system model' },
        { name: 'process_node', type: 'number', description: 'Manufacturing process node in nm' },
        { name: 'yield_improvement', type: 'number', description: 'Percentage yield improvement' },
        { name: 'migration_challenges', type: 'array', description: 'List of technical challenges encountered' }
      ]
    },
    {
      id: 6,
      name: 'EUV Patent Portfolio Analysis',
      category: 'Patents',
      owner: 'IP Department',
      lastUpdated: '2025-01-20',
      quality: 'medium',
      recordCount: '328',
      description: 'Analysis of EUV lithography patents, including ASML\'s portfolio, competitor patents, and potential freedom to operate issues for next-generation EUV technology development.',
      tags: ['patents', 'IP', 'EUV', 'legal'],
      popularity: 58,
      permissions: 'restricted',
      format: 'semi-structured',
      sizeMB: 42,
      schema: [
        { name: 'patent_number', type: 'string', description: 'Patent identification number' },
        { name: 'title', type: 'string', description: 'Patent title' },
        { name: 'assignee', type: 'string', description: 'Patent owner company' },
        { name: 'filing_date', type: 'date', description: 'Original filing date' },
        { name: 'expiration_date', type: 'date', description: 'Patent expiration date' },
        { name: 'key_claims', type: 'array', description: 'Important patent claims' },
        { name: 'jurisdiction', type: 'string', description: 'Legal jurisdiction' }
      ]
    },
    {
      id: 7,
      name: 'Customer Feedback on TWINSCAN Systems',
      category: 'Customer Data',
      owner: 'Customer Support',
      lastUpdated: '2025-04-12',
      quality: 'low',
      recordCount: '18,432',
      description: 'Comprehensive database of customer feedback on TWINSCAN systems, collected through support tickets, field service reports, and customer satisfaction surveys.',
      tags: ['TWINSCAN', 'customer-feedback', 'support', 'service'],
      popularity: 71,
      permissions: 'internal',
      format: 'unstructured',
      sizeMB: 215,
      schema: [
        { name: 'feedback_id', type: 'string', description: 'Unique feedback identifier' },
        { name: 'system_model', type: 'string', description: 'TWINSCAN model' },
        { name: 'date', type: 'date', description: 'Date feedback was received' },
        { name: 'customer_type', type: 'string', description: 'Customer segment classification' },
        { name: 'feedback_text', type: 'string', description: 'Raw feedback text' },
        { name: 'sentiment_score', type: 'number', description: 'Calculated sentiment (-1.0 to 1.0)' },
        { name: 'issue_category', type: 'string', description: 'Category of issue reported' }
      ]
    },
    {
      id: 8,
      name: 'Reticle Defect Analysis Database',
      category: 'Manufacturing Data',
      owner: 'Reticle Manufacturing',
      lastUpdated: '2025-03-15',
      quality: 'high',
      recordCount: '8,754',
      description: 'Comprehensive database of reticle defects detected during manufacturing and usage, including defect types, detection methods, and impact on wafer quality and yield.',
      tags: ['reticles', 'defects', 'quality-control', 'yield'],
      popularity: 83,
      permissions: 'restricted',
      format: 'structured',
      sizeMB: 612,
      schema: [
        { name: 'reticle_id', type: 'string', description: 'Unique reticle identifier' },
        { name: 'defect_type', type: 'string', description: 'Classification of defect' },
        { name: 'detection_method', type: 'string', description: 'Method used to detect defect' },
        { name: 'defect_size', type: 'number', description: 'Size in nm' },
        { name: 'impact_level', type: 'string', description: 'Severity of impact' },
        { name: 'detection_date', type: 'date', description: 'Date defect was detected' },
        { name: 'yield_impact', type: 'number', description: 'Estimated yield impact percentage' }
      ]
    }
  ];

  // Filter datasets based on search and category
  const filteredDatasets = dataSources.filter(dataset => {
    const matchesSearch = 
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle dataset selection
  const handleDatasetClick = (dataset) => {
    setSelectedDataset(dataset);
  };

  // Close dataset details modal
  const closeDatasetDetails = () => {
    setSelectedDataset(null);
  };

  // Render the schema table for the dataset details
  const renderSchemaTable = (schema) => {
    return (
      <table className="w-full mt-2">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="text-left text-sm font-medium text-gray-400 py-2">Field Name</th>
            <th className="text-left text-sm font-medium text-gray-400 py-2">Type</th>
            <th className="text-left text-sm font-medium text-gray-400 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {schema.map((field, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-2 font-mono text-sm">{field.name}</td>
              <td className="py-2 text-purple-400 text-sm">{field.type}</td>
              <td className="py-2 text-sm text-gray-300">{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Data Catalog</h1>
        </div>
        
        <p className="text-gray-400 mb-8">
          Browse and search available datasets for research and analysis
        </p>
        
        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search datasets by name, description, or tags..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-3 py-2 text-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-300 cursor-pointer min-w-40">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span className="mr-2">{selectedCategory}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
                {/* Dropdown would be implemented here in a real application */}
              </div>
              
              <div className="flex bg-gray-700 border border-gray-600 rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-600' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-600' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === category 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredDatasets.length} of {dataSources.length} datasets
          </p>
          <div className="flex items-center text-sm text-gray-400">
            <RefreshCw size={14} className="mr-1" />
            <span>Last updated: Today at 10:23 AM</span>
          </div>
        </div>
        
        {/* Dataset Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map(dataset => (
              <div 
                key={dataset.id} 
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors"
                onClick={() => handleDatasetClick(dataset)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-purple-900 p-2 rounded-md mr-3">
                      <Database size={18} />
                    </div>
                    <h3 className="font-medium text-lg">{dataset.name}</h3>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Star size={14} className="mr-1 text-yellow-400" />
                    <span>{dataset.popularity}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {dataset.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {dataset.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-purple-300 text-xs rounded-full px-2 py-1">
                      {tag}
                    </span>
                  ))}
                  {dataset.tags.length > 3 && (
                    <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-2 py-1">
                      +{dataset.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-400">
                      <Calendar size={12} className="mr-1" />
                      <span>{dataset.lastUpdated}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users size={12} className="mr-1" />
                      <span>{dataset.owner}</span>
                    </div>
                    <div className={`flex items-center ${dataQualityLevels[dataset.quality].color}`}>
                      {dataQualityLevels[dataset.quality].icon}
                      <span>{dataQualityLevels[dataset.quality].label}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FileText size={12} className="mr-1" />
                      <span>{dataset.recordCount} records</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Dataset List */}
        {viewMode === 'list' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-750">
              <div className="col-span-4 text-sm font-medium text-gray-400">Name</div>
              <div className="col-span-2 text-sm font-medium text-gray-400">Category</div>
              <div className="col-span-2 text-sm font-medium text-gray-400">Owner</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Quality</div>
              <div className="col-span-2 text-sm font-medium text-gray-400">Last Updated</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Size</div>
            </div>
            
            {filteredDatasets.map(dataset => (
              <div 
                key={dataset.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => handleDatasetClick(dataset)}
              >
                <div className="col-span-4">
                  <div className="flex items-center">
                    <div className="bg-purple-900 p-1 rounded-md mr-2">
                      <Database size={14} />
                    </div>
                    <div>
                      <h3 className="font-medium">{dataset.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{dataset.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-sm">
                  {dataset.category}
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-400">
                  {dataset.owner}
                </div>
                <div className="col-span-1 flex items-center text-sm">
                  <span className={`flex items-center ${dataQualityLevels[dataset.quality].color}`}>
                    {dataQualityLevels[dataset.quality].icon}
                    <span className="hidden md:inline">{dataQualityLevels[dataset.quality].label}</span>
                  </span>
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-400">
                  {dataset.lastUpdated}
                </div>
                <div className="col-span-1 flex items-center text-sm text-gray-400">
                  {dataset.sizeMB} MB
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Dataset Detail Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-screen overflow-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                <div className="flex items-center">
                  <div className="bg-purple-900 p-2 rounded-md mr-3">
                    <Database size={20} />
                  </div>
                  <h2 className="text-xl font-semibold">{selectedDataset.name}</h2>
                </div>
                <button onClick={closeDatasetDetails} className="text-gray-500 hover:text-gray-300">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {/* Dataset Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Records</h3>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-semibold">{selectedDataset.recordCount}</span>
                      <BarChart size={20} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Format</h3>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-semibold capitalize">{selectedDataset.format}</span>
                      <Database size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Size</h3>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-semibold">{selectedDataset.sizeMB} MB</span>
                      <FileText size={20} className="text-green-400" />
                    </div>
                  </div>
                </div>
                
                {/* Dataset Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-300">
                    {selectedDataset.description}
                  </p>
                </div>
                
                {/* Dataset Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Metadata</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-y-4">
                        <div className="col-span-1 text-gray-400">Category</div>
                        <div className="col-span-2">{selectedDataset.category}</div>
                        
                        <div className="col-span-1 text-gray-400">Owner</div>
                        <div className="col-span-2">{selectedDataset.owner}</div>
                        
                        <div className="col-span-1 text-gray-400">Last Updated</div>
                        <div className="col-span-2">{selectedDataset.lastUpdated}</div>
                        
                        <div className="col-span-1 text-gray-400">Data Quality</div>
                        <div className={`col-span-2 flex items-center ${dataQualityLevels[selectedDataset.quality].color}`}>
                          {dataQualityLevels[selectedDataset.quality].icon}
                          <span>{dataQualityLevels[selectedDataset.quality].label}</span>
                        </div>
                        
                        <div className="col-span-1 text-gray-400">Permissions</div>
                        <div className="col-span-2 flex items-center">
                          <Shield size={14} className="mr-1 text-blue-400" />
                          <span className="capitalize">{selectedDataset.permissions}</span>
                        </div>
                        
                        <div className="col-span-1 text-gray-400">Popularity</div>
                        <div className="col-span-2 flex items-center">
                          <Star size={14} className="mr-1 text-yellow-400" />
                          <span>{selectedDataset.popularity}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Tags</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedDataset.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-700 text-purple-300 rounded-full px-3 py-1 flex items-center"
                          >
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dataset Schema */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Schema</h3>
                    <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center">
                      <Copy size={14} className="mr-1" />
                      Copy JSON Schema
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
                    {renderSchemaTable(selectedDataset.schema)}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                      <ExternalLink size={16} className="mr-2" />
                      Open in Explorer
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                      <Info size={16} className="mr-2" />
                      Request Access
                    </button>
                  </div>
                  <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
                    <Edit size={16} className="mr-2" />
                    Add to Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCatalogComponent;