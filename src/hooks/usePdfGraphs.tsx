import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphNode, GraphEdge } from "@/lib/types";
import axios from "axios";

export const usePdfGraphs = () => {
  const [pdfGraphs, setPdfGraphs] = useState<Record<string, any>>({});
  const [isLoadingPdfGraphs, setIsLoadingPdfGraphs] = useState(false);
  const { toast } = useToast();

  const fetchPdfGraphs = async (pdfId: string) => {
    if (!pdfId) {
      console.warn("No PDF ID provided to fetchPdfGraphs");
      return;
    }
  
    setIsLoadingPdfGraphs(true);
    try {
      const response = await axios.get(`/api/pdf-graphs/${pdfId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 3600000, // 2 minutes timeout
      });
  
      if (response.data && response.data.section_graphs) {
        setPdfGraphs(response.data.section_graphs);
  
        toast({
          title: "PDF Graphs Loaded",
          description: `Loaded ${Object.keys(response.data.section_graphs).length} sections.`,
        });
      } else {
        console.warn("Unexpected response format:", response.data);
        setPdfGraphs({});
        toast({
          title: "Warning",
          description: "Received empty or invalid graph data",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching PDF graphs:", error);
      setPdfGraphs({}); // Reset state on error
  
      let errorMessage = "Failed to load PDF graphs.";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = "No sections found for the given PDF ID.";
        } else {
          errorMessage = error.response?.data?.error || error.message;
        }
        console.error("Detailed error:", {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
  
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPdfGraphs(false);
    }
  };

  return {
    pdfGraphs,
    isLoadingPdfGraphs,
    fetchPdfGraphs,
  };
};