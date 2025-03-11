"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Database, PlusCircle, X, MinusCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricsLibrary } from './types';
import { FeatureTooltip } from './components/feature-tooltip';

interface TemplateMetricsLibraryProps {
  metrics: MetricsLibrary;
  activeSection: string;
  rating?: string;
  role?: string;
  onAddMetricAction: (metric: string) => void;
  onAddCustomMetricAction: (metric: string, section: string) => void;
  onDeleteMetricAction?: (metric: string, section: string) => void;
  onError?: (message: string) => void;
}

export const TemplateMetricsLibrary: React.FC<TemplateMetricsLibraryProps> = ({
  metrics,
  activeSection,
  rating,
  role,
  onAddMetricAction,
  onAddCustomMetricAction,
  onDeleteMetricAction,
  onError
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState('');
  const [isGeneratingMetrics, setIsGeneratingMetrics] = useState(false);
  const [generatedMetrics, setGeneratedMetrics] = useState<string[]>([]);
  const [showGeneratedMetrics, setShowGeneratedMetrics] = useState(false);
  
  // Make sure we have metrics for the active section, or use an empty array
  const sectionMetrics = metrics[activeSection as keyof MetricsLibrary] || [];
  
  // Only log metrics in development mode and when explicitly debugging
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_METRICS === 'true') {
    console.debug(`Metrics for section ${activeSection}:`, sectionMetrics);
  }
  
  // Filter the metrics based on search term
  const filteredMetrics = sectionMetrics.filter(
    metric => metric.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateAIMetrics = async () => {
    setIsGeneratingMetrics(true);
    setShowGeneratedMetrics(false);
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Generating metrics for section: ${activeSection}, rating: ${rating}, role: ${role}`);
      }
      
      // Call the AI metrics generation endpoint
      const response = await fetch('/api/ai/generate-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: activeSection,
          rating: rating || 'IT',  // Use the rating abbreviation from the navy_ratings table
          role: role || 'System Administrator',
          task: 'generate_metrics'
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate metrics: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.summary) {
        // Parse the metrics from the response
        const metricsText = result.data.summary;
        const metrics = metricsText
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.trim());
        
        setGeneratedMetrics(metrics);
        setShowGeneratedMetrics(true);
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Generated ${metrics.length} metrics for ${rating} ${role}`);
        }
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      console.error('Error generating metrics:', error);
      if (onError) {
        onError('Failed to generate metrics with AI. Please try again later.');
      }
    } finally {
      setIsGeneratingMetrics(false);
    }
  };

  const handleAddCustomMetric = () => {
    if (newMetric.trim()) {
      // Add to the metrics library for future use
      // This will also add the metric to the section text
      if (onAddCustomMetricAction) {
        onAddCustomMetricAction(newMetric.trim(), activeSection);
      }
      
      // Reset form
      setNewMetric('');
      setIsAddingMetric(false);
    }
  };

  const handleAddMetric = (metric: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Adding metric "${metric}" to active section: ${activeSection}`);
    }
    
    // Call the parent component's handler to add the metric
    if (metric && activeSection) {
      try {
        onAddMetricAction(metric);
        if (process.env.NODE_ENV === 'development') {
          console.debug(`Successfully called onAddMetricAction for metric: "${metric}"`);
        }
      } catch (error) {
        console.error(`Error adding metric "${metric}" to section ${activeSection}:`, error);
      }
    } else {
      console.warn(`Cannot add metric: metric=${metric}, activeSection=${activeSection}`);
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader className="bg-blue-50 dark:bg-blue-950/50 border-b border-blue-100 dark:border-blue-900">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center text-blue-800 dark:text-blue-300">
            <Database size={16} className="mr-2" />
            Custom Metrics Library
          </CardTitle>
          <div className="flex items-center space-x-2">
            <FeatureTooltip
              color="blue"
              content={
                <div>
                  <p className="font-medium mb-1">Custom Metrics Library</p>
                  <p className="mb-2">A collection of quantifiable metrics organized by evaluation section that you can add to your evaluation with a single click.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Click any metric to add it to your current section</li>
                    <li>Use the search box to find specific metrics</li>
                    <li>Create custom metrics for future use</li>
                    <li>Use the AI button to generate role-specific metrics</li>
                  </ul>
                </div>
              }
            />
            <button
              className="text-purple-600 hover:text-purple-800 transition-colors"
              title="Generate AI metrics for this section"
              onClick={handleGenerateAIMetrics}
              disabled={isGeneratingMetrics}
            >
              {isGeneratingMetrics ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-purple-600 rounded-full animate-spin" />
              ) : (
                <Zap size={16} />
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {isAddingMetric ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">New Custom Metric</label>
              <div className="flex gap-2">
                <Input
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="Use ## as placeholder for numbers (e.g., '## tasks completed')"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use ## as a placeholder for numbers that will be filled in later.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsAddingMetric(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddCustomMetric}>
                Add Metric
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Search Metrics</label>
              <input
                type="text"
                className="w-full border rounded p-1.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                placeholder="Search by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {showGeneratedMetrics && (
              <div className="mt-2 mb-3 border rounded-md p-3 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center">
                    <Zap size={14} className="mr-1" />
                    AI-Generated Metrics
                  </h4>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowGeneratedMetrics(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {generatedMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center">
                      <button
                        className="text-left px-2 py-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded flex-grow flex items-center text-gray-700 dark:text-gray-200"
                        onClick={() => handleAddMetric(metric)}
                      >
                        <PlusCircle size={14} className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                        {metric}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-sm">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1 mt-3">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Metrics
              </h3>
              <div className="space-y-1">
                {filteredMetrics.length > 0 ? (
                  filteredMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center">
                      <button
                        className="text-left px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded flex-grow flex items-center text-gray-700 dark:text-gray-200"
                        onClick={() => handleAddMetric(metric)}
                      >
                        <PlusCircle size={14} className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                        {metric}
                      </button>
                      {onDeleteMetricAction && (
                        <button
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent button's onClick
                            e.preventDefault(); // Prevent any default behavior
                            if (process.env.NODE_ENV === 'development') {
                              console.debug(`Deleting metric: ${metric} from section: ${activeSection}`);
                            }
                            onDeleteMetricAction(metric, activeSection);
                          }}
                          title="Delete metric"
                        >
                          <MinusCircle size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm py-2 text-center">
                    No metrics available for this section
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-900 py-2 px-3">
        <button
          className="text-blue-700 dark:text-blue-400 text-xs hover:underline flex items-center w-full"
          onClick={() => setIsAddingMetric(true)}
        >
          <PlusCircle size={12} className="mr-1" />
          Add Custom Metric
        </button>
      </CardFooter>
    </Card>
  );
};