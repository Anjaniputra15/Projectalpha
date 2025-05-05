import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { GraphProps } from "./types";
import { networkOptions } from "./config";
import { prepareGraphData } from "./utils";

export function Graph({ nodes, edges, onNodeClick }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
  
    const container = containerRef.current;
    const data = prepareGraphData(nodes, edges);
  
    // Create network
    const network = new Network(container, data, networkOptions);
    networkRef.current = network;
  
    // Add click handler
    if (onNodeClick) {
      network.on("click", (params) => {
        if (params.nodes.length > 0) {
          onNodeClick(params.nodes[0]);
        }
      });
    }
  
    // Handle stabilization and disable physics afterward
    network.once("stabilizationIterationsDone", () => {
      // Disable physics after initial layout
      network.setOptions({ physics: { enabled: false } });
      
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });
    });
  
    // Add a backup timeout to disable physics in case the event doesn't fire
    const physicsTimeout = setTimeout(() => {
      if (networkRef.current) {
        networkRef.current.setOptions({ physics: { enabled: false } });
      }
    }, 2000);  // 2 second backup
  
    // Basic resize handler
    const handleResize = () => {
      network.fit();
    };
  
    window.addEventListener("resize", handleResize);
  
    // Cleanup
    return () => {
      clearTimeout(physicsTimeout);
      window.removeEventListener("resize", handleResize);
      network.destroy();
      networkRef.current = null;
    };
  }, [nodes, edges, onNodeClick]);
  
  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 min-h-[400px] bg-[#1e1e1e] rounded-lg border border-[#363636] overflow-hidden"
      />
    </div>
  );
}
