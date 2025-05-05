import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphNode, GraphEdge } from "@/lib/types";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// Utility function to get or generate a user ID
const getUserId = (): string => {
  // Check if user ID exists in local storage
  let userId = localStorage.getItem('scinter_user_id');
  
  // If not, generate a new one
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('scinter_user_id', userId);
  }
  
  return userId;
};

export const useGraph = () => {
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const { toast } = useToast();

  const handleGenerateGraph = async (textContent: string) => {
      // if (activeTab !== "sections") {
    setGraphNodes([]);
    setGraphEdges([]);
  // }
    setIsGeneratingGraph(true);
    try {
      if (!textContent?.trim()) {
        toast({
          title: "Error",
          description: "Please enter text or upload a file before generating the graph.",
          variant: "destructive",
        });
        setIsGeneratingGraph(false);
        return;
      }
      
      // Get dynamic user ID
      const userId = getUserId();
      
      console.log("Generating graph with payload:", { 
        text: textContent, 
        user_id: userId 
      });

     /* The code snippet you provided is making a POST request to the
     "https://vm.api.scinter.org/api/submit-text" endpoint using axios. Here's a breakdown of what
     each part of the axios.post call is doing: */
      const response = await axios.post(
        "https://vm.api.scinter.org/api/submit-text",
        { 
          text: textContent,
          
          //text: "Section: 1. INTRODUCTION Laser modulation to reduce the dependence on natural guidestar for focus sensing: simulations and preliminary resultsSowmya Hassan Krishnaa, Noelia Martinez Reya, Francois Rigauta, John Harta,L y l eR o b e r t sb,and Celine d’OrgevilleaaAustralian National University, Research School of Astronomy and Astrophysics, AdvancedInstrumentation Technology Centre, Mount Stromlo Observatory, Cotter Rd., Weston Creek,Canberra, ACT, 2611, AustraliabAustralian National University, Research school of Physics, Centre of GravitationalAstrophysics, Building 38a, Science Rd., Canberra, ACT, 2601, AustraliaABSTRACTThe adaptive optics (AO) system requires natural guide stars (NGS) to di!erentiate the focus error generateddue to vertical shift in the sodium centroid altitude together with atmospheric turbulence. This dependency onNGS restricts achieving useable sky coverage and AO operation during dawn. One of the proposed approachesto distinguish these two focus errors is to monitor continuously the region of the sodium layer where the LGS isgenerated. The classical approaches used for this task, direct imaging, and LIDAR technology, have limitations.The technique of continuously amplitude modulating the guidestar laser (GSL) according to the pseudo-randombinary sequence (PRBS) has the potential to overcome the limitations of classical approaches and reduce thedependency of the AO system on the NGS. The focus error is the major issue in large telescopes; therefore, weextended the PRBS technique to one of the large telescopes, the Gaint Magellan Telescope through numericalsimulations. The study shows that modulation strength of 0.47 is required to fulﬁl the requirements during highsodium column density. Previously, it was intended to experimentally verify the technique with an LGS facilityinstalled at the 1.8 m EOS telescope, Mount Stromlo, Canberra, Australia. Due to unavoidable circumstances,we now intend to perform the experiment with the LGS facility at the 2.3 m ANU telescope, Siding SpringObservatory (SSO), Coonabarabran, Australia. The paper presents the numerical simulations conducted withparameters of SSO, hardware selection for the experiment based on the system requirements, and preliminarytest results from the laboratory.Keywords:Sodium Laser Guide Star Adaptive Optics, Sodium Centroid Altitude, LGS WFS Focus Error,Pseudo Random Binary Sequence, Laser Amplitude Modulation, Large Telescopes.1. INTRODUCTIONThe mesospheric sodium layer in the atmosphere is believed to be formed by the deposition of meteoric ablationand consists of Sodium (Na), Potassium (K), Iron (Fe), Magnesium (Mg), Calcium (Ca) and Silicon (Si) as majormetallic constituents.1The sodium layer has a full-width half-maximum of→10 km with a centroid altitudeof→90 km. This layer exhibits sodium column densities that vary on an hourly, daily and yearly basis in therange of 1↑109↓10↑109atoms/cm2usually with trends low in local summer and high in local winters atall altitudes. The sporadic events2caused by a sudden burst of sodium atoms in the layer increase the columndensity and shifts the centroid altitude vertically. In an experiment at Calar Alto by O’Sullivan, a shift of up to400 m in the timeframe of 1 to 2 min was observed.3This centroid altitude shift induces focus errors on the laserguide star (LGS) wavefront sensor (WFS), Equ. 1 in Davis et al4expresses the relationship between WFS focuserror (ωfocus WFE) and sodium centroid error (ωh). In large telescopes like Giant Magellan Telescope (GMT),Thirty Meter Telescope (TMT), and Extremely Large Telescope (ELT),ωh=1mr e s u l t si nωfocus WFE= 8 - 20Further author information: (Send correspondence to Sowmya Hassan Krishna)Sowmya Hassan Krishna: E-mail: sowmya.Hk@anu.edu.au, Telephone: +61 402 490 697Adaptive Optics Systems VIII, edited by Laura Schreiber, Dirk Schmidt, Elise Vernet,Proc. of SPIE Vol. 12185, 121851G · © 2022 SPIE0277-786X · doi: 10.1117/12.2627080Proc. of SPIE Vol. 12185  121851G-1Downloaded From: https://www.spiedigitallibrary.org/conference-proceedings-of-spie on 16 Apr 2023Terms of Use: https://www.spiedigitallibrary.org/terms-of-use", 
          user_id: userId 
        },
        { 
          headers: { 
            "Content-Type": "application/json" 
          },
          timeout: 560000 // 30 seconds timeout
        }
      );

      console.log("Full API Response:", JSON.stringify(response.data, null, 2));
      console.log("Entities count:", response.data.entities?.length);
      console.log("Edges count:", response.data.edges?.length);

      const apiData = response.data;
      
      // Validate the response data
      if (!apiData || (!apiData.entities && !apiData.edges)) {
        throw new Error("Invalid API response: No entities or edges found");
      }

      // Transform API response into graph nodes and edges
      const nodes: GraphNode[] = (apiData.entities || []).map((entity: string) => ({
        id: entity,
        label: entity,
        labelProps: {
          style: {
            fill: 'white',
            fontSize: 12,
            fontWeight: 'bold',
          },
          position: 'center',
        },
        size: 30,
      }));

      const edges: GraphEdge[] = (apiData.edges || []).map(([source, target, type]: [string, string, string]) => ({
        from: source,
        to: target,
        label: type || "RELATED_TO"
      }));

      setGraphNodes(nodes);
      setGraphEdges(edges);

      toast({
        title: "Graph Generated",
        description: `Created ${nodes.length} nodes and ${edges.length} relationships.`,
      });
    } catch (error) {
      console.error("Error generating graph:", error);
      
      // More detailed error message
      let errorMessage = "Failed to generate graph. Please try again.";
      if (axios.isAxiosError(error)) {
        // Log full error details
        console.error("Axios Error Details:", {
          response: error.response,
          request: error.request,
          message: error.message
        });

        errorMessage = error.response?.data?.error || 
                      `Server error (${error.response?.status || 'unknown'}): ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingGraph(false);
    }
  };

  return {
    isGeneratingGraph,
    graphNodes,
    graphEdges,
    handleGenerateGraph,
    setGraphNodes,
    setGraphEdges
  };
};
