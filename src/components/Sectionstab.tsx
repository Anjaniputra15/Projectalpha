// components/SectionsTab.tsx
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FileText, FileUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SectionsTabProps {
  extractedSections: any;
  fileName: string | null;
  isProcessing?: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SectionsTab: React.FC<SectionsTabProps> = ({ 
  extractedSections, 
  fileName,
  isProcessing = false,
  onFileChange
}) => {
  if (!extractedSections || Object.keys(extractedSections).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="bg-[#2a2a2a] p-8 rounded-lg border border-[#444] flex flex-col items-center max-w-md">
          <FileText className="h-16 w-16 text-purple-400/50 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Sections Extracted</h3>
          <p className="text-sm text-white/60 text-center mb-6">
            Upload a PDF document to extract and view its sections.
          </p>
          
          <Input
            type="file"
            onChange={onFileChange}
            className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute"
            id="section-file-upload"
            accept=".pdf"
          />
          <label
            htmlFor="section-file-upload"
            className="cursor-pointer inline-flex items-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            <FileUp className="h-4 w-4" />
            Upload PDF File
          </label>
          
          {isProcessing && (
            <div className="mt-4 flex items-center text-white/70">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing document...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">
          Extracted Sections {fileName && <span className="text-xs text-white/60 ml-2">from {fileName}</span>}
        </h2>
        
        {/* Add upload button even when sections are available */}
        <div>
          <Input
            type="file"
            onChange={onFileChange}
            className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute"
            id="section-file-upload-header"
            accept=".pdf"
          />
          <label
            htmlFor="section-file-upload-header"
            className="cursor-pointer inline-flex items-center gap-2 text-sm py-1.5 px-3 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <FileUp className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Upload PDF"}
          </label>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(extractedSections).map(([sectionName, sectionData]: [string, any]) => (
            <AccordionItem 
              key={sectionName} 
              value={sectionName}
              className="border-b border-[#363636]"
            >
              <AccordionTrigger className="hover:bg-[#2a2a2a] py-3 px-2 rounded-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{sectionName}</span>
                  <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {Array.isArray(sectionData) ? sectionData.length : 0} pages
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2">
                {Array.isArray(sectionData) && sectionData.map((pageData: any, index: number) => (
                  <div key={index} className="mb-4 bg-[#252525] p-3 rounded border border-[#363636]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-white/60">
                        Page {pageData.page_num}
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/20">
                        Score: {typeof pageData.score === 'number' ? pageData.score.toFixed(2) : 'N/A'}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/80 whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                      {pageData.content}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};