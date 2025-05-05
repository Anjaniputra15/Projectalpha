import React, { useState } from 'react';
import { FileText, Search, Filter, ChevronDown, Tag, Clock, Users, Calendar, BarChart2, Grid, List, Download, ExternalLink, Check, Info, Edit, Copy, Share2, Eye, MessageSquare, File, AlertTriangle, AlertCircle, Shield, Lock, User, ArrowUpRight, Bookmark, Clipboard, ChevronRight, X } from 'lucide-react';

const TechnicalReportsComponent = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [savedReports, setSavedReports] = useState([2, 5]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommentPanel, setShowCommentPanel] = useState(false);

  // Mock data for technical reports
  const categories = [
    'All', 
    'Field Performance', 
    'System Evaluation', 
    'Quality Analysis', 
    'EUV Performance',
    'Failure Analysis',
    'Technical Validation',
    'Customer Benchmarks'
  ];

  const confidentialityLevels = {
    public: { label: 'Public', color: 'text-green-400', icon: <Check size={14} className="mr-1" /> },
    internal: { label: 'Internal Only', color: 'text-yellow-400', icon: <Lock size={14} className="mr-1" /> },
    confidential: { label: 'Confidential', color: 'text-red-400', icon: <Shield size={14} className="mr-1" /> },
  };

  const reports = [
    {
      id: 1,
      title: "NXE:3800E Field Performance Analysis: Q1 2025",
      authors: ["Technical Systems Team", "Field Service Engineering"],
      category: "Field Performance",
      date: "2025-04-10",
      abstract: "This technical report presents a comprehensive analysis of NXE:3800E EUV lithography systems field performance across multiple customer sites during Q1 2025. We examine system availability, throughput, accuracy metrics, and identified issues with recommended remediation actions.",
      keywords: ["EUV", "NXE:3800E", "field performance", "system availability", "throughput"],
      confidentiality: "internal",
      reportNumber: "TR-2025-041",
      pages: 47,
      attachments: 3,
      relatedReports: [3, 6, 8],
      sections: [
        "Executive Summary",
        "System Availability Analysis",
        "Throughput Performance",
        "Accuracy Metrics Evaluation",
        "Common Field Issues",
        "Customer Satisfaction Metrics",
        "Recommended Actions",
        "Appendices"
      ],
      keyFindings: [
        "Average system availability across all installations: 97.2% (1.4% increase over Q4 2024)",
        "Throughput variability between identical systems reduced by 8.3% due to standardized calibration procedures",
        "Most frequent maintenance issue: light source cooling system alerts (37% of unscheduled maintenance)"
      ],
      recommendations: [
        "Deploy cooling system firmware update v4.3.2 to all field systems by end of Q2",
        "Increase preventative maintenance frequency for high-utilization customers",
        "Establish centralized monitoring system for real-time performance tracking"
      ],
      comments: [
        {
          author: "Jan Van der Meer",
          date: "2025-04-12",
          text: "Excellent analysis on the cooling system issues. We should prioritize the firmware update deployment to our high-volume manufacturing customers first."
        },
        {
          author: "Sarah Chen",
          date: "2025-04-13",
          text: "The throughput variability reduction is significant. Can we get more details on which specific calibration procedures had the most impact?"
        }
      ]
    },
    {
      id: 2,
      title: "High-NA EUV System Thermal Stability Evaluation",
      authors: ["Thermal Engineering Group", "System Integration Team"],
      category: "System Evaluation",
      date: "2025-03-28",
      abstract: "This report evaluates the thermal stability characteristics of the next-generation High-NA EUV lithography system prototypes. We analyze temperature control precision, thermal gradient management, and cooling system performance under various operational scenarios and environmental conditions.",
      keywords: ["High-NA EUV", "thermal stability", "cooling performance", "temperature control", "system integration"],
      confidentiality: "confidential",
      reportNumber: "TR-2025-037",
      pages: 68,
      attachments: 5,
      relatedReports: [5, 9],
      sections: [
        "Executive Summary",
        "Thermal Requirements for High-NA Systems",
        "Prototype Cooling System Architecture",
        "Temperature Control Performance",
        "Thermal Gradient Analysis",
        "Environmental Factors Impact",
        "Comparative Analysis with Current EUV Systems",
        "Recommendations for Design Improvements",
        "Appendices"
      ],
      keyFindings: [
        "Achieved ±0.003°C temperature stability in critical optical path components (exceeding target by 25%)",
        "Thermal gradients reduced by 42% compared to current EUV systems through novel cooling architecture",
        "System recovers from thermal equilibrium disturbances 2.8x faster than previous generation"
      ],
      recommendations: [
        "Implement enhanced cooling loop redundancy for production systems",
        "Adjust thermal control algorithms to account for customer fab environmental variations",
        "Increase sensor density in critical optical path regions for more precise monitoring"
      ],
      comments: [
        {
          author: "Michael Johnson",
          date: "2025-03-30",
          text: "The thermal recovery time improvement is impressive. We should incorporate these findings into the customer installation guidelines for environment preparation."
        }
      ]
    },
    {
      id: 3,
      title: "Source Power Stability Analysis Across NXE Platform",
      authors: ["EUV Source Team", "Performance Analysis Group"],
      category: "EUV Performance",
      date: "2025-03-15",
      abstract: "This technical report analyzes EUV source power stability across the installed base of NXE platforms. We compare performance between different generations, evaluate impact of recent upgrades, and identify factors affecting power stability in customer manufacturing environments.",
      keywords: ["EUV source", "power stability", "NXE platform", "performance comparison", "manufacturing environment"],
      confidentiality: "internal",
      reportNumber: "TR-2025-032",
      pages: 53,
      attachments: 4,
      relatedReports: [1, 8],
      sections: [
        "Executive Summary",
        "EUV Source Power Specifications Review",
        "Measurement Methodology",
        "Cross-Platform Comparison",
        "Environmental Factors Analysis",
        "Upgrade Impact Assessment",
        "Stability Pattern Recognition",
        "Recommendations",
        "Appendices"
      ],
      keyFindings: [
        "Latest generation NXE:3800E demonstrates 23% improved power stability compared to previous generation",
        "Temperature fluctuations in facility cooling water have direct correlation to source power stability",
        "Systems with Upgrade Package 5.2 show significantly reduced droplet generator variations"
      ],
      recommendations: [
        "Implement enhanced monitoring of facility cooling water temperature variance",
        "Accelerate deployment of Upgrade Package 5.2 to remaining installed base",
        "Develop predictive maintenance algorithms based on identified power fluctuation patterns"
      ],
      comments: [
        {
          author: "David Lee",
          date: "2025-03-16",
          text: "The correlation between facility cooling water and source stability is concerning. We should develop more detailed guidelines for customer facility requirements."
        },
        {
          author: "Emma Rodriguez",
          date: "2025-03-18",
          text: "Great work on the pattern recognition approach. This could be valuable for our predictive maintenance initiative."
        }
      ]
    },
    {
      id: 4,
      title: "Reticle Defect Impact Analysis on Critical Dimensions",
      authors: ["Mask Technology Group", "Process Integration Team"],
      category: "Quality Analysis",
      date: "2025-02-22",
      abstract: "This report quantifies the impact of various reticle defect types on printed critical dimensions in EUV lithography. We analyze different defect categories, their transfer mechanisms to the wafer, and implications for process windows across multiple customer process nodes.",
      keywords: ["reticle defects", "critical dimensions", "EUV lithography", "process window", "defect transfer"],
      confidentiality: "internal",
      reportNumber: "TR-2025-024",
      pages: 41,
      attachments: 6,
      relatedReports: [7],
      sections: [
        "Executive Summary",
        "Reticle Defect Classification",
        "Experimental Setup",
        "Defect Transfer Mechanisms",
        "Critical Dimension Impact Analysis",
        "Process Window Implications",
        "Mitigation Strategies",
        "Conclusions and Recommendations",
        "Appendices"
      ],
      keyFindings: [
        "Phase defects smaller than 35nm have statistically insignificant impact on 2nm node process windows",
        "Edge placement errors show non-linear correlation with absorber material thickness variations",
        "Multilayer defects have 2.3x greater impact on CD uniformity than surface contamination of similar size"
      ],
      recommendations: [
        "Update reticle inspection sensitivity thresholds based on defect type and expected impact",
        "Implement enhanced absorber thickness control in mask manufacturing process",
        "Develop predictive models for specific defect types to estimate CD impact before production"
      ],
      comments: [
        {
          author: "Yuki Tanaka",
          date: "2025-02-24",
          text: "This data will be very useful for our discussions with mask suppliers about quality specifications."
        }
      ]
    },
    {
      id: 5,
      title: "Energy Efficiency Optimization for High-NA EUV Systems",
      authors: ["Sustainability Engineering", "System Architecture Team"],
      category: "System Evaluation",
      date: "2025-04-02",
      abstract: "This technical report presents comprehensive analysis and recommendations for energy efficiency optimization in next-generation High-NA EUV lithography systems. We examine power consumption profiles, identify efficiency opportunities, and propose architectural changes to reduce overall energy requirements while maintaining performance specifications.",
      keywords: ["energy efficiency", "High-NA EUV", "power consumption", "sustainability", "system architecture"],
      confidentiality: "internal",
      reportNumber: "TR-2025-038",
      pages: 59,
      attachments: 3,
      relatedReports: [2],
      sections: [
        "Executive Summary",
        "Energy Consumption Baseline",
        "Subsystem Power Analysis",
        "Idle State Optimization",
        "Cooling System Efficiency",
        "Vacuum System Power Reduction",
        "Software Control Optimizations",
        "Financial and Environmental Impact",
        "Implementation Roadmap",
        "Appendices"
      ],
      keyFindings: [
        "Vacuum system consumes 28% of total system energy but offers potential 35% reduction through redesign",
        "Intelligent idle state management can reduce non-production energy usage by 42%",
        "Cooling system efficiency improvements can save 1.2 GWh per system annually"
      ],
      recommendations: [
        "Implement staged vacuum pump operation based on actual chamber requirements",
        "Develop new software algorithms for predictive component spin-up/spin-down",
        "Upgrade thermal insulation in next-generation designs to reduce cooling demands"
      ],
      comments: [
        {
          author: "Thomas Weber",
          date: "2025-04-05",
          text: "These energy savings would significantly improve our customers' total cost of ownership calculations. We should highlight this in marketing materials."
        },
        {
          author: "Ana Silva",
          date: "2025-04-05",
          text: "The vacuum system redesign proposal is excellent. We should fast-track this for implementation in the next hardware revision."
        }
      ]
    },
    {
      id: 6,
      title: "NXE:3800E vs. Competitive Systems Benchmarking Analysis",
      authors: ["Competitive Intelligence Team", "Customer Value Engineering"],
      category: "Customer Benchmarks",
      date: "2025-03-10",
      abstract: "This report presents a comprehensive benchmarking analysis comparing ASML's NXE:3800E EUV lithography systems against competitive offerings. We evaluate performance metrics, cost of ownership, and overall value proposition based on customer feedback and independent testing.",
      keywords: ["competitive benchmarking", "lithography systems", "EUV", "cost of ownership", "performance comparison"],
      confidentiality: "confidential",
      reportNumber: "TR-2025-030",
      pages: 72,
      attachments: 8,
      relatedReports: [1],
      sections: [
        "Executive Summary",
        "Benchmarking Methodology",
        "System Specifications Comparison",
        "Performance Metrics Analysis",
        "Cost of Ownership Calculations",
        "Customer Feedback Summary",
        "Competitive Positioning",
        "Market Strategy Recommendations",
        "Appendices"
      ],
      keyFindings: [
        "NXE:3800E demonstrates 18% higher throughput than nearest competitive system for equivalent process recipes",
        "Total cost of ownership advantage of 12-15% over 5-year period when accounting for all operational factors",
        "Customer-reported uptime exceeds competitive systems by 3.2 percentage points"
      ],
      recommendations: [
        "Emphasize throughput and uptime advantages in customer communications",
        "Develop more detailed TCO calculator tool for sales team use with prospects",
        "Create specialized competitive response team for high-profile customer engagements"
      ],
      comments: [
        {
          author: "Robert Chen",
          date: "2025-03-12",
          text: "This benchmarking data should be incorporated into our quarterly sales training. Very powerful competitive positioning."
        }
      ]
    },
    {
      id: 7,
      title: "Overlay Accuracy Analysis for Advanced Logic Nodes",
      authors: ["Process Integration Team", "Applications Engineering"],
      category: "Quality Analysis",
      date: "2025-02-08",
      abstract: "This technical report analyzes overlay accuracy performance for advanced logic nodes using ASML's latest lithography systems. We investigate factors affecting overlay performance, evaluate enhancement techniques, and provide recommendations for optimizing customer processes.",
      keywords: ["overlay accuracy", "advanced logic", "process optimization", "lithography", "metrology"],
      confidentiality: "internal",
      reportNumber: "TR-2025-018",
      pages: 44,
      attachments: 5,
      relatedReports: [4],
      sections: [
        "Executive Summary",
        "Overlay Requirements for Advanced Nodes",
        "Measurement Methodology",
        "System Control Factors",
        "Process Interaction Analysis",
        "Enhancement Techniques Evaluation",
        "Customer Case Studies",
        "Recommendations",
        "Appendices"
      ],
      keyFindings: [
        "Enhanced grid correction algorithms improve overlay performance by 24% for 2nm node applications",
        "Wafer heating effects contribute significantly to dynamic overlay errors during high-throughput processing",
        "Process-specific optimization can reduce mean + 3sigma overlay errors to below 1.8nm"
      ],
      recommendations: [
        "Implement advanced thermal modeling in overlay correction software",
        "Adjust measurement sampling strategies based on identified critical patterns",
        "Develop customer-specific process optimization guidelines for advanced nodes"
      ],
      comments: [
        {
          author: "Lisa Wong",
          date: "2025-02-10",
          text: "The thermal modeling recommendations are particularly important. We should consider making this a standard component of our process integration package."
        },
        {
          author: "John Muller",
          date: "2025-02-12",
          text: "Great analysis on the sampling strategies. We should update our field applications guidelines based on this."
        }
      ]
    },
    {
      id: 8,
      title: "EUV Source Lifetime Extension: Methods and Results",
      authors: ["EUV Source Engineering", "Reliability Team"],
      category: "EUV Performance",
      date: "2025-01-25",
      abstract: "This report documents methods developed to extend EUV source component lifetimes and the resulting improvements in system availability and cost of ownership. We analyze wear mechanisms, evaluate design modifications, and present field validation results from extended testing.",
      keywords: ["EUV source", "component lifetime", "reliability engineering", "availability", "cost reduction"],
      confidentiality: "internal",
      reportNumber: "TR-2025-012",
      pages: 51,
      attachments: 4,
      relatedReports: [1, 3],
      sections: [
        "Executive Summary",
        "Component Lifetime Limitations",
        "Wear Mechanism Analysis",
        "Design Modifications",
        "Material Science Advancements",
        "Field Testing Methodology",
        "Performance Results",
        "Cost Impact Analysis",
        "Recommendations and Future Work",
        "Appendices"
      ],
      keyFindings: [
        "Novel collector protection system extends collector lifetime by 72%",
        "Modified droplet generator design reduces consumable requirements by 38%",
        "Combined enhancements improve overall source availability by 2.8 percentage points"
      ],
      recommendations: [
        "Deploy collector protection system to all installed systems as part of regular maintenance",
        "Transition to new droplet generator design for all new system builds",
        "Implement enhanced monitoring system to predict component end-of-life more accurately"
      ],
      comments: [
        {
          author: "Karl Schmidt",
          date: "2025-01-28",
          text: "The lifetime improvements are impressive. We should quantify the total customer savings in CoO terms for our marketing team."
        }
      ]
    },
    {
      id: 9,
      title: "High-NA EUV System Software Architecture and Performance",
      authors: ["Software Development Team", "System Architecture Group"],
      category: "Technical Validation",
      date: "2025-03-20",
      abstract: "This technical report details the software architecture for next-generation High-NA EUV lithography systems, including control systems, computational lithography integration, and performance monitoring subsystems. We present validation results from prototype systems and outline the roadmap for feature enhancements.",
      keywords: ["software architecture", "High-NA EUV", "control systems", "computational lithography", "system integration"],
      confidentiality: "confidential",
      reportNumber: "TR-2025-035",
      pages: 63,
      attachments: 2,
      relatedReports: [2],
      sections: [
        "Executive Summary",
        "Software Architecture Overview",
        "Control System Design",
        "Computational Lithography Integration",
        "Performance Monitoring Framework",
        "Real-time Data Processing Capabilities",
        "Security Architecture",
        "Validation Test Results",
        "Feature Roadmap",
        "Appendices"
      ],
      keyFindings: [
        "New architecture reduces computational latency by 64% compared to current generation",
        "Integrated machine learning framework enables predictive maintenance with 87% accuracy",
        "Modular design allows for field updates without system recertification"
      ],
      recommendations: [
        "Accelerate deployment of machine learning framework to current generation systems where compatible",
        "Enhance security features to address emerging cybersecurity requirements",
        "Develop advanced user training program to maximize utilization of new capabilities"
      ],
      comments: [
        {
          author: "Patricia Liang",
          date: "2025-03-22",
          text: "The latency reduction is impressive. This will significantly improve our process control capabilities."
        },
        {
          author: "Hendrik van der Berg",
          date: "2025-03-23",
          text: "We should consider how to package the ML components as a retrofittable upgrade for existing customers."
        }
      ]
    },
    {
      id: 10,
      title: "Immersion and EUV Combined Lithography Process Integration",
      authors: ["Process Integration Team", "Customer Support Engineering"],
      category: "Field Performance",
      date: "2025-02-15",
      abstract: "This report examines optimal integration strategies for combining immersion and EUV lithography in advanced semiconductor manufacturing. We analyze layer assignment optimization, throughput balancing, and overall fab efficiency when utilizing both technologies in complementary approaches.",
      keywords: ["hybrid lithography", "process integration", "immersion", "EUV", "layer optimization"],
      confidentiality: "public",
      reportNumber: "TR-2025-022",
      pages: 38,
      attachments: 6,
      relatedReports: [],
      sections: [
        "Executive Summary",
        "Technology Comparison",
        "Layer Assignment Strategy",
        "Economic Analysis",
        "Case Studies",
        "Process Window Analysis",
        "Fab Integration Considerations",
        "Recommendations",
        "Appendices"
      ],
      keyFindings: [
        "Optimized layer assignment can reduce overall lithography costs by 14-18% for advanced nodes",
        "Combined approach improves fab cycle time by reducing bottlenecks at critical layers",
        "Double-patterning complexity in immersion can be reduced through strategic EUV deployment"
      ],
      recommendations: [
        "Implement layer-specific cost modeling for technology assignment decisions",
        "Develop integrated metrology strategy across both platforms",
        "Create specialized process integration team to support customer hybrid approaches"
      ],
      comments: [
        {
          author: "Mark Thompson",
          date: "2025-02-18",
          text: "This is excellent guidance for our customers transitioning to mixed lithography strategies. We should create a workshop around this content."
        },
        {
          author: "Sophia Zhang",
          date: "2025-02-20",
          text: "The economic analysis is particularly valuable. It would be helpful to create a simplified calculator tool for initial customer discussions."
        }
      ]
    }
  ];

  // Filter reports based on search and category
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      report.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle report selection
  const handleReportClick = (report) => {
    setSelectedReport(report);
    setActiveTab('overview');
  };

  // Close report details modal
  const closeReportDetails = () => {
    setSelectedReport(null);
    setShowCommentPanel(false);
  };

  // Toggle save status
  const toggleSave = (id, event) => {
    event.stopPropagation();
    if (savedReports.includes(id)) {
      setSavedReports(savedReports.filter(itemId => itemId !== id));
    } else {
      setSavedReports([...savedReports, id]);
    }
  };

  // Get related reports
  const getRelatedReports = (relatedIds) => {
    return reports.filter(report => relatedIds.includes(report.id));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Technical Reports</h1>
        </div>
        
        <p className="text-gray-400 mb-8">
          Access and analyze technical reports related to ASML lithography systems and semiconductor manufacturing
        </p>
        
        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by title, author, keywords, or content..."
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
            Showing {filteredReports.length} of {reports.length} reports
          </p>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>Last updated: Today at 10:23 AM</span>
          </div>
        </div>
        
        {/* Reports Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <div 
                key={report.id} 
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors h-full flex flex-col"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow pr-2">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        confidentialityLevels[report.confidentiality].color === 'text-green-400' ? "bg-green-900 text-green-300" :
                        confidentialityLevels[report.confidentiality].color === 'text-yellow-400' ? "bg-yellow-900 text-yellow-300" :
                        "bg-red-900 text-red-300"
                      } mr-2`}>
                        {confidentialityLevels[report.confidentiality].label}
                      </span>
                      <span className="text-xs text-gray-400">{report.reportNumber}</span>
                    </div>
                    <h3 className="font-medium text-lg leading-tight">{report.title}</h3>
                  </div>
                  <button 
                    className={`flex-shrink-0 p-1 rounded-full ${savedReports.includes(report.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={(e) => toggleSave(report.id, e)}
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-400 mb-2">
                  {report.authors.join(", ")}
                </p>
                
                <p className="text-xs text-gray-500 mb-3 flex items-center">
                  <Calendar size={12} className="mr-1" /> {report.date} • <FileText size={12} className="mx-1" /> {report.pages} pages
                </p>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {report.abstract}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {report.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="bg-gray-700 text-purple-300 text-xs rounded-full px-2 py-1">
                      {keyword}
                    </span>
                  ))}
                  {report.keywords.length > 3 && (
                    <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-2 py-1">
                      +{report.keywords.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-400">
                      <Tag size={12} className="mr-1" />
                      <span>{report.category}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MessageSquare size={12} className="mr-1" />
                      <span>{report.comments.length} comments</span>
                    </div>
                    <div className={`flex items-center ${confidentialityLevels[report.confidentiality].color}`}>
                      {confidentialityLevels[report.confidentiality].icon}
                      <span>{confidentialityLevels[report.confidentiality].label}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <File size={12} className="mr-1" />
                      <span>{report.attachments} attachments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Reports List */}
        {viewMode === 'list' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-750">
              <div className="col-span-6 text-sm font-medium text-gray-400">Report Title</div>
              <div className="col-span-2 text-sm font-medium text-gray-400">Category</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Date</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Report #</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Level</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Actions</div>
            </div>
            
            {filteredReports.map(report => (
              <div 
                key={report.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => handleReportClick(report)}
              >
                <div className="col-span-6">
                  <div className="flex items-start">
                    <div>
                      <h3 className="font-medium line-clamp-2">{report.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{report.authors.join(", ")}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-400">
                  {report.category}
                </div>
                <div className="col-span-1 flex items-center text-sm text-gray-400">
                  {report.date}
                </div>
                <div className="col-span-1 flex items-center text-sm text-gray-400">
                  {report.reportNumber}
                </div>
                <div className="col-span-1 flex items-center text-sm">
                  <span className={`flex items-center ${confidentialityLevels[report.confidentiality].color}`}>
                    {confidentialityLevels[report.confidentiality].icon}
                    <span className="hidden md:inline">{confidentialityLevels[report.confidentiality].label}</span>
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <button 
                    className={`p-1 rounded-full ${savedReports.includes(report.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={(e) => toggleSave(report.id, e)}
                  >
                    <Bookmark size={16} />
                  </button>
                  <button className="p-1 rounded-full text-purple-400 hover:text-purple-300">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`bg-gray-900 rounded-lg w-full max-w-5xl max-h-screen overflow-auto ${showCommentPanel ? 'mr-80' : ''}`}>
              <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-start p-6">
                  <div className="flex-grow pr-4">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        confidentialityLevels[selectedReport.confidentiality].color === 'text-green-400' ? "bg-green-900 text-green-300" :
                        confidentialityLevels[selectedReport.confidentiality].color === 'text-yellow-400' ? "bg-yellow-900 text-yellow-300" :
                        "bg-red-900 text-red-300"
                      } mr-2`}>
                        {confidentialityLevels[selectedReport.confidentiality].label}
                      </span>
                      <span className="text-xs text-gray-400 mr-2">{selectedReport.reportNumber}</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {selectedReport.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{selectedReport.title}</h2>
                    <p className="text-gray-400 text-sm">
                      {selectedReport.authors.join(", ")} • {selectedReport.date} • {selectedReport.pages} pages
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className={`p-2 rounded-full ${showCommentPanel ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCommentPanel(!showCommentPanel);
                      }}
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button 
                      className={`p-2 rounded-full ${savedReports.includes(selectedReport.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                      onClick={(e) => toggleSave(selectedReport.id, e)}
                    >
                      <Bookmark size={20} />
                    </button>
                    <button className="p-2 rounded-full text-gray-500 hover:text-gray-300">
                      <Download size={20} />
                    </button>
                    <button onClick={closeReportDetails} className="p-2 rounded-full text-gray-500 hover:text-gray-300">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <Info size={16} className="inline mr-2" />
                    Overview
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'findings' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('findings')}
                  >
                    <AlertCircle size={16} className="inline mr-2" />
                    Findings
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'recommendations' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('recommendations')}
                  >
                    <ArrowUpRight size={16} className="inline mr-2" />
                    Recommendations
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'related' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('related')}
                  >
                    <FileText size={16} className="inline mr-2" />
                    Related Reports
                  </button>
                </div>
              </div>
              
              {/* Content based on selected tab */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Abstract */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Abstract</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedReport.abstract}
                      </p>
                    </div>
                    
                    {/* Document Outline */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Document Outline</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedReport.sections.map((section, index) => (
                            <div key={index} className="flex items-center py-2 px-3 hover:bg-gray-750 rounded-md">
                              <ChevronRight size={16} className="text-purple-400 mr-2" />
                              <span className="text-gray-300">{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Keywords and metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <h3 className="text-lg font-medium mb-3">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.keywords.map((keyword, index) => (
                            <span key={index} className="bg-gray-800 text-purple-300 rounded-full px-3 py-1 text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Document Info</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Report Number:</span>
                              <span className="font-medium">{selectedReport.reportNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pages:</span>
                              <span className="font-medium">{selectedReport.pages}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Published:</span>
                              <span className="font-medium">{selectedReport.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Attachments:</span>
                              <span className="font-medium">{selectedReport.attachments}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Confidentiality:</span>
                              <span className={confidentialityLevels[selectedReport.confidentiality].color}>
                                {confidentialityLevels[selectedReport.confidentiality].label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Attachments */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Attachments ({selectedReport.attachments})</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-blue-400 mr-2" />
                              <span className="text-gray-300">Raw Data Spreadsheet.xlsx</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <Download size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-red-400 mr-2" />
                              <span className="text-gray-300">Detailed Analysis Methods.pdf</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <Download size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-green-400 mr-2" />
                              <span className="text-gray-300">Supplementary Figures.pptx</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-700">
                      <div className="flex space-x-3">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                          <Download size={16} className="mr-2" />
                          Download Full Report
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                          <Share2 size={16} className="mr-2" />
                          Share Report
                        </button>
                      </div>
                      <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
                        <Edit size={16} className="mr-2" />
                        Add to Project
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'findings' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Key Findings</h3>
                    <div className="space-y-4">
                      {selectedReport.keyFindings.map((finding, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-600">
                          <p className="text-gray-300">
                            {finding}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Supporting data visualization placeholder */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Supporting Data</h3>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-center text-gray-400 py-8">
                          <BarChart2 size={48} className="mx-auto mb-4 text-gray-600" />
                          <p>Data visualization would be displayed here in a full implementation.</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Impact analysis */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Impact Analysis</h3>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-green-400 font-medium mb-2 flex items-center">
                              <ArrowUpRight size={16} className="mr-2" />
                              Performance Impact
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Implementing these findings could result in significant improvements to system performance metrics.
                            </p>
                          </div>
                          <div className="bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                              <ArrowUpRight size={16} className="mr-2" />
                              Cost Impact
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Cost savings potential through improved efficiency and reduced waste in manufacturing processes.
                            </p>
                          </div>
                          <div className="bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-purple-400 font-medium mb-2 flex items-center">
                              <ArrowUpRight size={16} className="mr-2" />
                              Time Impact
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Implementation timeline estimates and potential impact on production schedules.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'recommendations' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                    <div className="space-y-4">
                      {selectedReport.recommendations.map((recommendation, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-600">
                          <p className="text-gray-300">
                            {recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Implementation Plan */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Implementation Considerations</h3>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="space-y-6">
                          <div className="border-b border-gray-700 pb-4">
                            <h4 className="text-purple-400 font-medium mb-3">Resources Required</h4>
                            <p className="text-gray-300 mb-2">
                              Implementing these recommendations would require coordination across multiple teams:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                              <li>Engineering resources for technical implementation</li>
                              <li>Field service teams for deployment to customer sites</li>
                              <li>Quality assurance for validation testing</li>
                              <li>Documentation team for updating technical manuals</li>
                            </ul>
                          </div>
                          
                          <div className="border-b border-gray-700 pb-4">
                            <h4 className="text-purple-400 font-medium mb-3">Timeline Estimates</h4>
                            <p className="text-gray-300 mb-2">
                              Phased implementation approach recommended:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                              <li>Phase 1 (Immediate): Critical software updates and calibration procedures</li>
                              <li>Phase 2 (1-3 months): Hardware modifications during scheduled maintenance</li>
                              <li>Phase 3 (3-6 months): Full integration with monitoring systems</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-purple-400 font-medium mb-3">Risk Assessment</h4>
                            <p className="text-gray-300 mb-2">
                              Key risks and mitigation strategies:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <AlertTriangle size={16} className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-gray-300">Potential compatibility issues with older system versions</p>
                              </div>
                              <div className="flex items-start">
                                <AlertTriangle size={16} className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-gray-300">Customer production impact during implementation</p>
                              </div>
                              <div className="flex items-start">
                                <AlertTriangle size={16} className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-gray-300">Supply chain constraints for required hardware components</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'related' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Related Technical Reports</h3>
                    {selectedReport.relatedReports.length > 0 ? (
                      <div className="space-y-4">
                        {getRelatedReports(selectedReport.relatedReports).map(related => (
                          <div 
                            key={related.id} 
                            className="bg-gray-800 rounded-lg p-4 hover:border-purple-500 border border-gray-700 cursor-pointer"
                            onClick={() => handleReportClick(related)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center mb-1">
                                  <span className="text-xs text-gray-400 mr-2">{related.reportNumber}</span>
                                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                                    {related.category}
                                  </span>
                                </div>
                                <h4 className="font-medium mb-1">{related.title}</h4>
                                <p className="text-sm text-gray-400">{related.authors.join(", ")} • {related.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs flex items-center ${confidentialityLevels[related.confidentiality].color}`}>
                                  {confidentialityLevels[related.confidentiality].icon}
                                  <span>{confidentialityLevels[related.confidentiality].label}</span>
                                </span>
                                <Eye size={16} className="text-purple-400" />
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                              {related.abstract}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <p className="text-gray-400">No related reports found for this document.</p>
                      </div>
                    )}
                    
                    {/* Other reference materials */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Reference Materials</h3>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 mb-4">
                          Additional materials that may be relevant to this technical report:
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-purple-400 mr-2" />
                              <span className="text-gray-300">System Specifications Document</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-purple-400 mr-2" />
                              <span className="text-gray-300">Industry Standard Guidelines</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-750 rounded-md">
                            <div className="flex items-center">
                              <FileText size={16} className="text-purple-400 mr-2" />
                              <span className="text-gray-300">Historical Performance Data</span>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Comments Panel */}
            {showCommentPanel && (
              <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto z-50">
                <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Comments</h3>
                    <button 
                      onClick={() => setShowCommentPanel(false)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {selectedReport.comments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedReport.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-750 rounded-lg p-3">
                          <div className="flex items-start mb-2">
                            <div className="bg-purple-900 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                              <User size={14} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{comment.author}</p>
                              <p className="text-xs text-gray-400">{comment.date}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center my-6">No comments on this report yet.</p>
                  )}
                  
                  <div className="mt-4">
                    <textarea 
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-300 text-sm"
                      placeholder="Add your comment..."
                      rows={4}
                    ></textarea>
                    <button className="mt-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm w-full">
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalReportsComponent;