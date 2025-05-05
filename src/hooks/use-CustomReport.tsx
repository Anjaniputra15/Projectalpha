// src/components/HypothesisReport.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, Copy, Share, ChevronDown, X, AlertCircle, CheckCircle2, FileText, Beaker, Link2 } from 'lucide-react';
import { HypothesisResult } from '@/components/Graph/types';

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
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isFullReportOpen, setIsFullReportOpen] = React.useState(false);

  // Calculate color based on validation score
  const getScoreColorClass = (score: number) => {
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.4) return 'text-amber-500';
    return 'text-red-500';
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full border-muted">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Beaker className="h-5 w-5" /> Analyzing Hypothesis...
          </CardTitle>
          <CardDescription>Please wait while we validate your hypothesis against our scientific database.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-blue-600 animate-spin mb-4"></div>
            <p className="text-muted-foreground">This may take a few moments...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-800 bg-red-900/10">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertCircle size={18} /> Validation Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onClose}>Dismiss</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Hypothesis Validation Results
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            )}
          </div>
          <CardDescription>{formatDate(result.timestamp)}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="methods">Methods</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="font-medium italic p-3 bg-muted/30 rounded-md border border-muted">"{result.hypothesis}"</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-md border border-muted">
                  <div className="text-sm font-medium mb-1">Validation Score</div>
                  <div className={`text-xl font-bold ${getScoreColorClass(result.validation_score)}`}>
                    {(result.validation_score * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md border border-muted">
                  <div className="text-sm font-medium mb-1">P-Value</div>
                  <div className="text-xl font-bold">
                    {result.p_value.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-md border border-muted">
                <div className="text-sm font-medium mb-1">Conclusion</div>
                <p>{result.conclusion}</p>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-900/20 border border-green-900/30 rounded-md">
                  <div className="text-green-400 text-sm font-medium mb-1">Supporting Evidence</div>
                  <div className="text-xl font-bold text-green-400">
                    {result.supporting_evidence.length}
                  </div>
                </div>
                
                <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-md">
                  <div className="text-red-400 text-sm font-medium mb-1">Contradicting Evidence</div>
                  <div className="text-xl font-bold text-red-400">
                    {result.contradicting_evidence.length}
                  </div>
                </div>
              </div>

              <ScrollArea className="h-64 rounded-md border p-2">
                {result.supporting_evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-green-500">
                      <CheckCircle2 size={14} /> Supporting Evidence
                    </h4>
                    <div className="space-y-2">
                      {result.supporting_evidence.map((item, index) => (
                        <div key={index} className="p-2 border border-green-900/30 bg-green-900/10 rounded-md">
                          <p className="text-sm">{item.text}</p>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.contradicting_evidence.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-red-500">
                      <X size={14} /> Contradicting Evidence
                    </h4>
                    <div className="space-y-2">
                      {result.contradicting_evidence.map((item, index) => (
                        <div key={index} className="p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                          <p className="text-sm">{item.text}</p>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="methods">
              {result.methods.length > 0 ? (
                <ScrollArea className="h-64 rounded-md border p-4">
                  <div className="space-y-4">
                    {result.methods.map((method, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-md border border-muted">
                        <h4 className="font-medium text-sm mb-1">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-64 flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">No methods information available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sources">
              {result.sources.length > 0 ? (
                <ScrollArea className="h-64 rounded-md border p-4">
                  <div className="space-y-4">
                    {result.sources.map((source, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-md border border-muted">
                        <h4 className="font-medium text-sm">{source.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {source.authors.join(', ')} 
                          {source.year ? ` (${source.year})` : ''}
                        </p>
                        {source.journal && (
                          <p className="text-xs italic text-muted-foreground mt-1">{source.journal}</p>
                        )}
                        {source.doi && (
                          <div className="mt-2 flex items-center gap-1 text-xs">
                            <Link2 size={12} />
                            <span className="text-blue-400">DOI: {source.doi}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-64 flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">No source information available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsFullReportOpen(true)}>
            <FileText className="h-4 w-4 mr-2" /> View Raw Data
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isFullReportOpen} onOpenChange={setIsFullReportOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Full Report Data</DialogTitle>
            <DialogDescription>Raw JSON data from the hypothesis validation</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] p-6">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </ScrollArea>
          <DialogFooter className="p-4 border-t">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}>
              <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
            </Button>
            <Button variant="default" onClick={() => setIsFullReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

