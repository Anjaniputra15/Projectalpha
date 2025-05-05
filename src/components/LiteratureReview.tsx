import React, { useState } from 'react';
import { FileText, Search, Filter, ChevronDown, Tag, Clock, Users, Calendar, Star, BookOpen, ExternalLink, Download, ArrowUpRight, Check, Info, Edit, BookMarked, Bookmark, Copy, ListFilter, BarChart2, Grid, List, CircleSlash, Zap, Eye } from 'lucide-react';

const LiteratureReviewComponent = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [savedItems, setSavedItems] = useState([2, 5, 7]);

  // Mock data for literature catalog
  const categories = [
    'All', 
    'Academic Papers', 
    'Conference Proceedings', 
    'Industry Reports', 
    'Patents',
    'White Papers',
    'Technical Articles',
    'ASML Whitepapers'
  ];

  const journalTiers = {
    tier1: { label: 'Tier 1', color: 'text-green-400', icon: <Star size={14} className="mr-1" /> },
    tier2: { label: 'Tier 2', color: 'text-blue-400', icon: <Star size={14} className="mr-1" /> },
    tier3: { label: 'Tier 3', color: 'text-yellow-400', icon: <Star size={14} className="mr-1" /> },
  };

  const publications = [
    {
      id: 1,
      title: "Advances in High-NA EUV Lithography for Sub-2nm Semiconductor Nodes",
      authors: ["Zhang, L.", "Muller, H.J.", "van der Steen, J.", "Smith, R."],
      journal: "Journal of Semiconductor Manufacturing",
      year: 2024,
      category: "Academic Papers",
      abstract: "This paper explores the latest developments in High-NA EUV lithography technology for enabling semiconductor manufacturing at sub-2nm nodes. We discuss optical innovations in ASML's next-generation lithography systems that overcome previous resolution limitations, enabling continuation of Moore's Law.",
      keywords: ["High-NA EUV", "sub-2nm", "semiconductor manufacturing", "optical lithography", "ASML"],
      citations: 37,
      journalTier: "tier1",
      publicationDate: "2024-02-15",
      doi: "10.1109/JSEMI.2024.0234",
      fullTextAvailable: true,
      relatedTo: [2, 8, 10],
      internalNotes: "Key paper supporting our High-NA value proposition to customers.",
      references: 42,
      keyFindings: [
        "High-NA EUV systems demonstrated 8nm resolution, enabling 2nm process node manufacturing",
        "New optical designs reduce stochastic effects by 37% compared to standard EUV systems",
        "Throughput improvements of 15% achieved through enhanced source power and system stability"
      ]
    },
    {
      id: 2,
      title: "Computational Lithography Methods for EUV Process Optimization",
      authors: ["Chen, W.", "Petersen, J.", "de Boer, G.", "Williams, K."],
      journal: "IEEE Transactions on Semiconductor Manufacturing",
      year: 2024,
      category: "Academic Papers",
      abstract: "This paper presents novel computational lithography methods specifically designed for EUV process optimization. We demonstrate how machine learning approaches can be integrated with physics-based models to predict and mitigate stochastic effects in EUV lithography, improving both yield and performance in leading-edge semiconductor manufacturing.",
      keywords: ["computational lithography", "EUV", "machine learning", "process optimization", "stochastic effects"],
      citations: 28,
      journalTier: "tier1",
      publicationDate: "2024-01-05",
      doi: "10.1109/TSM.2024.3268421",
      fullTextAvailable: true,
      relatedTo: [1, 4, 6],
      internalNotes: "Complements our software roadmap for computational lithography solutions.",
      references: 38,
      keyFindings: [
        "Neural network models achieve 92% accuracy in predicting stochastic defects",
        "Computational lithography methods reduce pattern variability by 40%",
        "Integration with ASML's lithography systems enables closed-loop process optimization"
      ]
    },
    {
      id: 3,
      title: "Reticle Defect Detection and Mitigation Strategies for Advanced EUV Lithography",
      authors: ["Kim, S.", "Jiang, X.", "van Heerden, E.", "Patel, V."],
      journal: "SPIE Advanced Lithography and Patterning",
      year: 2025,
      category: "Conference Proceedings",
      abstract: "This paper addresses the critical challenge of reticle defect detection and mitigation in advanced EUV lithography. We present new inspection methodologies and automatic defect classification algorithms that enable comprehensive quality control for EUV reticles, enhancing yield and reliability in leading-edge semiconductor manufacturing processes.",
      keywords: ["EUV", "reticle defects", "inspection", "defect classification", "yield enhancement"],
      citations: 12,
      journalTier: "tier2",
      publicationDate: "2025-02-28",
      doi: "10.1117/12.2662835",
      fullTextAvailable: true,
      relatedTo: [8, 9],
      internalNotes: "Significant advancement in reticle quality control that can be incorporated into our inspection systems.",
      references: 31,
      keyFindings: [
        "Novel actinic inspection technique improves defect detection sensitivity by 35%",
        "Machine learning classification achieves 97% accuracy for EUV-specific defect types",
        "Proposed mitigation strategies reduce impact of non-repairable defects by 60%"
      ]
    },
    {
      id: 4,
      title: "Global Semiconductor Manufacturing Equipment Market Trends: 2025-2030",
      authors: ["Global Market Insights Inc."],
      journal: "Industry Report",
      year: 2025,
      category: "Industry Reports",
      abstract: "This comprehensive market report analyzes current trends and future projections for the semiconductor manufacturing equipment market from 2025 to 2030. With special focus on lithography equipment, we examine regional investments, technological disruptions, and competitive dynamics shaping the industry over the next five years.",
      keywords: ["semiconductor equipment", "market trends", "lithography", "industry forecast", "competitive analysis"],
      citations: 45,
      journalTier: "tier2",
      publicationDate: "2025-01-10",
      doi: null,
      fullTextAvailable: true,
      relatedTo: [7],
      internalNotes: "Valuable market data for our strategic planning. Highlights our dominant position in EUV.",
      references: 24,
      keyFindings: [
        "EUV lithography equipment segment projected to grow at 11.5% CAGR through 2030",
        "Asia-Pacific region accounts for 68% of new lithography equipment investments",
        "ASML maintains 85% market share in high-end lithography systems"
      ]
    },
    {
      id: 5,
      title: "Energy Efficiency Optimizations in Next-Generation Lithography Systems",
      authors: ["Gupta, R.", "van der Meulen, Y.", "Tanaka, K."],
      journal: "Journal of Sustainable Semiconductor Manufacturing",
      year: 2024,
      category: "Academic Papers",
      abstract: "This paper explores novel approaches to improving energy efficiency in next-generation lithography systems. We present design innovations that significantly reduce power consumption while maintaining performance, addressing the growing environmental and operational cost concerns in semiconductor manufacturing.",
      keywords: ["energy efficiency", "lithography", "sustainable manufacturing", "power optimization", "green semiconductor"],
      citations: 19,
      journalTier: "tier2",
      publicationDate: "2024-09-22",
      doi: "10.1016/j.jsusm.2024.08.003",
      fullTextAvailable: false,
      relatedTo: [10],
      internalNotes: "Aligns with our sustainability initiatives and customer demands for lower operational costs.",
      references: 35,
      keyFindings: [
        "Thermal management redesign reduces system power consumption by 22%",
        "New vacuum system architecture lowers energy requirements by 18%",
        "Software optimizations enable dynamic power scaling based on throughput needs"
      ]
    },
    {
      id: 6,
      title: "Optical Proximity Correction Techniques for High-NA EUV Lithography",
      authors: ["Wang, L.", "Kowalski, M.", "Dijkstra, J."],
      journal: "Proceedings of the International Symposium on Lithography Extensions",
      year: 2025,
      category: "Conference Proceedings",
      abstract: "This paper presents advanced optical proximity correction (OPC) techniques specifically designed for High-NA EUV lithography. We demonstrate how these new computational approaches address the unique challenges of High-NA systems, enabling accurate pattern transfer at the most demanding nodes of semiconductor manufacturing.",
      keywords: ["optical proximity correction", "High-NA EUV", "computational lithography", "pattern fidelity", "mask optimization"],
      citations: 8,
      journalTier: "tier2",
      publicationDate: "2025-03-15",
      doi: "10.1145/3876543.3896785",
      fullTextAvailable: true,
      relatedTo: [1, 2],
      internalNotes: "Directly relevant to our computational lithography group's development roadmap.",
      references: 29,
      keyFindings: [
        "Novel OPC algorithms reduce edge placement errors by 45% for High-NA specific patterns",
        "Computational efficiency improvements enable 3x faster mask optimization",
        "Integration with machine learning models improves pattern fidelity across process windows"
      ]
    },
    {
      id: 7,
      title: "Semiconductor Manufacturing Equipment: Competitive Landscape Analysis 2025",
      authors: ["Tech Market Advisors"],
      journal: "Industry Analysis Report",
      year: 2025,
      category: "Industry Reports",
      abstract: "This report provides a detailed competitive landscape analysis of the semiconductor manufacturing equipment industry in 2025. We examine market shares, technological capabilities, R&D investments, and strategic positioning of key players, with particular focus on the EUV lithography segment dominated by ASML.",
      keywords: ["competitive analysis", "market share", "semiconductor equipment", "strategic positioning", "industry landscape"],
      citations: 31,
      journalTier: "tier2",
      publicationDate: "2025-02-05",
      doi: null,
      fullTextAvailable: true,
      relatedTo: [4],
      internalNotes: "Good competitive intelligence. Confirms our market leadership but identifies areas where competitors are investing.",
      references: 18,
      keyFindings: [
        "ASML maintains 92% market share in EUV lithography segment",
        "Competitors focusing on complementary technologies rather than direct EUV competition",
        "Growing strategic partnerships between equipment vendors and advanced foundries"
      ]
    },
    {
      id: 8,
      title: "Method and Apparatus for Improved EUV Source Power Stability",
      authors: ["van Leeuwen, M.", "Thompson, S.", "Yamada, H."],
      journal: "US Patent Office",
      year: 2024,
      category: "Patents",
      abstract: "This patent describes a novel method and apparatus for improving EUV source power stability in lithography systems. The invention addresses one of the key challenges in EUV lithography by providing a more consistent and reliable power source, enhancing system throughput and reducing downtime in semiconductor manufacturing environments.",
      keywords: ["EUV source", "power stability", "lithography", "patent", "throughput enhancement"],
      citations: 5,
      journalTier: "tier3",
      publicationDate: "2024-05-12",
      doi: null,
      fullTextAvailable: true,
      relatedTo: [1, 3],
      internalNotes: "Key patent in our IP portfolio. Provides significant competitive advantage in EUV source technology.",
      references: 14,
      keyFindings: [
        "Novel feedback control system improves EUV source stability by 40%",
        "Reduces power fluctuations to less than 0.5% over 24-hour operation",
        "Compatible with existing EUV source designs with minimal modification"
      ]
    },
    {
      id: 9,
      title: "Extended Reality Interfaces for Remote Lithography System Maintenance",
      authors: ["Martinez, C.", "van den Berg, F.", "Kumar, A."],
      journal: "IEEE Transactions on Semiconductor Manufacturing",
      year: 2024,
      category: "Academic Papers",
      abstract: "This paper explores the implementation of extended reality (XR) interfaces for remote maintenance of lithography systems. We present a framework combining augmented reality, IoT sensors, and expert systems to enable effective remote diagnostics and guided maintenance procedures, reducing system downtime and service costs.",
      keywords: ["extended reality", "remote maintenance", "lithography systems", "augmented reality", "service optimization"],
      citations: 14,
      journalTier: "tier1",
      publicationDate: "2024-11-18",
      doi: "10.1109/TSM.2024.3301456",
      fullTextAvailable: false,
      relatedTo: [],
      internalNotes: "Aligns with our service innovation initiatives. Could significantly reduce field service costs.",
      references: 27,
      keyFindings: [
        "XR-guided maintenance reduces average repair time by 32%",
        "Remote expert assistance improves first-time fix rate by 45%",
        "System learns from maintenance history to suggest preventive actions"
      ]
    },
    {
      id: 10,
      title: "Next-Generation Semiconductor Manufacturing: ASML's Vision for 2030",
      authors: ["ASML Technology Research"],
      journal: "ASML White Paper",
      year: 2025,
      category: "ASML Whitepapers",
      abstract: "This white paper outlines ASML's strategic vision for semiconductor manufacturing technology through 2030. We discuss the evolution of EUV lithography, including High-NA systems, computational techniques, and holistic fab solutions that will enable the semiconductor industry to continue scaling according to Moore's Law beyond the 1nm node.",
      keywords: ["technology roadmap", "EUV", "High-NA", "semiconductor manufacturing", "Moore's Law"],
      citations: 26,
      journalTier: "tier1",
      publicationDate: "2025-01-25",
      doi: null,
      fullTextAvailable: true,
      relatedTo: [1, 5],
      internalNotes: "Our flagship vision document. Useful for customer education and technology planning discussions.",
      references: 38,
      keyFindings: [
        "Outlines technology roadmap enabling semiconductor scaling to 2030 and beyond",
        "Presents integrated approach combining hardware, software, and services",
        "Addresses key challenges including power, performance, area, and cost optimization"
      ]
    }
  ];

  // Filter publications based on search and category
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle publication selection
  const handlePublicationClick = (publication) => {
    setSelectedPublication(publication);
    setSelectedTab('overview');
  };

  // Close publication details modal
  const closePublicationDetails = () => {
    setSelectedPublication(null);
  };

  // Toggle save status
  const toggleSave = (id, event) => {
    event.stopPropagation();
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  // Get related publications
  const getRelatedPublications = (relatedIds) => {
    return publications.filter(pub => relatedIds.includes(pub.id));
  };

  // Format author list with proper citation style
  const formatAuthors = (authors) => {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
  };

  // Format citation for copying
  const formatCitation = (pub) => {
    return `${formatAuthors(pub.authors)} (${pub.year}). "${pub.title}". ${pub.journal}. ${pub.doi ? `DOI: ${pub.doi}` : ''}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Literature Review</h1>
        </div>
        
        <p className="text-gray-400 mb-8">
          Browse and analyze key publications related to ASML lithography technology and semiconductor manufacturing
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
                  <ListFilter size={16} className="mr-2 text-gray-500" />
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
            Showing {filteredPublications.length} of {publications.length} publications
          </p>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={14} className="mr-1" />
            <span>Last updated: Today at 10:23 AM</span>
          </div>
        </div>
        
        {/* Publications Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map(publication => (
              <div 
                key={publication.id} 
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors h-full flex flex-col"
                onClick={() => handlePublicationClick(publication)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow pr-2">
                    <h3 className="font-medium text-lg leading-tight">{publication.title}</h3>
                  </div>
                  <button 
                    className={`flex-shrink-0 p-1 rounded-full ${savedItems.includes(publication.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={(e) => toggleSave(publication.id, e)}
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-400 mb-2">
                  {formatAuthors(publication.authors)}
                </p>
                
                <p className="text-xs text-gray-500 mb-3 flex items-center">
                  <BookOpen size={12} className="mr-1" /> {publication.journal}, {publication.year}
                </p>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {publication.abstract}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {publication.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="bg-gray-700 text-purple-300 text-xs rounded-full px-2 py-1">
                      {keyword}
                    </span>
                  ))}
                  {publication.keywords.length > 3 && (
                    <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-2 py-1">
                      +{publication.keywords.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-400">
                      <Calendar size={12} className="mr-1" />
                      <span>{publication.publicationDate}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <BarChart2 size={12} className="mr-1" />
                      <span>{publication.citations} citations</span>
                    </div>
                    <div className={`flex items-center ${journalTiers[publication.journalTier].color}`}>
                      {journalTiers[publication.journalTier].icon}
                      <span>{journalTiers[publication.journalTier].label} Journal</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      {publication.fullTextAvailable ? (
                        <div className="flex items-center text-green-400">
                          <Check size={12} className="mr-1" />
                          <span>Full text available</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <CircleSlash size={12} className="mr-1" />
                          <span>Abstract only</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Publications List */}
        {viewMode === 'list' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-750">
              <div className="col-span-6 text-sm font-medium text-gray-400">Publication</div>
              <div className="col-span-2 text-sm font-medium text-gray-400">Journal/Source</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Year</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Citations</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Category</div>
              <div className="col-span-1 text-sm font-medium text-gray-400">Actions</div>
            </div>
            
            {filteredPublications.map(publication => (
              <div 
                key={publication.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => handlePublicationClick(publication)}
              >
                <div className="col-span-6">
                  <div className="flex items-start">
                    <div>
                      <h3 className="font-medium line-clamp-2">{publication.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{formatAuthors(publication.authors)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-400 line-clamp-2">
                  {publication.journal}
                </div>
                <div className="col-span-1 flex items-center text-sm text-gray-400">
                  {publication.year}
                </div>
                <div className="col-span-1 flex items-center text-sm">
                  <span className="flex items-center text-gray-400">
                    <BarChart2 size={14} className="mr-1" />
                    {publication.citations}
                  </span>
                </div>
                <div className="col-span-1 flex items-center text-sm text-gray-400">
                  {publication.category.split(' ')[0]}
                </div>
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <button 
                    className={`p-1 rounded-full ${savedItems.includes(publication.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                    onClick={(e) => toggleSave(publication.id, e)}
                  >
                    <Bookmark size={16} />
                  </button>
                  {publication.fullTextAvailable && (
                    <button className="p-1 rounded-full text-purple-400 hover:text-purple-300">
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Publication Detail Modal */}
        {selectedPublication && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg w-full max-w-5xl max-h-screen overflow-auto">
              <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-start p-6">
                  <div className="flex-grow pr-4">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedPublication.category === "Academic Papers" ? "bg-blue-900 text-blue-300" :
                        selectedPublication.category === "Conference Proceedings" ? "bg-green-900 text-green-300" :
                        selectedPublication.category === "Patents" ? "bg-yellow-900 text-yellow-300" :
                        selectedPublication.category === "ASML Whitepapers" ? "bg-purple-900 text-purple-300" :
                        "bg-gray-700 text-gray-300"
                      } mr-2`}>
                        {selectedPublication.category}
                      </span>
                      <span className={`flex items-center text-xs ${journalTiers[selectedPublication.journalTier].color}`}>
                        {journalTiers[selectedPublication.journalTier].icon}
                        {journalTiers[selectedPublication.journalTier].label} Journal
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{selectedPublication.title}</h2>
                    <p className="text-gray-400 text-sm">
                      {formatAuthors(selectedPublication.authors)} • {selectedPublication.journal} • {selectedPublication.year}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className={`p-2 rounded-full ${savedItems.includes(selectedPublication.id) ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                      onClick={(e) => toggleSave(selectedPublication.id, e)}
                    >
                      <Bookmark size={20} />
                    </button>
                    <button onClick={closePublicationDetails} className="p-2 rounded-full text-gray-500 hover:text-gray-300">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${selectedTab === 'overview' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setSelectedTab('overview')}
                  >
                    <Info size={16} className="inline mr-2" />
                    Overview
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${selectedTab === 'findings' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setSelectedTab('findings')}
                  >
                    <Zap size={16} className="inline mr-2" />
                    Key Findings
                  </button>
                  <button 
                    className={`px-6 py-3 font-medium text-sm ${selectedTab === 'related' 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-400 hover:text-gray-300'}`}
                    onClick={() => setSelectedTab('related')}
                  >
                    <BookMarked size={16} className="inline mr-2" />
                    Related Literature
                  </button>
                </div>
              </div>
              
              {/* Content based on selected tab */}
              <div className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Abstract */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Abstract</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedPublication.abstract}
                      </p>
                    </div>
                    
                    {/* Keywords and metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <h3 className="text-lg font-medium mb-3">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPublication.keywords.map((keyword, index) => (
                            <span key={index} className="bg-gray-800 text-purple-300 rounded-full px-3 py-1 text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Metrics</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Citations:</span>
                              <span className="font-medium">{selectedPublication.citations}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">References:</span>
                              <span className="font-medium">{selectedPublication.references}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Published:</span>
                              <span className="font-medium">{selectedPublication.publicationDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Full Text:</span>
                              <span className={selectedPublication.fullTextAvailable ? "text-green-400" : "text-red-400"}>
                                {selectedPublication.fullTextAvailable ? "Available" : "Not Available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Internal Notes */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Internal Notes</h3>
                      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-600">
                        <p className="text-gray-300 italic">
                          {selectedPublication.internalNotes}
                        </p>
                      </div>
                    </div>
                    
                    {/* Citation */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Citation</h3>
                      <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 flex justify-between items-center">
                        <div className="overflow-x-auto pr-4">
                          {formatCitation(selectedPublication)}
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 p-2">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t border-gray-700">
                      <div className="flex space-x-3">
                        {selectedPublication.fullTextAvailable && (
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                            <Download size={16} className="mr-2" />
                            Download PDF
                          </button>
                        )}
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center">
                          <ExternalLink size={16} className="mr-2" />
                          View Original Source
                        </button>
                      </div>
                      <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
                        <Edit size={16} className="mr-2" />
                        Add to Project
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'findings' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Key Findings and Insights</h3>
                    <div className="space-y-4">
                      {selectedPublication.keyFindings.map((finding, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-600">
                          <p className="text-gray-300">
                            {finding}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Significance section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Significance to ASML Research</h3>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <p className="text-gray-300 mb-4">
                          This publication provides significant insights into {selectedPublication.keywords[0]} and {selectedPublication.keywords[1]}, 
                          which directly informs our approach to {selectedPublication.category === "Patents" ? "intellectual property strategy" : "technology development"}.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-purple-400 font-medium mb-2 flex items-center">
                              <Zap size={16} className="mr-2" />
                              Technology Impact
                            </h4>
                            <p className="text-gray-300 text-sm">
                              Advances described in this publication could enhance our {selectedPublication.keywords[2]} capabilities, 
                              potentially leading to improved performance in next-generation systems.
                            </p>
                          </div>
                          <div className="bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                              <BarChart2 size={16} className="mr-2" />
                              Market Relevance
                            </h4>
                            <p className="text-gray-300 text-sm">
                              With {selectedPublication.citations} citations, this work demonstrates significant interest 
                              in {selectedPublication.keywords[0]}, aligning with our strategic market priorities.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'related' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Related Literature</h3>
                    {selectedPublication.relatedTo.length > 0 ? (
                      <div className="space-y-4">
                        {getRelatedPublications(selectedPublication.relatedTo).map(related => (
                          <div 
                            key={related.id} 
                            className="bg-gray-800 rounded-lg p-4 hover:border-purple-500 border border-gray-700 cursor-pointer"
                            onClick={() => handlePublicationClick(related)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium mb-1">{related.title}</h4>
                                <p className="text-sm text-gray-400">{formatAuthors(related.authors)} • {related.journal} • {related.year}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-gray-700 rounded-full px-2 py-1">
                                  {related.category.split(' ')[0]}
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
                        <p className="text-gray-400">No related literature found for this publication.</p>
                      </div>
                    )}
                    
                    {/* Citation Network Visualization */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Citation Network</h3>
                      <div className="bg-gray-800 rounded-lg p-4 text-center h-64 flex items-center justify-center">
                        <p className="text-gray-400">
                          Citation network visualization would be displayed here in a full implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiteratureReviewComponent;