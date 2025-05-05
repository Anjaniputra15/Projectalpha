import { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Eye, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [textAreaRef, setTextAreaRef] = useState<HTMLTextAreaElement | null>(null);

  // Update word and character counts when content changes
  useEffect(() => {
    // Count words (sequences of non-whitespace characters)
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    
    // Count characters (excluding line breaks for consistency with Word)
    const chars = content.replace(/\n/g, "").length;
    setCharCount(chars);
  }, [content]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleTextSelect = () => {
    if (textAreaRef) {
      const start = textAreaRef.selectionStart;
      const end = textAreaRef.selectionEnd;
      setSelectedText(content.substring(start, end));
    }
  };

  // Format functions
  const applyFormat = (formatType: string) => {
    if (!textAreaRef) return;
    
    const start = textAreaRef.selectionStart;
    const end = textAreaRef.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText.length === 0) return;
    
    let formattedText = "";
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "list":
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      case "align-left":
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        break;
      case "align-center":
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        break;
      case "align-right":
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    onChange(beforeText + formattedText + afterText);
    
    // Set the cursor position after the formatting
    setTimeout(() => {
      if (textAreaRef) {
        const newPosition = start + formattedText.length;
        textAreaRef.focus();
        textAreaRef.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Function to insert a tab character when Tab key is pressed
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!textAreaRef) return;
      
      const start = textAreaRef.selectionStart;
      const end = textAreaRef.selectionEnd;
      
      // Insert a tab character (or spaces)
      const newText = content.substring(0, start) + '    ' + content.substring(end);
      onChange(newText);
      
      // Set cursor position after the tab
      setTimeout(() => {
        if (textAreaRef) {
          textAreaRef.selectionStart = textAreaRef.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="gap-2"
          >
            {isPreview ? (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
          
          {!isPreview && (
            <TooltipProvider>
              <div className="flex items-center border-l ml-2 pl-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("bold")}
                      className="h-8 w-8"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("italic")}
                      className="h-8 w-8"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("underline")}
                      className="h-8 w-8"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("list")}
                      className="h-8 w-8"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>
                
                <div className="border-l mx-1 h-6"></div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("align-left")}
                      className="h-8 w-8"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Left</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("align-center")}
                      className="h-8 w-8"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Center</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("align-right")}
                      className="h-8 w-8"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Right</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {wordCount} words | {charCount} characters
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isPreview ? (
          <div className="prose dark:prose-invert max-w-none h-full p-4">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            ref={(el) => setTextAreaRef(el)}
            value={content}
            onChange={handleChange}
            onSelect={handleTextSelect}
            onKeyDown={handleTabKey}
            className="h-full w-full resize-none font-mono border-0 rounded-none"
            placeholder="Start writing..."
          />
        )}
      </div>
      
      <div className="border-t p-2 flex justify-between items-center text-xs text-gray-500">
        <div>
          {!isPreview && selectedText.length > 0 && 
            `Selected: ${selectedText.length} characters`
          }
        </div>
        <div>
          Line: {content.substring(0, textAreaRef?.selectionStart || 0).split('\n').length} | 
          Column: {textAreaRef?.selectionStart 
            ? textAreaRef.selectionStart - (content.substring(0, textAreaRef.selectionStart).lastIndexOf('\n') + 1) + 1
            : 1}
        </div>
      </div>
    </div>
  );
}