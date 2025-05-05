import { useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Sidebar } from "@/components/Sidebar";
import { Graph } from "@/components/Graph";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import * as React from 'react';
import { PDFSectionViewer } from "@/components/PDFSectionViewer";
import { PDFSectionGraph } from "./PDFSectionGraph";
import { LeftSidebar } from "@/components/Leftsidebar";
import { HomePage } from "@/components/HomePage";
import { ConceptLayerTraining } from "@/components/ConceptLayerTraining";
//import { TestGraphComponent } from "@/components/testGraphComponent";
import { Loader2 } from "lucide-react";
import { IndexPage } from "@/components/IndexPage";
import AnalyticPage from "@/components/AnalyticPage";
import SonarEmbeddingVisualizer from "@/components/SonarPage";
import QuantumLCMDarkDashboard from "@/components/Dashboard";
import QuantumLCMDashboard from "@/components/LCMDashboard";
import ExperimentDesign from "@/components/ExperimentDesign";
import TestingProtocol from "@/components/TestingProtocol";
import BrainstormingSessions from "@/components/BrainstormSessions";
import { GlobalChat } from "@/components/GlobalChat";
import DatabaseConnectionComponent  from "@/components/DBinternalconnection";
import DocumentAnalysis from "@/components/DocumentAnalysis";
import DataCatalogComponent from "@/components/DataCatalog";
import LiteratureReviewComponent from "@/components/LiteratureReview";
import TechnicalReportsComponent from "@/components/Technicalreports";
import LCMTrainingVisualization from "@/components/ConceptLayer";
import {
  ChevronRight,
  ChevronLeft,
  Network,
  FileUp,
  UserCircle2,
  Beaker,
  Plus,
  Save,
  FileText,
  MessageCircle,
  Upload,
} from "lucide-react";
import { FileSystemItem } from "@/lib/types";
import { Link } from "react-router-dom";
import {
  HypothesisReport,
  HypothesisResult,
} from "@/components/HypothesisReport";
import { useHypothesis } from "@/hooks/use-Hypothesis";
import useStreamingHypothesis from "@/hooks/useStreamingHypothesis";
import StreamingHypothesisReport from "@/components/StreamingHypothesis";
import { ConfigurationComponent } from "@/components/ConfigurationModel";

import { Textarea } from "@/components/ui/textarea";
import { ChatComponent } from "@/components/ChatComponent";
import TrainingControls from "@/components/TrainingControl";
// In your main App.jsx or root layout file



//import { ReactNode } from "react";

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
  selectedFile,
  onFileChange,
  isGeneratingGraph,
  graphNodes,
  graphEdges,
  onGraphUpdate,
  children: ReactNode,
}: {
  items: any[];
  currentNote: any;
  isLoading: boolean;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  onRenameItem: (id: string, name: string) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: any) => void;
  onGenerateGraph: (content: string) => void;
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isGeneratingGraph: boolean;
  graphNodes: any[];
  graphEdges: any[];
  onGraphUpdate: (nodes: any[], edges: any[]) => void;
  children: React.ReactNode;
}) {
  const {
    selectedFile: uploadedFile,
    fileContent,
    isProcessing,
    extractedSections,
    serverAvailable,
    handleFileChange
  } = useFileUpload();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [panelSizes, setPanelSizes] = useState([60, 40]);
  const [activeTab, setActiveTab] = useState("notes");
  const [hypothesisText, setHypothesisText] = useState("");
  const [showHypothesisReport, setShowHypothesisReport] = useState(false);
  const [showStreamingReport, setShowStreamingReport] = useState(false);
  const [useStreamingMode, setUseStreamingMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { toast } = useToast();
  const [showSecondPanel, setShowSecondPanel] = useState(false);
  //const tabsWithSecondPanel = ["notes", "Document Analysis", "sections"];
  // New state for the enhanced note functionality
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [savedGraphs, setSavedGraphs] = useState({});
  const [savedHypotheses, setSavedHypotheses] = useState([]);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  
  // New state for section functionality
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionContent, setSectionContent] = useState("");
  
  const displayFile = uploadedFile || selectedFile;
  
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
  
  // Add effect to switch to sections tab when new sections are extracted
  //useEffect(() => {
  //  if (extractedSections && Object.keys(extractedSections).length > 0) {
  //    setActiveTab("sections");
  //  }
  //}, [extractedSections]);
  
  const handlePanelResize = (sizes) => {
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
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // If switching away from sections, clear selection
    if (tab !== "Document-Analysis") {
      setSelectedSection(null);
      setSectionContent("");
    }
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
  const handleSelectItem = (item) => {
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

  // Handler for selecting a section
  const handleSelectSection = (sectionName, content) => {
    setSelectedSection(sectionName);
    setSectionContent(content);
    
    // Generate graph for this section if needed
    if (content) {
      onGenerateGraph(content);
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
    const newNote = {
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
  const handleSelectHypothesis = (hypothesis) => {
    setSelectedHypothesis(hypothesis);
    setHypothesisText(hypothesis.text);
  };

  // Handler for generating graph from note content
 // Fix the handleGenerateGraphClick function
const handleGenerateGraphClick = () => {
  console.log("Generate Graph clicked, activeTab:", activeTab);
  let textContent = "";
  
  if (activeTab === "notes") {
    const contentElement = document.querySelector("#content");
    // Cast to HTMLTextAreaElement to access the value property
    textContent = contentElement instanceof HTMLTextAreaElement 
      ? contentElement.value 
      : "";
    console.log("Text content from notes:", textContent.substring(0, 100) + "...");
  } else if (activeTab === "Document-Analysis" && selectedSection) {
    textContent = sectionContent;
    console.log("Text content from sections:", textContent.substring(0, 100) + "...");
  }
  
  if (textContent) {
    onGenerateGraph(textContent);
  }
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
  
  const handleDeleteItem = async (id) => {
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
      onSelectItem(null);
      setIsCreatingNote(false);
      // Clear the graph
      onGraphUpdate([], []);
    }

    toast({
      title: "Success",
      description: "Note deleted successfully.",
    });
  };

  const handleDeleteHypothesis = (id) => {
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

  // Handler for content selection from PDF sections
  const handleSectionContentSelect = (sectionName, content) => {
    setSelectedSection(sectionName);
    setSectionContent(content);
    
    // Generate graph for this section
    if (content) {
      onGenerateGraph(content);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-[#1e1e1e]">
      {showSidebar && (
  <>
  
    <LeftSidebar 
      activeTab={activeTab}
      onTabChange={handleTabChange}
      extractedSections={extractedSections || {}}
      savedHypotheses={savedHypotheses}
    />
    
  </>
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
                  : activeTab === "Document-Analysis"
                  ? selectedSection
                    ? `Section: ${selectedSection}`
                    : "PDF Sections"
                  : selectedHypothesis
                  ? "Hypothesis Analysis"
                  : "New Hypothesis"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(activeTab === "notes" || activeTab === "Document-Analysis") && (
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
                  className="cursor-pointer inline-flex items-center gap-2 text-sm py-1.5 px-3 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <FileUp className="h-4 w-4" />
                  {displayFile ? displayFile.name : "Upload File"}
                </label>
              </div>
            )}
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
        
        
{/* Main Content Rendering Area */}
<div className="flex-1 bg-[#1e1e1e]"> 
    {/* Modified condition to include conceptLayer */}
    {activeTab === "home" || activeTab === "internal-databases" || activeTab === "lcm-core" || activeTab ==="data-catalogs"||activeTab === "file-uploads"||activeTab === "literature-review"
    ||activeTab === "technical-reports"
    ||activeTab === "index" || activeTab === "graph" || activeTab === "quantum" || activeTab === "configuration"|| activeTab === "embeddinglayer" || activeTab === "conceptLayer" 
    || activeTab === "dashboard" || activeTab === "labresource" || activeTab === "experiment-design" || activeTab === "testing-protocols"
|| activeTab === "brainstorming"? (
        <div className="h-full overflow-auto custom-scrollbar">
            {activeTab === "home" ? (
              <div className="flex-1 bg-[#1e1e1e] custom-scrollbar"> 
                <HomePage />
                </div>
            ) : activeTab === "file-uploads" ? (
              <DocumentAnalysis/>
            )
  
            : activeTab === "index" ? (
              <IndexPage />
          ) :  
             activeTab === "internal-databases"  ? (
                <DatabaseConnectionComponent/>

            ) : activeTab === "data-catalogs" ? (
              <DataCatalogComponent/>
            )
            : activeTab === "literature-review" ? (
              <LiteratureReviewComponent />
            ): activeTab === "technical-reports" ? (
              <TechnicalReportsComponent/>
            )

            
            : activeTab === "graph" ? (
                <AnalyticPage />
            ) : activeTab === "configuration" ? (
              <ConfigurationComponent />
          )  : activeTab === "embeddinglayer" ? (
              <SonarEmbeddingVisualizer />
          ) : activeTab === "conceptLayer" ? (
                <ConceptLayerTraining />
            ) : activeTab === "dashboard" ? (
              <div style={{minHeight: "200vh"}}>
              <QuantumLCMDarkDashboard />
              </div>
          ) : activeTab === "labresource" ? (
            <div style={{minHeight: "200vh"}}>
            <TrainingControls
              isTraining={false}
              epoch={0}
              trainingConfig={{ learningRate: 0.01, batchSize: 32, epochs: 10, nQubits: 4, diffusionSteps: 100, datasetType: "sequence" }}
              setTrainingConfig={(config) => console.log("Updated config:", config)}
              startTraining={() => console.log("Training started")}
              stopTraining={() => console.log("Training stopped")}
            />
            </div>
        ) : activeTab === "lcm-core" ? (
          <div className="h-full overflow-auto custom-scrollbar">
          <div style={{minHeight: "200vh"}}>
              <LCMTrainingVisualization />
              </div>
              </div>
      
        )
        : activeTab === "experiment-design" ? (
          <div style={{minHeight: "200vh"}}>
          <ExperimentDesign />
          </div>
      ) : activeTab === "testing-protocols" ? (
        <div style={{minHeight: "200vh"}}>
        <TestingProtocol/>
        </div>
    ) :  activeTab === "brainstorming" ? (
      <div style={{minHeight: "200vh"}}>
      <BrainstormingSessions/>
      </div>
  ):
      
             (
                // This is for quantum
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-white mb-4">Quantum Training</h1>
                    {/* Quantum training page content */}
                </div>
            )}
        </div>
    ) : (
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full" 
            onLayout={handlePanelResize}
          >
            <ResizablePanel
              defaultSize={showSecondPanel ? panelSizes[0] : 100}
              minSize={30}
              className="bg-[#1e1e1e]"
              style={{ height: "100%", overflow: "hidden" 
              }}
            >
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
                        className="flex-1 bg-[#2a2a2a] border-[#444] text-white"
                        id="content"
                      />
                    </div>
                  )}

                  {/* Show TextInput for existing note */}
                  {currentNote && !isCreatingNote && (
                    <TextInput
                      onGraphUpdate={onGraphUpdate}
                      initialContent={currentNote.content}
                      currentNoteId={currentNote.id}
                    />
                  )}
                </>
              ) : activeTab === "Document-Analysis" ? (
                <>
                  {/* If no file is uploaded yet, show upload button in center */}
                  {(!extractedSections || Object.keys(extractedSections).length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileUp className="h-12 w-12 text-white/20 mb-4" />
                      <h2 className="text-lg font-medium text-white mb-2">
                        No PDF Uploaded
                      </h2>
                      <p className="text-sm text-white/60 text-center max-w-md mb-6">
                        Upload a PDF file to extract and view its sections.
                      </p>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute"
                        id="section-file-upload"
                        accept=".pdf"
                      />
                      <label
                        htmlFor="section-file-upload"
                        className="cursor-pointer inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </label>
                    </div>
                  ) : selectedSection ? (
                    // Show the selected section content
                    <div className="flex flex-col h-full p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-white">
                          {selectedSection}
                        </h2>
                        <Button
                          onClick={() => {
                            // Add section content to note
                            if (currentNote) {
                              const textarea = document.querySelector('#content');
                              if (textarea && textarea instanceof HTMLTextAreaElement) {
                                textarea.value += "\n\n" + sectionContent;
                              }
                              
                              toast({
                                title: "Success",
                                description: "Section content added to note.",
                              });
                            } else {
                              // Create a new note with this content
                              setNoteTitle(selectedSection);
                              setNoteContent(sectionContent);
                              setIsCreatingNote(true);
                              setActiveTab("notes");
                            }
                          }}
                          className="ml-2 bg-purple-600 hover:bg-purple-700"
                          disabled={!sectionContent}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {currentNote ? "Add to Note" : "Create Note"}
                        </Button>
                      </div>
                      
                      <pre className="flex-1 bg-[#2a2a2a] border-[#444] text-white p-4 rounded-md overflow-auto whitespace-pre-wrap">
                        {sectionContent}
                      </pre>
                    </div>
                  ) : (
                    // Show the section viewer (list of sections)
                    <PDFSectionViewer 
                    pdfId={selectedFile?.name || "unknown-pdf"} // Add this prop
                    extractedSections={extractedSections || {}} 
                    onContentSelect={handleSectionContentSelect}
                    />
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
  <div className="mt-6 p-4 bg-[#2a2a2a] rounded border border-[#444] text-white">
    <h3 className="text-lg font-medium mb-2">Streaming Status</h3>
    <p><strong>Status:</strong> {streamingState?.status}</p>
    <p><strong>Progress:</strong> {streamingState?.progress}%</p>
    <p><strong>Message:</strong> {streamingState?.message}</p>

    {/* Debug data structure */}
    <details className="mt-2 text-xs">
      <summary className="cursor-pointer text-purple-400">Debug Data Structure</summary>
      <pre className="mt-1 p-2 bg-[#1a1a1a] rounded overflow-auto text-xs">
        {JSON.stringify(streamingState, null, 2)}
      </pre>
    </details>

    {/* Display result data if available */}
    {"result" in streamingState && streamingState.result && (
      <>
        <hr className="my-4 border-gray-600" />
        <h4 className="text-white/80 text-base font-semibold mb-2">Result</h4>
        
        {streamingState.result && 
          typeof streamingState.result === 'object' && 
          'parsed_result' in streamingState.result && (
          <>
            <p className="text-white/70 mb-3">
            {streamingState?.result?.parsed_result && 
  typeof streamingState.result.parsed_result === 'object' &&
  streamingState.result.parsed_result !== null &&
  'conclusion' in (streamingState.result.parsed_result as Record<string, unknown>) 
    ? (streamingState.result.parsed_result as {conclusion: string}).conclusion
    : 'Analysis in progress...'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900/20 border border-green-800/40 rounded p-3">
                <div className="text-green-400 text-sm">Supporting Evidence</div>
                <div className="text-2xl font-bold">
                  {"parsed_result" in streamingState.result && 
                  typeof streamingState.result.parsed_result === "object" &&
                  "supporting_evidence" in streamingState.result.parsed_result &&
                  Array.isArray(streamingState.result.parsed_result.supporting_evidence
                  ) ? streamingState.result.parsed_result.supporting_evidence.length : 0}
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-800/40 rounded p-3">
                <div className="text-red-400 text-sm">Contradicting Evidence</div>
                <div className="text-2xl font-bold">
                  {"contradicting_evidence" in (streamingState.result.parsed_result as Record<string, any>) 
                    ? (streamingState.result.parsed_result as { contradicting_evidence: any[] }).contradicting_evidence.length 
                    : 0}
                </div>
              </div>
            </div>

            {"parsed_result" in streamingState.result &&
              typeof streamingState.result.parsed_result === "object" &&
              "validation_score" in streamingState.result.parsed_result &&
              streamingState.result.parsed_result.validation_score && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/40 rounded">
                <div className="text-blue-400 text-sm">Validation Score</div>
                <div className="text-2xl font-bold">
                  {typeof streamingState.result.parsed_result.validation_score === 'number' 
                    ? (streamingState.result.parsed_result.validation_score * 100).toFixed(1) 
                    : 'N/A'}%
                </div>
                {"p_value" in streamingState.result.parsed_result && (
                  <div className="text-sm text-blue-400/70 mt-1">
                    p-value: {typeof streamingState.result.parsed_result.p_value === 'number' 
                      ? streamingState.result.parsed_result.p_value 
                      : 'N/A'}
                  </div>
                )}
              </div>
            )}

            {/* Evidence Details */}
            {(streamingState.result.parsed_result as any).supporting_evidence && 
 (streamingState.result.parsed_result as any).supporting_evidence.length > 0 && (
  <div className="mt-4">
                <h5 className="text-sm font-medium text-white/80 mb-2">Supporting Evidence</h5>
                <div className="space-y-2">
                  {(streamingState.result.parsed_result as any).supporting_evidence.length.map((evidence, index) => (
                    <div key={index} className="p-2 bg-green-900/10 border border-green-800/30 rounded">
                      <p className="text-sm">{evidence.description}</p>
                      <p className="text-xs text-green-400/70 mt-1">Source: {evidence.source}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          evidence.strength === "strong" 
                            ? "bg-green-700/50 text-green-300"
                            : evidence.strength === "moderate"
                            ? "bg-yellow-700/50 text-yellow-300"
                            : "bg-blue-700/50 text-blue-300"
                        }`}>
                          {evidence.strength} evidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

{((streamingState.result?.parsed_result as { contradicting_evidence?: any[] })?.contradicting_evidence?.length ?? 0) > 0 && (
  <div className="mt-4">
    <h5 className="text-sm font-medium text-white/80 mb-2">Contradicting Evidence</h5>
    <div className="space-y-2">
      {(streamingState.result?.parsed_result as { contradicting_evidence?: any[] })?.contradicting_evidence?.map((evidence, index) => (
        <div key={index} className="p-2 bg-red-900/10 border border-red-800/30 rounded">
                      <p className="text-sm">{evidence.description}</p>
                      <p className="text-xs text-red-400/70 mt-1">Source: {evidence.source}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          evidence.strength === "strong" 
                            ? "bg-red-700/50 text-red-300"
                            : evidence.strength === "moderate"
                            ? "bg-orange-700/50 text-orange-300"
                            : "bg-gray-700/50 text-gray-300"
                        }`}>
                          {evidence.strength} evidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </>
    )}

    {/* Display appropriate buttons based on status */}
    <div className="mt-4 flex justify-between">
      {(streamingState?.status === "completed" || streamingState?.status === "failed") && (
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleCloseStreamingReport}
        >
          Close
        </Button>
      )}
      
      {"result" in streamingState && streamingState?.status === "completed" && (
        <Button
          variant="outline"
          className="border-purple-500/50 hover:bg-purple-500/20"
          onClick={handleSaveHypothesis}
        >
          Save Hypothesis
        </Button>
      )}
    </div>
  </div>
)}


                </div>
              )}
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
    {activeTab === "Document-Analysis" ? (
      // Document Analysis Graph Visualization
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/80">
            Document Knowledge Graph
          </span>
        </div>
        <div className="flex flex-col h-[calc(100%-3rem)] bg-[#1e1e1e] border border-[#363636] rounded-md">
          <PDFSectionGraph 
            sectionData={{
              entities: Object.keys(extractedSections || {}),
              edges: []
            }}
          />
        </div>
      </div>
    ) : activeTab === "notes" || activeTab === "Document-Analysis" ? (
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
        ((activeTab === "notes" && !currentNote && !isCreatingNote) ||
        (activeTab === "Document-Analysis" && !selectedSection))
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

    {/* Add the test button here */}
    <Button
      variant="outline"
      size="sm"
      className="text-xs h-7 px-2 bg-purple-600/20 border-purple-600/40 hover:bg-purple-600/30"
      onClick={() => {
        // Test data - simple graph for debugging
        const testNodes = [
          "Focus Error", 
          "Telescope Diameter", 
          "LCS WFS", 
          "Sodium Centroid"
        ];
        const testEdges = [
          ["LCS WFS", "Focus Error", "MEASURES"],
          ["Focus Error", "Telescope Diameter", "PROPORTIONAL_TO"],
          ["Sodium Centroid", "Focus Error", "AFFECTS"]
        ];
        
        // Update graph state with test data
        onGraphUpdate(testNodes, testEdges);
        console.log("Test graph data loaded!");
      }}
    >
      <Beaker className="h-3.5 w-3.5 mr-1.5" />
      Test Graph
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
                      <div className="flex flex-col h-[calc(100%-3rem)] bg-[#1e1e1e] border border-[#363636] rounded-md">
            {/* THIS IS WHERE YOU SHOULD CHANGE THE COMPONENT */}

{/* Before rendering graph, add this debugging */}
{(() => {
  console.log("Current activeTab:", activeTab);
  console.log("Selected section:", selectedSection);
  console.log("Graph nodes:", graphNodes?.length || 0);
  console.log("Graph edges:", graphEdges?.length || 0);
  return null;
})()}

{/* Graph visualization component */}
{/* Graph visualization component */}
{graphNodes.length > 0 ? (
  (() => {
    console.log("Selecting graph component based on activeTab:", activeTab);
    
    // Create a completely isolated rendering path for each tab
    if (activeTab === "Document-Analysis" && selectedSection) {
      console.log("Using PDFSectionGraph");
      return (
        <div className="w-full h-full" style={{ minHeight: "400px" }}>
          <PDFSectionGraph 
            sectionData={{
              entities: graphNodes.map(node => 
                typeof node === 'object' ? node.name || node.label || node.id || 'Unknown' : node
              ),
              edges: graphEdges.map(edge => {
                if (Array.isArray(edge)) return edge;
                const source = typeof edge.source === 'object' ? edge.source.id : (edge.source || edge.from || '');
                const target = typeof edge.target === 'object' ? edge.target.id : (edge.target || edge.to || '');
                const label = edge.type || edge.label || '';
                return [source, target, label];
              }).filter(edge => edge[0] && edge[1])
            }}
          />
        </div>
      );
    } 
    
    // For notes tab, explicitly return Graph component with no reference to PDFSectionGraph
    if (activeTab === "notes") {
      console.log("Using standard Graph component");
      // Import the graph explicitly to avoid any potential reference issues
      const GraphComponent = Graph;
      return <GraphComponent nodes={graphNodes} edges={graphEdges} />;
    }
    
    // Default fallback, shouldn't reach here but just in case
    console.log("Using fallback standard Graph component");
    return <Graph nodes={graphNodes} edges={graphEdges} />;
  })()
) : (
  // Empty state code
  <div className="flex flex-col items-center justify-center h-full p-6">
    <Network className="h-12 w-12 text-white/20 mb-4" />
    <h3 className="text-lg font-medium text-white mb-2">
      No Graph Generated
    </h3>
    <p className="text-sm text-white/60 text-center max-w-md">
      Click the "Generate Graph" button to create a knowledge graph.
    </p>
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
                            {streamingResult.visualization &&
                            streamingResult.visualization.image_data ? (
                              <img
                                src={`data:image/png;base64,${streamingResult.visualization.image_data}`}
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
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-green-50 p-3 rounded">
                            <h4 className="text-green-700 font-semibold">Supporting Evidence</h4>
                            <p className="text-2xl text-green-900">
                              {hypothesisResult.supporting_evidence?.length || 0}
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded">
                            <h4 className="text-red-700 font-semibold">Contradicting Evidence</h4>
                            <p className="text-2xl text-red-900">
                              {hypothesisResult.contradicting_evidence?.length || 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-[#252525] rounded-md border border-[#444] overflow-hidden mb-4">
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
    {hypothesisResult.conclusion && (
      <div className="p-3 bg-[#2a2a2a] rounded-md border border-[#444]">
        <h4 className="text-sm font-medium text-white/80 mb-2">Conclusion</h4>
        <p className="text-white/60">{hypothesisResult.conclusion}</p>
      </div>
    )}
    
  <div className="flex flex-col h-full items-center justify-center">
    <div className="text-center">
      <p className="text-white/60 mb-2">
        No visualization available
      </p>
      <p className="text-xs text-white/40">
        Validations will appear here when available
      </p>
    </div>
  </div>
)
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
          )}
        </div>
      </div>

      {showChat &&
        ReactDOM.createPortal(
          <div
            style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
          >
            <ChatComponent
              isExpanded={isChatExpanded}
              onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
              onClose={() => setShowChat(false)}
              initialPosition={{ x: 0, y: 0 }}
            />
          </div>,
          document.body
        )}
  
    
    {/* Add the GlobalChat component right here, at the end, but still inside the main div */}
    <GlobalChat />
      
    </div>
  );
}