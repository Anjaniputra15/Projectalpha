// src/components/TerminalOutput.tsx
import React, { useMemo } from 'react';
import { StatisticalTestResult } from '@/hooks/useStreamingHypothesis';

interface TerminalOutputProps {
  rawOutput?: string[];
  testResults?: StatisticalTestResult[];
  containerClass?: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  rawOutput = [],
  testResults = [],
  containerClass = ''
}) => {
  // Format scientific notation consistently
  const formatScientific = (value: number): string => {
    if (isNaN(value)) return 'NaN';
    
    // For very small p-values, use scientific notation
    if (value < 0.0001) {
      return value.toExponential(6);
    }
    
    // For normal values, show up to 6 decimal places
    return value.toFixed(6);
  };
  
  // Create a highlighted version of the raw output with styled p-values and statistics
  const highlightedOutput = useMemo(() => {
    return rawOutput.map((line, index) => {
      // Highlight different parts of the line
      let highlightedLine = line;
      
      // Replace statistical test headers
      highlightedLine = highlightedLine.replace(
        /(Kolmogorov-Smirnov test results:|Complete Kolmogorov-Smirnov test results:)/gi,
        '<span class="terminal-test-header">$1</span>'
      );
      
      // Replace test type labels
      highlightedLine = highlightedLine.replace(
        /(Tangential motion|Perpendicular motion|Tangential\/Radial ratio)(\s+\([\w_]+\))?:/gi,
        '<span class="terminal-test-type">$1$2:</span>'
      );
      
      // Replace statistics values
      highlightedLine = highlightedLine.replace(
        /statistic=([\d.]+)/gi,
        'statistic=<span class="terminal-statistic">$1</span>'
      );
      
      // Replace p-values
      highlightedLine = highlightedLine.replace(
        /p-value=([\d.e+-]+)/gi,
        'p-value=<span class="terminal-p-value">$1</span>'
      );
      
      // Replace combined values
      highlightedLine = highlightedLine.replace(
        /(Combined[\s\w]+p-value|Bootstrap p-value):\s*([\d.e+-]+)/gi,
        '<span class="terminal-combined">$1:</span> <span class="terminal-p-value">$2</span>'
      );
      
      // Replace warnings and errors
      highlightedLine = highlightedLine.replace(
        /(Warning|Error|I apologize):/gi,
        '<span class="terminal-warning">$1:</span>'
      );
      
      // Replace Action: prompts
      highlightedLine = highlightedLine.replace(
        /(Action:)(\s*\w+)/gi,
        '<span class="terminal-action">$1$2</span>'
      );
      
      return (
        <div 
          key={index} 
          className="terminal-line"
          dangerouslySetInnerHTML={{ __html: highlightedLine }}
        />
      );
    });
  }, [rawOutput]);

  return (
    <div className={`terminal-output ${containerClass}`}>
      <div className="terminal-content">
        {highlightedOutput}
      </div>
      
      {/* Show a summary of statistical tests if available */}
      {testResults.length > 0 && (
        <div className="terminal-summary">
          <div className="terminal-summary-header">Statistical Test Summary</div>
          <table className="terminal-summary-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Statistic</th>
                <th>p-value</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index}>
                  <td>{test.testName}</td>
                  <td>{isNaN(test.statistic) ? 'N/A' : formatScientific(test.statistic)}</td>
                  <td>{formatScientific(test.pValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TerminalOutput;