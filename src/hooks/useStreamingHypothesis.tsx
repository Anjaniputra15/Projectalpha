// src/hooks/useStreamingHypothesis.tsx
import { useState, useEffect, useRef } from 'react';
import { formatApiResponse } from '@/components/utils/debug-logger.js';
import { EventSourcePolyfill } from 'event-source-polyfill';
import axios from 'axios';

export interface HypothesisResult {
  hypothesis: string;
  validation_score: number;
  p_value?: number;
  supporting_evidence: Array<{
    source: string;
    description: string;
    strength: 'strong' | 'moderate' | 'weak';
  }>;
  contradicting_evidence: Array<{
    source: string;
    description: string;
    strength: 'strong' | 'moderate' | 'weak';
  }>;
  methods: {
    name: string;
    description: string;
    parameters?: Record<string, any>;
  }[];
  figures?: Array<{
    title: string;
    description: string;
    image_data?: string; // base64 encoded image
    type: 'chart' | 'table' | 'image';
  }>;
  sources: Array<{
    title: string;
    authors?: string[];
    year?: number;
    journal?: string;
    doi?: string;
    url?: string;
  }>;
  conclusion: string;
  timestamp: string;
  visualization?: {
    type?: string;
    image_data?: string;
  };
  // These properties were causing the error
  result?: string;
  confidence?: number;
  alpha?: number;
}

// New interface for statistical test results
export interface StatisticalTestResult {
  testName: string;
  statistic: number;
  pValue: number;
  description?: string;
  rawOutput: string;
}

export interface StreamingState {
  status: string;
  progress: number;
  message: string;
  result?: any;
  testResults?: StatisticalTestResult[];
  rawOutput?: string[];
}

export const useStreamingHypothesis = () => {
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [hypothesisResult, setHypothesisResult] = useState<HypothesisResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUsingSim, setIsUsingSim] = useState<boolean>(false);
  const [streamingStatus, setStreamingStatus] = useState<StreamingState>({
    status: 'idle',
    progress: 0,
    message: '',
    testResults: [],
    rawOutput: []
  });
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  
  // Keep a reference to the event source for cleanup
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup function to close EventSource connection
  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEventSource();
    };
  }, []);

  // Parse statistical test output from raw text
  const parseStatisticalTests = (text: string): StatisticalTestResult[] => {
    if (!text) return [];
    
    const results: StatisticalTestResult[] = [];
    
    // Patterns to match different statistical tests
    const patterns = [
      // Bootstrap test
      {
        regex: /Bootstrap\s+p-value:\s+([\d.]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Bootstrap Test',
          statistic: NaN, // No statistic provided
          pValue: parseFloat(match[1]),
          description: 'Bootstrap resampling test',
          rawOutput: match[0]
        })
      },
      // Fisher's method
      {
        regex: /Combined\s+p-value\s+\(Fisher's\s+method\):\s+([\d.e+-]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Fisher\'s Method',
          statistic: NaN, // No statistic provided
          pValue: parseFloat(match[1]),
          description: 'Combined p-value using Fisher\'s method',
          rawOutput: match[0]
        })
      },
      // Kolmogorov-Smirnov (tangential) test
      {
        regex: /Tangential\s+motion\s+\(pm_l\):\s+statistic=([\d.]+),\s+p-value=([\d.e+-]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Kolmogorov-Smirnov (Tangential Motion)',
          statistic: parseFloat(match[1]),
          pValue: parseFloat(match[2]),
          description: 'K-S test for tangential motion distribution',
          rawOutput: match[0]
        })
      },
      // Kolmogorov-Smirnov (perpendicular) test
      {
        regex: /Perpendicular\s+motion\s+\(pm_b\):\s+statistic=([\d.]+),\s+p-value=([\d.e+-]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Kolmogorov-Smirnov (Perpendicular Motion)',
          statistic: parseFloat(match[1]),
          pValue: parseFloat(match[2]),
          description: 'K-S test for perpendicular motion distribution',
          rawOutput: match[0]
        })
      },
      // Tangential/Radial ratio test
      {
        regex: /Tangential\/Radial\s+ratio:\s+statistic=([\d.]+),\s+p-value=([\d.e+-]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Tangential/Radial Ratio',
          statistic: parseFloat(match[1]),
          pValue: parseFloat(match[2]),
          description: 'Statistical test for tangential to radial motion ratio',
          rawOutput: match[0]
        })
      },
      // Combined KS test
      {
        regex: /Combined\s+KS\s+test\s+p-value:\s+([\d.e+-]+)/i,
        extractor: (match: RegExpMatchArray) => ({
          testName: 'Combined Kolmogorov-Smirnov Test',
          statistic: NaN, // No statistic provided
          pValue: parseFloat(match[1]),
          description: 'Combined p-value from multiple K-S tests',
          rawOutput: match[0]
        })
      }
    ];
    
    // Check each line for matching patterns
    const lines = text.split('\n');
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern.regex);
        if (match) {
          const result = pattern.extractor(match);
          results.push(result);
        }
      }
    }
    
    return results;
  };

  const validateHypothesisStreaming = async (hypothesis: string, alpha: number = 0.05) => {
    setIsValidating(true);
    setValidationError(null);
    setIsUsingSim(false);
    setRawApiResponse(null);
    setHypothesisResult(null);
    setStreamingStatus({
      status: 'initializing',
      progress: 10,
      message: 'Starting validation...',
      testResults: [],
      rawOutput: []
    });
  
    cleanupEventSource();
  
    try {
      // Construct the streaming endpoint URL
      const sseUrl = `https://popper.api.scinter.org/validate-stream?hypothesis=${encodeURIComponent(hypothesis)}&alpha=${alpha}`;
  
      // Initialize EventSource connection
      const eventSource = new EventSourcePolyfill(sseUrl);
  
      eventSourceRef.current = eventSource;
  
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        // Update raw API response for debugging/logging
        setRawApiResponse(data);
        
        // Check if there's a message to parse for statistical results
        let testResults: StatisticalTestResult[] = [];
        let allRawOutput = streamingStatus.rawOutput || [];
        
        if (data.message) {
          // Store raw messages for terminal display
          allRawOutput = [...allRawOutput, data.message];
          
          // Try to parse statistical test results
          const newTestResults = parseStatisticalTests(data.message);
          if (newTestResults.length > 0) {
            testResults = [...(streamingStatus.testResults || []), ...newTestResults];
          } else {
            testResults = streamingStatus.testResults || [];
          }
        }
  
        // Update streaming status state with SSE data
        setStreamingStatus({
          status: data.status,
          progress: data.progress,
          message: data.message,
          result: data.result,
          testResults: testResults,
          rawOutput: allRawOutput
        });
  
        // If validation is complete, set the final result
        if (data.status === "completed" && data.result) {
          const formattedResult = formatApiResponse(data);
          
          // Enhance the formatted result with the statistical tests we parsed
          if (testResults.length > 0) {
            formattedResult.methods = [
              ...(formattedResult.methods || []),
              ...testResults.map(test => ({
                name: test.testName,
                description: test.description || 'Statistical test',
                parameters: {
                  statistic: test.statistic,
                  p_value: test.pValue
                }
              }))
            ];
          }
          
          setHypothesisResult(formattedResult);
          eventSource.close();
          setIsValidating(false);
        } else if (data.status === "failed") {
          throw new Error(data.error || "Validation failed");
        }
      };
  
      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        setValidationError("Streaming connection failed, falling back to simulation.");
        setIsUsingSim(true);
        const simulated = simulateHypothesisValidation(hypothesis, alpha);
        setHypothesisResult(simulated);
        eventSource.close();
        setIsValidating(false);
      };
  
    } catch (error: any) {
      console.error("Validation process failed:", error);
      setValidationError(error?.message || "Validation failed or timed out");
  
      // Fallback to simulation
      setIsUsingSim(true);
      const simulated = simulateHypothesisValidation(hypothesis, alpha);
      setHypothesisResult(simulated);
      setIsValidating(false);
    }
  };
  
  const clearHypothesisResult = () => {
    setHypothesisResult(null);
    setValidationError(null);
    setIsUsingSim(false);
    setRawApiResponse(null);
    setStreamingStatus({
      status: 'idle',
      progress: 0,
      message: '',
      testResults: [],
      rawOutput: []
    });
    cleanupEventSource();
  };

  // Add some test results to the simulation
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
    
    let methods: Array<{
      name: string;
      description: string;
      parameters?: Record<string, any>;
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
        }
      ];
      contradicting_evidence = [
        {
          description: 'Modified Newtonian Dynamics (MOND) can explain some galaxy rotation curves without dark matter.',
          source: 'Milgrom (1983), Astrophysical Journal',
          strength: "moderate"
        }
      ];
      
      // Add simulated statistical tests for dark matter hypothesis
      methods = [
        {
          name: 'Kolmogorov-Smirnov (Tangential Motion)',
          description: 'K-S test for tangential motion distribution',
          parameters: {
            statistic: 0.14753,
            p_value: 3.05462e-171
          }
        },
        {
          name: 'Kolmogorov-Smirnov (Perpendicular Motion)',
          description: 'K-S test for perpendicular motion distribution',
          parameters: {
            statistic: 0.13261,
            p_value: 2.52084e-138
          }
        },
        {
          name: 'Fisher\'s Method',
          description: 'Combined p-value using Fisher\'s method',
          parameters: {
            p_value: 0.00947
          }
        }
      ];
      
    } else if (lowerHypothesis.includes('stellar') && lowerHypothesis.includes('velocity')) {
      // Stellar velocity hypothesis
      validation_score = 0.78;
      p_value = 0.022;
      conclusion = 'Evidence supports the hypothesis that stellar velocity distribution shows asymmetry.';
      supporting_evidence = [
        {
          description: 'Statistical analysis of stellar velocities shows significant deviations from symmetry.',
          source: 'Galactic Structure Analysis, Astronomy & Astrophysics',
          strength: "moderate"
        }
      ];
      methods = [
        {
          name: 'Kolmogorov-Smirnov (Tangential Motion)',
          description: 'K-S test for tangential motion distribution',
          parameters: {
            statistic: 0.14753,
            p_value: 3.05462e-171
          }
        },
        {
          name: 'Kolmogorov-Smirnov (Perpendicular Motion)',
          description: 'K-S test for perpendicular motion distribution',
          parameters: {
            statistic: 0.13261,
            p_value: 2.52084e-138
          }
        },
        {
          name: 'Tangential/Radial Ratio',
          description: 'Statistical test for tangential to radial motion ratio',
          parameters: {
            statistic: 0.13825,
            p_value: 8.31306e-149
          }
        },
        {
          name: 'Fisher\'s Method',
          description: 'Combined p-value using Fisher\'s method',
          parameters: {
            p_value: 0.00947
          }
        }
      ];
    } else {
      // Default simulation
      validation_score = 0.75;
      p_value = 0.02;
      conclusion = `Evidence suggests the hypothesis may be valid, but more research is needed.`;
      supporting_evidence = [
        {
          description: 'Initial evidence supports this hypothesis.',
          source: 'Scientific Literature Review',
          strength: "moderate"
        }
      ];
      contradicting_evidence = [
        {
          description: 'Some contradicting factors have been identified.',
          source: 'Meta-analysis',
          strength: "weak"
        }
      ];
      
      methods = [
        {
          name: 'Literature Analysis',
          description: 'Comprehensive analysis of peer-reviewed scientific literature.'
        },
        {
          name: 'Bootstrap Test',
          description: 'Bootstrap resampling test',
          parameters: {
            p_value: 0.497
          }
        }
      ];
    }
    
    // Add a simulation timestamp
    const timestamp = new Date().toISOString();
    
    // Simulate raw output for terminal display
    const simulatedRawOutput = methods.map(method => {
      if (method.name === 'Kolmogorov-Smirnov (Tangential Motion)') {
        return `Tangential motion (pm_l): statistic=${method.parameters?.statistic}, p-value=${method.parameters?.p_value}`;
      } else if (method.name === 'Kolmogorov-Smirnov (Perpendicular Motion)') {
        return `Perpendicular motion (pm_b): statistic=${method.parameters?.statistic}, p-value=${method.parameters?.p_value}`;
      } else if (method.name === 'Tangential/Radial Ratio') {
        return `Tangential/Radial ratio: statistic=${method.parameters?.statistic}, p-value=${method.parameters?.p_value}`;
      } else if (method.name === 'Fisher\'s Method') {
        return `Combined p-value (Fisher's method): ${method.parameters?.p_value}`;
      } else if (method.name === 'Bootstrap Test') {
        return `Bootstrap p-value: ${method.parameters?.p_value}`;
      }
      return '';
    }).filter(Boolean);
    
    // Set the simulated streaming status for terminal display
    setStreamingStatus({
      status: 'completed',
      progress: 100,
      message: 'Validation complete',
      result: {
        parsed_result: {
          validation_score,
          conclusion,
          supporting_evidence,
          contradicting_evidence
        }
      },
      testResults: methods
        .filter(m => m.parameters)
        .map(m => ({
          testName: m.name,
          statistic: m.parameters?.statistic || NaN,
          pValue: m.parameters?.p_value || NaN,
          description: m.description,
          rawOutput: ''
        })),
      rawOutput: simulatedRawOutput
    });
    
    // Create the final HypothesisResult
    return {
      hypothesis,
      validation_score,
      p_value,
      supporting_evidence,
      contradicting_evidence,
      methods,
      sources: [
        {
          title: 'Scientific evidence review',
          authors: ['Scientific Database System'],
          year: 2024
        }
      ],
      conclusion,
      timestamp,
      // Add these to match the interface
      result: conclusion,
      confidence: validation_score,
      alpha
    };
  };

  // Return the hook API with the updated properties
  return {
    isStreaming: isValidating,
    streamingState: streamingStatus,
    hypothesisResult,
    validationError,
    isUsingSim,
    validateHypothesisStreaming,
    clearHypothesisResult,
    // Add raw terminal output access
    rawOutput: streamingStatus.rawOutput || [],
    testResults: streamingStatus.testResults || []
  };
};

export default useStreamingHypothesis;