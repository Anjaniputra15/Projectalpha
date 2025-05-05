import { useNotes } from "@/hooks/useNotes";
import { useGraph } from "@/hooks/useGraph";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Layout } from "@/components/Layout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedHypothesisValidation from "@/components/HypothesisValidation";

export default function Index() {
  const { 
    items, 
    currentNote, 
    isLoading,
    setCurrentNote,
    handleCreateNote,
    handleCreateFolder,
    handleRenameItem,
    handleDeleteItem
  } = useNotes();

  const {
    isGeneratingGraph,
    graphNodes,
    graphEdges,
    handleGenerateGraph,
    setGraphNodes,
    setGraphEdges
  } = useGraph();

  const {
    selectedFile,
    handleFileChange
  } = useFileUpload();

  return (
    <Layout
      items={items}
      currentNote={currentNote}
      isLoading={isLoading}
      onCreateNote={handleCreateNote}
      onCreateFolder={() => handleCreateFolder("New Folder")}
      onRenameItem={handleRenameItem}
      onDeleteItem={handleDeleteItem}
      onSelectItem={(item) => {
        if (item.type === "file") {
          setCurrentNote(item);
        }
      }}
      onGenerateGraph={handleGenerateGraph}
      selectedFile={selectedFile}
      onFileChange={handleFileChange}
      isGeneratingGraph={isGeneratingGraph}
      graphNodes={graphNodes}
      graphEdges={graphEdges}
      onGraphUpdate={(nodes, edges) => {
        setGraphNodes(nodes);
        setGraphEdges(edges);
      }}
    >
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="home">home</TabsTrigger>
          
        </TabsList>
        
        <TabsContent value="notes" className="w-full">
          {/* Your existing notes content */}
          <div className="flex flex-col h-full">
            {currentNote ? (
              <div className="flex-1 overflow-auto">
                {/* Display current note content here */}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">{currentNote.name}</h2>
                  {/* Note content would be rendered here */}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a note or create a new one to get started
              </div>
            )}
          </div>
        </TabsContent>
        
        
      </Tabs>
    </Layout>
  );
}