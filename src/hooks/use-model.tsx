// Add to use-model.tsx
import axios from 'axios';

export const useQPLCGNModel = () => {
  const processDocument = async (text: string) => {
    try {
      // Call your API endpoint
      const response = await axios.post('https://colpali.api.scinter.org:5000/extract_concepts', {
        text
      });
      
      return response.data;
    } catch (error) {
      console.error('Error processing with QPLCGN model:', error);
      throw error;
    }
  };
  
  const predictRelationship = async (concept1: string, concept2: string, context: string) => {
    try {
      const response = await axios.post('https://colpali.api.scinter.org:5000/predict_relationship', {
        concept1,
        concept2,
        context
      });
      
      return response.data;
    } catch (error) {
      console.error('Error predicting relationship:', error);
      throw error;
    }
  };
  
  return {
    processDocument,
    predictRelationship
  };
};