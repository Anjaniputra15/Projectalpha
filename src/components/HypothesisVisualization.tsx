// src/components/StreamingHypothesis.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, X } from 'lucide-react';
import useStreamingHypothesis from '@/hooks/useStreamingHypothesis';
import TerminalOutput from './TerminalOutput';
import '@/styles/terminal-output.css';

interface StreamingHypothesisReportProps {
  initialHypothesis: string;
  onClose: () => void;
}

const StreamingHypothesisReport: React.FC<StreamingHypothesisReportProps> = ({
  initialHypothesis,
  onClose
}) => {
  const {
    isStreaming,
    streamingState,
    hypothesisResult,
    validationError,
    testResults,
    rawOutput
  } = useStreamingHypothesis();

  // Format confidence score as percentage
  const formatConfidence = (score?: number) => {
    if (!score && score !== 0) return 'N/A';
    return `${Math.round(score * 100)}%`;
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#363636] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-white text-lg font-medium">Hypothesis Validation</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Hypothesis text */}
        <div className="p-3 bg-[#252525] rounded-md border border-[#363636]">
          <h3 className="text-sm font-medium text-white/80 mb-1">Hypothesis</h3>
          <p className="text-white/60 text-sm">{initialHypothesis}</p>
        </div>
        
        {/* Status and progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white/80">
              Status: <span className={`${streamingState.status === 'completed' ? 'text-green-400' : streamingState.status === 'failed' ? 'text-red-400' : 'text-blue-400'}`}>
                {streamingState.status.charAt(0).toUpperCase() + streamingState.status.slice(1)}
              </span>
            </span>
            <span className="text-sm text-white/60">{streamingState.progress}%</span>
          </div>
            <Progress 
            value={streamingState.progress} 
            className={`h-2 bg-[#363636] ${streamingState.status === 'completed' ? 'bg-green-500' : streamingState.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`}
          />
        </div>
        
        {/* Error message */}
        {validationError && (
          <div className="p-3 bg-red-900/20 text-red-400 rounded-md border border-red-900/30">
            <h3 className="text-sm font-medium mb-1">Error</h3>
            <p className="text-sm">{validationError}</p>
          </div>
        )}
        
        {/* Statistical test results */}
        {rawOutput && rawOutput.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Statistical Tests</h3>
            <TerminalOutput 
              rawOutput={rawOutput} 
              testResults={testResults} 
              containerClass={isStreaming ? "validating" : ""}
            />
            
            {/* Display significant test results as badges */}
            {testResults && testResults.filter(t => t.pValue < 0.05).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {testResults
                  .filter(t => t.pValue < 0.05)
                  .map((test, idx) => (
                    <div 
                      key={idx} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    >
                      <span className="font-medium mr-1">{test.testName}</span>
                      <span>p={test.pValue < 0.0001 ? '<0.0001' : test.pValue.toFixed(4)}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}
        
        {/* Result when completed */}
        {hypothesisResult && streamingState.status === 'completed' && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#252525] p-3 rounded-md border border-[#363636]">
                <h4 className="text-xs text-white/60 uppercase">Validation Score</h4>
                <p className="text-xl font-bold text-white">{formatConfidence(hypothesisResult.validation_score)}</p>
              </div>
              <div className="bg-[#252525] p-3 rounded-md border border-[#363636]">
                <h4 className="text-xs text-white/60 uppercase">p-value</h4>
                <p className="text-xl font-bold text-white">
                  {hypothesisResult.p_value !== undefined 
                    ? hypothesisResult.p_value < 0.001 
                      ? '<0.001' 
                      : hypothesisResult.p_value.toFixed(4)
                    : 'N/A'}
                </p>
              </div>
            </div>
            
            {hypothesisResult.conclusion && (
              <div className="p-3 bg-[#252525] rounded-md border border-[#363636]">
                <h4 className="text-sm font-medium text-white/80 mb-2">Conclusion</h4>
                <p className="text-white/80">{hypothesisResult.conclusion}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {hypothesisResult.supporting_evidence && hypothesisResult.supporting_evidence.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-green-400">Supporting Evidence ({hypothesisResult.supporting_evidence.length})</h4>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                    {hypothesisResult.supporting_evidence.map((evidence, i) => (
                      <div key={i} className="p-2 bg-green-900/20 rounded border border-green-900/30 text-xs text-white/80">
                        <p>{evidence.description}</p>
                        <p className="text-green-400 text-xs mt-1">Source: {evidence.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {hypothesisResult.contradicting_evidence && hypothesisResult.contradicting_evidence.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-400">Contradicting Evidence ({hypothesisResult.contradicting_evidence.length})</h4>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                    {hypothesisResult.contradicting_evidence.map((evidence, i) => (
                      <div key={i} className="p-2 bg-red-900/20 rounded border border-red-900/30 text-xs text-white/80">
                        <p>{evidence.description}</p>
                        <p className="text-red-400 text-xs mt-1">Source: {evidence.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isStreaming && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin mr-2" />
            <span className="text-sm text-white/60">Processing hypothesis validation...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreamingHypothesisReport;