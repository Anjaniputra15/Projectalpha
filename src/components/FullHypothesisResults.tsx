// src/components/FullHypothesisResults.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { HypothesisResult } from '@/components/HypothesisReport';

interface FullHypothesisResultsProps {
  result: HypothesisResult;
  onViewFullReport?: () => void;
}

export const FullHypothesisResults: React.FC<FullHypothesisResultsProps> = ({
  result,
  onViewFullReport,
}) => {
  // Helper function to get color class based on validation score
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.4) return 'text-amber-500';
    return 'text-red-500';
  };

  // Helper function to get color for evidence strength
  const getStrengthColor = (strength: string) => {
    if (strength === 'strong') return 'text-green-500';
    if (strength === 'moderate') return 'text-amber-500';
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

  return (
    <Card className="w-full bg-[#2a2a2a] border-[#444]">
      <CardHeader className="border-b border-[#444]">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white text-lg">Hypothesis Validation Results</CardTitle>
            <CardDescription className="text-white/60">
              Analyzed on {formatDate(result.timestamp)}
            </CardDescription>
          </div>
          {onViewFullReport && (
            <Button variant="outline" size="sm" onClick={onViewFullReport} className="text-white/80 border-[#444]">
              View Full Report
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="font-medium italic p-3 bg-[#333] rounded-md border border-[#444] text-white mb-4">
          "{result.hypothesis}"
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 bg-[#333] border border-[#444]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#444] text-white">Overview</TabsTrigger>
            <TabsTrigger value="evidence" className="data-[state=active]:bg-[#444] text-white">Evidence</TabsTrigger>
            <TabsTrigger value="methods" className="data-[state=active]:bg-[#444] text-white">Methods</TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-[#444] text-white">Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#333] rounded-md border border-[#444]">
                <div className="text-sm font-medium mb-1 text-white/80">Validation Score</div>
                <div className={`text-2xl font-bold ${getScoreColor(result.validation_score)}`}>
                  {(result.validation_score * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="p-3 bg-[#333] rounded-md border border-[#444]">
                <div className="text-sm font-medium mb-1 text-white/80">P-Value</div>
                <div className="text-2xl font-bold text-white">
                  {result.p_value.toFixed(4)}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-[#333] rounded-md border border-[#444]">
              <div className="text-sm font-medium mb-1 text-white/80">Conclusion</div>
              <p className="text-white/80">{result.conclusion || "No conclusion available"}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="evidence" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-green-900/20 border border-green-900/30 rounded-md">
                <div className="text-green-400 text-sm font-medium mb-1">Supporting Evidence</div>
                <div className="text-2xl font-bold text-green-400">
                  {result.supporting_evidence.length}
                </div>
              </div>
              
              <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-md">
                <div className="text-red-400 text-sm font-medium mb-1">Contradicting Evidence</div>
                <div className="text-2xl font-bold text-red-400">
                  {result.contradicting_evidence.length}
                </div>
              </div>
            </div>

            <ScrollArea className="h-64 rounded-md border border-[#444] p-2 bg-[#333]">
              {result.supporting_evidence.length > 0 ? (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-green-500">
                    <CheckCircle2 size={14} /> Supporting Evidence
                  </h4>
                  <div className="space-y-2">
                    {result.supporting_evidence.map((item, index) => (
                      <div key={index} className="p-2 border border-green-900/30 bg-green-900/10 rounded-md">
                        <p className="text-sm text-white/80">{item.description}</p>
                        <div className="flex justify-between mt-1 text-xs text-white/60">
                          <span>{item.source}</span>
                          <span className={getStrengthColor(item.strength)}>
                            Strength: {item.strength}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  No supporting evidence found
                </div>
              )}

              {result.contradicting_evidence.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-red-500">
                    <AlertCircle size={14} /> Contradicting Evidence
                  </h4>
                  <div className="space-y-2">
                    {result.contradicting_evidence.map((item, index) => (
                      <div key={index} className="p-2 border border-red-900/30 bg-red-900/10 rounded-md">
                        <p className="text-sm text-white/80">{item.description}</p>
                        <div className="flex justify-between mt-1 text-xs text-white/60">
                          <span>{item.source}</span>
                          <span className={getStrengthColor(item.strength)}>
                            Strength: {item.strength}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="methods">
            {result.methods && result.methods.length > 0 ? (
              <ScrollArea className="h-64 rounded-md border border-[#444] p-4 bg-[#333]">
                <div className="space-y-4">
                  {result.methods.map((method, index) => (
                    <div key={index} className="p-3 bg-[#2d2d2d] rounded-md border border-[#444]">
                      <h4 className="font-medium text-sm mb-1 text-white">{method.name}</h4>
                      <p className="text-sm text-white/70">{method.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-64 flex items-center justify-center border rounded-md border-[#444] bg-[#333] text-white/60">
                No methods information available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sources">
            {result.sources && result.sources.length > 0 ? (
              <ScrollArea className="h-64 rounded-md border border-[#444] p-4 bg-[#333]">
                <div className="space-y-4">
                  {result.sources.map((source, index) => (
                    <div key={index} className="p-3 bg-[#2d2d2d] rounded-md border border-[#444]">
                      <h4 className="font-medium text-sm text-white">{source.title}</h4>
                      <p className="text-sm text-white/70">
                        {source.authors.join(', ')} 
                        {source.year ? ` (${source.year})` : ''}
                      </p>
                      {source.journal && (
                        <p className="text-xs italic text-white/50 mt-1">{source.journal}</p>
                      )}
                      {source.doi && (
                        <div className="mt-2 text-xs text-blue-400">DOI: {source.doi}</div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-64 flex items-center justify-center border rounded-md border-[#444] bg-[#333] text-white/60">
                No source information available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t border-[#444] py-3">
        <Button variant="outline" size="sm" className="text-white/80 border-[#444]">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
        <Button variant="outline" size="sm" className="text-white/80 border-[#444]">
          <Share className="h-4 w-4 mr-2" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FullHypothesisResults;