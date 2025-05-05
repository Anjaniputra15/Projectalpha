import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "@/components/Sidebar";
import { Graph } from "@/components/Graph";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  ChevronLeft,
  Network,
  FileUp,
  Loader2,
  UserCircle2,
  Beaker,
  Plus,
  Save,
  FileText,
  MessageCircle,
} from "lucide-react";
import { FileSystemItem } from "@/lib/types";
import { Link } from "react-router-dom";
import {
  HypothesisReport,
  HypothesisResult,
} from "@/components/HypothesisReport";
import { useHypothesis } from "@/hooks/use-Hypothesis";
import { useStreamingHypothesis } from "@/hooks/useStreamingHypothesis";
import StreamingHypothesisReport from "@/components/StreamingHypothesis";

import { Textarea } from "@/components/ui/textarea";
import { ChatComponent } from "@/components/ChatComponent";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PDFSectionViewer } from "@/components/PDFSectionViewer";

interface LayoutProps {
  items: FileSystemItem[];
  currentNote: FileSystemItem | null;
  isLoading: boolean;
  onCreateNote: (parentId?: string) => Promise<void>;
  onCreateFolder: (name: string, parentId?: string) => void;
  onRenameItem: (id: string, newName: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onSelectItem: (item: FileSystemItem) => void;
  onGenerateGraph: (content: string) => Promise<void>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isGeneratingGraph: boolean;
  graphNodes: any[];
  graphEdges: any[];
  onGraphUpdate: (nodes: any[], edges: any[]) => void;
}

export function Layout({
  items,
  currentNote,
  isLoading,
  onCreateNote,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
  onSelectItem,
  onGenerateGraph,
  onFileChange,
  isGeneratingGraph,
  graphNodes,
  graphEdges,
  onGraphUpdate,
}: LayoutProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [panelSizes, setPanelSizes] = useState<number[]>([60, 40]);
  const [activeTab, setActiveTab] = useState<"notes" | "hypothesis">("notes");
  const [hypothesisText, setHypothesisText] = useState("");
  const [showHypothesisReport, setShowHypothesisReport] = useState(false);
  const [showStreamingReport, setShowStreamingReport] = useState(false);
  const [useStreamingMode, setUseStreamingMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { toast } = useToast();

  // New state for the enhanced note functionality
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [savedNotes, setSavedNotes] = useState<FileSystemItem[]>([]);
  const [savedGraphs, setSavedGraphs] = useState<
    Record<string, { nodes: any[]; edges: any[] }>
  >({});
  const [savedHypotheses, setSavedHypotheses] = useState<any[]>([]);
  const [selectedHypothesis, setSelectedHypothesis] = useState<any>(null);

  //Pdf upload
  // Add the file upload hook
  const { 
    selectedFile, 
    fileContent, 
    isProcessing, 
    extractedSections,
    handleFileChange 
  } = useFileUpload();

  // Load saved notes, graphs, and hypotheses from localStorage on initial render
  useEffect(() => {
    const storedNotes = localStorage.getItem("scinter-notes");
    const storedGraphs = localStorage.getItem("scinter-graphs");
    const storedHypotheses = localStorage.getItem("scinter-hypotheses");

    if (storedNotes) {
      setSavedNotes(JSON.parse(storedNotes));
    }

    if (storedGraphs) {
      setSavedGraphs(JSON.parse(storedGraphs));
    }

    if (storedHypotheses) {
      setSavedHypotheses(JSON.parse(storedHypotheses));
    }
  }, []);

  const handlePanelResize = (sizes: number[]) => {
    setPanelSizes(sizes);
  };

  // Effect to load saved graph when current note changes
  useEffect(() => {
    if (currentNote && savedGraphs[currentNote.id]) {
      const savedGraph = savedGraphs[currentNote.id];
      onGraphUpdate(savedGraph.nodes, savedGraph.edges);
    } else if (currentNote) {
      // Clear the graph if there's no saved graph for this note
      onGraphUpdate([], []);
    }
  }, [currentNote]);

  // Handler for changing the active tab
  const handleTabChange = (tab: "notes" | "hypothesis") => {
    setActiveTab(tab);
  };

  // Handler for starting note creation process
  const handleCreateNote = () => {
    setIsCreatingNote(true);
    setNoteTitle("");
    setNoteContent("");

    // Clear the graph when creating a new note
    onGraphUpdate([], []);
  };

  // Handler for selecting an item (note)
  const handleSelectItem = (item: FileSystemItem) => {
    // If we're currently creating a note, reset that state
    if (isCreatingNote) {
      setIsCreatingNote(false);
    }

    // Pass the item to the parent's onSelectItem
    onSelectItem(item);

    // Set the current note content if it exists
    if (item.content) {
      setNoteContent(item.content);
    }
  };

  // Handler for saving a new note
  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note.",
        variant: "destructive",
      });
      return;
    }

    // Create a new note object
    const newNote: FileSystemItem = {
      id: `note-${Date.now()}`,
      name: noteTitle,
      type: "file",
      content: noteContent,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update state
    const updatedNotes = [...savedNotes, newNote];
    setSavedNotes(updatedNotes);

    // Save to localStorage
    localStorage.setItem("scinter-notes", JSON.stringify(updatedNotes));

    // Select the new note
    onSelectItem(newNote);

    // Reset creation state
    setIsCreatingNote(false);

    toast({
      title: "Success",
      description: "Note saved successfully.",
    });
  };

  // Handler for selecting a hypothesis
  const handleSelectHypothesis = (hypothesis: any) => {
    setSelectedHypothesis(hypothesis);
    setHypothesisText(hypothesis.text);
  };

  // Handler for generating graph from note content
  const handleGenerateGraphClick = () => {
    const textContent =
      document.querySelector<HTMLTextAreaElement>("#content")?.value || "";
    onGenerateGraph(textContent);
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  // Regular hypothesis validation
  const {
    isValidating,
    hypothesisResult,
    validationError,
    validateHypothesis,
    clearHypothesisResult,
  } = useHypothesis();

  // Streaming hypothesis validation
  const {
    isStreaming,
    streamingState,
    hypothesisResult: streamingResult,
    validationError: streamingError,
    validateHypothesisStreaming,
    clearHypothesisResult: clearStreamingResult,
  } = useStreamingHypothesis();

  // Handler for saving the generated graph
  const handleSaveGraph = () => {
    if (!currentNote) {
      toast({
        title: "Error",
        description: "Please select or create a note first.",
        variant: "destructive",
      });
      return;
    }

    // Save graph data linked to current note
    const updatedGraphs = {
      ...savedGraphs,
      [currentNote.id]: { nodes: graphNodes, edges: graphEdges },
    };

    setSavedGraphs(updatedGraphs);
    localStorage.setItem("scinter-graphs", JSON.stringify(updatedGraphs));

    toast({
      title: "Success",
      description: "Knowledge graph saved successfully.",
    });
  };

  // Handler for saving a hypothesis
  const handleSaveHypothesis = () => {
    if (!hypothesisResult) {
      toast({
        title: "Error",
        description: "Please validate your hypothesis first.",
        variant: "destructive",
      });
      return;
    }

    // Create a new hypothesis object
    const newHypothesis = {
      id: `hypothesis-${Date.now()}`,
      text: hypothesisText,
      result: hypothesisResult,
      createdAt: new Date().toISOString(),
    };

    // Update state
    const updatedHypotheses = [...savedHypotheses, newHypothesis];
    setSavedHypotheses(updatedHypotheses);

    // Save to localStorage
    localStorage.setItem(
      "scinter-hypotheses",
      JSON.stringify(updatedHypotheses)
    );

    toast({
      title: "Success",
      description: "Hypothesis saved successfully.",
    });
  };

  // Load saved graph when a note is selected
  useEffect(() => {
    if (currentNote && savedGraphs[currentNote.id]) {
      const savedGraph = savedGraphs[currentNote.id];
      onGraphUpdate(savedGraph.nodes, savedGraph.edges);
    }
  }, [currentNote, savedGraphs]);

  // Update note content when a note is selected
  useEffect(() => {
    if (currentNote) {
      setNoteContent(currentNote.content || "");
    }
  }, [currentNote]);

  // Handle hypothesis validation
  const handleValidateHypothesis = async () => {
    if (!hypothesisText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hypothesis to validate.",
        variant: "destructive",
      });
      return;
    }

    if (useStreamingMode) {
      // Use streaming validation
      await validateHypothesisStreaming(hypothesisText);
      setShowStreamingReport(true);
    } else {
      // Use regular validation
      await validateHypothesis(hypothesisText);
      setShowHypothesisReport(true);
    }
  };

  const handleCloseReport = () => {
    setShowHypothesisReport(false);
    clearHypothesisResult();
  };

  const handleCloseStreamingReport = () => {
    setShowStreamingReport(false);
    clearStreamingResult();
  };

  const handleToggleStreamingMode = () => {
    setUseStreamingMode(!useStreamingMode);
    // Clear any existing reports when switching modes
    setShowHypothesisReport(false);
    setShowStreamingReport(false);
    clearHypothesisResult();
    clearStreamingResult();
  };
  const handleDeleteItem = async (id: string) => {
    // First, call the parent's onDeleteItem if it exists
    if (onDeleteItem) {
      await onDeleteItem(id);
    }

    // Get current notes from state
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);

    // Update localStorage
    localStorage.setItem("scinter-notes", JSON.stringify(updatedNotes));

    // Also delete any associated graph data
    if (savedGraphs[id]) {
      const updatedGraphs = { ...savedGraphs };
      delete updatedGraphs[id];
      setSavedGraphs(updatedGraphs);
      localStorage.setItem("scinter-graphs", JSON.stringify(updatedGraphs));
    }

    // If the current note is the one being deleted, clear the current note
    if (currentNote && currentNote.id === id) {
      onSelectItem(null as any);
      setIsCreatingNote(false);
      // Clear the graph
      onGraphUpdate([], []);
    }

    toast({
      title: "Success",
      description: "Note deleted successfully.",
    });
  };

  const handleDeleteHypothesis = (id: string) => {
    // Filter out the deleted hypothesis from state
    const updatedHypotheses = savedHypotheses.filter((h) => h.id !== id);
    setSavedHypotheses(updatedHypotheses);

    // Update localStorage
    localStorage.setItem(
      "scinter-hypotheses",
      JSON.stringify(updatedHypotheses)
    );

    // If the current hypothesis is the one being deleted, clear it
    if (selectedHypothesis && selectedHypothesis.id === id) {
      setSelectedHypothesis(null);
      setHypothesisText("");
      clearHypothesisResult();
    }

    toast({
      title: "Success",
      description: "Hypothesis deleted successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  // Add this return statement
  return (
  <div className="h-screen flex overflow-hidden bg-[#1e1e1e]">
    {/* Your existing JSX content */}
  </div>
  );

  <div className="h-screen flex overflow-hidden bg-[#1e1e1e]">
      {showSidebar && (
        <Sidebar
          items={[...items, ...savedNotes]}
          onCreateNote={handleCreateNote}
          onCreateFolder={onCreateFolder}
          onRenameItem={onRenameItem}
          onDeleteItem={handleDeleteItem}
          onSelectItem={handleSelectItem}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          savedHypotheses={savedHypotheses}
          onSelectHypothesis={handleSelectHypothesis}
          onDeleteHypothesis={handleDeleteHypothesis}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-12 border-b border-[#363636] px-4 flex items-center justify-between bg-[#1e1e1e]">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#888] font-medium">
                {activeTab === "notes"
                  ? currentNote?.name ||
                    (isCreatingNote ? "New Note" : "No note selected")
                  : selectedHypothesis
                  ? "Hypothesis Analysis"
                  : "New Hypothesis"}
              </span>
            </div>
          </div>
          {/* Replace the existing file upload component with this: */}
          <div className="flex items-center gap-2 border-r border-[#363636] pr-3">
          <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleChat}
        className={`gap-1.5 text-sm py-1.5 px-3 rounded-md ${
        showChat
          ? "bg-purple-500/20 text-purple-400"
          : "hover:bg-accent hover:text-accent-foreground"
          }`}
          >
        <MessageCircle className="h-4 w-4" />
        Chat
        </Button>
        <Input
        type="file"
        onChange={handleFileChange}
        className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute"
        id="file-upload"
        accept=".txt,.md,.pdf"
        />
        <label
      htmlFor="file-upload"
      className={`cursor-pointer inline-flex items-center gap-2 text-sm py-1.5 px-3 rounded-md ${
        isProcessing 
          ? "bg-amber-500/20 text-amber-400" 
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing PDF...
        </>
      ) : (
        <>
          <FileUp className="h-4 w-4" />
          {selectedFile ? selectedFile.name : "Upload File"}
        </>
      )}
    </label>
  </div>
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
              >
                <UserCircle2 className="h-4 w-4" />
                <span className="text-sm">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 bg-[#1e1e1e]">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
            onLayout={handlePanelResize}
          >
            <ResizablePanel
              defaultSize={panelSizes[0]}
              minSize={30}
              className="bg-[#1e1e1e]"
              style={{ height: "100%", overflow: "hidden" }}
            >
              <div className="p-4 h-full custom-scrollbar pb-2">
                {activeTab === "notes" ? (
                  <>
                    {/* Empty state when no note is selected and not creating a note */}
                    {!currentNote && !isCreatingNote && (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileText className="h-12 w-12 text-white/20 mb-4" />
                        <h2 className="text-lg font-medium text-white mb-2">
                          No Note Selected
                        </h2>
                        <p className="text-sm text-white/60 text-center max-w-md mb-6">
                          Create a new note or select an existing one from the
                          sidebar to start working.
                        </p>
                        <Button
                          onClick={handleCreateNote}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Note
                        </Button>
                      </div>
                    )}

                    {/* Note creation UI */}
                    {isCreatingNote && (
                      <div className="flex flex-col h-full pb-5">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-medium text-white">
                            New Note
                          </h2>
                          <Button
                            onClick={handleSaveNote}
                            className="ml-2 bg-purple-600 hover:bg-purple-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Note
                          </Button>
                        </div>
                        <Input
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="Enter note title..."
                          className="font-medium bg-[#2a2a2a] border-[#444] text-white mb-4"
                        />
                        <Textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Enter your note content here..."
                          className="flex-1  bg-[#2a2a2a] border-[#444]  text-white"
                          id="content"
                        />
                      </div>
                    )}
                    

                    {/* Show TextInput for existing note */}
                    {currentNote && !isCreatingNote && (
                      <>
                      <TextInput
                        onGraphUpdate={onGraphUpdate}
                        initialContent={currentNote.content}
                        currentNoteId={currentNote.id}
                      />
                      {/* Add PDFSectionViewer after TextInput when sections are available */}
                      {extractedSections && Object.keys(extractedSections).length > 0 && (
                    <div className="mt-4">
                      <PDFSectionViewer 
                        extractedSections={extractedSections}
                        onContentSelect={(content) => {
            // Handle using the selected content in your note
                        const textarea = document.querySelector<HTMLTextAreaElement>('#content');
                        if (textarea) {
                          textarea.value = content;
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}

                  
                  </>
                ) : (
                  // Hypothesis tab content
                  <div className="flex flex-col h-full custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-white">
                        Hypothesis Validation
                      </h2>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-purple-500/30"
                          onClick={handleToggleStreamingMode}
                        >
                          {useStreamingMode
                            ? "Standard Mode"
                            : "Streaming Mode"}
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={handleValidateHypothesis}
                          disabled={isValidating || isStreaming}
                        >
                          {isValidating || isStreaming ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              Validating...
                            </>
                          ) : (
                            <>
                              <Beaker className="h-3.5 w-3.5 mr-1.5" />
                              Validate Hypothesis
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm mb-2 text-white/80">
                        Enter a scientific hypothesis to validate against
                        existing research.
                        {useStreamingMode &&
                          " Using streaming mode for real-time updates."}
                      </p>
                      <p className="text-xs mb-4 text-white/60">
                        For best results, be specific and clear. Example: "High
                        sodium intake is associated with increased risk of
                        hypertension."
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <Textarea
                        value={hypothesisText}
                        onChange={(e) => setHypothesisText(e.target.value)}
                        placeholder="Enter your hypothesis here..."
                        className="flex-1 min-h-[120px] bg-[#2a2a2a] border-[#444] resize-none text-white"
                      />

                      <div className="mt-4 text-xs text-white/60 flex justify-between">
                        <span>{hypothesisText.length} characters</span>
                        {hypothesisText.length > 500 && (
                          <span className="text-amber-400">
                            Long hypotheses may take longer to process
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Show appropriate report based on the mode */}
                    {showHypothesisReport && !useStreamingMode && (
                      <div className="mt-6">
                        <HypothesisReport
                          result={hypothesisResult || undefined}
                          isLoading={isValidating}
                          error={validationError || undefined}
                          onClose={handleCloseReport}
                        />
                      </div>
                    )}

                    {showStreamingReport && useStreamingMode && (
                      <div className="mt-6">
                        <StreamingHypothesisReport
                          initialHypothesis={hypothesisText}
                          onClose={handleCloseStreamingReport}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle className="w-2 bg-[#363636] data-[hover]:bg-[#444]" />
            <ResizablePanel
              defaultSize={panelSizes[1]}
              minSize={20}
              className="bg-[#1e1e1e] relative"
              style={{ height: "100%" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {activeTab === "notes" ? (
                  // Graph visualization content
                  <>
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white/80">
                          Knowledge Graph
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={handleGenerateGraphClick}
                            disabled={
                              isGeneratingGraph ||
                              (!currentNote && !isCreatingNote)
                            }
                          >
                            {isGeneratingGraph ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Network className="h-3.5 w-3.5 mr-1.5" />
                                Generate Graph
                              </>
                            )}
                          </Button>

                          {/* Save Graph button - only visible when there's a graph and note */}
                          {graphNodes.length > 0 && currentNote && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2 bg-purple-600/20 border-purple-600/40 hover:bg-purple-600/30"
                              onClick={handleSaveGraph}
                            >
                              <Save className="h-3.5 w-3.5 mr-1.5" />
                              Save Graph
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col h-[calc(100%-3rem)] bg-[#1e1e1e]  border border-[#363636] rounded-md">
                        {graphNodes.length > 0 ? (
                          <Graph nodes={graphNodes} edges={graphEdges} />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-6">
                            <Network className="h-16 w-16 text-white/10 mb-4" />
                            {!currentNote && !isCreatingNote ? (
                              <>
                                <h3 className="text-lg font-medium text-white/70 mb-2">
                                  No Note Selected
                                </h3>
                                <p className="text-sm text-white/50 text-center max-w-md mb-2">
                                  Select or create a note first to generate a
                                  knowledge graph.
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="text-lg font-medium text-white/70 mb-2">
                                  No Graph Generated
                                </h3>
                                <p className="text-sm text-white/50 text-center max-w-md mb-2">
                                  Click the "Generate Graph" button above to
                                  create a knowledge graph from your note
                                  content.
                                </p>
                                <p className="text-xs text-white/40 text-center max-w-md">
                                  The graph will visualize key concepts and
                                  their relationships from your note.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Hypothesis-related visualization content
                  <div className="flex flex-col h-full bg-[#1e1e1e] p-4 border border-[#363636] rounded-md">
                    {/* Show visualization based on which mode is active */}
                    {useStreamingMode ? (
                      // Streaming result visualization
                      streamingResult ? (
                        <div className="flex flex-col h-full">
                          <h3 className="text-lg font-medium text-white mb-4">
                            Streaming Validation Results
                          </h3>

                          <div className="flex-1 flex items-center justify-center bg-[#252525] rounded-md border border-[#444] overflow-hidden">
                            {streamingResult.figures &&
                            streamingResult.figures.length > 0 &&
                            streamingResult.figures[0].image_data ? (
                              <img
                                src={`data:image/png;base64,${streamingResult.figures[0].image_data}`}
                                alt="Hypothesis visualization"
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <div className="text-center p-6">
                                <p className="text-white/60 mb-2">
                                  No visualization available
                                </p>
                                <p className="text-xs text-white/40">
                                  Visualizations will appear here when available
                                  from the streaming validation process
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-white/80 mb-2">
                              Evidence Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-green-900/20 border border-green-900/30 rounded-md p-3">
                                <div className="text-green-400 text-sm font-medium mb-1">
                                  Supporting Evidence
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                  {streamingResult.supporting_evidence.length}
                                </div>
                              </div>
                              <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3">
                                <div className="text-red-400 text-sm font-medium mb-1">
                                  Contradicting Evidence
                                </div>
                                <div className="text-2xl font-bold text-red-400">
                                  {
                                    streamingResult.contradicting_evidence
                                      .length
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Streaming mode but no results yet
                        <div className="flex flex-col items-center justify-center h-full">
                          <Beaker className="h-12 w-12 text-white/20 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">
                            No Streaming Data
                          </h3>
                          <p className="text-sm text-white/60 text-center max-w-md mb-6">
                            Enter a scientific hypothesis in the input panel and
                            click "Validate Hypothesis" to see streaming results
                            visualized here.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setHypothesisText(
                                "The presence of dark matter affects galaxy rotation curves."
                              )
                            }
                          >
                            Try an Example Hypothesis
                          </Button>
                        </div>
                      )
                    ) : // Regular result visualization
                    hypothesisResult ? (
                      <div className="flex flex-col h-full">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Validation Visualization
                        </h3>

                        <div className="flex-1 flex items-center justify-center bg-[#252525] rounded-md border border-[#444] overflow-hidden">
                          {hypothesisResult.figures &&
                          hypothesisResult.figures.length > 0 &&
                          hypothesisResult.figures[0].image_data ? (
                            <img
                              src={`data:image/png;base64,${hypothesisResult.figures[0].image_data}`}
                              alt="Hypothesis visualization"
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="text-center p-6">
                              <p className="text-white/60 mb-2">
                                No visualization available
                              </p>
                              <p className="text-xs text-white/40">
                                Visualizations will appear here when available
                                from the validation process
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white/80 mb-2">
                            Evidence Summary
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-900/20 border border-green-900/30 rounded-md p-3">
                              <div className="text-green-400 text-sm font-medium mb-1">
                                Supporting Evidence
                              </div>
                              <div className="text-2xl font-bold text-green-400">
                                {hypothesisResult.supporting_evidence.length}
                              </div>
                            </div>
                            <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3">
                              <div className="text-red-400 text-sm font-medium mb-1">
                                Contradicting Evidence
                              </div>
                              <div className="text-2xl font-bold text-red-400">
                                {hypothesisResult.contradicting_evidence.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular mode but no results yet
                      <div className="flex flex-col items-center justify-center h-full">
                        <Beaker className="h-12 w-12 text-white/20 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          No Validation Data
                        </h3>
                        <p className="text-sm text-white/60 text-center max-w-md mb-6">
                          Enter a scientific hypothesis in the input panel and
                          click "Validate Hypothesis" to see results visualized
                          here.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setHypothesisText(
                              "High sodium intake is associated with increased risk of hypertension."
                            )
                          }
                        >
                          Try an Example Hypothesis
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Chat component using ReactDOM.createPortal */}
      {showChat && 
        ReactDOM.createPortal(
          <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
            <ChatComponent
              isExpanded={isChatExpanded}
              onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
              onClose={() => setShowChat(false)}
              initialPosition={{ x: 0, y: 0 }}
            />
          </div>,
          document.body
        )
      }
    
}
