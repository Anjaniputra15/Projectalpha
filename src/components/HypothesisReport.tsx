import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Download, Copy, Share, ChevronDown, ChevronRight, Search, X } from 'lucide-react';

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
}

interface HypothesisReportProps {
  result?: HypothesisResult;
  isLoading?: boolean;
  error?: string;
  onClose?: () => void;
}

export const HypothesisReport: React.FC<HypothesisReportProps> = ({
  result,
  isLoading = false,
  error,
  onClose
}) => {
  const [isFullReportOpen, setIsFullReportOpen] = useState(false);
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyzing Hypothesis...</CardTitle>
          <CardDescription>Please wait while we validate your hypothesis</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">This may take a minute</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <X size={18} />
            Validation Error
          </CardTitle>
          <CardDescription>We encountered an issue validating your hypothesis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onClose}>Dismiss</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  // Calculate validation color based on score
  const getValidationColor = (score: number) => {
    if (score >= 0.7) return "text-green-500";
    if (score >= 0.4) return "text-amber-500";
    return "text-red-500";
  };

  // Calculate badge color based on evidence strength
  const getEvidenceBadgeColor = (strength: string) => {
    switch (strength) {
      case 'strong': return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case 'moderate': return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case 'weak': return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  // Summary card for collapsed view
  const SummaryCard = () => (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Hypothesis Validation Results</CardTitle>
            <CardDescription>
              Analyzed on {new Date(result.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsFullReportOpen(true)}
          >
            View Full Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-3 font-medium italic">"{result.hypothesis}"</div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Validation Score</div>
            <div className={`text-xl font-bold ${getValidationColor(result.validation_score)}`}>
              {(result.validation_score * 100).toFixed(1)}%
            </div>
          </div>
          
          {result.p_value !== undefined && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">P-Value</div>
              <div className="text-xl font-bold">
                {result.p_value < 0.001 ? "< 0.001" : result.p_value.toFixed(3)}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex gap-1 items-center">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs">{result.supporting_evidence.length} supporting</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-xs">{result.contradicting_evidence.length} contradicting</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-xs">{result.methods.length} methods</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span className="text-xs">{result.sources.length} sources</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-1">Conclusion</div>
        <div className="text-sm mb-4">{result.conclusion}</div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={onClose}>
          Dismiss
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  // Full report dialog
  const FullReportDialog = () => (
    <Dialog open={isFullReportOpen} onOpenChange={setIsFullReportOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Hypothesis Validation Report</DialogTitle>
          <DialogDescription>
            Detailed analysis of your hypothesis
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="summary" className="w-full h-full">
          <div className="border-b px-6">
            <TabsList className="h-10">
              <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
              <TabsTrigger value="methods" className="text-xs">Methods</TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs">Evidence</TabsTrigger>
              <TabsTrigger value="figures" className="text-xs">Figures</TabsTrigger>
              <TabsTrigger value="sources" className="text-xs">Sources</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[calc(90vh-12rem)]">
            <div className="p-6">
              <TabsContent value="summary" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Hypothesis</h3>
                  <div className="text-sm p-4 bg-muted rounded-md">
                    {result.hypothesis}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Validation Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Validation Score:</span>
                        <span className={`font-bold ${getValidationColor(result.validation_score)}`}>
                          {(result.validation_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      {result.p_value !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">p-value:</span>
                          <span className="font-bold">
                            {result.p_value < 0.001 ? "< 0.001" : result.p_value.toFixed(3)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Supporting Evidence:</span>
                        <span className="font-bold text-green-500">
                          {result.supporting_evidence.length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Contradicting Evidence:</span>
                        <span className="font-bold text-red-500">
                          {result.contradicting_evidence.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                    <p className="text-sm">{result.conclusion}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Methods Overview</h3>
                  <div className="space-y-2">
                    {result.methods.map((method, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{method.name}:</span> {method.description}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="methods" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">Methodology</h3>
                
                {result.methods.map((method, index) => (
                  <Collapsible key={index} className="mb-4 border rounded-md">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-left">
                      <span>{method.name}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 text-sm border-t">
                      <p className="mb-3">{method.description}</p>
                      
                      {method.parameters && (
                        <div>
                          <h4 className="font-medium mb-2">Parameters:</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.entries(method.parameters).map(([key, value]) => (
                              <React.Fragment key={key}>
                                <div className="text-muted-foreground">{key}:</div>
                                <div>{String(value)}</div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TabsContent>
              
              <TabsContent value="evidence" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Supporting Evidence</h3>
                  {result.supporting_evidence.length > 0 ? (
                    <div className="space-y-4">
                      {result.supporting_evidence.map((evidence, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{evidence.source}</span>
                            <Badge className={getEvidenceBadgeColor(evidence.strength)}>
                              {evidence.strength}
                            </Badge>
                          </div>
                          <p className="text-sm">{evidence.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No supporting evidence found.</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Contradicting Evidence</h3>
                  {result.contradicting_evidence.length > 0 ? (
                    <div className="space-y-4">
                      {result.contradicting_evidence.map((evidence, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">{evidence.source}</span>
                            <Badge className={getEvidenceBadgeColor(evidence.strength)}>
                              {evidence.strength}
                            </Badge>
                          </div>
                          <p className="text-sm">{evidence.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No contradicting evidence found.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="figures" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">Figures & Visualizations</h3>
                
                {result.figures && result.figures.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.figures.map((figure, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <div className="p-4 border-b">
                          <h4 className="font-medium">{figure.title}</h4>
                        </div>
                        <div className="p-4 flex justify-center">
                          {figure.image_data ? (
                            <img 
                              src={`data:image/png;base64,${figure.image_data}`} 
                              alt={figure.title}
                              className="max-w-full h-auto"
                            />
                          ) : (
                            <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground">
                              No image data
                            </div>
                          )}
                        </div>
                        <div className="p-4 border-t">
                          <p className="text-sm text-muted-foreground">{figure.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No figures available for this report.</p>
                )}
              </TabsContent>
              
              <TabsContent value="sources" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">References & Sources</h3>
                
                <div className="space-y-4">
                  {result.sources.map((source, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium mb-1">{source.title}</h4>
                      
                      <div className="text-sm space-y-2">
                        {source.authors && (
                          <div>
                            <span className="text-muted-foreground mr-2">Authors:</span>
                            {source.authors.join(', ')}
                          </div>
                        )}
                        
                        <div className="flex gap-x-4">
                          {source.year && (
                            <div>
                              <span className="text-muted-foreground mr-2">Year:</span>
                              {source.year}
                            </div>
                          )}
                          
                          {source.journal && (
                            <div>
                              <span className="text-muted-foreground mr-2">Journal:</span>
                              {source.journal}
                            </div>
                          )}
                        </div>
                        
                        {source.doi && (
                          <div>
                            <span className="text-muted-foreground mr-2">DOI:</span>
                            <a 
                              href={`https://doi.org/${source.doi}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {source.doi}
                            </a>
                          </div>
                        )}
                        
                        {source.url && !source.doi && (
                          <div>
                            <span className="text-muted-foreground mr-2">URL:</span>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {source.url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-4 border-t">
            <div className="flex justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setIsFullReportOpen(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <SummaryCard />
      <FullReportDialog />
    </>
  );
};