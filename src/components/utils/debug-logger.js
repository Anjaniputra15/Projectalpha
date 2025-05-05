// src/components/utils/debug-logger.js
// Placed in the correct directory path with correct export names

/**
 * Simple utility to log API responses and format them for the UI
 */

// Export with both names for compatibility
export const logFullResponse = (response) => {
  console.group('API Response Debug Info');
  console.log('Full response object:', response);
  
  if (response && response.parsed_result) {
    console.group('Parsed Results');
    console.log('Validation score:', response.parsed_result.validation_score);
    console.log('P-value:', response.parsed_result.p_value);
    console.log('Conclusion:', response.parsed_result.conclusion);
    
    console.group('Supporting Evidence');
    console.log(response.parsed_result.supporting_evidence || []);
    console.groupEnd();
    
    console.group('Contradicting Evidence');
    console.log(response.parsed_result.contradicting_evidence || []);
    console.groupEnd();
    
    console.group('Methods');
    console.log(response.parsed_result.methods || []);
    console.groupEnd();
    
    console.group('Sources');
    console.log(response.parsed_result.sources || []);
    console.groupEnd();
    
    console.groupEnd(); // Close Parsed Results
  }
  
  console.groupEnd(); // Close API Response Debug Info
};

// For backward compatibility
export const logApiResponse = logFullResponse;

// Format API response for the frontend
export const formatApiResponse = (response) => {
  if (!response) return null;
  
  // Create a safe result object with defaults for missing data
  return {
    hypothesis: response.hypothesis || '',
    validation_score: response.parsed_result?.validation_score || 0,
    p_value: response.parsed_result?.p_value || 0,
    supporting_evidence: formatEvidenceItems(response.parsed_result?.supporting_evidence),
    contradicting_evidence: formatEvidenceItems(response.parsed_result?.contradicting_evidence),
    methods: formatMethods(response.parsed_result?.methods),
    figures: formatFigures(response.parsed_result?.figures),
    sources: formatSources(response.parsed_result?.sources),
    conclusion: response.parsed_result?.conclusion || 'No conclusion available',
    timestamp: new Date().toISOString()
  };
};

// Helper functions
function formatEvidenceItems(items) {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map(item => ({
    source: item.source || 'Unknown source',
    description: item.description || item.text || 'No description available',
    strength: item.strength || 'moderate'
  }));
}

function formatMethods(methods) {
  if (!methods || !Array.isArray(methods)) return [];
  
  return methods.map(method => ({
    name: method.name || 'Unnamed method',
    description: method.description || 'No description available'
  }));
}

function formatFigures(figures) {
  if (!figures || !Array.isArray(figures)) return [];
  
  return figures.map(figure => ({
    title: figure.title || 'Untitled figure',
    description: figure.description || figure.caption || 'No description available',
    type: figure.type || 'chart',
    image_data: figure.image_data || null
  }));
}

function formatSources(sources) {
  if (!sources || !Array.isArray(sources)) return [];
  
  return sources.map(source => ({
    title: source.title || 'Untitled source',
    authors: Array.isArray(source.authors) ? source.authors : [source.author || 'Unknown author'],
    journal: source.journal || source.publication,
    year: source.year,
    url: source.url,
    doi: source.doi
  }));
}