import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  FileText, 
  Database, 
  Search, 
  BrainCircuit, 
  Beaker,
  ArrowRight,
  Plus,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import './scrollbar.css';

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, link }) => (
  <div className="bg-[#252525] border border-[#363636] rounded-lg p-5 hover:border-purple-500/50 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-purple-400" />
    </div>
    <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
    <p className="text-[#aaa] text-sm mb-4">{description}</p>
    <a 
      href={link} 
      className="text-purple-400 text-sm font-medium flex items-center group"
    >
      Explore
      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
    </a>
  </div>
);

function WelcomePage({ username = "Researcher" }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Move the useEffect inside the component
  useEffect(() => {
    // Set up CSS for proper scrolling behavior
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html, body {
        height: 100%;
        overflow: auto;
        margin: 0;
        padding: 0;
        background-color: #1e1e1e;
      }
      .scrollable-content {
        overflow-y: scroll;
        height: calc(100vh - 150px); /* Adjust based on header height */
      }
      
      /* Custom scrollbar styles */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #2a2a2a;
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #8b5cf6;
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #9f7aea;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const features = [
    {
      title: "Hypothesis Management",
      description: "Create, test, and validate research hypotheses with powerful analysis tools",
      icon: Lightbulb,
      link: "#/hypothesis"
    },
    {
      title: "Document Analysis",
      description: "Extract insights from research papers, patents, and technical documentation",
      icon: FileText,
      link: "#/document-analysis"
    },
    {
      title: "Data Sources",
      description: "Connect to internal and external databases for comprehensive research",
      icon: Database,
      link: "#/datasources"
    },
    {
      title: "Experimentation",
      description: "Design and execute experiments with detailed protocols and tracking",
      icon: Beaker,
      link: "#/experimentation"
    },
    {
      title: "Brainstorming Sessions",
      description: "Collaborate with your team to generate and capture innovative ideas",
      icon: BrainCircuit,
      link: "#/brainstorming"
    },
    {
      title: "Knowledge Discovery",
      description: "Find connections between research projects, data, and publications",
      icon: Search,
      link: "#/knowledge"
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-[#1e1e1e] border-b border-[#363636] p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">Welcome to Scinter Graph Lab</h1>
          <p className="text-[#aaa]">Your advanced platform for R&D research, collaboration, and knowledge management</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#363636]">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'getting-started' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
            onClick={() => setActiveTab('getting-started')}
          >
            Getting Started
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'resources' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="p-6 bg-[#1e1e1e] text-white scrollable-content custom-scrollbar">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
            
            {/* Getting Started */}
            <div className="bg-[#252525] border border-[#363636] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Getting Started</h2>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-purple-900/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Create your first research project</h3>
                    <p className="text-[#aaa] text-sm">Set up a new research project to organize your work and collaborate with team members</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-900/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Connect your data sources</h3>
                    <p className="text-[#aaa] text-sm">Import documents, connect to databases, or upload experimental data to begin your analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-900/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Formulate your first hypothesis</h3>
                    <p className="text-[#aaa] text-sm">Create a testable hypothesis and use our tools to validate it against existing research</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Getting Started Tab */}
        {activeTab === 'getting-started' && (
          <div className="space-y-6">
            <div className="bg-[#252525] border border-[#363636] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Plus className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-medium">Project Creation</h2>
              </div>
              
              <div className="space-y-4 mb-4">
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Create a new research project</h3>
                  <p className="text-[#aaa] text-sm mb-3">Start by creating a new project that will contain all your research materials, hypotheses, and findings.</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-[#aaa] ml-2">
                    <li>Click the <span className="text-purple-400">"Create New Project"</span> button in the top right corner of your dashboard</li>
                    <li>Enter a project title, description, and select relevant research domains</li>
                    <li>Choose privacy settings and invite team members to collaborate</li>
                    <li>Select a project template or start from scratch</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-[#252525] border border-[#363636] rounded-lg p-4">
            <div className="space-y-4">
              {/* Activity Item 1 */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center mr-3 flex-shrink-0">
                  <Beaker className="h-4 w-4 text-[#4c9be8]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">ASML EUV Calibration Test Completed</span>
                    <span className="text-[#888] text-xs">2 hours ago</span>
                  </div>
                  <p className="text-[#aaa] text-xs">Test results show 0.3nm improvement in alignment accuracy</p>
                </div>
              </div>
              
              {/* Activity Item 2 */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center mr-3 flex-shrink-0">
                  <Lightbulb className="h-4 w-4 text-[#e85c4c]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">New Hypothesis Added</span>
                    <span className="text-[#888] text-xs">6 hours ago</span>
                  </div>
                  <p className="text-[#aaa] text-xs">Dynamic dose correction based on resist temperature</p>
                </div>
              </div>
              
              {/* Activity Item 3 */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center mr-3 flex-shrink-0">
                  <BrainCircuit className="h-4 w-4 text-[#53d969]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Team Brainstorming Session</span>
                    <span className="text-[#888] text-xs">Yesterday</span>
                  </div>
                  <p className="text-[#aaa] text-xs">Generated 7 new ideas for wafer stage optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Extra content to ensure scrolling */}
        <div className="content-padding">
          {/* Additional content items to ensure scrollbar visibility */}
          <div className="mt-12 bg-[#252525] border border-[#363636] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recommended Resources</h3>
            <div className="space-y-3">
              <div className="bg-[#2a2a2a] p-3 rounded-md hover:bg-[#333] transition-colors">
                <h4 className="font-medium text-white">Quantum Computing in Materials Research</h4>
                <p className="text-[#aaa] text-sm">Recent advances in computational materials science</p>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-md hover:bg-[#333] transition-colors">
                <h4 className="font-medium text-white">Advanced Lithography Techniques</h4>
                <p className="text-[#aaa] text-sm">Pushing the boundaries of semiconductor manufacturing</p>
              </div>
              <div className="bg-[#2a2a2a] p-3 rounded-md hover:bg-[#333] transition-colors">
                <h4 className="font-medium text-white">ML-Driven Drug Discovery</h4>
                <p className="text-[#aaa] text-sm">Applications of deep learning in pharmaceutical research</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-[#252525] border border-[#363636] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Your Research Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">7</div>
                <div className="text-[#aaa] text-sm">Active Projects</div>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">23</div>
                <div className="text-[#aaa] text-sm">Research Documents</div>
              </div>
              <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">12</div>
                <div className="text-[#aaa] text-sm">Verified Hypotheses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { WelcomePage as HomePage };