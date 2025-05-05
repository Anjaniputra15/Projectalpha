import React, { useState, useEffect } from "react";
import {
    // Core Icons (some reused)
    Home,
    FileText,
    Database,
    Settings,
    Key,
    BookOpen,
    Activity,
    ChevronDown,
    ChevronRight,
    Search,
    LayoutDashboard,
    ClipboardList,
    Award,  
    Users, // For Customers/Suppliers/Users
    Calendar,
    BarChart, // For Reports
    LineChart, // For Reports
    PieChart, // For Reports
    UploadCloud,
    ClipboardCheck,
    Files,
    Archive,
    Share2,
    Network, // For Logistics Partners
    Target,
    Filter,
    Bell, // For Alerts
    Calculator,
    BadgeCheck, // For Quality/Compliance
    Clock,
    ListChecks, // For Tasks/Checks
    Workflow, // For Processes/Partners
    Table, // For Data/Reports
    Gauge, // For KPIs
    Briefcase, // For Budget/Finance
    Box, // Generic Item/Package
    Boxes, // For Inventory
    Truck, // For Logistics
    Ship, // For Logistics
    Thermometer, // For Temperature
    Warehouse, // For Inventory
    Landmark, // For Customs/Ports
    Building, // For Suppliers/Companies
    DollarSign, // For Pricing/Costs
    Receipt, // For Invoices
    ShoppingCart, // For Orders
    Tag, // For Pricing/Products
    Package, // Using as proxy for Product/Fish
    ArrowRightLeft, // For Transfers
    Route, // For Traceability
    ShieldCheck, // For Compliance/Safety
    FlaskConical, // For Lab Tests
    BookMarked, // For Documents/References
    Ruler, // For Units of Measure
    Building2, // For Company Profile
    Wrench // For Adjustments/Maintenance
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Same NavItem Interface ---
interface NavItem {
    id: string;
    name: string;
    icon: React.ReactNode;
    active?: boolean;
    badge?: string | number;
    badgeColor?: string;
    subItems?: NavItem[];
}

// --- Same SectionProps Interface ---
interface SectionProps {
    title: string;
    items: NavItem[];
    onItemClick: (id: string) => void;
    activeTab: string;
    expanded?: boolean;
}

// --- Same LeftSidebarProps Interface ---
interface LeftSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    // You might want specific props relevant to fish import, like pending alerts count
    // Example: pendingAlerts?: number;
}

// --- Same SidebarSection Component (No changes needed in its logic) ---
const SidebarSection: React.FC<SectionProps> = ({
    title,
    items,
    onItemClick,
    activeTab,
    expanded: initialSectionExpanded = true
}) => {
    const [isSectionExpanded, setIsSectionExpanded] = useState(initialSectionExpanded);
    const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const newExpandedParents: Record<string, boolean> = {};
        items.forEach(item => {
            if (item.subItems?.some(sub => sub.id === activeTab)) {
                newExpandedParents[item.id] = true;
            }
        });
        setExpandedParents(prev => ({ ...prev, ...newExpandedParents }));
    }, [activeTab, items]);


    const handleParentToggle = (itemId: string) => {
        setExpandedParents(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const renderNavItem = (item: NavItem, isSubItem: boolean = false) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isParentExpanded = expandedParents[item.id];
        const isEffectivelyActive = item.active || (hasSubItems && item.subItems.some(sub => sub.active));

        return (
            <React.Fragment key={item.id}>
                <div
                    className={`flex items-center w-full px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors group ${isSubItem ? 'pl-8' : 'pl-2'} ${
                        isEffectivelyActive
                            ? "bg-blue-600/20 text-blue-400" // Adjusted active color slightly
                            : "text-[#aaa] hover:bg-[#2a2a2a]"
                        }`}
                    onClick={() => !hasSubItems || isSubItem ? onItemClick(item.id) : handleParentToggle(item.id)}
                >
                    <span className="mr-2">{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>

                    {hasSubItems && (
                        <span
                            className="ml-auto pr-1"
                            onClick={(e) => { e.stopPropagation(); handleParentToggle(item.id); }}
                        >
                            {isParentExpanded ? (
                                <ChevronDown className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5 text-[#888] group-hover:text-[#ccc]" />
                            )}
                        </span>
                    )}

                    {!hasSubItems && item.badge && (
                        <span className={`${item.badgeColor || "bg-gray-500"} text-white text-xs px-1.5 py-0.5 rounded-full ml-2`}>
                            {item.badge}
                        </span>
                    )}
                </div>

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

            {isSectionExpanded && (
                <div className="mt-1.5 space-y-1 px-2">
                    {items.map(item => renderNavItem(item))}
                </div>
            )}
        </div>
    );
};

// --- Same UserProfile Component (No changes needed) ---
const UserProfile: React.FC = () => {
    return (
        <div className="border-t border-[#363636] p-3">
            {/* ... UserProfile content ... */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        U {/* Placeholder Initial */}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#eee]">User Name</span> {/* Placeholder */}
                        <span className="text-xs text-[#888]">Importer Role</span> {/* Placeholder */}
                    </div>
                </div>
                <ChevronDown className="h-4 w-4 text-[#888]" />
            </div>
        </div>
    );
};


// --- Main LeftSidebar component - PERSONALIZED FOR FISH IMPORT ---
export const LeftSidebar: React.FC<LeftSidebarProps> = ({
    activeTab,
    onTabChange,
    // Example: pendingAlerts = 0 // Add specific props if needed
}) => {

    // --- DASHBOARD Section ---
    const dashboardItems: NavItem[] = [
        {
            id: "overview-dashboard",
            name: "Overview",
            icon: <LayoutDashboard className="h-4 w-4" />,
            active: activeTab === "overview-dashboard"
        },
        {
            id: "alerts",
            name: "Alerts & Notifications",
            icon: <Bell className="h-4 w-4" />,
            active: activeTab === "alerts",
            // badge: pendingAlerts || undefined, // Example using a prop
            // badgeColor: "bg-red-500"
        },
        {
            id: "tasks",
            name: "My Tasks",
            icon: <ListChecks className="h-4 w-4" />,
            active: activeTab === "tasks"
        },
    ];

    // --- SOURCING & PROCUREMENT Section ---
    const sourcingItems: NavItem[] = [
        {
            id: "suppliers",
            name: "Suppliers",
            icon: <Building className="h-4 w-4" />,
            active: activeTab === "suppliers"
        },
        {
            id: "contracts",
            name: "Contracts",
            icon: <FileText className="h-4 w-4" />,
            active: activeTab === "contracts"
        },
        {
            id: "sourcing-requests",
            name: "Sourcing Requests",
            icon: <Search className="h-4 w-4" />,
            active: activeTab === "sourcing-requests"
        },
         {
            id: "market-prices",
            name: "Market Prices",
            icon: <DollarSign className="h-4 w-4" />,
            active: activeTab === "market-prices"
        },
    ];

    // --- IMPORTS & LOGISTICS Section ---
    const logisticsItems: NavItem[] = [
        {
            id: "shipments",
            name: "Shipments",
            icon: <Ship className="h-4 w-4" />,
            active: activeTab === "shipments" || activeTab.startsWith("shipment-detail-") // Example for detail view
        },
        {
            id: "customs",
            name: "Customs Declarations",
            icon: <Landmark className="h-4 w-4" />,
            active: activeTab === "customs"
        },
        {
            id: "logistics-partners",
            name: "Logistics Partners",
            icon: <Workflow className="h-4 w-4" />,
            active: activeTab === "logistics-partners"
        },
        {
            id: "temperature-logs",
            name: "Temperature Monitoring",
            icon: <Thermometer className="h-4 w-4" />,
            active: activeTab === "temperature-logs"
        },
        {
             id: "import-documents",
             name: "Import Documents",
             icon: <Files className="h-4 w-4" />,
             active: activeTab === "import-documents" // Could add sub-items later
        },
    ];

    // --- INVENTORY & WAREHOUSE Section ---
    const inventoryItems: NavItem[] = [
        {
            id: "stock-levels",
            name: "Stock Levels",
            icon: <Boxes className="h-4 w-4" />,
            active: activeTab === "stock-levels"
        },
        {
            id: "warehouse-locations",
            name: "Warehouse Locations",
            icon: <Warehouse className="h-4 w-4" />,
            active: activeTab === "warehouse-locations"
        },
        {
            id: "stock-transfers",
            name: "Stock Transfers",
            icon: <ArrowRightLeft className="h-4 w-4" />,
            active: activeTab === "stock-transfers"
        },
        {
            id: "stock-adjustments",
            name: "Stock Adjustments",
            icon: <Wrench className="h-4 w-4" />,
            active: activeTab === "stock-adjustments"
        },
    ];

    // --- QUALITY & COMPLIANCE Section ---
    const qualityComplianceItems: NavItem[] = [
        {
            id: "quality-control",
            name: "Quality Control (QC)",
            icon: <ClipboardCheck className="h-4 w-4" />, // Using ClipboardCheck
            active: activeTab === "quality-control"
        },
        {
            id: "lab-results",
            name: "Lab Results",
            icon: <FlaskConical className="h-4 w-4" />,
            active: activeTab === "lab-results"
        },
        {
            id: "traceability",
            name: "Traceability",
            icon: <Route className="h-4 w-4" />,
            active: activeTab === "traceability"
        },
        {
            id: "certifications",
            name: "Certifications",
            icon: <Award className="h-4 w-4" />,
            active: activeTab === "certifications"
        },
        {
            id: "regulatory-info",
            name: "Regulatory Info",
            icon: <ShieldCheck className="h-4 w-4" />,
            active: activeTab === "regulatory-info"
        },
    ];

     // --- SALES & ORDERS Section ---
    const salesItems: NavItem[] = [
        {
            id: "customers",
            name: "Customers",
            icon: <Users className="h-4 w-4" />,
            active: activeTab === "customers"
        },
        {
            id: "sales-orders",
            name: "Sales Orders",
            icon: <ShoppingCart className="h-4 w-4" />,
            active: activeTab === "sales-orders"
        },
        {
            id: "invoices",
            name: "Invoices",
            icon: <Receipt className="h-4 w-4" />,
            active: activeTab === "invoices"
        },
        {
            id: "pricing",
            name: "Pricing Rules",
            icon: <Tag className="h-4 w-4" />,
            active: activeTab === "pricing"
        },
    ];

    // --- REPORTING Section ---
    const reportingItems: NavItem[] = [
        {
            id: "sales-reports",
            name: "Sales Reports",
            icon: <BarChart className="h-4 w-4" />,
            active: activeTab === "sales-reports"
        },
        {
            id: "inventory-reports",
            name: "Inventory Reports",
            icon: <PieChart className="h-4 w-4" />,
            active: activeTab === "inventory-reports"
        },
        {
            id: "import-performance",
            name: "Import Performance",
            icon: <LineChart className="h-4 w-4" />,
            active: activeTab === "import-performance"
        },
        {
            id: "custom-reports",
            name: "Custom Reports",
            icon: <Table className="h-4 w-4" />,
            active: activeTab === "custom-reports"
        },
    ];

     // --- MASTER DATA Section ---
    const masterDataItems: NavItem[] = [
        {
            id: "products",
            name: "Products",
            icon: <Package className="h-4 w-4" />, // Using Package as fish/product icon
            active: activeTab === "products"
        },
        {
            id: "species-db",
            name: "Species Database",
            icon: <Database className="h-4 w-4" />,
            active: activeTab === "species-db"
        },
        {
            id: "units-measure",
            name: "Units of Measure",
            icon: <Ruler className="h-4 w-4" />,
            active: activeTab === "units-measure"
        },
    ];

    // --- SETTINGS Section ---
    const settingsItems: NavItem[] = [
        {
            id: "user-management",
            name: "User Management",
            icon: <Users className="h-4 w-4" />,
            active: activeTab === "user-management"
        },
         {
            id: "company-profile",
            name: "Company Profile",
            icon: <Building2 className="h-4 w-4" />,
            active: activeTab === "company-profile"
        },
        {
            id: "system-config",
            name: "System Configuration",
            icon: <Settings className="h-4 w-4" />,
            active: activeTab === "system-config"
        },
        {
            id: "api-keys",
            name: "API Keys",
            icon: <Key className="h-4 w-4" />,
            active: activeTab === "api-keys"
        },
    ];


    // Handle navigation item click (no change needed)
    const handleItemClick = (id: string) => {
        onTabChange(id);
    };

    return (
        <div className="w-60 h-full bg-[#1a1a1a] border-r border-[#363636] flex flex-col overflow-hidden"> {/* Increased width slightly */}
            {/* Sidebar header - Updated */}
            <div className="h-12 border-b border-[#363636] px-4 flex items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <Ship className="h-3.5 w-3.5 text-white" /> {/* Changed Icon */}
                    </div>
                    <span className="font-medium text-[#eee]">Fish Import Hub</span> {/* Changed Title */}
                </div>
            </div>

            {/* Organization selector (can be kept or removed) */}
            <div className="p-3 border-b border-[#363636]">
                <div className="flex items-center gap-2 p-2 bg-[#2a2a2a] rounded-md cursor-pointer hover:bg-[#333]">
                    <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white font-medium">
                        {/* Placeholder for Org Initial */}
                        FI 
                    </div>
                    <span className="text-[#eee] text-sm">Your Company Name</span> {/* Placeholder */}
                    <ChevronDown className="h-4 w-4 text-[#888] ml-auto" />
                </div>
            </div>

            {/* Scrollable navigation sections - Updated */}
            <div className="overflow-y-auto flex-1 custom-scrollbar py-4">
                <SidebarSection
                    title="Dashboard"
                    items={dashboardItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                 <SidebarSection
                    title="Sourcing & Procurement"
                    items={sourcingItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                <SidebarSection
                    title="Imports & Logistics"
                    items={logisticsItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                <SidebarSection
                    title="Inventory & Warehouse"
                    items={inventoryItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                 <SidebarSection
                    title="Quality & Compliance"
                    items={qualityComplianceItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                 <SidebarSection
                    title="Sales & Orders"
                    items={salesItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                <SidebarSection
                    title="Reporting"
                    items={reportingItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                />
                 <SidebarSection
                    title="Master Data"
                    items={masterDataItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                    expanded={false} // Collapse this by default
                />
                <SidebarSection
                    title="Settings"
                    items={settingsItems}
                    onItemClick={handleItemClick}
                    activeTab={activeTab}
                    expanded={false} // Collapse this by default
                />

                {/* Search feature (can be kept) */}
                <div className="px-3 mt-4">
                    <div className="relative">
                        <Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <Input
                            placeholder="Search Shipments, POs..." // Updated placeholder
                            className="h-8 pl-8 bg-[#2a2a2a] border-[#444] text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* User profile at bottom (using the unchanged component) */}
            <UserProfile />
        </div>
    );
};

export default LeftSidebar;