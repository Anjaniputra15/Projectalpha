import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Neo4jProvider } from 'use-neo4j';
import neo4j from 'neo4j-driver';
import Index from "./pages/Index";
//import Login from "./pages/Login";
//import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Neo4j connection details
const NEO4J_HOST = "neo4j+s://a2f1b95f.databases.neo4j.io";
const NEO4J_USERNAME = "neo4j";
const NEO4J_PASSWORD = "4LUdL2PgS7bkJP18Fdv9prmvHZPGYTpm05xlJlnziy4";

console.log('Using Neo4j Host:', NEO4J_HOST);

// Create Neo4j driver without encryption settings (already in URL)
let driver;
try {
  // The neo4j+s:// protocol already specifies encryption
  // so we don't need to set it in the config object
  driver = neo4j.driver(
    NEO4J_HOST,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    // No additional config needed
  );
  console.log('Neo4j driver created successfully');
} catch (error) {
  console.error('Failed to create Neo4j driver:', error);
  driver = null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {driver ? (
        <Neo4jProvider driver={driver}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                
                <Route path="/" element={<Index />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </Neo4jProvider>
      ) : (
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="*" 
                element={
                  <div className="flex items-center justify-center h-screen">
                    <div className="bg-red-500/10 border border-red-500 rounded-md p-6 max-w-md text-center">
                      <h2 className="text-xl font-semibold text-white mb-4">Neo4j Connection Error</h2>
                      <p className="text-gray-300 mb-2">
                        Failed to connect to Neo4j database. Please check your connection details and try again.
                      </p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      )}
    </QueryClientProvider>
  );
};

export default App;
