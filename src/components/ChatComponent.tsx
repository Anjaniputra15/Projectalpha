import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, X, Maximize2, Minimize2, Move } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatComponentProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export function ChatComponent({ 
  isExpanded, 
  onToggleExpand, 
  onClose,
  initialPosition = { x: 0, y: 0 }
}: ChatComponentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I can help you understand the knowledge graph. What would you like to know?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of messages when new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && chatRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Boundary checking to keep chat on screen
        const chat = chatRef.current;
        const chatRect = chat.getBoundingClientRect();
        const maxX = window.innerWidth - chatRect.width;
        const maxY = window.innerHeight - chatRect.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatRef.current) {
      const chatRect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - chatRect.left,
        y: e.clientY - chatRect.top
      });
      setIsDragging(true);
    }
  };

  const queryKnowledgeGraph = async (userQuestion: string) => {
    try {
      const response = await fetch('https://agentgraphs-153839638227.australia-southeast1.run.app/query-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error querying knowledge graph:', error);
      return {
        success: false,
        evaluated_answer: 'Sorry, I encountered an error when trying to query the knowledge graph. Please try again later.'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Query the knowledge graph API
      const result = await queryKnowledgeGraph(userMessage.content);
      
      let assistantResponse = '';
      
      if (result.success) {
        // Use the evaluated answer from the API but remove the "Based on the Neo4j database results" phrase
        let cleanedResponse = result.evaluated_answer;
        
        // Remove the phrase "Based on the Neo4j database results" and variations
        cleanedResponse = cleanedResponse.replace(/based on the neo4j database results,?\s?/i, '');
        cleanedResponse = cleanedResponse.replace(/based on the neo4j results,?\s?/i, '');
        
        // Set the cleaned response
        assistantResponse = cleanedResponse;
        
        // Optionally add information about entities if available
        if (result.entities && result.entities.length > 0) {
          assistantResponse += '\n\nEntities found: ' + result.entities.join(', ');
        }
      } else {
        assistantResponse = 'I couldn\'t find information related to your question in the knowledge graph. Please try asking differently or explore another topic.';
      }

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: assistantResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col bg-[#252525] border border-[#444] rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
      isExpanded ? 'h-[70vh]' : 'h-[400px]'
    }`}>
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#333] border-b border-[#444]">
        <h3 className="text-sm font-medium text-white">Knowledge Graph Chat</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onToggleExpand}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#333] text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#333] rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-white/70" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Chat input */}
      <div className="p-3 border-t border-[#444] bg-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the knowledge graph..."
            className="flex-1 bg-[#333] border-[#555] text-white"
            disabled={isLoading}
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Component to be used in the Layout.tsx
export const MovableChat = () => {
  const [showChat, setShowChat] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 450 });

  return showChat ? (
    <ChatComponent 
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
      onClose={() => setShowChat(false)}
      initialPosition={position}
    />
  ) : null;
};

export default ChatComponent;