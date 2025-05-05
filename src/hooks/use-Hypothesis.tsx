// src/hooks/use-Hypothesis.tsx

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { HypothesisResult } from '@/components/HypothesisReport';


// Import from the correct path
import { logFullResponse, formatApiResponse } from '@/components/utils/debug-logger.js';




export const useHypothesis = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [hypothesisResult, setHypothesisResult] = useState<HypothesisResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUsingSim, setIsUsingSim] = useState(false);
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);

  const validateHypothesis = async (hypothesis: string, alpha: number = 0.05) => {
    setIsValidating(true);
    setValidationError(null);
    setIsUsingSim(false);
    setRawApiResponse(null);
  
    try {
      console.log(`Validating hypothesis: ${hypothesis}`);
      
      // 1. Start validation with POST
      const response = await axios.post("https://popper.api.scinter.org/validate-async", {
        hypothesis,
        alpha,
        max_num_of_tests: 5,
        time_limit: 2
      });
  
      const { job_id } = response.data;
      if (!job_id) throw new Error("No job_id returned from API");
      console.log(`Job started with ID: ${job_id}`);
  
      // 2. Poll until complete
      let attempts = 0;
      const maxAttempts = 500;
      const delay = 2000;
  
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}`);
        
        try {
          const statusRes = await axios.get(
            `https://popper.api.scinter.org/validation-result/${job_id}`
          );
  
          const data = statusRes.data;
          console.log(`Job status: ${data.status}`);
          
          // Update UI with progress even before completion
          setRawApiResponse(data);
          
          if (data.status === "completed") {
            console.log("Validation completed successfully");
            const formatted = formatApiResponse(data);
            setHypothesisResult(formatted);
            return formatted;
          }
  
          if (data.status === "failed") {
            console.error("Validation failed:", data.error);
            setValidationError(data.error || "Validation failed");
            throw new Error(data.error || "Validation failed");
          }
        } catch (pollError) {
          console.warn(`Polling error (attempt ${attempts}):`, pollError);
          // Continue polling even if one request fails
        }
  
        await new Promise((r) => setTimeout(r, delay));
      }
  
      // Timeout fallback
      throw new Error("Validation timed out");
    } catch (error: any) {
      console.error("Validation failed:", error);
      setValidationError(
        error.message || "Validation failed or timed out. Showing simulation."
      );
      setIsUsingSim(true);
      const simulated = simulateHypothesisValidation(hypothesis, alpha);
      setHypothesisResult(simulated);
      return simulated;
    } finally {
      setIsValidating(false);
    }
  };
  

  const clearHypothesisResult = () => {
    setHypothesisResult(null);
    setValidationError(null);
    setIsUsingSim(false);
    setRawApiResponse(null);
  };

  // Create a simulated result for when the API is unavailable
  const simulateHypothesisValidation = (hypothesis: string, alpha: number): HypothesisResult => {
    // Is this a "known" hypothesis? Generate appropriate results
    const lowerHypothesis = hypothesis.toLowerCase();
    
    let validation_score = 0;
    let p_value = 0;
    let conclusion = '';
    let supporting_evidence: Array<{
      source: string;
      description: string;
      strength: "strong" | "moderate" | "weak";
    }> = [];
    let contradicting_evidence: Array<{
      source: string;
      description: string;
      strength: "strong" | "moderate" | "weak";
    }> = [];
    
    // Dark matter hypothesis
    if (lowerHypothesis.includes('dark matter') && lowerHypothesis.includes('galaxy')) {
      validation_score = 0.87;
      p_value = 0.0012;
      conclusion = 'Strong evidence supports the hypothesis that dark matter affects galaxy rotation curves.';
      supporting_evidence = [
        {
          description: 'Galaxy rotation curves show higher rotational velocities at large radii than predicted by visible matter alone.',
          source: 'Rubin et al. (1980), Astrophysical Journal',
          strength: "strong"
        },
        {
          description: 'Gravitational lensing observations show mass distributions beyond what can be accounted for by visible matter.',
          source: 'Clowe et al. (2006), Astrophysical Journal Letters',
          strength: "strong"
        },
        {
          description: 'Computer simulations incorporating dark matter successfully reproduce observed galaxy structures.',
          source: 'Springel et al. (2005), Nature',
          strength: "moderate"
        }
      ];
      contradicting_evidence = [
        {
          description: 'Modified Newtonian Dynamics (MOND) can explain some galaxy rotation curves without dark matter.',
          source: 'Milgrom (1983), Astrophysical Journal',
          strength: "moderate"
        }
      ];
    }
    // Sodium hypothesis
    else if (lowerHypothesis.includes('sodium') && lowerHypothesis.includes('hypertension')) {
      validation_score = 0.92;
      p_value = 0.0005;
      conclusion = 'Strong evidence supports the association between high sodium intake and increased risk of hypertension.';
      supporting_evidence = [
        {
          description: 'Meta-analysis of 26 randomized trials shows significant blood pressure reduction with lowered sodium intake.',
          source: 'He et al. (2013), British Medical Journal',
          strength: "strong"
        },
        {
          description: 'Population studies show lower hypertension rates in regions with low-sodium diets.',
          source: 'Intersalt Cooperative Research Group (1988), British Medical Journal',
          strength: "strong"
        },
        {
          description: 'Controlled studies demonstrate dose-dependent relationship between sodium intake and blood pressure.',
          source: 'DASH-Sodium Collaborative Research Group (2001), New England Journal of Medicine',
          strength: "strong"
        }
      ];
      contradicting_evidence = [
        {
          description: 'Some studies suggest J-shaped association, with very low sodium intake also associated with adverse outcomes.',
          source: 'O\'Donnell et al. (2014), New England Journal of Medicine',
          strength: "moderate"
        }
      ];
    }
    // CO2 hypothesis
    else if (lowerHypothesis.includes('co2') && lowerHypothesis.includes('temperature')) {
      validation_score = 0.95;
      p_value = 0.0001;
      conclusion = 'Very strong evidence supports the hypothesis that increased atmospheric CO2 leads to higher global temperatures.';
      supporting_evidence = [
        {
          description: 'Ice core samples show strong correlation between CO2 levels and temperature over 800,000 years.',
          source: 'Lüthi et al. (2008), Nature',
          strength: "strong"
        },
        {
          description: 'Global temperature records show accelerated warming coinciding with industrial CO2 emissions.',
          source: 'IPCC 6th Assessment Report (2021)',
          strength: "strong"
        },
        {
          description: 'Satellite measurements confirm enhanced greenhouse effect from rising CO2 concentrations.',
          source: 'Harries et al. (2001), Nature',
          strength: "strong"
        },
        {
          description: 'Climate models accurately predict observed warming when including anthropogenic CO2 emissions.',
          source: 'Hausfather et al. (2020), Geophysical Research Letters',
          strength: "strong"
        }
      ];
      contradicting_evidence = [];
    }
    // Default (unknown hypothesis)
    else {
      validation_score = 0.6 + Math.random() * 0.3; // Random score between 0.6-0.9
      p_value = 0.01 + Math.random() * 0.04; // Random p-value between 0.01-0.05
      conclusion = `The hypothesis shows ${validation_score > 0.8 ? 'strong' : 'moderate'} support in the scientific literature.`;
      
      // Generate random evidence
      const numSupporting = Math.floor(2 + Math.random() * 3); // 2-4 supporting evidence
      for (let i = 0; i < numSupporting; i++) {
        supporting_evidence.push({
          description: `Evidence ${i+1} supporting this hypothesis based on scientific literature.`,
          source: `Journal of Scientific Research (${2015 + Math.floor(Math.random() * 8)})`,
          strength: Math.random() > 0.5 ? "strong" : "moderate"
        });
      }
      
      const numContradicting = Math.floor(Math.random() * 2); // 0-1 contradicting evidence
      for (let i = 0; i < numContradicting; i++) {
        contradicting_evidence.push({
          description: `Evidence ${i+1} contradicting or qualifying aspects of this hypothesis.`,
          source: `International Science Review (${2018 + Math.floor(Math.random() * 5)})`,
          strength: Math.random() > 0.5 ? "moderate" : "weak"
        });
      }
    }
    
    // Create mock methods
    const methods = [
      {
        name: 'Literature Analysis',
        description: 'Comprehensive analysis of peer-reviewed scientific literature related to the hypothesis.'
      },
      {
        name: 'Statistical Aggregation',
        description: 'Meta-analytical approach to combine evidence from multiple studies and calculate confidence scores.'
      }
    ];
    
    // Create mock figures
    const figures = [
      {
        title: 'Evidence Distribution',
        description: 'Distribution of supporting and contradicting evidence by source type',
        type: "chart" as const,
        image_data: null // No actual image data in simulation
      }
    ];
    
    // Create mock sources
    const sources = [
      {
        title: 'Comprehensive review of evidence',
        authors: ['Scientific Database System'],
        year: 2024,
        journal: 'Automated Scientific Analysis'
      }
    ];
    
    // Create the final HypothesisResult
    return {
      hypothesis,
      validation_score,
      p_value,
      supporting_evidence,
      contradicting_evidence,
      methods,
      figures,
      sources,
      conclusion,
      timestamp: new Date().toISOString()
    };
  };

  return {
    isValidating,
    hypothesisResult,
    validationError,
    isUsingSim,
    rawApiResponse,
    validateHypothesis,
    clearHypothesisResult
  };
};

export default useHypothesis;