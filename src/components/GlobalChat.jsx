// src/components/GlobalChat.jsx
import { useState } from "react";
import ReactDOM from "react-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatComponent } from "@/components/ChatComponent";

export function GlobalChat() {
  const [showChat, setShowChat] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  
  return (
    <>
      {/* Chat toggle button - always visible */}
      <div 
        className="fixed bottom-6 right-6 z-50" 
        style={{ 
          display: showChat ? "none" : "block" 
        }}
      >
        <Button
          onClick={() => setShowChat(true)}
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat component - shown when toggled */}
      {showChat && 
        ReactDOM.createPortal(
          <div className="fixed bottom-6 right-6 z-50">
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
    </>
  );
}