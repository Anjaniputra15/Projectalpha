import React, { useState } from 'react';
import { 
  Workflow, 
  FlaskConical, 
  Microscope, 
  Calculator, 
  BarChart, 
  Save, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  Search,
  Download,
  Share
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ExperimentVariable {
  id: string;
  name: string;
  type: "independent" | "dependent" | "controlled";
  value: string;
  unit: string;
}

interface ExperimentStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  durationUnit: "minutes" | "hours" | "days";
  requiresEquipment: string[];
}

interface ExperimentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
}

const ExperimentDesign: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'design' | 'templates' | 'history'>('design');
  const [experimentTitle, setExperimentTitle] = useState('');
  const [experimentDescription, setExperimentDescription] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [variables, setVariables] = useState<ExperimentVariable[]>([]);
  const [steps, setSteps] = useState<ExperimentStep[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  
  // Sample templates for demonstration
  // Sample templates updated for ASML lithography equipment research
const experimentTemplates: ExperimentTemplate[] = [
    {
      id: '1',
      title: 'ASML Immersion Lithography Defectivity Study',
      description: 'Standard protocol for evaluating defect generation in immersion lithography processes on ASML XT:1900i systems',
      category: 'Lithography Process',
      createdAt: new Date('2024-02-15')
    },
    {
      id: '2',
      title: 'EUV Resist Sensitivity Analysis',
      description: 'Experimental design for measuring resist sensitivity and line edge roughness on ASML NXE:3600 EUV systems',
      category: 'EUV Process Development',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '3',
      title: 'ASML Scanner Overlay Budget Analysis',
      description: 'Protocol for decomposing overlay error contributors in ASML TWINSCAN NXT:2000i scanners',
      category: 'Metrology & Performance',
      createdAt: new Date('2024-01-20')
    },
  ];
  
  // Recent experiments with ASML focus
  const recentExperiments = [
    {
      id: '101',
      title: 'NXT:2050i Focus Uniformity Test',
      status: 'Completed',
      date: '2024-04-05',
      success: true
    },
    {
      id: '102',
      title: 'EUV Source Droplet Generator Optimization',
      status: 'In Progress',
      date: '2024-04-10',
      success: null
    },
    {
      id: '103',
      title: 'ASML Reticle Handing System Validation',
      status: 'Failed',
      date: '2024-03-28',
      success: false
    }
  ];
  
  // Equipment database updated for ASML-related equipment
  const availableEquipment = [
    'ASML TWINSCAN NXT:2000i',
    'ASML NXE:3600 EUV System',
    'Reticle Inspection System',
    'YieldStar 1000 Metrology Tool',
    'SMASH Alignment Sensor',
    'Overlay Measurement System',
    'Critical Dimension SEM',
    'EUV Dosimeter',
    'Wafer Edge Inspection Module',
    'Immersion Water Analysis System'
  ];

  const handleAddVariable = () => {
    const newVariable: ExperimentVariable = {
      id: `var-${Date.now()}`,
      name: '',
      type: 'independent',
      value: '',
      unit: ''
    };
    setVariables([...variables, newVariable]);
  };

  const handleUpdateVariable = (id: string, field: keyof ExperimentVariable, value: string) => {
    setVariables(variables.map(variable => 
      variable.id === id ? { ...variable, [field]: value } : variable
    ));
  };

  const handleRemoveVariable = (id: string) => {
    setVariables(variables.filter(variable => variable.id !== id));
  };

  const handleAddStep = () => {
    const newStep: ExperimentStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      description: '',
      duration: 0,
      durationUnit: 'minutes',
      requiresEquipment: []
    };
    setSteps([...steps, newStep]);
    setExpandedStep(newStep.id);
  };

  const handleUpdateStep = (id: string, field: keyof ExperimentStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
    if (expandedStep === id) {
      setExpandedStep(null);
    }
  };

  const handleToggleExpandStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const handleSaveExperiment = () => {
    // Validation
    if (!experimentTitle.trim()) {
      toast({
        title: "Error",
        description: "Please provide an experiment title",
        variant: "destructive"
      });
      return;
    }

    if (!hypothesis.trim()) {
      toast({
        title: "Error",
        description: "Please provide a hypothesis",
        variant: "destructive"
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one experimental step",
        variant: "destructive"
      });
      return;
    }

    // Save logic would go here (API call, local storage, etc.)
    console.log("Saving experiment:", {
      title: experimentTitle,
      description: experimentDescription,
      hypothesis,
      variables,
      steps,
      equipment
    });

    toast({
      title: "Success",
      description: "Experiment design saved successfully"
    });
  };

  const handleUseTemplate = (template: ExperimentTemplate) => {
    setExperimentTitle(template.title);
    setExperimentDescription(template.description);
    setActiveTab('design');
    
    toast({
      title: "Template Loaded",
      description: `Template "${template.title}" has been loaded`
    });
  };

  const filteredTemplates = experimentTemplates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-white">Experiment Design Lab</h1>
        <p className="text-[#aaa]">Create, plan, and manage your research experiments</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#363636] mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'design' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('design')}
        >
          <Workflow className="h-4 w-4 inline mr-2" />
          Design Experiment
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'templates' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('templates')}
        >
          <FlaskConical className="h-4 w-4 inline mr-2" />
          Templates
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('history')}
        >
          <Calculator className="h-4 w-4 inline mr-2" />
          History
        </button>
      </div>

      {/* Design Tab */}
      {activeTab === 'design' && (
        <div className="space-y-6">
          {/* Experiment Details */}
          <div className="bg-[#252525] rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Experiment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#aaa] mb-1">Experiment Title</label>
                <Input
                  value={experimentTitle}
                  onChange={(e) => setExperimentTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your experiment"
                  className="bg-[#2a2a2a] border-[#444] text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#aaa] mb-1">Description</label>
                <Textarea
                  value={experimentDescription}
                  onChange={(e) => setExperimentDescription(e.target.value)}
                  placeholder="Provide a brief overview of your experiment"
                  className="bg-[#2a2a2a] border-[#444] text-white"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#aaa] mb-1">Hypothesis</label>
                <Textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="State the hypothesis you are testing"
                  className="bg-[#2a2a2a] border-[#444] text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Variables */}
          <div className="bg-[#252525] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Variables</h2>
              <Button 
                onClick={handleAddVariable}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Variable
              </Button>
            </div>
            
            {variables.length === 0 ? (
              <div className="text-center py-8 text-[#888]">
                <FlaskConical className="h-12 w-12 mx-auto mb-3 text-[#555]" />
                <p>No variables added yet</p>
                <p className="text-sm mt-1">Variables help define what you're measuring and testing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variables.map((variable) => (
                  <div key={variable.id} className="bg-[#2a2a2a] border border-[#363636] rounded p-3">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1 mr-2">
                        <Input
                          value={variable.name}
                          onChange={(e) => handleUpdateVariable(variable.id, 'name', e.target.value)}
                          placeholder="Variable name"
                          className="bg-[#333] border-[#444] text-white"
                        />
                      </div>
                      <select
                        value={variable.type}
                        onChange={(e) => handleUpdateVariable(variable.id, 'type', e.target.value as any)}
                        className="bg-[#333] border border-[#444] rounded px-2 py-1 text-sm"
                      >
                        <option value="independent">Independent</option>
                        <option value="dependent">Dependent</option>
                        <option value="controlled">Controlled</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariable(variable.id)}
                        className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex mt-2">
                      <div className="flex-1 mr-2">
                        <Input
                          value={variable.value}
                          onChange={(e) => handleUpdateVariable(variable.id, 'value', e.target.value)}
                          placeholder="Value or range"
                          className="bg-[#333] border-[#444] text-white"
                        />
                      </div>
                      <div className="w-1/3">
                        <Input
                          value={variable.unit}
                          onChange={(e) => handleUpdateVariable(variable.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="bg-[#333] border-[#444] text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experimental Steps */}
          <div className="bg-[#252525] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Experimental Steps</h2>
              <Button 
                onClick={handleAddStep}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Step
              </Button>
            </div>
            
            {steps.length === 0 ? (
              <div className="text-center py-8 text-[#888]">
                <Workflow className="h-12 w-12 mx-auto mb-3 text-[#555]" />
                <p>No steps added yet</p>
                <p className="text-sm mt-1">Break down your experiment into sequential steps</p>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="bg-[#2a2a2a] border border-[#363636] rounded p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-purple-900/40 text-purple-300 w-7 h-7 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <Input
                          value={step.title}
                          onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                          placeholder={`Step ${index + 1}`}
                          className="bg-[#333] border-[#444] text-white"
                        />
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleExpandStep(step.id)}
                          className="text-[#aaa]"
                        >
                          {expandedStep === step.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStep(step.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {expandedStep === step.id && (
                      <div className="mt-3 pt-3 border-t border-[#363636] space-y-3">
                        <div>
                          <label className="block text-sm text-[#aaa] mb-1">Description</label>
                          <Textarea
                            value={step.description}
                            onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                            placeholder="Detailed description of this step"
                            className="bg-[#333] border-[#444] text-white"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="block text-sm text-[#aaa] mb-1">Duration</label>
                            <div className="flex">
                              <Input
                                type="number"
                                value={step.duration}
                                onChange={(e) => handleUpdateStep(step.id, 'duration', parseInt(e.target.value) || 0)}
                                className="bg-[#333] border-[#444] text-white w-24"
                                min={0}
                              />
                              <select
                                value={step.durationUnit}
                                onChange={(e) => handleUpdateStep(step.id, 'durationUnit', e.target.value as any)}
                                className="bg-[#333] border border-[#444] rounded ml-2 px-2 text-sm"
                              >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-[#aaa] mb-1">Required Equipment</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {step.requiresEquipment.map((eq, i) => (
                              <div key={i} className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full flex items-center">
                                {eq}
                                <button 
                                  onClick={() => {
                                    const newEquipment = [...step.requiresEquipment];
                                    newEquipment.splice(i, 1);
                                    handleUpdateStep(step.id, 'requiresEquipment', newEquipment);
                                  }}
                                  className="ml-1.5 text-purple-300 hover:text-white"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="relative">
                            <select
                              className="w-full bg-[#333] border border-[#444] rounded p-2 text-sm"
                              onChange={(e) => {
                                if (e.target.value && !step.requiresEquipment.includes(e.target.value)) {
                                  handleUpdateStep(
                                    step.id, 
                                    'requiresEquipment', 
                                    [...step.requiresEquipment, e.target.value]
                                  );
                                }
                                e.target.value = ''; // Reset select after selection
                              }}
                              value=""
                            >
                              <option value="" disabled>Add equipment...</option>
                              {availableEquipment
                                .filter(eq => !step.requiresEquipment.includes(eq))
                                .map((eq, i) => (
                                  <option key={i} value={eq}>{eq}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveExperiment}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Experiment Design
            </Button>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <div className="relative mb-6">
            <Search className="h-4 w-4 text-[#888] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, description or category..."
              className="bg-[#2a2a2a] border-[#444] text-white pl-10"
            />
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <FlaskConical className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg">No templates found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-[#252525] border border-[#363636] rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{template.title}</h3>
                    <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-[#aaa] mb-4 line-clamp-2">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888]">
                      Created: {template.createdAt.toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="bg-[#252525] rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium mb-4">Recent Experiments</h2>
            
            {recentExperiments.length === 0 ? (
              <div className="text-center py-8 text-[#888]">
                <Calculator className="h-12 w-12 mx-auto mb-3 text-[#555]" />
                <p>No experiment history yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[#aaa] border-b border-[#363636]">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Result</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExperiments.map((exp) => (
                      <tr key={exp.id} className="border-b border-[#363636] hover:bg-[#2a2a2a]">
                        <td className="py-3">{exp.title}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            exp.status === 'Completed' ? 'bg-green-900/30 text-green-300' :
                            exp.status === 'In Progress' ? 'bg-blue-900/30 text-blue-300' :
                            'bg-red-900/30 text-red-300'
                          }`}>
                            {exp.status === 'Completed' && <Check className="h-3 w-3 mr-1" />}
                            {exp.status}
                          </span>
                        </td>
                        <td className="py-3 text-[#aaa]">{exp.date}</td>
                        <td className="py-3">
                          {exp.success === true && <span className="text-green-400">Success</span>}
                          {exp.success === false && <span className="text-red-400">Failed</span>}
                          {exp.success === null && <span className="text-[#aaa]">Pending</span>}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#aaa] hover:text-white h-7 px-2"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#aaa] hover:text-white h-7 px-2"
                            >
                              <Share className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-[#252525] rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Experiment Analytics</h2>
            <div className="text-center py-8 text-[#888]">
              <BarChart className="h-12 w-12 mx-auto mb-3 text-[#555]" />
              <p>Experiment analytics will appear here</p>
              <p className="text-sm mt-1">Track your experiment success rate and outcomes over time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentDesign;