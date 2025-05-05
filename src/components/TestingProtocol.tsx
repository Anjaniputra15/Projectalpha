import React, { useState } from 'react';
import { 
  Beaker, 
  ClipboardCheck, 
  FileText, 
  FilePlus, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Play,
  Pause,
  SkipForward,
  Trash2,
  Check,
  X,
  Save,
  Download,
  Upload,
  FileSearch,
  BarChart,
  Activity,
  Settings,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TestingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  duration: number; // in minutes
  startTime?: Date;
  endTime?: Date;
  observations?: string;
  results?: string;
  acceptanceCriteria?: string[];
}

interface TestProtocol {
  id: string;
  title: string;
  version: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  description: string;
  objective: string;
  requiredEquipment: string[];
  materials: string[];
  safetyNotes: string;
  steps: TestingStep[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const TestingProtocol: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'protocols' | 'running' | 'results'>('protocols');
  const [activeProtocolId, setActiveProtocolId] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showCreateNew, setShowCreateNew] = useState<boolean>(false);
  const [newProtocolData, setNewProtocolData] = useState({
    title: '',
    description: '',
    objective: '',
    safetyNotes: ''
  });

  // Dummy data for protocols
  // This is the updated TestingProtocol component with ASML-focused examples

// The dummy protocol data has been updated with ASML-related examples
const [protocols, setProtocols] = useState<TestProtocol[]>([
    {
      id: 'proto-1',
      title: 'ASML TWINSCAN NXT:2000i Alignment Calibration',
      version: '2.3.0',
      status: 'active',
      description: 'Standardized protocol for alignment sensor calibration on ASML TWINSCAN NXT:2000i lithography systems',
      objective: 'Ensure wafer alignment accuracy within 2nm tolerance for critical layer patterning',
      requiredEquipment: [
        'Alignment Calibration Wafer Set',
        'SMASH Sensor Calibration Kit',
        'Metrology Analysis Software',
        'Critical Dimension (CD) Measurement Tool'
      ],
      materials: [
        'Silicon Calibration Wafer (300mm)',
        'Reference Calibration Markers',
        'Clean Room Supplies',
        'System Maintenance Log'
      ],
      safetyNotes: 'Ensure ESD protection protocols are followed. System uses class 4 laser for alignment - follow proper laser safety procedures. Verify vacuum system status before loading wafers.',
      steps: [
        {
          id: 'step-1',
          title: 'System Pre-Check',
          description: 'Verify system status and confirm scanner is in maintenance mode',
          status: 'completed',
          duration: 30,
          startTime: new Date('2024-04-10T09:00:00'),
          endTime: new Date('2024-04-10T09:25:00'),
          observations: 'System reports all subsystems operational. Scanner in maintenance mode.',
          results: 'Stage positioning verified within specification. Vacuum system stable at 2.7e-6 mbar.',
          acceptanceCriteria: ['System in maintenance mode', 'All subsystems green in diagnostic panel', 'Vacuum level <3.0e-6 mbar']
        },
        {
          id: 'step-2',
          title: 'Load Calibration Wafer',
          description: 'Load alignment calibration wafer using the specified handling procedure',
          status: 'completed',
          duration: 45,
          startTime: new Date('2024-04-10T09:30:00'),
          endTime: new Date('2024-04-10T10:10:00'),
          observations: 'Wafer loaded without incidents. Initial scan shows all alignment markers present.',
          acceptanceCriteria: ['Wafer properly mounted', 'No handling alarms', 'Pre-scan identifies all alignment markers']
        },
        {
          id: 'step-3',
          title: 'SMASH Sensor Alignment',
          description: 'Calibrate the alignment sensors using SMASH calibration protocol at 5 wafer locations',
          status: 'in-progress',
          duration: 120,
          startTime: new Date('2024-04-10T10:15:00'),
          observations: 'First 3 locations completed, observed 1.2nm shift from baseline at location 2',
          acceptanceCriteria: ['Alignment sensors calibrated at all 5 designated locations', 'Alignment variation <2nm across locations']
        },
        {
          id: 'step-4',
          title: 'Linewidth Measurement Verification',
          description: 'Execute test exposure and verify measurement performance',
          status: 'pending',
          duration: 120,
          acceptanceCriteria: ['CD uniformity <3nm across wafer', 'Edge placement error <5nm']
        },
        {
          id: 'step-5',
          title: 'Full Grid Alignment Test',
          description: 'Perform full wafer grid alignment test with 49-point measurement',
          status: 'pending',
          duration: 120,
          acceptanceCriteria: ['Grid alignment error <2nm RMS', 'No point exceeds 3nm variance', 'Successful overlay onto reference pattern']
        }
      ],
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-09')
    },
    {
      id: 'proto-2',
      title: 'ASML EUV Source Power Stability Analysis',
      version: '1.5.1',
      status: 'completed',
      description: 'Protocol for analyzing stability of EUV source power on ASML NXE:3400B systems',
      objective: 'Measure power stability fluctuations over 72-hour period and validate against specification',
      requiredEquipment: [
        'EUV Power Sensor Array',
        'Droplet Generation Monitoring System',
        'Pulse Energy Measurement Tools',
        'Spectral Purity Analysis Module'
      ],
      materials: [
        'EUV System Log Files',
        'Reference Power Standards',
        'Calibration Documentation'
      ],
      safetyNotes: 'EUV radiation and high-voltage hazards present. Ensure proper shielding and lockout procedures are followed. Tin vapor detection system must be operational.',
      steps: [
        {
          id: 'step-1',
          title: 'Baseline Measurement',
          description: 'Record baseline power measurements at standard operating conditions',
          status: 'completed',
          duration: 60,
          startTime: new Date('2024-03-15T13:00:00'),
          endTime: new Date('2024-03-15T14:05:00'),
          observations: 'Baseline recorded at 246W with 0.5% short-term variation',
          results: 'Baseline power: 246W, Pulse-to-pulse stability: 0.5%, Dose stability: 0.2%',
          acceptanceCriteria: ['Stable power output >240W', 'Pulse stability <0.8%']
        },
        {
          id: 'step-2',
          title: 'Hydrogen Flow Optimization',
          description: 'Adjust hydrogen flow parameters and measure impact on stability',
          status: 'completed',
          duration: 180,
          startTime: new Date('2024-03-15T14:15:00'),
          endTime: new Date('2024-03-15T17:20:00'),
          observations: 'Optimal stability observed at 217 sccm flow rate',
          results: 'Optimized parameters: Flow: 217 sccm, Pressure: 27.3 Pa, Power stability improved to 0.3%',
          acceptanceCriteria: ['Flow parameter optimization complete', 'Stability improvement verified']
        },
        {
          id: 'step-3',
          title: '72-Hour Stability Run',
          description: 'Monitor power stability continuously for 72 hours at production conditions',
          status: 'completed',
          duration: 4320, // 72 hours in minutes
          startTime: new Date('2024-03-16T09:00:00'),
          endTime: new Date('2024-03-19T09:00:00'),
          observations: 'System maintained stable operation. One minor power dip at 47-hour mark, auto-corrected.',
          results: 'Long-term stability: 0.7% variation, Mean power: 245.3W, No significant degradation trend observed',
          acceptanceCriteria: ['72-hour continuous operation', 'Long-term stability <1%', 'No unrecoverable power drops']
        },
        {
          id: 'step-4',
          title: 'Collector Degradation Analysis',
          description: 'Analyze collector reflectivity and contamination levels',
          status: 'completed',
          duration: 180,
          startTime: new Date('2024-03-19T10:00:00'),
          endTime: new Date('2024-03-19T13:10:00'),
          observations: 'Collector shows 0.8% reflectivity loss after test period. Debris mitigation system performing within spec.',
          results: 'Reflectivity loss rate: 0.011% per day, Contamination level: 3.2nm tin equivalent thickness',
          acceptanceCriteria: ['Reflectivity loss <1%', 'Debris mitigation system operational']
        }
      ],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-19'),
      completedAt: new Date('2024-03-19')
    },
    {
      id: 'proto-3',
      title: 'ASML TWINSCAN Stage Accuracy Validation',
      version: '3.0.0',
      status: 'draft',
      description: 'Protocol for validating stage positioning accuracy on ASML TWINSCAN NXT:2050i',
      objective: 'Verify stage positioning accuracy and repeatability across full wafer travel range',
      requiredEquipment: [
        'Interferometer Calibration System',
        'Stage Position Verification Software',
        'TWINSCAN Diagnostic Interface',
        'Wafer Handling Test Kit'
      ],
      materials: [
        'Position Reference Wafer',
        'Calibration Certificate',
        'System Specifications',
        'Stage Map Documentation'
      ],
      safetyNotes: 'Ensure stage lock is engaged during maintenance. System operates with high-voltage components and fast-moving stages. Follow proper lockout procedures.',
      steps: [
        {
          id: 'step-1',
          title: 'System Initialization',
          description: 'Initialize system into diagnostic mode with stage mapping enabled',
          status: 'pending',
          duration: 60,
          acceptanceCriteria: ['System in diagnostic mode', 'Stage mapping enabled', 'Air bearing system operational']
        },
        {
          id: 'step-2',
          title: 'Interferometer Validation',
          description: 'Verify interferometer measurements against reference standards',
          status: 'pending',
          duration: 45,
          acceptanceCriteria: ['All interferometers calibrated', 'Reference measurements match within 0.5nm']
        },
        {
          id: 'step-3',
          title: 'Full Field Stage Accuracy Test',
          description: 'Run full field stage positioning test with 81-point measurement grid',
          status: 'pending',
          duration: 180,
          acceptanceCriteria: ['Positioning error <1.0nm RMS', 'No single point exceeds 1.5nm error']
        }
      ],
      createdAt: new Date('2024-04-05'),
      updatedAt: new Date('2024-04-05')
    }
  ]);

  const handleToggleProtocolExpand = (protocolId: string) => {
    setActiveProtocolId(activeProtocolId === protocolId ? null : protocolId);
  };

  const handleToggleStepExpand = (stepId: string) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const handleRunProtocol = (protocolId: string) => {
    // Find the protocol
    const protocolToRun = protocols.find(p => p.id === protocolId);
    if (!protocolToRun) return;

    // Update protocol status to active if it's a draft
    const updatedProtocols = protocols.map(p => {
      if (p.id === protocolId && p.status === 'draft') {
        return { ...p, status: 'active', updatedAt: new Date() } as TestProtocol;
      }
      return p;
    });

    setProtocols(updatedProtocols);
    setActiveProtocolId(protocolId);
    setActiveTab('running');
    setIsRunning(true);

    toast({
      title: "Protocol Started",
      description: `Now running: ${protocolToRun.title}`,
    });
  };

  const handlePauseProtocol = () => {
    setIsRunning(false);
    toast({
      title: "Protocol Paused",
      description: "You can resume the protocol at any time",
    });
  };

  const handleResumeProtocol = () => {
    setIsRunning(true);
    toast({
      title: "Protocol Resumed",
      description: "Protocol execution is continuing",
    });
  };

  const handleStepStatusChange = (protocolId: string, stepId: string, newStatus: TestingStep['status']) => {
    const now = new Date();
    
    // Update the step status in the protocols
    const updatedProtocols = protocols.map(protocol => {
      if (protocol.id === protocolId) {
        const updatedSteps = protocol.steps.map(step => {
          if (step.id === stepId) {
            const updatedStep = { 
              ...step, 
              status: newStatus,
              updatedAt: now
            };
            
            // Add start time if transitioning to in-progress
            if (newStatus === 'in-progress' && !step.startTime) {
              updatedStep.startTime = now;
            }
            
            // Add end time if completing or failing
            if ((newStatus === 'completed' || newStatus === 'failed' || newStatus === 'skipped') && !step.endTime) {
              updatedStep.endTime = now;
            }
            
            return updatedStep;
          }
          return step;
        });
        
        // Check if all steps are completed/failed/skipped
        const allStepsFinished = updatedSteps.every(
          step => ['completed', 'failed', 'skipped'].includes(step.status)
        );
        
        // Update protocol status if all steps are finished
        if (allStepsFinished && protocol.status === 'active') {
          return {
            ...protocol,
            status: 'completed',
            updatedAt: now,
            completedAt: now,
            steps: updatedSteps
          } as TestProtocol;
        }
        
        return {
          ...protocol,
          updatedAt: now,
          steps: updatedSteps
        };
      }
      return protocol;
    });
    
    setProtocols(updatedProtocols);
    
    // Show appropriate toast based on the status change
    const statusMessages = {
      'in-progress': 'Step started',
      'completed': 'Step completed successfully',
      'failed': 'Step marked as failed',
      'skipped': 'Step skipped'
    };
    
    toast({
      title: statusMessages[newStatus] || 'Status Updated',
      variant: newStatus === 'failed' ? 'destructive' : 'default'
    });
  };

  const handleSaveObservation = (protocolId: string, stepId: string, observation: string) => {
    const updatedProtocols = protocols.map(protocol => {
      if (protocol.id === protocolId) {
        const updatedSteps = protocol.steps.map(step => {
          if (step.id === stepId) {
            return { 
              ...step, 
              observations: observation,
              updatedAt: new Date()
            };
          }
          return step;
        });
        
        return {
          ...protocol,
          updatedAt: new Date(),
          steps: updatedSteps
        };
      }
      return protocol;
    });
    
    setProtocols(updatedProtocols);
    
    toast({
      title: "Observations Saved",
      description: "Your observations have been recorded"
    });
  };

  const handleSaveResults = (protocolId: string, stepId: string, results: string) => {
    const updatedProtocols = protocols.map(protocol => {
      if (protocol.id === protocolId) {
        const updatedSteps = protocol.steps.map(step => {
          if (step.id === stepId) {
            return { 
              ...step, 
              results: results,
              updatedAt: new Date()
            };
          }
          return step;
        });
        
        return {
          ...protocol,
          updatedAt: new Date(),
          steps: updatedSteps
        };
      }
      return protocol;
    });
    
    setProtocols(updatedProtocols);
    
    toast({
      title: "Results Saved",
      description: "Test results have been recorded"
    });
  };

  const handleCreateNewProtocol = () => {
    // Validate inputs
    if (!newProtocolData.title.trim()) {
      toast({
        title: "Error",
        description: "Protocol title is required",
        variant: "destructive"
      });
      return;
    }

    // Create new protocol
    const newProtocolId = `proto-${Date.now()}`;
    const now = new Date();
    
    const newProtocol: TestProtocol = {
      id: newProtocolId,
      title: newProtocolData.title,
      version: '1.0.0',
      status: 'draft',
      description: newProtocolData.description,
      objective: newProtocolData.objective,
      requiredEquipment: [],
      materials: [],
      safetyNotes: newProtocolData.safetyNotes,
      steps: [],
      createdAt: now,
      updatedAt: now
    };
    
    setProtocols([...protocols, newProtocol]);
    setShowCreateNew(false);
    setNewProtocolData({
      title: '',
      description: '',
      objective: '',
      safetyNotes: ''
    });
    
    toast({
      title: "Protocol Created",
      description: "New testing protocol has been created as a draft"
    });
  };

  const handleDeleteProtocol = (protocolId: string) => {
    setProtocols(protocols.filter(p => p.id !== protocolId));
    
    toast({
      title: "Protocol Deleted",
      description: "The protocol has been removed"
    });
  };

  const activeProtocol = activeProtocolId 
    ? protocols.find(p => p.id === activeProtocolId) 
    : null;

  const filteredProtocols = protocols.filter(protocol => {
    // Filter by status
    if (filterStatus !== 'all' && protocol.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        protocol.title.toLowerCase().includes(query) ||
        protocol.description.toLowerCase().includes(query) ||
        protocol.objective.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-white">Testing Protocols</h1>
        <p className="text-[#aaa]">Define, execute, and analyze testing protocols for your research</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#363636] mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'protocols' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('protocols')}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Protocols
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'running' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('running')}
        >
          <Beaker className="h-4 w-4 inline mr-2" />
          Running Tests
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'results' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('results')}
        >
          <BarChart className="h-4 w-4 inline mr-2" />
          Results & Analysis
        </button>
      </div>

      {/* Protocols Tab */}
      {activeTab === 'protocols' && (
        <div>
          {/* Controls */}
          <div className="flex justify-between mb-6">
            <div className="flex space-x-3">
              <div className="relative w-64">
                <FileSearch className="h-4 w-4 text-[#888] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search protocols..."
                  className="bg-[#2a2a2a] border-[#444] text-white pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-[#888]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#2a2a2a] border border-[#444] rounded px-2 py-2 text-sm text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowCreateNew(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              New Protocol
            </Button>
          </div>

          {/* Create New Protocol Form */}
          {showCreateNew && (
            <div className="bg-[#252525] border border-[#363636] rounded-lg p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Create New Protocol</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateNew(false)}
                  className="text-[#aaa] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Protocol Title*</label>
                  <Input
                    value={newProtocolData.title}
                    onChange={(e) => setNewProtocolData({...newProtocolData, title: e.target.value})}
                    placeholder="Enter protocol title"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Description</label>
                  <Textarea
                    value={newProtocolData.description}
                    onChange={(e) => setNewProtocolData({...newProtocolData, description: e.target.value})}
                    placeholder="Describe the purpose and scope of this protocol"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Objective</label>
                  <Textarea
                    value={newProtocolData.objective}
                    onChange={(e) => setNewProtocolData({...newProtocolData, objective: e.target.value})}
                    placeholder="Define the goals and expected outcomes"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Safety Notes</label>
                  <Textarea
                    value={newProtocolData.safetyNotes}
                    onChange={(e) => setNewProtocolData({...newProtocolData, safetyNotes: e.target.value})}
                    placeholder="Important safety considerations and precautions"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2 border-[#444] text-[#aaa] hover:text-white"
                    onClick={() => setShowCreateNew(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNewProtocol}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Protocol
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Protocol List */}
          {filteredProtocols.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <ClipboardCheck className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg">No protocols found</p>
              <p className="text-sm mt-1">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try changing your search or filter criteria' 
                  : 'Create a new protocol to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProtocols.map((protocol) => (
                <div 
                  key={protocol.id} 
                  className="bg-[#252525] border border-[#363636] rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#2a2a2a]"
                    onClick={() => handleToggleProtocolExpand(protocol.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-4 ${
                        protocol.status === 'draft' ? 'bg-blue-900/30 text-blue-300' :
                        protocol.status === 'active' ? 'bg-green-900/30 text-green-300' :
                        protocol.status === 'completed' ? 'bg-purple-900/30 text-purple-300' :
                        'bg-gray-900/30 text-gray-300'
                      }`}>
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{protocol.title}</h3>
                        <div className="flex items-center mt-1 text-sm">
                          <span className="text-[#aaa] mr-4">Version {protocol.version}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            protocol.status === 'draft' ? 'bg-blue-900/30 text-blue-300' :
                            protocol.status === 'active' ? 'bg-green-900/30 text-green-300' :
                            protocol.status === 'completed' ? 'bg-purple-900/30 text-purple-300' :
                            'bg-gray-900/30 text-gray-300'
                          }`}>
                            {protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-[#888] mr-6">
                        {protocol.status === 'completed' 
                          ? `Completed: ${protocol.completedAt?.toLocaleDateString()}` 
                          : `Updated: ${protocol.updatedAt.toLocaleDateString()}`}
                      </span>
                      {activeProtocolId === protocol.id ? (
                        <ChevronUp className="h-5 w-5 text-[#aaa]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#aaa]" />
                      )}
                    </div>
                  </div>
                  
                  {activeProtocolId === protocol.id && (
                    <div className="p-4 border-t border-[#363636]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-[#aaa] mb-1">Description</h4>
                          <p className="text-sm text-white">{protocol.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-[#aaa] mb-1">Objective</h4>
                          <p className="text-sm text-white">{protocol.objective}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[300px]">
                          <h4 className="text-sm font-medium text-[#aaa] mb-2">Required Equipment</h4>
                          <div className="bg-[#2a2a2a] rounded-md p-3 min-h-[80px]">
                            {protocol.requiredEquipment.length === 0 ? (
                              <p className="text-sm text-[#888]">No equipment specified</p>
                            ) : (
                              <ul className="list-disc list-inside space-y-1">
                                {protocol.requiredEquipment.map((eq, i) => (
                                  <li key={i} className="text-sm">{eq}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-[300px]">
                          <h4 className="text-sm font-medium text-[#aaa] mb-2">Materials</h4>
                          <div className="bg-[#2a2a2a] rounded-md p-3 min-h-[80px]">
                            {protocol.materials.length === 0 ? (
                              <p className="text-sm text-[#888]">No materials specified</p>
                            ) : (
                              <ul className="list-disc list-inside space-y-1">
                                {protocol.materials.map((mat, i) => (
                                  <li key={i} className="text-sm">{mat}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {protocol.safetyNotes && (
                        <div className="mb-6">
                          <div className="flex items-center text-amber-300 mb-2">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <h4 className="text-sm font-medium">Safety Notes</h4>
                          </div>
                          <div className="bg-amber-900/20 border border-amber-900/30 rounded-md p-3">
                            <p className="text-sm text-amber-200">{protocol.safetyNotes}</p>
                          </div>
                        </div>
                      )}
                      
                      <h4 className="text-sm font-medium text-[#aaa] mb-3">Testing Steps</h4>
                      {protocol.steps.length === 0 ? (
                        <div className="text-center py-6 bg-[#2a2a2a] rounded-md mb-4">
                          <p className="text-[#888]">No steps defined for this protocol</p>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {protocol.steps.map((step, index) => (
                            <div key={step.id} className="bg-[#2a2a2a] border border-[#363636] rounded-md">
                              <div className="p-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                                    step.status === 'completed' ? 'bg-green-900/40 text-green-300' :
                                    step.status === 'in-progress' ? 'bg-blue-900/40 text-blue-300' :
                                    step.status === 'failed' ? 'bg-red-900/40 text-red-300' :
                                    step.status === 'skipped' ? 'bg-gray-900/40 text-gray-300' :
                                    'bg-purple-900/40 text-purple-300'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <span className="font-medium">{step.title}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs text-[#888] mr-3">
                                    <Clock className="h-3.5 w-3.5 inline mr-1" />
                                    {step.duration} min
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs mr-3 ${
                                    step.status === 'completed' ? 'bg-green-900/30 text-green-300' :
                                    step.status === 'in-progress' ? 'bg-blue-900/30 text-blue-300' :
                                    step.status === 'failed' ? 'bg-red-900/30 text-red-300' :
                                    step.status === 'skipped' ? 'bg-gray-900/30 text-gray-300' :
                                    'bg-purple-900/30 text-purple-300'
                                  }`}>
                                    {step.status === 'completed' ? 'Completed' :
                                     step.status === 'in-progress' ? 'In Progress' :
                                     step.status === 'failed' ? 'Failed' :
                                     step.status === 'skipped' ? 'Skipped' : 
                                     'Pending'}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStepExpand(step.id);
                                    }}
                                    className="text-[#aaa] h-7 w-7 p-0"
                                  >
                                    {expandedStepId === step.id ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              {expandedStepId === step.id && (
                                <div className="p-3 border-t border-[#363636]">
                                  <p className="text-sm mb-3">{step.description}</p>
                                  
                                  {step.acceptanceCriteria && step.acceptanceCriteria.length > 0 && (
                                    <div className="mb-3">
                                      <h5 className="text-xs font-medium text-[#aaa] mb-1">Acceptance Criteria</h5>
                                      <ul className="list-disc list-inside space-y-1">
                                        {step.acceptanceCriteria.map((criteria, i) => (
                                          <li key={i} className="text-xs text-[#ddd]">{criteria}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {(step.observations || step.results) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                      {step.observations && (
                                        <div>
                                          <h5 className="text-xs font-medium text-[#aaa] mb-1">Observations</h5>
                                          <p className="text-xs bg-[#333] p-2 rounded">{step.observations}</p>
                                        </div>
                                      )}
                                      
                                      {step.results && (
                                        <div>
                                          <h5 className="text-xs font-medium text-[#aaa] mb-1">Results</h5>
                                          <p className="text-xs bg-[#333] p-2 rounded">{step.results}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {step.startTime && (
                                    <div className="text-xs text-[#888]">
                                      Started: {step.startTime.toLocaleString()}
                                      {step.endTime && ` • Ended: ${step.endTime.toLocaleString()}`}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProtocol(protocol.id)}
                          className="bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Delete
                        </Button>
                        
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#444] text-[#aaa] hover:text-white"
                          >
                            <Settings className="h-4 w-4 mr-1.5" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#444] text-[#aaa] hover:text-white"
                          >
                            <Download className="h-4 w-4 mr-1.5" />
                            Export
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleRunProtocol(protocol.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={protocol.status === 'archived'}
                          >
                            <Play className="h-4 w-4 mr-1.5" />
                            Run Protocol
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Running Tests Tab */}
      {activeTab === 'running' && (
        <div>
          {!activeProtocol ? (
            <div className="text-center py-12 text-[#888]">
              <Beaker className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg">No Active Testing Protocol</p>
              <p className="text-sm mt-1 mb-6">Select a protocol from the Protocols tab to begin testing</p>
              <Button
                onClick={() => setActiveTab('protocols')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Protocols
              </Button>
            </div>
          ) : (
            <div>
              {/* Protocol Info Bar */}
              <div className="bg-[#252525] border border-[#363636] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium">{activeProtocol.title}</h2>
                    <p className="text-sm text-[#aaa] mt-1">{activeProtocol.objective}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <div className="text-sm text-[#aaa]">Protocol Status</div>
                      <div className={`text-sm font-medium ${
                        activeProtocol.status === 'active' ? 'text-green-400' :
                        activeProtocol.status === 'completed' ? 'text-purple-400' :
                        'text-[#eee]'
                      }`}>
                        {activeProtocol.status.charAt(0).toUpperCase() + activeProtocol.status.slice(1)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isRunning ? (
                        <Button
                          onClick={handlePauseProtocol}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Pause className="h-4 w-4 mr-1.5" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={handleResumeProtocol}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Play className="h-4 w-4 mr-1.5" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {activeProtocol.safetyNotes && (
                  <div className="mt-4 bg-amber-900/20 border border-amber-900/30 rounded-md p-3 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-300 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-amber-300 font-medium text-sm">Safety Reminder</div>
                      <p className="text-sm text-amber-200 mt-1">{activeProtocol.safetyNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Execution */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-4">Test Execution Steps</h3>
                
                {activeProtocol.steps.length === 0 ? (
                  <div className="text-center py-8 bg-[#252525] rounded-lg border border-[#363636]">
                    <p className="text-[#888]">No steps defined for this protocol</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeProtocol.steps.map((step, index) => (
                      <div 
                        key={step.id} 
                        className={`bg-[#252525] border rounded-lg overflow-hidden ${
                          step.status === 'in-progress' ? 'border-blue-600' : 'border-[#363636]'
                        }`}
                      >
                        <div className={`p-4 flex justify-between items-center ${
                          step.status === 'in-progress' ? 'bg-blue-900/10' : ''
                        }`}>
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              step.status === 'completed' ? 'bg-green-900/40 text-green-300' :
                              step.status === 'in-progress' ? 'bg-blue-900/40 text-blue-300' :
                              step.status === 'failed' ? 'bg-red-900/40 text-red-300' :
                              step.status === 'skipped' ? 'bg-gray-900/40 text-gray-300' :
                              'bg-purple-900/40 text-purple-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-[#aaa] mt-0.5">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-[#888] mr-4">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {step.duration} min
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs mr-4 ${
                              step.status === 'completed' ? 'bg-green-900/30 text-green-300' :
                              step.status === 'in-progress' ? 'bg-blue-900/30 text-blue-300' :
                              step.status === 'failed' ? 'bg-red-900/30 text-red-300' :
                              step.status === 'skipped' ? 'bg-gray-900/30 text-gray-300' :
                              'bg-purple-900/30 text-purple-300'
                            }`}>
                              {step.status === 'completed' ? 'Completed' :
                               step.status === 'in-progress' ? 'In Progress' :
                               step.status === 'failed' ? 'Failed' :
                               step.status === 'skipped' ? 'Skipped' : 
                               'Pending'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStepExpand(step.id)}
                              className="text-[#aaa] h-8 w-8 p-0"
                            >
                              {expandedStepId === step.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {expandedStepId === step.id && (
                          <div className="p-4 border-t border-[#363636]">
                            {step.acceptanceCriteria && step.acceptanceCriteria.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-[#aaa] mb-2">Acceptance Criteria</h5>
                                <div className="bg-[#2a2a2a] rounded-md p-3">
                                  <ul className="space-y-2">
                                    {step.acceptanceCriteria.map((criteria, i) => (
                                      <li key={i} className="flex items-center">
                                        <Check className="h-4 w-4 text-green-400 mr-2" />
                                        <span className="text-sm">{criteria}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                            
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-[#aaa] mb-2">Observations</h5>
                              <Textarea
                                placeholder="Record your observations here..."
                                value={step.observations || ''}
                                onChange={(e) => {
                                  // This would typically update a local state, 
                                  // but we're doing a direct update in this demo
                                  const updatedProtocols = protocols.map(p => {
                                    if (p.id === activeProtocol.id) {
                                      const updatedSteps = p.steps.map(s => {
                                        if (s.id === step.id) {
                                          return { ...s, observations: e.target.value };
                                        }
                                        return s;
                                      });
                                      return { ...p, steps: updatedSteps };
                                    }
                                    return p;
                                  });
                                  setProtocols(updatedProtocols);
                                }}
                                rows={3}
                                className="w-full bg-[#2a2a2a] border-[#444] text-white resize-none"
                              />
                              <Button
                                size="sm"
                                className="mt-2 bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleSaveObservation(activeProtocol.id, step.id, step.observations || '')}
                              >
                                <Save className="h-3.5 w-3.5 mr-1.5" />
                                Save Observations
                              </Button>
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-[#aaa] mb-2">Results</h5>
                              <Textarea
                                placeholder="Record test results here..."
                                value={step.results || ''}
                                onChange={(e) => {
                                  const updatedProtocols = protocols.map(p => {
                                    if (p.id === activeProtocol.id) {
                                      const updatedSteps = p.steps.map(s => {
                                        if (s.id === step.id) {
                                          return { ...s, results: e.target.value };
                                        }
                                        return s;
                                      });
                                      return { ...p, steps: updatedSteps };
                                    }
                                    return p;
                                  });
                                  setProtocols(updatedProtocols);
                                }}
                                rows={3}
                                className="w-full bg-[#2a2a2a] border-[#444] text-white resize-none"
                              />
                              <Button
                                size="sm"
                                className="mt-2 bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleSaveResults(activeProtocol.id, step.id, step.results || '')}
                              >
                                <Save className="h-3.5 w-3.5 mr-1.5" />
                                Save Results
                              </Button>
                            </div>

                            {step.startTime && (
                              <div className="text-sm text-[#888] mb-4">
                                Started: {step.startTime.toLocaleString()}
                                {step.endTime && ` • Ended: ${step.endTime.toLocaleString()}`}
                              </div>
                            )}
                            
                            <div className="flex justify-end space-x-2">
                              {step.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStepStatusChange(activeProtocol.id, step.id, 'in-progress')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Play className="h-3.5 w-3.5 mr-1.5" />
                                  Start Step
                                </Button>
                              )}
                              
                              {step.status === 'in-progress' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStepStatusChange(activeProtocol.id, step.id, 'failed')}
                                    className="border-red-500/40 text-red-400 hover:bg-red-900/20"
                                  >
                                    <X className="h-3.5 w-3.5 mr-1.5" />
                                    Mark Failed
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    onClick={() => handleStepStatusChange(activeProtocol.id, step.id, 'completed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-3.5 w-3.5 mr-1.5" />
                                    Complete Step
                                  </Button>
                                </>
                              )}
                              
                              {step.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStepStatusChange(activeProtocol.id, step.id, 'skipped')}
                                  className="border-[#444] text-[#aaa]"
                                >
                                  <SkipForward className="h-3.5 w-3.5 mr-1.5" />
                                  Skip Step
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Material and Equipment Reference */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#252525] border border-[#363636] rounded-lg p-4">
                  <h3 className="text-md font-medium mb-3">Required Equipment</h3>
                  {activeProtocol.requiredEquipment.length === 0 ? (
                    <p className="text-[#888]">No equipment specified</p>
                  ) : (
                    <ul className="space-y-2">
                      {activeProtocol.requiredEquipment.map((eq, i) => (
                        <li key={i} className="flex items-center bg-[#2a2a2a] p-2 rounded">
                          <div className="w-6 h-6 rounded-full bg-purple-900/30 text-purple-300 flex items-center justify-center mr-3 text-xs">
                            {i + 1}
                          </div>
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="bg-[#252525] border border-[#363636] rounded-lg p-4">
                  <h3 className="text-md font-medium mb-3">Materials</h3>
                  {activeProtocol.materials.length === 0 ? (
                    <p className="text-[#888]">No materials specified</p>
                  ) : (
                    <ul className="space-y-2">
                      {activeProtocol.materials.map((mat, i) => (
                        <li key={i} className="flex items-center bg-[#2a2a2a] p-2 rounded">
                          <div className="w-6 h-6 rounded-full bg-blue-900/30 text-blue-300 flex items-center justify-center mr-3 text-xs">
                            {i + 1}
                          </div>
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div>
          <div className="text-center py-12 text-[#888]">
            <Activity className="h-16 w-16 mx-auto mb-3 text-[#555]" />
            <p className="text-lg">Results & Analysis Dashboard</p>
            <p className="text-sm mt-1 mb-6">
              View comprehensive reports and analytics from completed test protocols
            </p>
            <Button
              variant="outline"
              className="border-purple-500/40 text-purple-400 hover:bg-purple-900/20"
            >
              <BarChart className="h-4 w-4 mr-2" />
              View Sample Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingProtocol;