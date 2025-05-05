import React, { useState } from 'react';
import useStreamingHypothesis from '@/hooks/useStreamingHypothesis';
import { HypothesisReport } from '@/components/HypothesisReport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EnhancedHypothesisValidation: React.FC = () => {
  const [hypothesis, setHypothesis] = useState('');
  const [alpha, setAlpha] = useState(0.05);
  const [displayAlpha, setDisplayAlpha] = useState('0.05');
  
  const {
    isStreaming,
    streamingState,
    hypothesisResult,
    validationError,
    validateHypothesisStreaming,
    clearHypothesisResult
  } = useStreamingHypothesis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hypothesis.trim()) {
      await validateHypothesisStreaming(hypothesis, alpha);
    }
  };

  const handleAlphaChange = (value: number[]) => {
    const newAlpha = value[0];
    setAlpha(newAlpha);
    setDisplayAlpha(newAlpha.toString());
  };

  const handleReset = () => {
    clearHypothesisResult();
    setHypothesis('');
  };

  // Example hypotheses for quick selection
  const exampleHypotheses = [
    "The presence of dark matter affects galaxy rotation curves",
    "High sodium intake is associated with increased risk of hypertension",
    "Increased atmospheric CO2 leads to higher global temperatures"
  ];

  const handleExampleSelect = (example: string) => {
    setHypothesis(example);
  };

  // Format status string for display
  const formatStatus = (status: string): string => {
    if (!status) return 'Processing...';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popper Hypothesis Validation</h2>
        {(hypothesisResult || isStreaming) && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            New Hypothesis
          </Button>
        )}
      </div>
      
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {!hypothesisResult && !isStreaming && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Hypothesis</CardTitle>
            <CardDescription>
              Submit a scientific hypothesis to validate it against existing research
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="hypothesis" className="text-sm font-medium block mb-1">
                  Hypothesis Statement
                </label>
                <Input
                  id="hypothesis"
                  placeholder="Enter a clear, testable scientific hypothesis..."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a clear, testable scientific statement that can be validated against existing evidence
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="alpha" className="text-sm font-medium">
                    Significance Level (α)
                  </label>
                  <span className="text-sm">{displayAlpha}</span>
                </div>
                <Slider
                  onValueChange={handleAlphaChange}
                  defaultValue={[alpha]}
                  min={0.01}
                  max={0.1}
                  step={0.01}
                  className="mb-6"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alpha defines the threshold for statistical significance. Lower values are more stringent (0.01-0.05 is typical).
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Example Hypotheses</p>
                <div className="flex flex-wrap gap-2">
                  {exampleHypotheses.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => handleExampleSelect(example)}
                      className="text-xs"
                    >
                      {example.length > 40 ? `${example.substring(0, 37)}...` : example}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!hypothesis.trim() || isStreaming}
              >
                Validate Hypothesis
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {isStreaming && streamingState && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Validating Hypothesis
            </CardTitle>
            <CardDescription>
              {streamingState.status ? formatStatus(streamingState.status) : 'Processing...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={streamingState.progress} className="h-2 w-full" />
              <p className="text-sm text-muted-foreground">{streamingState.message}</p>
              
              <div className="mt-8 italic text-sm bg-muted p-3 rounded-md">
                "{streamingState.hypothesis}"
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {hypothesisResult && (
        <div className="space-y-4">
          <HypothesisReport 
            result={hypothesisResult}
            isLoading={isStreaming}
            error={validationError || undefined}
            onClose={handleReset}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedHypothesisValidation;