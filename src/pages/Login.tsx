import React, { useState, useEffect, useRef } from 'react';
// Import all necessary icons from lucide-react used by BOTH sidebars and the App/Login components
import {
    Home, FileText, Database, Settings, Key, BookOpen, Activity, ChevronDown,
    ChevronRight, Search, Layers, LayoutDashboard, ClipboardList, Users, Calendar,
    BarChart, LineChart, Kanban, GitBranch, Briefcase, FileSpreadsheet, BookMarked,
    Lightbulb, Beaker, Microscope, ArrowUpDown, ListChecks, PanelTop, Gauge, Workflow,
    Table, Radar, BarChart2, BarChart3, PieChart, Cylinder, UploadCloud, Library,
    Files, Archive, Share2, Network, Target, FileCheck, Filter, Bell, Calculator, Bug,
    BadgeCheck, Clock, Hourglass, Award, GraduationCap, SquareStack, Cpu, Server,
    Braces, Atom, Box, Zap, Ship, Truck, Thermometer, Warehouse, Landmark, Building,
    DollarSign, Receipt, ShoppingCart, Tag, Package, Boxes, ArrowRightLeft, Route,
    ShieldCheck, FlaskConical, Ruler, Building2, Wrench, LogOut, User, ClipboardCheck,
    BrainCircuit, AlertTriangle // Added AlertTriangle for error display
} from "lucide-react";

// --- Mock UI Components (Assume these are available) ---
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className={`border border-gray-600 bg-[#2a2a2a] text-white px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`} {...props} />
);
const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
        {children}
    </button>
);

// --- Interfaces (NavItem, SectionProps, LeftSidebarProps) ---
interface NavItem { id: string; name: string; icon: React.ReactNode; active?: boolean; badge?: string | number; badgeColor?: string; subItems?: NavItem[]; }
interface SectionData { title: string; items: NavItem[]; }
interface SectionProps extends SectionData { onItemClick: (id: string) => void; activeTab: string; expanded?: boolean; }
interface LeftSidebarProps { activeTab: string; onTabChange: (tab: string) => void; username?: string; }

// --- D3 Variable ---
// Assign window.d3 to a variable. It will be undefined if the script isn't loaded.
const d3 = (window as any).d3;

// --- SidebarSection Component ---
// Renders a collapsible section with navigation items (No changes)
const SidebarSection: React.FC<SectionProps> = ({ title, items, onItemClick, activeTab, expanded: initialSectionExpanded = true }) => {
    const [isSectionExpanded, setIsSectionExpanded] = useState(initialSectionExpanded);
    const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
    useEffect(() => { const newExpandedParents: Record<string, boolean> = {}; let sectionShouldExpand = false; items.forEach(item => { const isItemActive = item.id === activeTab; const isChildActive = item.subItems?.some(sub => sub.id === activeTab); if (isChildActive) { newExpandedParents[item.id] = true; sectionShouldExpand = true; } if (isItemActive || isChildActive) { sectionShouldExpand = true; } }); setExpandedParents(prev => ({ ...prev, ...newExpandedParents })); const isActiveInSection = items.some(item => item.id === activeTab || item.subItems?.some(sub => sub.id === activeTab)); if (isActiveInSection) { setIsSectionExpanded(true); } }, [activeTab, items]);
    const handleParentToggle = (itemId: string) => { setExpandedParents(prev => ({ ...prev, [itemId]: !prev[itemId] })); };
    const renderNavItem = (item: NavItem, isSubItem: boolean = false) => { const hasSubItems = item.subItems && item.subItems.length > 0; const isParentExpanded = expandedParents[item.id]; const isEffectivelyActive = item.id === activeTab || (hasSubItems && item.subItems?.some(sub => sub.id === activeTab)); return ( <React.Fragment key={item.id}><div className={`flex items-center w-full px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors group ${isSubItem ? 'pl-8' : 'pl-2'} ${isEffectivelyActive ? "bg-blue-600/20 text-blue-400" : "text-[#aaa] hover:bg-[#2a2a2a]"}`} onClick={() => hasSubItems && !isSubItem ? handleParentToggle(item.id) : onItemClick(item.id)}><span className="mr-2 flex-shrink-0 w-4 h-4">{item.icon}</span><span className="flex-1 truncate">{item.name}</span>{hasSubItems && !isSubItem && ( <span className="ml-auto pr-1 flex-shrink-0" onClick={(e) => { e.stopPropagation(); handleParentToggle(item.id); }}>{isParentExpanded ? <ChevronDown className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" /> : <ChevronRight className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" />}</span> )}{!hasSubItems && item.badge && ( <span className={`flex-shrink-0 ${item.badgeColor || "bg-gray-500"} text-white text-xs px-1.5 py-0.5 rounded-full ml-2`}>{item.badge}</span> )}</div>{hasSubItems && isParentExpanded && ( <div className="mt-1 space-y-1">{item.subItems?.map(subItem => renderNavItem(subItem, true))}</div> )}</React.Fragment> ); };
    return ( <div className="mb-4"><div className="flex items-center px-3 py-1 cursor-pointer" onClick={() => setIsSectionExpanded(!isSectionExpanded)}>{isSectionExpanded ? <ChevronDown className="h-3.5 w-3.5 text-[#666] mr-1.5 flex-shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-[#666] mr-1.5 flex-shrink-0" />}<span className="text-xs font-medium uppercase tracking-wider text-[#666]">{title}</span></div>{isSectionExpanded && <div className="mt-1.5 space-y-1 px-2">{items.map(item => renderNavItem(item))}</div>}</div> );
};

// --- UserProfile Component ---
// Displays user information (No changes)
const UserProfile: React.FC<{ username?: string }> = ({ username = "User" }) => ( <div className="border-t border-[#363636] p-3 mt-auto flex-shrink-0"><div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2 overflow-hidden"><div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">{username.charAt(0).toUpperCase()}</div><div className="flex flex-col overflow-hidden"><span className="text-[#eee] truncate">{username}</span><span className="text-xs text-[#888] truncate">{username === 'user1' ? 'Fish Importer' : 'Data Analyst'}</span></div></div></div></div> );

// --- LeftSidebar Component (Fish Import) ---
// Sidebar for user1 (No changes)
const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab, onTabChange, username }) => {
    const dashboardItems: NavItem[] = [ { id: "overview-dashboard", name: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> }, { id: "alerts", name: "Alerts & Notifications", icon: <Bell className="h-4 w-4" /> }, { id: "tasks", name: "My Tasks", icon: <ListChecks className="h-4 w-4" /> }, ]; const sourcingItems: NavItem[] = [ { id: "suppliers", name: "Suppliers", icon: <Building className="h-4 w-4" /> }, { id: "contracts", name: "Contracts", icon: <FileText className="h-4 w-4" /> }, { id: "sourcing-requests", name: "Sourcing Requests", icon: <Search className="h-4 w-4" /> }, { id: "market-prices", name: "Market Prices", icon: <DollarSign className="h-4 w-4" /> }, ]; const logisticsItems: NavItem[] = [ { id: "shipments", name: "Shipments", icon: <Ship className="h-4 w-4" /> }, { id: "customs", name: "Customs Declarations", icon: <Landmark className="h-4 w-4" /> }, { id: "logistics-partners", name: "Logistics Partners", icon: <Workflow className="h-4 w-4" /> }, { id: "temperature-logs", name: "Temperature Monitoring", icon: <Thermometer className="h-4 w-4" /> }, { id: "import-documents", name: "Import Documents", icon: <Files className="h-4 w-4" /> }, ]; const inventoryItems: NavItem[] = [ { id: "stock-levels", name: "Stock Levels", icon: <Boxes className="h-4 w-4" /> }, { id: "warehouse-locations", name: "Warehouse Locations", icon: <Warehouse className="h-4 w-4" /> }, { id: "stock-transfers", name: "Stock Transfers", icon: <ArrowRightLeft className="h-4 w-4" /> }, { id: "stock-adjustments", name: "Stock Adjustments", icon: <Wrench className="h-4 w-4" /> }, ]; const qualityComplianceItems: NavItem[] = [ { id: "quality-control", name: "Quality Control (QC)", icon: <ClipboardCheck className="h-4 w-4" /> }, { id: "lab-results", name: "Lab Results", icon: <FlaskConical className="h-4 w-4" /> }, { id: "traceability", name: "Traceability", icon: <Route className="h-4 w-4" /> }, { id: "certifications", name: "Certifications", icon: <Award className="h-4 w-4" /> }, { id: "regulatory-info", name: "Regulatory Info", icon: <ShieldCheck className="h-4 w-4" /> }, ]; const salesItems: NavItem[] = [ { id: "customers", name: "Customers", icon: <Users className="h-4 w-4" /> }, { id: "sales-orders", name: "Sales Orders", icon: <ShoppingCart className="h-4 w-4" /> }, { id: "invoices", name: "Invoices", icon: <Receipt className="h-4 w-4" /> }, { id: "pricing", name: "Pricing Rules", icon: <Tag className="h-4 w-4" /> }, ]; const reportingItems: NavItem[] = [ { id: "sales-reports", name: "Sales Reports", icon: <BarChart className="h-4 w-4" /> }, { id: "inventory-reports", name: "Inventory Reports", icon: <PieChart className="h-4 w-4" /> }, { id: "import-performance", name: "Import Performance", icon: <LineChart className="h-4 w-4" /> }, { id: "custom-reports", name: "Custom Reports", icon: <Table className="h-4 w-4" /> }, { id: "knowledge-graph", name: "Knowledge Graph", icon: <BrainCircuit className="h-4 w-4" /> }, ]; const masterDataItems: NavItem[] = [ { id: "products", name: "Products", icon: <Package className="h-4 w-4" /> }, { id: "species-db", name: "Species Database", icon: <Database className="h-4 w-4" /> }, { id: "units-measure", name: "Units of Measure", icon: <Ruler className="h-4 w-4" /> }, ]; const settingsItems: NavItem[] = [ { id: "user-management", name: "User Management", icon: <Users className="h-4 w-4" /> }, { id: "company-profile", name: "Company Profile", icon: <Building2 className="h-4 w-4" /> }, { id: "system-config", name: "System Configuration", icon: <Settings className="h-4 w-4" /> }, { id: "api-keys", name: "API Keys", icon: <Key className="h-4 w-4" /> }, ];
    return ( <div className="w-60 h-full bg-[#1a1a1a] border-r border-[#363636] flex flex-col overflow-hidden flex-shrink-0"><div className="h-12 border-b border-[#363636] px-4 flex items-center flex-shrink-0"><div className="flex items-center gap-2 overflow-hidden"><div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0"><Ship className="h-3.5 w-3.5 text-white" /></div><span className="font-medium text-[#eee] truncate">Fish Import Hub</span></div></div><div className="p-3 border-b border-[#363636] flex-shrink-0"><div className="flex items-center gap-2 p-2 bg-[#2a2a2a] rounded-md cursor-pointer hover:bg-[#333]"><div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white font-medium flex-shrink-0">FI</div><span className="text-[#eee] text-sm truncate">Your Company</span><ChevronDown className="h-4 w-4 text-[#888] ml-auto flex-shrink-0" /></div></div><div className="overflow-y-auto flex-1 custom-scrollbar py-4"><SidebarSection title="Dashboard" items={dashboardItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Sourcing & Procurement" items={sourcingItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Imports & Logistics" items={logisticsItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Inventory & Warehouse" items={inventoryItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Quality & Compliance" items={qualityComplianceItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Sales & Orders" items={salesItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Reporting" items={reportingItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Master Data" items={masterDataItems} onItemClick={onTabChange} activeTab={activeTab} expanded={false} /><SidebarSection title="Settings" items={settingsItems} onItemClick={onTabChange} activeTab={activeTab} expanded={false} /><div className="px-3 mt-4"><div className="relative"><Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" /><Input placeholder="Search..." className="h-8 pl-8 w-full" /></div></div></div><UserProfile username={username} /></div> );
};

// --- NewLeftbar Component (Placeholder) ---
// Sidebar for user2 (No changes)
const NewLeftbar: React.FC<LeftSidebarProps> = ({ activeTab, onTabChange, username }) => {
    const generalItems: NavItem[] = [ { id: "home", name: "Home", icon: <Home className="h-4 w-4" /> }, { id: "profile", name: "User Profile", icon: <User className="h-4 w-4" /> }, { id: "general-settings", name: "General Settings", icon: <Settings className="h-4 w-4" /> }, { id: "knowledge-graph", name: "Knowledge Graph", icon: <BrainCircuit className="h-4 w-4" /> }, ]; const dataItems: NavItem[] = [ { id: "data-view", name: "Data View", icon: <Database className="h-4 w-4" /> }, { id: "analytics", name: "Analytics", icon: <BarChart className="h-4 w-4" /> }, { id: "reports", name: "Reports", icon: <FileText className="h-4 w-4" /> }, ];
    return ( <div className="w-60 h-full bg-[#1f1f2e] border-r border-[#40405c] flex flex-col overflow-hidden flex-shrink-0"><div className="h-12 border-b border-[#40405c] px-4 flex items-center flex-shrink-0"><div className="flex items-center gap-2 overflow-hidden"><div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0"><Database className="h-3.5 w-3.5 text-white" /></div><span className="font-medium text-[#eee] truncate">Data Platform</span></div></div><div className="p-3 border-b border-[#40405c] flex-shrink-0"><div className="flex items-center gap-2 p-2 bg-[#2a2a3a] rounded-md cursor-pointer hover:bg-[#33334d]"><div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white font-medium flex-shrink-0">DP</div><span className="text-[#eee] text-sm truncate">Analytics Org</span><ChevronDown className="h-4 w-4 text-[#888] ml-auto flex-shrink-0" /></div></div><div className="overflow-y-auto flex-1 custom-scrollbar py-4"><SidebarSection title="General" items={generalItems} onItemClick={onTabChange} activeTab={activeTab} /><SidebarSection title="Data Tools" items={dataItems} onItemClick={onTabChange} activeTab={activeTab} /><div className="px-3 mt-4"><div className="relative"><Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" /><Input placeholder="Search Data..." className="h-8 pl-8 w-full bg-[#2a2a3a] border-[#555]" /></div></div></div><UserProfile username={username} /></div> );
};

// --- Login Component ---
// Renders the login form (No changes)
interface LoginProps { onLogin: (username: string) => void; errorMessage: string | null; }
const Login: React.FC<LoginProps> = ({ onLogin, errorMessage }) => { const [username, setUsername] = useState(''); const handleLoginSubmit = (event: React.FormEvent) => { event.preventDefault(); if (!username.trim()) return; onLogin(username.trim()); }; return ( <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"><form onSubmit={handleLoginSubmit} className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl border border-[#363636] w-full max-w-sm"><h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">Application Login</h2>{errorMessage && <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-md mb-4 text-sm text-center" role="alert">{errorMessage}</div>}<div className="mb-4"><label htmlFor="username" className="block text-sm font-medium text-[#aaa] mb-1">Username</label><Input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter 'user1' or 'user2'" className="w-full" aria-describedby="username-hint" required autoComplete="username" /><p id="username-hint" className="text-xs text-[#666] mt-1">(Demo: No password needed)</p></div><Button type="submit" className="w-full mt-2" disabled={!username.trim()}>Login</Button></form></div> ); };

// --- KnowledgeGraph Component (Updated Error Handling) ---
interface KnowledgeGraphProps { sections: SectionData[]; }
const transformNavItemsToGraphData = (sections: SectionData[]) => { const nodes: any[] = []; const links: any[] = []; const sectionColor = "#8b5cf6"; const itemColor = "#3b82f6"; const subItemColor = "#10b981"; sections.forEach((section, sectionIndex) => { const sectionId = `section-${section.title.replace(/\s+/g, '-')}`; nodes.push({ id: sectionId, name: section.title, type: 'section', color: sectionColor, radius: 12 }); const processItem = (item: NavItem, parentId: string | null, parentType: 'section' | 'item') => { nodes.push({ id: item.id, name: item.name, type: parentType === 'section' ? 'item' : 'subitem', color: parentType === 'section' ? itemColor : subItemColor, radius: parentType === 'section' ? 8 : 6 }); if (parentId) { links.push({ source: item.id, target: parentId }); } if (item.subItems && item.subItems.length > 0) { item.subItems.forEach(subItem => processItem(subItem, item.id, 'item')); } }; section.items.forEach(item => processItem(item, sectionId, 'section')); }); const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values()); return { nodes: uniqueNodes, links }; };

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ sections }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    // Memoize graph data generation
    const graphData = React.useMemo(() => {
        // Only generate graph data if d3 is available
        if (!d3) return null;
        return transformNavItemsToGraphData(sections);
    }, [sections]); // Dependency: sections array

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Effect to get container dimensions
    useEffect(() => {
        if (svgRef.current) {
            const parent = svgRef.current.parentElement;
            if (parent) {
                const updateDimensions = () => {
                    // Ensure dimensions are positive
                    setDimensions({
                        width: Math.max(parent.clientWidth, 10), // Minimum width
                        height: Math.max(parent.clientHeight, 10) // Minimum height
                    });
                };
                updateDimensions(); // Initial dimensions
                const resizeObserver = new ResizeObserver(updateDimensions);
                resizeObserver.observe(parent);
                // Fallback for window resize
                window.addEventListener('resize', updateDimensions);
                return () => {
                    resizeObserver.unobserve(parent);
                    window.removeEventListener('resize', updateDimensions);
                };
            }
        }
        return () => {};
    }, []);

    // Effect to run D3 simulation
    useEffect(() => {
        // Exit early if D3 isn't loaded, ref is null, data is null, or dimensions are invalid
        if (!d3 || !svgRef.current || !graphData || dimensions.width <= 0 || dimensions.height <= 0) {
            if (!d3) console.error("D3.js library not loaded. Required for Knowledge Graph.");
            return;
        }

        const { nodes, links } = graphData;
        const width = dimensions.width;
        const height = dimensions.height;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .style("max-width", "100%")
            .style("height", "auto")
            .style("display", "block"); // Ensure SVG takes block space

        svg.selectAll("*").remove(); // Clear previous elements

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60).strength(0.5))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("center", d3.forceCenter(0, 0))
            .force("collide", d3.forceCollide().radius((d: any) => d.radius + 5).strength(0.7));

        const graphContainer = svg.append("g");

        const link = graphContainer.append("g")
            .attr("stroke", "#555").attr("stroke-opacity", 0.6)
            .selectAll("line").data(links).join("line").attr("stroke-width", 1.5);

        const node = graphContainer.append("g")
            .attr("stroke", "#fff").attr("stroke-width", 0.5)
            .selectAll("circle").data(nodes).join("circle")
            .attr("r", (d: any) => d.radius).attr("fill", (d: any) => d.color)
            .call(drag(simulation) as any);

        node.append("title").text((d: any) => `${d.type}: ${d.name}`);

        simulation.on("tick", () => {
            link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
            node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
        });

        const zoom = d3.zoom().scaleExtent([0.3, 5]).on("zoom", (event: any) => {
            graphContainer.attr("transform", event.transform);
        });
        svg.call(zoom as any);

        function drag(simulationInstance: any) {
            function dragstarted(event: any, d: any) { if (!event.active) simulationInstance.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
            function dragged(event: any, d: any) { d.fx = event.x; d.fy = event.y; }
            function dragended(event: any, d: any) { if (!event.active) simulationInstance.alphaTarget(0); d.fx = null; d.fy = null; }
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }

        return () => { simulation.stop(); };

    }, [graphData, dimensions]); // Rerun effect if graphData or dimensions change

    // Render the SVG container or an error message if D3 is missing
    return (
        <div className="w-full h-full bg-[#2a2a2a] rounded-md overflow-hidden border border-gray-700">
            {/* Conditional Rendering based on D3 availability */}
            {!d3 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-red-400">
                    <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold mb-2">D3.js Library Not Found</h3>
                    <p className="text-sm text-gray-400">
                        The Knowledge Graph component requires the D3.js library.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Please add the following script tag to your main HTML file:
                    </p>
                    <code className="block bg-gray-700 px-2 py-1 rounded text-xs mt-2 text-yellow-300">
                        {'<script src="https://d3js.org/d3.v7.min.js"></script>'}
                    </code>
                </div>
            ) : (
                // Render SVG only if D3 is present
                <svg ref={svgRef}></svg>
            )}
        </div>
    );
};


// --- Main App Component ---
// Manages state and renders appropriate components (No changes in logic)
const App: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null); const [activeTab, setActiveTab] = useState<string>(''); const [loginError, setLoginError] = useState<string | null>(null);
    const user1Sections: SectionData[] = [ { title: "Dashboard", items: [ { id: "overview-dashboard", name: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> }, { id: "alerts", name: "Alerts & Notifications", icon: <Bell className="h-4 w-4" /> }, { id: "tasks", name: "My Tasks", icon: <ListChecks className="h-4 w-4" /> }, ] }, { title: "Sourcing & Procurement", items: [ { id: "suppliers", name: "Suppliers", icon: <Building className="h-4 w-4" /> }, { id: "contracts", name: "Contracts", icon: <FileText className="h-4 w-4" /> }, { id: "sourcing-requests", name: "Sourcing Requests", icon: <Search className="h-4 w-4" /> }, { id: "market-prices", name: "Market Prices", icon: <DollarSign className="h-4 w-4" /> }, ] }, { title: "Imports & Logistics", items: [ { id: "shipments", name: "Shipments", icon: <Ship className="h-4 w-4" /> }, { id: "customs", name: "Customs Declarations", icon: <Landmark className="h-4 w-4" /> }, { id: "logistics-partners", name: "Logistics Partners", icon: <Workflow className="h-4 w-4" /> }, { id: "temperature-logs", name: "Temperature Monitoring", icon: <Thermometer className="h-4 w-4" /> }, { id: "import-documents", name: "Import Documents", icon: <Files className="h-4 w-4" /> }, ] }, { title: "Inventory & Warehouse", items: [ { id: "stock-levels", name: "Stock Levels", icon: <Boxes className="h-4 w-4" /> }, { id: "warehouse-locations", name: "Warehouse Locations", icon: <Warehouse className="h-4 w-4" /> }, { id: "stock-transfers", name: "Stock Transfers", icon: <ArrowRightLeft className="h-4 w-4" /> }, { id: "stock-adjustments", name: "Stock Adjustments", icon: <Wrench className="h-4 w-4" /> }, ] }, { title: "Quality & Compliance", items: [ { id: "quality-control", name: "Quality Control (QC)", icon: <ClipboardCheck className="h-4 w-4" /> }, { id: "lab-results", name: "Lab Results", icon: <FlaskConical className="h-4 w-4" /> }, { id: "traceability", name: "Traceability", icon: <Route className="h-4 w-4" /> }, { id: "certifications", name: "Certifications", icon: <Award className="h-4 w-4" /> }, { id: "regulatory-info", name: "Regulatory Info", icon: <ShieldCheck className="h-4 w-4" /> }, ] }, { title: "Sales & Orders", items: [ { id: "customers", name: "Customers", icon: <Users className="h-4 w-4" /> }, { id: "sales-orders", name: "Sales Orders", icon: <ShoppingCart className="h-4 w-4" /> }, { id: "invoices", name: "Invoices", icon: <Receipt className="h-4 w-4" /> }, { id: "pricing", name: "Pricing Rules", icon: <Tag className="h-4 w-4" /> }, ] }, { title: "Reporting", items: [ { id: "sales-reports", name: "Sales Reports", icon: <BarChart className="h-4 w-4" /> }, { id: "inventory-reports", name: "Inventory Reports", icon: <PieChart className="h-4 w-4" /> }, { id: "import-performance", name: "Import Performance", icon: <LineChart className="h-4 w-4" /> }, { id: "custom-reports", name: "Custom Reports", icon: <Table className="h-4 w-4" /> }, { id: "knowledge-graph", name: "Knowledge Graph", icon: <BrainCircuit className="h-4 w-4" /> }, ] }, { title: "Master Data", items: [ { id: "products", name: "Products", icon: <Package className="h-4 w-4" /> }, { id: "species-db", name: "Species Database", icon: <Database className="h-4 w-4" /> }, { id: "units-measure", name: "Units of Measure", icon: <Ruler className="h-4 w-4" /> }, ] }, { title: "Settings", items: [ { id: "user-management", name: "User Management", icon: <Users className="h-4 w-4" /> }, { id: "company-profile", name: "Company Profile", icon: <Building2 className="h-4 w-4" /> }, { id: "system-config", name: "System Configuration", icon: <Settings className="h-4 w-4" /> }, { id: "api-keys", name: "API Keys", icon: <Key className="h-4 w-4" /> }, ] }, ];
    const user2Sections: SectionData[] = [ { title: "General", items: [ { id: "home", name: "Home", icon: <Home className="h-4 w-4" /> }, { id: "profile", name: "User Profile", icon: <User className="h-4 w-4" /> }, { id: "general-settings", name: "General Settings", icon: <Settings className="h-4 w-4" /> }, { id: "knowledge-graph", name: "Knowledge Graph", icon: <BrainCircuit className="h-4 w-4" /> }, ] }, { title: "Data Tools", items: [ { id: "data-view", name: "Data View", icon: <Database className="h-4 w-4" /> }, { id: "analytics", name: "Analytics", icon: <BarChart className="h-4 w-4" /> }, { id: "reports", name: "Reports", icon: <FileText className="h-4 w-4" /> }, ] }, ];
    const currentUserSections = loggedInUser === 'user1' ? user1Sections : (loggedInUser === 'user2' ? user2Sections : []);
    const handleLogin = (username: string) => { const lowerCaseUsername = username.toLowerCase().trim(); if (lowerCaseUsername === 'user1') { setLoggedInUser('user1'); setActiveTab('overview-dashboard'); setLoginError(null); } else if (lowerCaseUsername === 'user2') { setLoggedInUser('user2'); setActiveTab('home'); setLoginError(null); } else { setLoggedInUser(null); setLoginError("Invalid username. Please use 'user1' or 'user2'."); } };
    const handleLogout = () => { setLoggedInUser(null); setActiveTab(''); setLoginError(null); };
    const handleTabChange = (tabId: string) => { setActiveTab(tabId); console.log("Active tab changed to:", tabId); };
    if (!loggedInUser) { return <Login onLogin={handleLogin} errorMessage={loginError} />; }
    return ( <div className="flex h-screen bg-[#222] text-white">{loggedInUser === 'user1' && <LeftSidebar activeTab={activeTab} onTabChange={handleTabChange} username={loggedInUser} />}{loggedInUser === 'user2' && <NewLeftbar activeTab={activeTab} onTabChange={handleTabChange} username={loggedInUser} />}<div className="flex-1 flex flex-col overflow-hidden"><header className="bg-[#1a1a1a] h-12 border-b border-[#363636] flex items-center justify-between px-6 flex-shrink-0"><h1 className="text-lg font-semibold truncate">{activeTab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Welcome"}</h1><Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 flex items-center gap-1.5 text-xs px-3 py-1"><LogOut className="h-3.5 w-3.5" /> Logout</Button></header><main className="flex-1 overflow-y-auto p-6 bg-[#2d2d2d]">{activeTab === 'knowledge-graph' ? ( <> <h2 className="text-xl mb-4">Knowledge Graph ({loggedInUser})</h2> <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#444] h-[calc(100%-50px)]"> <KnowledgeGraph sections={currentUserSections} /> </div> </> ) : ( <> <h2 className="text-xl mb-4">Content Area</h2> <p className="mb-4">Current View: <strong className="text-blue-300">{activeTab || 'None Selected'}</strong></p> <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#444] min-h-[200px]">{activeTab === 'overview-dashboard' && <p>Displaying User 1's Overview Dashboard...</p>}{activeTab === 'shipments' && <p>Displaying Fish Import Shipments List...</p>}{activeTab === 'suppliers' && <p>Displaying Supplier Details...</p>}{activeTab === 'home' && <p>Displaying User 2's Home Screen...</p>}{activeTab === 'analytics' && <p>Displaying Data Platform Analytics...</p>}{!activeTab && <p>Select an item from the sidebar to view content.</p>}{activeTab === 'tasks' && <p>Displaying User 1's Tasks...</p>}{activeTab === 'data-view' && <p>Displaying User 2's Data View...</p>}</div> </> )}</main></div></div> );
};

export default App;
