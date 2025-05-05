// src/components/StreamingHypothesisReport.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, FileText, Beaker, Loader2 } from 'lucide-react';
import { HypothesisResult } from "@/components/HypothesisReport";
import useStreamingHypothesis  from '@/hooks/useStreamingHypothesis';

interface StreamingHypothesisReportProps {
  initialHypothesis?: string;
  onClose?: () => void;
}

export const StreamingHypothesisReport: React.FC<StreamingHypothesisReportProps> = ({
  initialHypothesis = '',
  onClose
}) => {
  const [hypothesis, setHypothesis] = React.useState(initialHypothesis);
  const [alpha, setAlpha] = React.useState(0.05);
  const [showFullReport, setShowFullReport] = React.useState(false);
  
  const {
    isStreaming,
    streamingState,
    hypothesisResult,
    validationError,
    validateHypothesisStreaming,
    clearHypothesisResult
  } = useStreamingHypothesis();
  
  const handleValidateClick = async () => {
    if (!hypothesis.trim()) return;
    validateHypothesisStreaming(hypothesis, alpha);
  };
  
  const getStatusMessage = () => {
    if (!streamingState) return '';
    
    switch (streamingState.status) {
      case 'initializing':
        return 'Initializing the validation process...';
      case 'loading_data':
        return 'Loading scientific datasets...';
      case 'configuring':
        return 'Configuring validation parameters...';
      case 'validating':
        return streamingState.message || 'Validating hypothesis...';
      case 'completed':
        return 'Validation completed successfully!';
      case 'failed':
        return `Validation failed: ${streamingState.error}`;
      default:
        return streamingState.message;
    }
  };
  
  // If we're streaming or have a result, show the detail view
  if (isStreaming || hypothesisResult || validationError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              {isStreaming ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> 
                  Validating Hypothesis
                </>
              ) : hypothesisResult ? (
                <>
                  <CheckCircle2 size={18} className="text-green-500" /> 
                  Hypothesis Validation Results
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-red-500" /> 
                  Validation Error
                </>
              )}
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
          {streamingState && (
            <CardDescription>
              {streamingState.job_id}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Hypothesis text */}
          <div className="font-medium italic p-3 bg-muted/30 rounded-md border border-muted">
            {hypothesis}
          </div>
          
          {/* Progress section (when streaming) */}
          {isStreaming && streamingState && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Progress: {streamingState.progress}%</div>
                <div className="text-sm text-muted-foreground">{streamingState.status}</div>
              </div>
              <Progress value={streamingState.progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">{getStatusMessage()}</p>
            </div>
          )}
          
          {/* Error message */}
          {validationError && (
            <div className="p-3 bg-red-900/20 rounded-md border border-red-900/30">
              <p className="text-red-400">{validationError}</p>
            </div>
          )}
          
          {/* Results section (when completed) */}
          {hypothesisResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-md border border-muted">
                  <div className="text-sm font-medium mb-1">Validation Score</div>
                  <div className={`text-xl font-bold ${
                    hypothesisResult.validation_score >= 0.7 ? 'text-green-500' :
                    hypothesisResult.validation_score >= 0.4 ? 'text-amber-500' :
                    'text-red-500'
                  }`}>
                    {(hypothesisResult.validation_score * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md border border-muted">
                  <div className="text-sm font-medium mb-1">P-Value</div>
                  <div className="text-xl font-bold">
                    {hypothesisResult.p_value.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-md border border-muted">
                <div className="text-sm font-medium mb-1">Conclusion</div>
                <p>{hypothesisResult.conclusion}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-900/20 border border-green-900/30 rounded-md">
                  <div className="text-green-400 text-sm font-medium mb-1">Supporting Evidence</div>
                  <div className="text-2xl font-bold text-green-400">
                    {hypothesisResult.supporting_evidence.length}
                  </div>
                </div>
                
                <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-md">
                  <div className="text-red-400 text-sm font-medium mb-1">Contradicting Evidence</div>
                  <div className="text-2xl font-bold text-red-400">
                    {hypothesisResult.contradicting_evidence.length}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Full Report Dialog */}
          {showFullReport && hypothesisResult && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Full Hypothesis Report</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowFullReport(false)}>
                    <AlertCircle size={18} />
                  </Button>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="evidence">Evidence</TabsTrigger>
                      <TabsTrigger value="methods">Methods</TabsTrigger>
                      <TabsTrigger value="sources">Sources</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="font-medium italic p-3 bg-muted/30 rounded-md border border-muted">
                        "{hypothesisResult.hypothesis}"
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-md border border-muted">
                          <div className="text-sm font-medium mb-1">Validation Score</div>
                          <div className={`text-xl font-bold ${
                            hypothesisResult.validation_score >= 0.7 ? 'text-green-500' :
                            hypothesisResult.validation_score >= 0.4 ? 'text-amber-500' :
                            'text-red-500'
                          }`}>
                            {(hypothesisResult.validation_score * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted/30 rounded-md border border-muted">
                          <div className="text-sm font-medium mb-1">P-Value</div>
                          <div className="text-xl font-bold">
                            {hypothesisResult.p_value.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-md border border-muted">
                        <div className="text-sm font-medium mb-1">Conclusion</div>
                        <p>{hypothesisResult.conclusion}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="evidence" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-green-900/20 border border-green-900/30 rounded-md">
                          <div className="text-green-400 text-sm font-medium mb-1">Supporting Evidence</div>
                          <div className="text-xl font-bold text-green-400">
                            {hypothesisResult.supporting_evidence.length}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-md">
                          <div className="text-red-400 text-sm font-medium mb-1">Contradicting Evidence</div>
                          <div className="text-xl font-bold text-red-400">
                            {hypothesisResult.contradicting_evidence.length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {hypothesisResult.supporting_evidence.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-green-500">
                              <CheckCircle2 size={14} /> Supporting Evidence
                            </h3>
                            <div className="space-y-2">
                              {hypothesisResult.supporting_evidence.map((item, index) => (
                                <div key={index} className="p-2 border border-green-900/30 bg-green-900/10 rounded-md">
                                  <p className="text-sm">{item.description}</p>
                                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>{item.source}</span>
                                    <span>Strength: {item.strength}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {hypothesisResult.contradicting_evidence.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-red-500">
                              <AlertCircle size={14} /> Contradicting Evidence
                            </h3>
                            <div className="space-y-2">
                              {hypothesisResult.contradicting_evidence.map((item, index) => (
                                <div key={index} className="p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                                  <p className="text-sm">{item.description}</p>
                                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>{item.source}</span>
                                    <span>Strength: {item.strength}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="methods" className="space-y-4">
                      {hypothesisResult.methods.length > 0 ? (
                        <div className="space-y-4">
                          {hypothesisResult.methods.map((method, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded-md border border-muted">
                              <h3 className="text-sm font-medium mb-1">{method.name}</h3>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No methods information available
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="sources" className="space-y-4">
                      {hypothesisResult.sources.length > 0 ? (
                        <div className="space-y-4">
                          {hypothesisResult.sources.map((source, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded-md border border-muted">
                              <h3 className="text-sm font-medium">{source.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {source.authors.join(', ')}
                                {source.year ? ` (${source.year})` : ''}
                              </p>
                              {source.journal && (
                                <p className="text-xs italic text-muted-foreground mt-1">{source.journal}</p>
                              )}
                              {source.doi && (
                                <div className="mt-2 text-xs text-blue-400">DOI: {source.doi}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No source information available
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
                <div className="p-4 border-t flex justify-end">
                  <Button variant="outline" onClick={() => setShowFullReport(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => clearHypothesisResult()}
          >
            Start New Validation
          </Button>
          
          {hypothesisResult && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowFullReport(true)}
            >
              <FileText className="h-4 w-4 mr-2" /> View Full Report
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  // Input form for initial state
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Validate Hypothesis (Streaming)</CardTitle>
        <CardDescription>
          Enter a scientific hypothesis to validate in real-time with streaming updates.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="hypothesis">
            Hypothesis
          </label>
          <textarea
            id="hypothesis"
            className="w-full min-h-32 p-3 rounded-md border bg-background"
            placeholder="Enter your scientific hypothesis here..."
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="alpha">
            Significance Level (Alpha)
          </label>
          <input
            id="alpha"
            type="number"
            step="0.01"
            min="0.01"
            max="0.1"
            className="w-full p-3 rounded-md border bg-background"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            The significance level determines the threshold for statistical significance (commonly 0.05).
          </p>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full"
            onClick={handleValidateClick}
            disabled={!hypothesis.trim()}
          >
            <Beaker className="h-4 w-4 mr-2" /> Validate Hypothesis with Streaming
          </Button>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground">
          <p>Example hypotheses you can try:</p>
          <ul className="list-disc pl-4 space-y-1 mt-1">
            <li>"High sodium intake is associated with increased risk of hypertension."</li>
            <li>"The presence of dark matter affects galaxy rotation curves."</li>
            <li>"Increased atmospheric CO2 leads to higher global temperatures."</li>
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setHypothesis("The presence of dark matter affects galaxy rotation curves.")}
        >
          Use Example
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StreamingHypothesisReport;