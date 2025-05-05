import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextInputProps {
  onGraphUpdate: (nodes: any[], edges: any[]) => void;
  initialContent?: string;
  currentNoteId?: string;
}

export function TextInput({
  onGraphUpdate,
  initialContent = "",
  currentNoteId,
}: TextInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isEdited, setIsEdited] = useState(false);
  const { toast } = useToast();

  // Update content when initialContent changes (when a different note is selected)
  useEffect(() => {
    setContent(initialContent);
    setIsEdited(false);
  }, [initialContent]);

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEdited(true);
  };

  // Save the updated content to localStorage
  const handleSaveContent = () => {
    // Get all notes from localStorage
    const storedNotes = localStorage.getItem("scinter-notes");
    if (storedNotes && currentNoteId) {
      const notes = JSON.parse(storedNotes);

      // Update the note content
      const updatedNotes = notes.map((note: any) => {
        if (note.id === currentNoteId) {
          return {
            ...note,
            content: content,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });

      // Save back to localStorage
      localStorage.setItem("scinter-notes", JSON.stringify(updatedNotes));

      toast({
        title: "Success",
        description: "Note content saved successfully.",
      });

      setIsEdited(false);
    } else {
      toast({
        title: "Error",
        description:
          "No active note found. Please create or select a note first.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">Note Content</h2>
        {isEdited && (
          <Button
            onClick={handleSaveContent}
            className="bg-purple-600 hover:bg-purple-700 text-sm"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Textarea
        id="content"
        value={content}
        onChange={handleContentChange}
        placeholder="Enter your note content here..."
        className="flex-1 min-h-[400px] bg-[#2a2a2a] border-[#444] resize-none text-white"
      />

      <div className="flex justify-between mt-2 text-xs text-white/60">
        <div>{content.length} characters</div>
        {isEdited && <div className="text-amber-400">Unsaved changes</div>}
      </div>
    </div>
  );
}
