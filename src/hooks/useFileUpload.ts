import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Set the API base URL to your RunPod endpoint
const API_BASE_URL = "https://colpali.api.scinter.org";
// const API_BASE_URL = "http://colpali-api-153839638227.us-central1.run.app";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Add a timeout to fetch requests to avoid long waits - significantly increased for PDF processing
// For FormData to be used in fetchWithTimeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 200000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};


export const useFileUpload = () => {
  //const [state, setState] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedSections, setExtractedSections] = useState<any>(null);
  const [serverAvailable, setServerAvailable] = useState<boolean>(true);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange triggered", e);
    console.log("Files:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      try {
        // Check if it's a PDF file
        if (file.type === "application/pdf") {
          setIsProcessing(true);
          if (serverAvailable) {
            await processPdfFile(file);
          } else {
            // If server is not available, use fallback immediately
            await processPdfFallback(file);
          }
          setIsProcessing(false);
        } else {
          // For non-PDF files, use the original text extraction method
          console.log("No files selected or files array is empty");
          const text = await file.text();
          setFileContent(text);
          
          const textarea = document.querySelector<HTMLTextAreaElement>('#content');
          if (textarea) {
            textarea.value = text;
          }

          toast({
            title: "File loaded",
            description: `${file.name} has been loaded successfully.`,
          });
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to process the file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Added separate fallback function to handle PDF text extraction
  const processPdfFallback = async (file: File) => {
    toast({
      title: "Using local processing",
      description: "Processing PDF locally (basic text extraction only).",
    });
    
    try {
      const reader = new FileReader();
      return new Promise<void>((resolve, reject) => {
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string || "PDF content could not be extracted locally.";
            setFileContent(text);
            
            const textarea = document.querySelector<HTMLTextAreaElement>('#content');
            if (textarea) {
              textarea.value = text;
            }
            
            toast({
              title: "PDF processed locally",
              description: `${file.name} has been processed with basic extraction.`,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } catch (error) {
      console.error("Fallback extraction failed:", error);
      throw error;
    }
  };

  const processPdfFile = async (file: File) => {
    try {
      // First check if the server is responding with a health check
      try {
        console.log("Checking server health at:", `https://colpali.api.scinter.org/health`);
        const healthResponse = await fetchWithTimeout(`https://colpali.api.scinter.org/health`, {
          method: "GET",
          mode: "cors",
        }, 10000); // 10 second timeout for health check
        
        if (!healthResponse.ok) {
          console.error("Health check failed:", healthResponse.status, healthResponse.statusText);
          throw new Error(`Server health check failed with status: ${healthResponse.status}`);
        }
        
        console.log("Health check successful:", await healthResponse.json());
        setServerAvailable(true);
      } catch (healthError) {
        console.error("Health check error:", healthError);
        setServerAvailable(false);
        
        toast({
          title: "Server not available",
          description: "PDF processing service is not available. Using local processing instead.",
          // Change variant from "warning" to "destructive" since "warning" is not a valid variant
          variant: "destructive",
        });
        
        await processPdfFallback(file);
        return;
      }
      
      // Show processing toast
      toast({
        title: "Processing PDF",
        description: "Extracting sections from PDF. This may take a minute...",
      });
      
      // Create form data with the PDF file
      const formData = new FormData();
      formData.append("file", file);
      
      // Optional sections to extract
      const sections = [
        "Abstract", "Introduction", "Background", "Methods", 
        "Results", "Discussion", "Conclusion", "References"
      ];
      
      // Add sections as a JSON string in the request
      const requestData = {
        sections: sections
      };
      formData.append("request", JSON.stringify(requestData));
      
      // Send the file to your FastAPI backend with timeout
      console.log("Sending request to:", ` https://colpali.api.scinter.org/extract-sections/`);
      const response = await fetchWithTimeout(` https://colpali.api.scinter.org/extract-sections/`, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "omit",
      }, 120000); // 2 minute timeout for processing
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server responded with status: ${response.status}. Details: ${errorText}`);
      }
      
      // Parse the response
      const result = await response.json();
      console.log("Server response:", result);
      
      // Store the extracted sections
      setExtractedSections(result.sections);
      
      // Combine all extracted text into a single document for display
      let combinedContent = "";
      
      // Process each section
      if (result.sections && Object.keys(result.sections).length > 0) {
        Object.entries(result.sections).forEach(([sectionName, sectionData]: [string, any]) => {
          // Add section header
          combinedContent += `## ${sectionName}\n\n`;
          
          // Add content from each page found for this section
          if (Array.isArray(sectionData)) {
            sectionData.forEach((pageData: any) => {
              if (!pageData) return; // Skip if pageData is null or undefined
              
              // Ensure score is a valid number that can be formatted
              const score = typeof pageData.score === 'number' ? pageData.score : 0;
              const pageNum = pageData.page_num || 'unknown';
              
              // If content is directly included in the response
              if (pageData.content) {
                combinedContent += `Page ${pageNum} (Score: ${score.toFixed(2)})\n\n`;
                combinedContent += pageData.content + "\n\n";
              } else {
                // Just mention the page if content isn't directly available
                combinedContent += `Page ${pageNum} (Score: ${score.toFixed(2)})\n\n`;
              }
            });
          }
          
          combinedContent += "\n";
        });
      } else {
        combinedContent = "No sections were extracted from the PDF.";
      }
      
      // Set the file content based on the combined content
      setFileContent(combinedContent);
      
      // Update the textarea with the combined content
      const textarea = document.querySelector<HTMLTextAreaElement>('#content');
      if (textarea) {
        textarea.value = combinedContent;
      }
      
      const sectionCount = result.sections ? Object.keys(result.sections).length : 0;
      
      toast({
        title: "PDF processed",
        description: `${file.name} has been processed. Found ${sectionCount} sections.`,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "PDF processing error",
        description: error instanceof Error ? error.message : "Failed to process PDF file.",
        variant: "destructive",
      });
      
      // Try to extract text from PDF directly as fallback
      await processPdfFallback(file);
    }
  };

  return {
    selectedFile,
    fileContent,
    isProcessing,
    extractedSections,
    serverAvailable,
    handleFileChange
  };
};