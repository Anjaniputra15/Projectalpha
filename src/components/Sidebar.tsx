import { useState, useEffect } from "react";
import { FileSystemItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FileText,
  FilePlus,
  FolderPlus,
  MoreVertical,
  Pen,
  FolderOpen,
  Plus,
  Clock,
  Network,
  Beaker,
  Settings,
  Notebook,
  Microscope,
  Trash,
  Book,
  FileType,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Update the SidebarProps interface in your Sidebar component
interface SidebarProps {
  onCreateNote: (parentId?: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onRenameItem: (id: string, newName: string) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: FileSystemItem) => void;
  items: FileSystemItem[];
  activeTab: "notes" | "hypothesis" | "sections" | "Document Analysis"; // Ensure this is strictly typed
  onTabChange: (tab: "notes" | "hypothesis" | "sections"| "Document Analysis" ) => void; // Ensure this is strictly typed
  savedHypotheses: any[];
  onSelectHypothesis: (hypothesis: any) => void;
  onDeleteHypothesis?: (id: string) => void;
  extractedSections?: Record<string, any[]>;
  onSelectSection?: (sectionName: string, content: string) => void;
}

export function Sidebar({
  onCreateNote,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onSelectItem,
  items,
  activeTab,
  onTabChange,
  savedHypotheses = [],
  onSelectHypothesis,
  onDeleteHypothesis,
  extractedSections = {},
  onSelectSection,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentParentId, setCurrentParentId] = useState<string | undefined>();
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [isLoadingSection, setIsLoadingSection] = useState<Record<string, boolean>>({});

  // Log extracted sections to help debug
  useEffect(() => {
    console.log("Extracted sections in sidebar:", extractedSections);
  }, [extractedSections]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentParentId);
      setNewFolderName("");
      setNewFolderDialog(false);
      setCurrentParentId(undefined);
    }
  };

  const handleCreateNote = () => {
    onCreateNote(currentParentId);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      onDeleteItem(id);
    }
  };

  const handleDeleteHypothesis = (id: string) => {
    if (confirm("Are you sure you want to delete this hypothesis?")) {
      if (onDeleteHypothesis) {
        onDeleteHypothesis(id);
      }
    }
  };

  const renderItem = (item: FileSystemItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const Icon =
      item.type === "folder"
        ? isExpanded
          ? FolderOpen
          : FolderOpen
        : FileText;
    const formattedDate = item.updatedAt
      ? format(new Date(item.updatedAt), "MMM d, yyyy h:mm a")
      : "";

    return (
      <div key={item.id} className="animate-in">
        <div className="flex items-center group">
          <button
            onClick={() => {
              if (item.type === "folder") {
                toggleFolder(item.id);
              } else {
                onSelectItem(item);
              }
            }}
            className={cn(
              "flex-1 flex items-center gap-2 px-2 py-1 text-sm hover:bg-white/5 rounded-sm transition-colors",
              "focus:outline-none"
            )}
            style={{ paddingLeft: `${(depth + 1) * 1}rem` }}
          >
            <Icon className="h-4 w-4 opacity-60" />
            <span className="truncate text-sm opacity-80 font-medium">
              {item.name}
            </span>
            {item.updatedAt && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="h-3 w-3 opacity-40 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Last modified: {formattedDate}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </button>
          <div className="opacity-0 group-hover:opacity-100 pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => {
                    const newName = window.prompt("Enter new name:", item.name);
                    if (newName) onRenameItem(item.id, newName);
                  }}
                >
                  <Pen className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {item.type === "folder" && isExpanded && item.children && (
          <div className="ml-2">
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderHypothesisItem = (hypothesis: any, index: number) => {
    const formattedDate = hypothesis.createdAt
      ? format(new Date(hypothesis.createdAt), "MMM d, yyyy h:mm a")
      : "";

    return (
      <div key={hypothesis.id || index} className="animate-in">
        <div className="flex items-center group">
          <button
            onClick={() => onSelectHypothesis(hypothesis)}
            className={cn(
              "flex-1 flex items-center gap-2 px-2 py-1 text-sm hover:bg-white/5 rounded-sm transition-colors",
              "focus:outline-none"
            )}
          >
            <Beaker className="h-4 w-4 opacity-60" />
            <span className="truncate text-sm opacity-80 font-medium">
              {hypothesis.text.length > 30
                ? hypothesis.text.substring(0, 30) + "..."
                : hypothesis.text}
            </span>
            {hypothesis.createdAt && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="h-3 w-3 opacity-40 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created: {formattedDate}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </button>
          <div className="opacity-0 group-hover:opacity-100 pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() =>
                    hypothesis.id && handleDeleteHypothesis(hypothesis.id)
                  }
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  // Function to render a section item
  const renderSectionItem = (sectionName: string) => {
    const pagesCount = extractedSections[sectionName]?.length || 0;
    
    return (
      <div key={sectionName} className="animate-in">
        <div className="flex items-center group">
          <button
           onClick={() => {
            if (onSelectSection) {
              // We need to load the content first before sending it to the main panel
              const sectionPages = extractedSections[sectionName];
              let content = "";
              
              // If we already have content cached, use it
              if (sectionContent[sectionName]) {
                onSelectSection(sectionName, sectionContent[sectionName]);
              } else {
                // Otherwise, manually build some content from the section info
                if (sectionPages && sectionPages.length > 0) {
                  content = `Section: ${sectionName}\n\n`;
                  sectionPages.forEach(page => {
                    if (page && page.content) {
                      content += page.content + "\n\n";
                    } else {
                      content += `Page ${page.page_num || '?'} content not available.\n\n`;
                    }
                  });
                  
                  // Save the content for future use
                  setSectionContent(prev => ({...prev, [sectionName]: content}));
                  
                  // Pass it to the handler
                  onSelectSection(sectionName, content);
                } else {
                  const defaultMessage = `No content available for section: ${sectionName}`;
                  setSectionContent(prev => ({...prev, [sectionName]: defaultMessage}));
                  onSelectSection(sectionName, defaultMessage);
                }
              }
            }
          }}
            className={cn(
              "flex-1 flex items-center gap-2 px-2 py-1 text-sm hover:bg-white/5 rounded-sm transition-colors",
              "focus:outline-none"
            )}
          >
            <FileText className="h-4 w-4 opacity-60" />
            <span className="truncate text-sm opacity-80 font-medium">
              {sectionName}
            </span>
            <span className="text-xs opacity-50 ml-1">({pagesCount})</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-[280px] h-screen flex flex-col bg-[#1e1e1e] border-r border-[#363636]">
        {/* Logo Section */}
        <div className="h-12 flex items-center px-4 border-b border-[#363636]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="w-full h-full rounded-full overflow-hidden bg-black/20 relative">
                <img
                  src="/lovable-uploads/0ee8d622-1881-4c90-afe6-a4c542526949.png"
                  alt="ScInter Logo"
                  className="w-full h-full rotate-logo object-cover"
                />
              </div>
            </div>
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              ScInter Graph Lab
            </span>
          </div>
        </div>

        {/* Tabs */}
        {/* Tabs */}
<div className="p-2 border-b border-[#363636] flex">
  {activeTab === "notes" && (
    <button
      className="flex-1 py-1.5 px-2 text-sm rounded-md bg-purple-500/20 text-purple-400"
      onClick={() => onTabChange("notes")}
    >
      <Notebook className="h-4 w-4 mr-1 inline-block" />
      Notes
    </button>
  )}
  {activeTab === "Document Analysis" && (
    <button
      className="flex-1 py-1.5 px-2 text-sm rounded-md bg-purple-500/20 text-purple-400"
      onClick={() => onTabChange("Document Analysis")}
    >
      <FileText className="h-4 w-4 mr-1 inline-block" />
      Sections
    </button>
  )}
  {activeTab === "hypothesis" && (
    <button
      className="flex-1 py-1.5 px-2 text-sm rounded-md bg-purple-500/20 text-purple-400"
      onClick={() => onTabChange("hypothesis")}
    >
      <Microscope className="h-4 w-4 mr-1 inline-block" />
      Hypothesis
    </button>
  )}
</div>

        <div className="flex-1 flex flex-col min-h-0">
          {activeTab === "notes" ? (
            <>
              <div className="p-2 border-b border-[#363636] flex items-center justify-between">
                <h2 className="text-sm font-medium text-[#888]">Notes</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCreateNote}
                  title="Create New Note"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-1 pt-2">
                  {items.map((item) => renderItem(item))}
                </div>
              </ScrollArea>
            </>
          ) : activeTab === "Document Analysis" ? (
            <>
              <div className="p-2 border-b border-[#363636] flex items-center justify-between">
                <h2 className="text-sm font-medium text-[#888]">PDF Sections</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-1 pt-2">
                  {extractedSections && Object.keys(extractedSections).length > 0 ? (
                    Object.keys(extractedSections).map((section) => renderSectionItem(section))
                  ) : (
                    <div className="px-3 py-6 text-center">
                      <FileText className="h-8 w-8 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-white/60">
                        No PDF sections available
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Upload a PDF file to see sections
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="p-2 border-b border-[#363636] flex items-center justify-between">
                <h2 className="text-sm font-medium text-[#888]">
                  Saved Hypotheses
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setNewFolderDialog(true)}
                  title="Create New Folder"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-1 pt-2">
                  {savedHypotheses.length > 0 ? (
                    savedHypotheses.map((hypothesis, index) =>
                      renderHypothesisItem(hypothesis, index)
                    )
                  ) : (
                    <div className="px-3 py-6 text-center">
                      <Beaker className="h-8 w-8 text-white/20 mx-auto mb-2" />
                      <p className="text-sm text-white/60">
                        No saved hypotheses yet
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Create and validate hypotheses to see them here
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
          <div className="p-2 border-t border-[#363636] flex items-center justify-between">
            <span className="text-xs text-[#888]">Knowledge Base</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-3.5 w-3.5 text-[#888]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#1e1e1e] border-[#363636] text-white">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="bg-[#2a2a2a] border-[#444] text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewFolderDialog(false)}
              className="border-[#444] text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}