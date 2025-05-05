import React, { useState } from 'react';
import { Ship, Factory, TruckIcon, ClipboardCheck, Store, LineChart } from 'lucide-react';

interface ProcessStep {
  id: number;
  name: string;
  shortDesc: string;
  color: string;
  lightColor: string;
  icon: React.ReactNode;
  activities: string[];
  systemComponents: string[];
  action: string;
}

const FishImportProcessFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const processSteps: ProcessStep[] = [
    {
      id: 1,
      name: 'SOURCE',
      shortDesc: 'Fish Farms & Fishermen',
      color: 'bg-blue-600',
      lightColor: 'bg-blue-500/20',
      icon: <Ship className="h-6 w-6" />,
      activities: [
        'Fish harvesting',
        'Fish farming/aquaculture',
        'Initial selection',
        'Basic preparation'
      ],
      systemComponents: [
        'Species Database',
        'Supplier Management'
      ],
      action: 'Harvest'
    },
    {
      id: 2,
      name: 'PROCESSING',
      shortDesc: 'Holding Facilities & Middlemen',
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-500/20',
      icon: <Factory className="h-6 w-6" />,
      activities: [
        'Holding & storage',
        'Initial quality checks',
        'Export preparation',
        'Packaging'
      ],
      systemComponents: [
        'Middleman Contracts',
        'Basic QC System'
      ],
      action: 'Export'
    },
    {
      id: 3,
      name: 'IMPORT',
      shortDesc: 'Transport & Wholesalers',
      color: 'bg-purple-600',
      lightColor: 'bg-purple-500/20',
      icon: <Ship className="h-6 w-6 transform rotate-180" />,
      activities: [
        'International shipping',
        'Customs clearance',
        'Temperature monitoring',
        'Documentation'
      ],
      systemComponents: [
        'Logistics Partners',
        'Import Documentation'
      ],
      action: 'Inspect'
    },
    {
      id: 4,
      name: 'QUALITY',
      shortDesc: 'Inspection & Compliance',
      color: 'bg-pink-600',
      lightColor: 'bg-pink-500/20',
      icon: <ClipboardCheck className="h-6 w-6" />,
      activities: [
        'QC inspections',
        'Lab testing',
        'Certification checks',
        'Regulatory approval'
      ],
      systemComponents: [
        'Traceability System',
        'Compliance Database'
      ],
      action: 'Approve'
    },
    {
      id: 5,
      name: 'DISTRIBUTION',
      shortDesc: 'Regional Wholesalers',
      color: 'bg-amber-600',
      lightColor: 'bg-amber-500/20',
      icon: <TruckIcon className="h-6 w-6" />,
      activities: [
        'Regional distribution',
        'Stock management',
        'Inventory tracking',
        'Retail fulfillment'
      ],
      systemComponents: [
        'Warehouse Management',
        'Stock Transfer System'
      ],
      action: 'Supply'
    },
    {
      id: 6,
      name: 'RETAIL',
      shortDesc: 'Pet Shops & Consumers',
      color: 'bg-red-600',
      lightColor: 'bg-red-500/20',
      icon: <Store className="h-6 w-6" />,
      activities: [
        'Pet shop sales',
        'Consumer purchases',
        'Customer service',
        'Order fulfillment'
      ],
      systemComponents: [
        'Sales Orders',
        'Invoicing & Pricing'
      ],
      action: ''
    }
  ];

  return (
    <div className="w-full bg-slate-900 text-white p-6 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-2">Fish Import Supply Chain Process Flow</h1>
      <h2 className="text-gray-400 text-center mb-8">Integrated Fish Industry Management System</h2>
      
      {/* Legend */}
      <div className="bg-slate-800 p-3 rounded-md mb-8 inline-flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">Process Step</span>
        </div>
        <div className="flex items-center gap-2">
          <hr className="w-4 border-white" />
          <span className="text-sm">Process Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <hr className="w-4 border-gray-400 border-dashed" />
          <span className="text-sm">Data Flow</span>
        </div>
      </div>
      
      {/* Main Process Flow */}
      <div className="relative mb-16">
        {/* Horizontal line */}
        <div className="absolute top-24 left-0 w-full h-2 bg-slate-600"></div>
        
        {/* Process step circles */}
        <div className="flex justify-between items-start relative">
          {processSteps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center z-10 cursor-pointer"
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="text-center mb-2">
                <div className="font-bold">STEP {step.id}</div>
              </div>
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center ${step.color} border-2 border-white transition-all duration-300 ${activeStep === step.id ? 'scale-110 shadow-lg shadow-slate-500/20' : ''}`}
              >
                {step.icon}
              </div>
              <div className="text-center mt-2">
                <div className="font-semibold">{step.name}</div>
                <div className="text-xs text-gray-400">{step.shortDesc}</div>
              </div>
              
              {/* Action label (except for the last item) */}
              {index < processSteps.length - 1 && (
                <div className={`absolute top-24 left-[calc(8.33% + 4rem + 8.33% * 2 * ${index} - 1.5rem)]`}>
                  <div className={`px-3 py-1 rounded-full text-xs ${step.color} shadow-md -mt-7`}>
                    {step.action}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Connector arrows */}
        {Array.from({ length: processSteps.length - 1 }).map((_, index) => (
          <div 
            key={`connector-${index}`} 
            className="absolute top-24 h-2 flex items-center justify-end"
            style={{ 
              left: `calc(8.33% + 2rem + (100% - 16.66% - 12rem) * ${index} / 5)`, 
              width: `calc((100% - 16.66% - 12rem) / 5)`
            }}
          >
            <div className="w-4 h-4 border-t-2 border-r-2 border-white transform rotate-45 -mr-2"></div>
          </div>
        ))}
      </div>
      
      {/* Reporting Node in Center */}
      <div className="flex justify-center -mt-8 mb-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-slate-500 flex items-center justify-center">
            <LineChart className="h-6 w-6" />
          </div>
          <div className="text-center mt-2">
            <div className="font-semibold">REPORTING</div>
            <div className="text-xs text-gray-400">Analytics & Monitoring</div>
          </div>
          
          {/* Dashed lines from all process steps to reporting */}
          {processSteps.map((step, index) => (
            <div 
              key={`reporting-line-${index}`} 
              className="absolute border-gray-500 border-dashed"
              style={{
                borderLeftWidth: '2px',
                top: '-50px',
                height: '50px',
                left: '8px',
                transform: `rotate(${(index - 2.5) * 25}deg)`,
                transformOrigin: 'bottom center'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Detail Boxes */}
      <div className="grid grid-cols-6 gap-4 mt-8">
        {processSteps.map((step) => (
          <div 
            key={`detail-${step.id}`} 
            className={`rounded-lg p-4 border ${activeStep === step.id ? 'border-' + step.color.replace('bg-', '') : 'border-slate-700'} ${step.lightColor}`}
          >
            <h3 className={`font-bold mb-2 ${step.color.replace('bg-', 'text-')}`}>{step.id}. {step.name}</h3>
            
            <div className="mb-3">
              <div className="text-sm font-semibold mb-1">Key Activities:</div>
              <ul className="text-xs space-y-1">
                {step.activities.map((activity, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-1">•</span> {activity}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-1">System Components:</div>
              <ul className="text-xs space-y-1">
                {step.systemComponents.map((component, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-1">•</span> {component}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FishImportProcessFlow;