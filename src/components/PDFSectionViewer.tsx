// Alternative fix - update the PDFSectionViewer.tsx to make pdfId optional

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, FileText, Book } from 'lucide-react';
import { PDFSectionGraph } from '@/components/PDFSectionGraph';
import { usePdfGraphs } from '@/hooks/usePdfGraphs';

const API_BASE_URL = "https://colpali.api.scinter.org";

interface SectionPage {
  page_num: number;
  score: number;
  file_path: string;
  content?: string;
}

interface PDFSectionViewerProps {
  pdfId?: string; // Make pdfId optional with the ? mark
  extractedSections: Record<string, Array<SectionPage>>;
  onContentSelect?: (sectionName: string, content: string) => void;
}

export const PDFSectionViewer: React.FC<PDFSectionViewerProps> = ({
  pdfId = "unknown-pdf", // Provide a default value
  extractedSections,
  onContentSelect
}) => {
  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const validSections = extractedSections && typeof extractedSections === 'object' ? extractedSections : {};
  const sectionKeys = Object.keys(validSections);
  const firstSection = sectionKeys.length > 0 ? sectionKeys[0] : null;

  const { pdfGraphs, fetchPdfGraphs, isLoadingPdfGraphs: isGraphLoading } = usePdfGraphs();


  useEffect(() => {
    if (pdfId) {
      fetchPdfGraphs(pdfId);
    }
  }, [pdfId, fetchPdfGraphs]);

  useEffect(() => {
    if (!activeSection && firstSection) {
      setActiveSection(firstSection);
      loadSectionContent(firstSection);
    }
  }, [extractedSections, activeSection, firstSection]);

  const loadSectionContent = async (sectionName: string) => {
    if (sectionContent[sectionName] || !validSections[sectionName]) return;

    const sectionPages = validSections[sectionName];
    if (!sectionPages || sectionPages.length === 0) return;

    setIsLoading(prev => ({ ...prev, [sectionName]: true }));

    try {
      let combinedContent = '';

      for (const page of sectionPages) {
        const score = typeof page.score === 'number' ? page.score : 0;
        const pageNum = page.page_num || 'unknown';

        if (page.content) {
          combinedContent += `\n--- Page ${pageNum} (Score: ${score.toFixed(2)}) ---\n\n${page.content}\n\n`;
        } else if (page.file_path) {
          const apiUrl = `${API_BASE_URL}/api/section-content?path=${encodeURIComponent(page.file_path)}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const text = await response.text();
            combinedContent += `\n--- Page ${pageNum} (Score: ${score.toFixed(2)}) ---\n\n${text}\n\n`;
          }
        }
      }

      setSectionContent(prev => ({ ...prev, [sectionName]: combinedContent || "No content available." }));
    } catch (error) {
      setSectionContent(prev => ({ ...prev, [sectionName]: "An error occurred loading content." }));
    } finally {
      setIsLoading(prev => ({ ...prev, [sectionName]: false }));
    }
  };

  const handleTabChange = (sectionName: string) => {
    setActiveSection(sectionName);
    loadSectionContent(sectionName);
  };

  return (
    <div className="mt-4 mb-4 bg-[#2a2a2a] border border-[#444] rounded-md overflow-hidden">
      <div onClick={() => setExpanded(!expanded)} className="px-4 py-3 bg-[#333] flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2">
          <Book className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white">PDF Sections ({sectionKeys.length})</h3>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="p-3">
          <Tabs defaultValue={firstSection || ""} value={activeSection || ""} onValueChange={handleTabChange}>
            <TabsList className="overflow-x-auto bg-[#1e1e1e]">
              {sectionKeys.map(section => (
                <TabsTrigger key={section} value={section}>{section}</TabsTrigger>
              ))}
            </TabsList>

            {sectionKeys.map(section => (
              <TabsContent key={section} value={section} className="pt-3">
                
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};