import React, { useState, useEffect } from "react"; // Import useEffect
import { 
  Home, 
  FileText, 
  FileCode, 
  BrainCircuit, 
  Database, 
  Settings, 
  Key, 
  BookOpen, 
  Activity, 
  ChevronDown,
  ChevronRight,
  Search, 
  Layers, 
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  BarChart,
  LineChart,
  Kanban,
  GitBranch,
  Briefcase,
  FileSpreadsheet,
  BookMarked,
  Lightbulb,
  Beaker,
  Microscope,
  ArrowUpDown,
  ListChecks,
  PanelTop,
  Gauge,
  Workflow,
  Table,
  Radar,
  BarChart2,
  BarChart3,
  PieChart,
  Cylinder,
  UploadCloud,
  Library,
  Files,
  Archive,
  Share2,
  Network,
  Target,
  FileCheck,
  Filter,
  Bell,
  Calculator,
  Bug,
  BadgeCheck,
  Clock,
  Hourglass,
  Award,
  GraduationCap,
  SquareStack,
  Cpu,
  Server,
  Braces,
  Atom,
  Box,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type for navigation items with nesting support
interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  badgeColor?: string;
  subItems?: NavItem[]; // Array for nested items
}

interface SectionProps {
  title: string;
  items: NavItem[];
  onItemClick: (id: string) => void;
  activeTab: string; // Pass activeTab down for expansion logic
  expanded?: boolean; // Initial expansion state for the whole section
}

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  extractedSections?: Record<string, string>;
  savedHypotheses?: any[];
}

// --- Refactored SidebarSection Component ---
const SidebarSection: React.FC<SectionProps> = ({ 
  title, 
  items, 
  onItemClick,
  activeTab, // Receive activeTab
  expanded: initialSectionExpanded = true 
}) => {
  const [isSectionExpanded, setIsSectionExpanded] = useState(initialSectionExpanded);
  // State to track expanded parent items { itemId: boolean }
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  // Effect to expand parent if a child is active when component mounts or activeTab changes
  useEffect(() => {
    const newExpandedParents: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.subItems?.some(sub => sub.id === activeTab)) {
        newExpandedParents[item.id] = true;
      }
    });
    setExpandedParents(prev => ({ ...prev, ...newExpandedParents })); // Merge with previous state if needed
  }, [activeTab, items]);


  const handleParentToggle = (itemId: string) => {
    setExpandedParents(prev => ({
      ...prev,
      [itemId]: !prev[itemId] // Toggle the specific parent's state
    }));
  };

  const renderNavItem = (item: NavItem, isSubItem: boolean = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isParentExpanded = expandedParents[item.id];
    
    // Determine if the item itself or one of its children is active
    const isEffectivelyActive = item.active || (hasSubItems && item.subItems.some(sub => sub.active));

    return (
      <React.Fragment key={item.id}>
        <div
          // Apply indentation for sub-items
          className={`flex items-center w-full px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors group ${isSubItem ? 'pl-8' : 'pl-2'} ${ 
            isEffectivelyActive // Use effective active state for styling parent/child
              ? "bg-purple-600/20 text-purple-400" 
              : "text-[#aaa] hover:bg-[#2a2a2a]"
          }`}
          // Only trigger navigation if it's not a parent with sub-items, or if it IS a sub-item
          onClick={() => !hasSubItems || isSubItem ? onItemClick(item.id) : handleParentToggle(item.id)} 
        >
          {/* Optional: Use a different icon or indicator for sub-items if desired */}
          {/* <span className="mr-2">{isSubItem ? <Minus className="h-3 w-3" /> : item.icon}</span> */}
           <span className="mr-2">{item.icon}</span>
          <span className="flex-1 truncate">{item.name}</span>
          
          {/* Chevron for parent items */}
          {hasSubItems && (
             <span 
                className="ml-auto pr-1" 
                onClick={(e) => { e.stopPropagation(); handleParentToggle(item.id); }} // Toggle only on chevron click
             >
              {isParentExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" />
              ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" />
              )}
            </span>
          )}

          {/* Badge (only on non-parent items or parent based on design) */}
          {!hasSubItems && item.badge && (
            <span className={`${item.badgeColor || "bg-gray-500"} text-white text-xs px-1.5 py-0.5 rounded-full ml-2`}>
              {item.badge}
            </span>
          )}
        </div>

        {/* Render Sub-Items if parent exists and is expanded */}
        {hasSubItems && isParentExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems?.map(subItem => renderNavItem(subItem, true))} 
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div 
        className="flex items-center px-3 py-1 cursor-pointer"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
      >
        {isSectionExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-[#666] mr-1.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[#666] mr-1.5" />
        )}
        <span className="text-xs font-medium uppercase tracking-wider text-[#666]">
          {title}
        </span>
      </div>
      
      {/* Section Content */}
      {isSectionExpanded && (
        <div className="mt-1.5 space-y-1 px-2">
          {items.map(item => renderNavItem(item))} 
        </div>
      )}
    </div>
  );
};
// --- End of Refactored SidebarSection ---


// User profile component (no changes needed)
const UserProfile: React.FC = () => {
  return (
    <div className="border-t border-[#363636] p-3">
      {/* ... UserProfile content ... */}
       <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium">
            F
          </div>
          <div className="flex flex-col">
            <span className="text-[#eee]">User</span>
            <span className="text-xs text-[#888]">0 / 10000 credits</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-[#888]" />
      </div>
    </div>
  );
};

// --- Main LeftSidebar component ---
// --- Main LeftSidebar component with new organization ---
export const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  activeTab,
  onTabChange,
  extractedSections = {},
  savedHypotheses = []
}) => {
  // Overview section items
  const overviewItems: NavItem[] = [
    { 
      id: "home", 
      name: "Home", 
      icon: <Home className="h-4 w-4" />, 
      active: activeTab === "home" 
    },
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: activeTab === "dashboard"
    },
    {
      id: "project-overview",
      name: "Project Overview--Coming Soon",
      icon: <ClipboardList className="h-4 w-4" />,
      active: activeTab === "project-overview"
    },
    {
      id: "research-team",
      name: "Research Team--Coming Soon",
      icon: <Users className="h-4 w-4" />,
      active: activeTab === "research-team"
    },
    {
      id: "timeline--Coming Soon",
      name: "Timeline",
      icon: <Calendar className="h-4 w-4" />,
      active: activeTab === "timeline"
    }
  ];
  
  // --- DATASOURCES Section ---
  const datasourcesItems: NavItem[] = [
    {
      id: "internal-databases",
      name: "Internal Databases-",
      icon: <Database className="h-4 w-4" />,
      active: activeTab === "internal-databases"
    },
    {
      id: "external-databases",
      name: "External Databases--Coming Soon",
      icon: <Cylinder className="h-4 w-4" />,
      active: activeTab === "external-databases"
    },
    {
      id: "file-uploads",
      name: "File Uploads",
      icon: <UploadCloud className="h-4 w-4" />,
      active: activeTab === "file-uploads"
    },
    {
      id: "data-catalogs",
      name: "Data Catalogs",
      icon: <Library className="h-4 w-4" />,
      active: activeTab === "data-catalogs"
    },
    {
      id: "market-research",
      name: "Market Research--Coming Soon",
      icon: <Search className="h-4 w-4" />,
      active: activeTab === "market-research"
    },
    
      { 
        id: "index", 
        name: "Index", 
        icon: <Database className="h-4 w-4" />, 
        active: activeTab === "index" 
      }
    ];
  
  // --- IDEAS Section ---
  const ontologyItems: NavItem[] = [
    {
      id: "notes",
      name: "Idea Bank",
      icon: <Lightbulb className="h-4 w-4" />,
      active: activeTab === "notes"
    },
    {
      id: "brainstorming",
      name: "Brainstorming Sessions",
      icon: <BrainCircuit className="h-4 w-4" />,
      active: activeTab === "brainstorming"
    },
    {
      id: "idea-prioritization",
      name: "Prioritization Matrix--Coming Soon",
      icon: <Kanban className="h-4 w-4" />,
      active: activeTab === "idea-prioritization"
    },
    {
      id: "innovation",
      name: "Innovation Roadmap--Coming Soon",
      icon: <GitBranch className="h-4 w-4" />,
      active: activeTab === "innovation-roadmap"
    },
    {
      id: "customer-feedback",
      name: "Customer Feedback--Coming Soon",
      icon: <Share2 className="h-4 w-4" />,
      active: activeTab === "customer-feedback"
    }
  ];
  
  // --- DOCUMENTS ANALYSIS Section ---
  const documentItems: NavItem[] = [
    {
      id: "literature-review",
      name: "Literature Review",
      icon: <BookMarked className="h-4 w-4" />,
      active: activeTab === "literature-review",
      badge: Object.keys(extractedSections).length || undefined,
      badgeColor: "bg-blue-500"

    },
  
    {
      id: "technical-reports",
      name: "Technical Reports",
      icon: <FileText className="h-4 w-4" />,
      active: activeTab === "technical-reports"
    },
    {
      id: "market-trends",
      name: "Market Trends--Coming Soon",
      icon: <LineChart className="h-4 w-4" />,
      active: activeTab === "market-trends"
    },
    {
      id: "competitive-research",
      name: "Competitive Research--Coming Soon",
      icon: <Target className="h-4 w-4" />,
      active: activeTab === "competitive-research"
    }
  ];
  
  // --- HYPOTHESIS Section ---
  const hypothesisItems: NavItem[] = [
    {
      id: "hypothesis-formation",
      name: "Hypothesis Formation",
      icon: <Lightbulb className="h-4 w-4" />,
      active: activeTab === "hypothesis-formation"
    },
    {
      id: "testing-criteria",
      name: "Testing Criteria--Coming Soon",
      icon: <ListChecks className="h-4 w-4" />,
      active: activeTab === "testing-criteria"
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment--Coming Soon",
      icon: <FileCheck className="h-4 w-4" />,
      active: activeTab === "risk-assessment"
    },
    {
      id: "validation-methods",
      name: "Validation Methods--Coming Soon",
      icon: <BadgeCheck className="h-4 w-4" />,
      active: activeTab === "validation-methods"
    },
    {
      id: "expected-outcomes",
      name: "Expected Outcomes--Coming Soon",
      icon: <Target className="h-4 w-4" />,
      active: activeTab === "expected-outcomes"
    }
  ];
  
  // --- EXPERIMENTATION Section ---
  const quantumTrainingItems: NavItem[] = [
    {
      id: "experiment-design",
      name: "Experiment Design",
      icon: <Workflow className="h-4 w-4" />,
      active: activeTab === "experiment-design"
    },
    {
      id: "testing-protocols",
      name: "Testing Protocols",
      icon: <Beaker className="h-4 w-4" />,
      active: activeTab === "testing-protocols"
    },
    {
      id: "labresource",
      name: "Lab Resources",
      icon: <Microscope className="h-4 w-4" />,
      active: activeTab === "labresource" || activeTab === "training-interface" || activeTab === "equipment-catalog" || activeTab === "compute-resources",
      subItems: [
        {
          id: "compute-resources",
          name: "Compute Resources",
          icon: <Server className="h-4 w-4" />,
          active: activeTab === "compute-resources"
        },
        {
      id: "lcm-core",
      name: "Large Concept Model",
      icon: <Braces className="h-4 w-4" />,
      active: activeTab === "lcm-core"
    },
    {
      id: "temporal-features",
      name: "Temporal Features",
      icon: <Network className="h-4 w-4" />,
      active: activeTab === "temporal-features"
    },
    {
      id: "temporal-graph",
      name: "Temporal Graph",
      icon: <Box className="h-4 w-4" />,
      active: activeTab === "temporal-graph"
    },
    {
      id: "quantum-training",
      name: "Quantum Training",
      icon: <Atom className="h-4 w-4" />,
      active: activeTab === "quantum-training"
    },
    {
      id: "quantum-diffusion",
      name: "Quantum Diffusion",
      icon: <Zap className="h-4 w-4" />,
      active: activeTab === "quantum-diffusion"
    },
    {
      id: "qplcgn",
      name: "Quantum Parallel Geometrical",
      icon: <Microscope className="h-4 w-4" />,
      active: activeTab === "qplcgn"
    }
        
      ]
    },
    {
      id: "results-collection",
      name: "Results Collection--Coming Soon",
      icon: <Database className="h-4 w-4" />,
      active: activeTab === "results-collection"
    },
    {
      id: "quality-control",
      name: "Quality Control--Coming Soon",
      icon: <BadgeCheck className="h-4 w-4" />,
      active: activeTab === "quality-control"
    }
  ];
  
  // Analysis section will use the same items as Experimentation section
  // If you want different items for Analysis, you can uncomment this code:
  /*
  // --- ANALYSIS Section ---
  const analysisItems: NavItem[] = [
    {
      id: "data-processing",
      name: "Data Processing",
      icon: <ArrowUpDown className="h-4 w-4" />,
      active: activeTab === "data-processing"
    },
    {
      id: "statistical-analysis",
      name: "Statistical Analysis",
      icon: <Calculator className="h-4 w-4" />,
      active: activeTab === "statistical-analysis"
    },
    {
      id: "trend-identification",
      name: "Trend Identification",
      icon: <LineChart className="h-4 w-4" />,
      active: activeTab === "trend-identification"
    },
    {
      id: "correlation-studies",
      name: "Correlation Studies",
      icon: <Network className="h-4 w-4" />,
      active: activeTab === "correlation-studies"
    },
    {
      id: "visualization-tools",
      name: "Visualization Tools",
      icon: <BarChart2 className="h-4 w-4" />,
      active: activeTab === "visualization-tools"
    }
  ];
  */
  
  // --- EVALUATION Section ---
  const evaluationItems: NavItem[] = [
    {
      id: "project-assessment",
      name: "Project Assessment--Coming Soon",
      icon: <ClipboardList className="h-4 w-4" />,
      active: activeTab === "project-assessment"
    },
    {
      id: "success-metrics",
      name: "Success Metrics--Coming Soon",
      icon: <Gauge className="h-4 w-4" />,
      active: activeTab === "success-metrics"
    },
    {
      id: "performance-indicators",
      name: "Performance Indicators--Coming Soon",
      icon: <BarChart3 className="h-4 w-4" />,
      active: activeTab === "performance-indicators"
    },
    {
      id: "stakeholder-feedback",
      name: "Stakeholder Feedback--Coming Soon",
      icon: <Users className="h-4 w-4" />,
      active: activeTab === "stakeholder-feedback"
    },
    {
      id: "roi-analysis",
      name: "ROI Analysis--Coming Soon",
      icon: <PieChart className="h-4 w-4" />,
      active: activeTab === "roi-analysis"
    }
  ];
  
  // --- MONITOR Section ---
  const monitorItems: NavItem[] = [
    {
      id: "project-tracking",
      name: "Project Tracking--Coming Soon",
      icon: <Clock className="h-4 w-4" />,
      active: activeTab === "project-tracking"
    },
    {
      id: "resource-utilization",
      name: "Resource Utilization--Coming Soon",
      icon: <Gauge className="h-4 w-4" />,
      active: activeTab === "resource-utilization"
    },
    {
      id: "budget-management",
      name: "Budget Management--Coming Soon",
      icon: <Briefcase className="h-4 w-4" />,
      active: activeTab === "budget-management"
    },
    {
      id: "timeline-compliance",
      name: "Timeline Compliance--Coming Soon",
      icon: <Hourglass className="h-4 w-4" />,
      active: activeTab === "timeline-compliance"
    },
    {
      id: "risk-monitoring",
      name: "Risk Monitoring--Coming Soon",
      icon: <Bell className="h-4 w-4" />,
      active: activeTab === "risk-monitoring"
    }
  ];
  
  // --- KNOWLEDGE RESOURCES Section ---
  const resourcesItems: NavItem[] = [
    {
      id: "best-practices",
      name: "Best Practices--Coming Soon",
      icon: <Award className="h-4 w-4" />,
      active: activeTab === "best-practices"
    },
    {
      id: "technical-documentation",
      name: "Technical Documentation--Coming Soon",
      icon: <Files className="h-4 w-4" />,
      active: activeTab === "technical-documentation"
    },
    {
      id: "training-materials--Coming Soon",
      name: "Training Materials",
      icon: <GraduationCap className="h-4 w-4" />,
      active: activeTab === "training-materials"
    },
    {
      id: "standards-guidelines",
      name: "Standards & Guidelines--Coming Soon",
      icon: <BookOpen className="h-4 w-4" />,
      active: activeTab === "standards-guidelines"
    },
    {
      id: "research-archives",
      name: "Research Archives--Coming Soon",
      icon: <Archive className="h-4 w-4" />,
      active: activeTab === "research-archives"
    }
  ];
  
  // Handle navigation item click
  const handleItemClick = (id: string) => {
    onTabChange(id);
  };
  
  return (
    <div className="w-56 h-full bg-[#1a1a1a] border-r border-[#363636] flex flex-col overflow-hidden">
      {/* Sidebar header */}
      <div className="h-12 border-b border-[#363636] px-4 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <BrainCircuit className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-medium text-[#eee]">Scinter Graph Lab</span>
        </div>
      </div>
      
      {/* Organization selector */}
      <div className="p-3 border-b border-[#363636]">
        <div className="flex items-center gap-2 p-2 bg-[#2a2a2a] rounded-md cursor-pointer hover:bg-[#333]">
          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white font-medium">
            D
          </div>
          <span className="text-[#eee] text-sm">Default Org</span>
          <ChevronDown className="h-4 w-4 text-[#888] ml-auto" />
        </div>
      </div>
      
      {/* Scrollable navigation sections */}
      <div className="overflow-y-auto flex-1 custom-scrollbar py-4">
        {/* New organization structure */}
        <SidebarSection 
          title="Overview" 
          items={overviewItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />
        <SidebarSection 
          title="Datasources" 
          items={datasourcesItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />
        <SidebarSection 
          title="Ideas" 
          items={ontologyItems} 
          onItemClick={handleItemClick} 
          activeTab={activeTab}
        />

        <SidebarSection 
          title="Documents Analysis" 
          items={documentItems} 
          onItemClick={handleItemClick} 
          activeTab={activeTab}
        />
        
        <SidebarSection 
          title="Hypotesis" 
          items={hypothesisItems} 
          onItemClick={handleItemClick} 
          activeTab={activeTab}
        />

        <SidebarSection 
          title="Experimentation" 
          items={quantumTrainingItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />

        <SidebarSection 
          title="Analysis" 
          items={quantumTrainingItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />
        
        <SidebarSection 
          title="Evaluation" 
          items={evaluationItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />
        <SidebarSection 
          title="Monitor" 
          items={monitorItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab} 
        />
        <SidebarSection 
          title="Knowledge Resources" 
          items={resourcesItems} 
          onItemClick={handleItemClick}
          activeTab={activeTab}
          expanded={false} // Keep this section collapsed initially
        />
        
        {/* Search feature */}
        <div className="px-3 mt-4">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search..."
              className="h-8 pl-8 bg-[#2a2a2a] border-[#444] text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* User profile at bottom */}
      <UserProfile />
    </div>
  );
};

export default LeftSidebar;