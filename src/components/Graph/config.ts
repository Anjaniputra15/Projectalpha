export const getNodeColor = (type?: string) => {
  const colors: { [key: string]: { background: string; border: string } } = {
    default: { background: '#FF9966', border: '#E88A5C' },
    person: { background: '#E882E8', border: '#D174D1' },
    organization: { background: '#66B3FF', border: '#5CA1E6' },
    location: { background: '#98E698', border: '#89D789' },
    event: { background: '#FFB366', border: '#E6A15C' },
  };
  return type && colors[type] ? colors[type] : colors.default;
};

export const networkOptions = {
  nodes: {
    shape: "dot",
    size: 25,
    font: {
      size: 14,  // Increased for better visibility
      face: "Inter",
      color: "#FFFFFF",  // Changed to white
      bold: {
        color: "#FFFFFF",  // Changed to white
        size: 14,
        face: "Inter",
        mod: "bold"
      }
    },
    borderWidth: 2,
    shadow: {
      enabled: true,
      color: 'rgba(0,0,0,0.2)',
      size: 5,
      x: 2,
      y: 2,
    },
  },
  edges: {
    color: {
      color: '#999999',
      highlight: '#666666',
      hover: '#666666',
    },
    width: 1,
    smooth: {
      enabled: true,
      type: "continuous",
      roundness: 0.5,
    },
    dashes: [5, 5],
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      }
    },
    font: {  // Added font settings for edge labels
      color: "#FFFFFF",
      size: 12,
      face: "Inter",
      align: "middle"
    }
  },
  layout: {
    hierarchical: {
      direction: "UD", // Up-down layout
      sortMethod: "directed",
      levelSeparation: 150,
      nodeSpacing: 100
    }
  },

  physics: {
    enabled: false  // Simply disable physics completely
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    hideEdgesOnDrag: true,
    navigationButtons: false,
    keyboard: false,
    zoomView: true,
    dragView: true,
  },
};
