import React, { useState } from 'react';
import { Database, Server, Boxes, Cloud, Search, Plus, X, Check } from 'lucide-react';

const DatabaseConnectionComponent = () => {
  const [connections, setConnections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [connectionName, setConnectionName] = useState('');
  const [connectionDetails, setConnectionDetails] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    additionalParams: ''
  });

  const connectionTypes = [
    { id: 'postgres', name: 'PostgreSQL', icon: <Database size={20} /> },
    { id: 'mysql', name: 'MySQL', icon: <Database size={20} /> },
    { id: 'mongodb', name: 'MongoDB', icon: <Database size={20} /> },
    { id: 'mssql', name: 'Microsoft SQL', icon: <Database size={20} /> },
    { id: 'azure', name: 'Azure Storage', icon: <Cloud size={20} /> },
    { id: 'gcp', name: 'GCP Buckets', icon: <Cloud size={20} /> },
    { id: 'aws', name: 'AWS S3', icon: <Cloud size={20} /> },
    { id: 'oracle', name: 'Oracle DB', icon: <Database size={20} /> },
    { id: 'redis', name: 'Redis', icon: <Database size={20} /> },
  ];

  const filteredConnectionTypes = connectionTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addConnection = () => {
    const newConnection = {
      id: Date.now(),
      type: connectionType,
      name: connectionName,
      details: connectionDetails,
      status: 'connected'
    };

    setConnections([...connections, newConnection]);
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setConnectionType('');
    setConnectionName('');
    setConnectionDetails({
      host: '',
      port: '',
      username: '',
      password: '',
      database: '',
      additionalParams: ''
    });
  };

  const getIconForType = (typeId) => {
    const connectionType = connectionTypes.find(type => type.id === typeId);
    return connectionType ? connectionType.icon : <Database size={20} />;
  };

  const getFormFieldsForType = () => {
    const baseFields = (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Connection Name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
            placeholder="My Database Connection"
            value={connectionName}
            onChange={(e) => setConnectionName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Host/Server</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
            placeholder="hostname or IP address"
            value={connectionDetails.host}
            onChange={(e) => setConnectionDetails({...connectionDetails, host: e.target.value})}
          />
        </div>
      </>
    );

    switch(connectionType) {
      case 'azure':
      case 'gcp':
      case 'aws':
        return (
          <>
            {baseFields}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Access Key/Account Name</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Access Key"
                value={connectionDetails.username}
                onChange={(e) => setConnectionDetails({...connectionDetails, username: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Secret/Access Key</label>
              <input
                type="password"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Secret Key"
                value={connectionDetails.password}
                onChange={(e) => setConnectionDetails({...connectionDetails, password: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Container/Bucket Name</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Container or bucket name"
                value={connectionDetails.database}
                onChange={(e) => setConnectionDetails({...connectionDetails, database: e.target.value})}
              />
            </div>
          </>
        );
      default:
        return (
          <>
            {baseFields}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Port</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                  placeholder="Port"
                  value={connectionDetails.port}
                  onChange={(e) => setConnectionDetails({...connectionDetails, port: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Database Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                  placeholder="Database name"
                  value={connectionDetails.database}
                  onChange={(e) => setConnectionDetails({...connectionDetails, database: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Username"
                value={connectionDetails.username}
                onChange={(e) => setConnectionDetails({...connectionDetails, username: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Password"
                value={connectionDetails.password}
                onChange={(e) => setConnectionDetails({...connectionDetails, password: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Additional Parameters</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
                placeholder="Additional connection parameters"
                value={connectionDetails.additionalParams}
                onChange={(e) => setConnectionDetails({...connectionDetails, additionalParams: e.target.value})}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Data Sources</h1>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
          >
            <Plus size={18} className="mr-1" />
            New Connection
          </button>
        </div>
        
        <p className="text-gray-400 mb-8">
          Connect to internal and external databases for comprehensive research
        </p>
        
        {connections.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-10 text-center">
            <Boxes size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">No connections yet</h3>
            <p className="text-gray-400 mb-4">Create your first database connection to get started</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              <Plus size={18} className="inline mr-1" />
              Add Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map(connection => (
              <div key={connection.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-purple-900 p-2 rounded-md mr-3">
                      {getIconForType(connection.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{connection.name}</h3>
                      <p className="text-sm text-gray-400">
                        {connectionTypes.find(t => t.id === connection.type)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center text-green-400 text-xs">
                      <Check size={14} className="mr-1" />
                      Connected
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  <p>Host: {connection.details.host}</p>
                  {connection.details.database && (
                    <p>Database: {connection.details.database}</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <button className="text-purple-400 text-sm hover:text-purple-300">
                    Edit connection
                  </button>
                  <button className="text-red-400 text-sm hover:text-red-300">
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Create New Connection</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            {!connectionType ? (
              <div className="p-6">
                <div className="relative mb-6">
                  <Search size={20} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search connection types..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredConnectionTypes.map(type => (
                    <button
                      key={type.id}
                      className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-left flex items-center"
                      onClick={() => setConnectionType(type.id)}
                    >
                      <div className="bg-purple-900 p-2 rounded-md mr-3">
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-gray-400">Connect to {type.name} database</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <button 
                  onClick={() => setConnectionType('')} 
                  className="text-purple-400 hover:text-purple-300 flex items-center mb-6"
                >
                  ← Back to database selection
                </button>
                
                <div className="mb-6 flex items-center">
                  <div className="bg-purple-900 p-2 rounded-md mr-3">
                    {getIconForType(connectionType)}
                  </div>
                  <h3 className="font-medium">
                    {connectionTypes.find(t => t.id === connectionType)?.name} Connection
                  </h3>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); addConnection(); }}>
                  {getFormFieldsForType()}
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button 
                      type="button" 
                      onClick={closeModal} 
                      className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md"
                    >
                      Create Connection
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseConnectionComponent;