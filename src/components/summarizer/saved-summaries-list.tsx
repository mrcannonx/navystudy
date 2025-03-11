import { useState, useEffect } from 'react';
import { Summarizer, SummaryFormat } from '@/lib/types';
import { SavedSummaryCard } from './saved-summary-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Zap, Brain } from 'lucide-react';

interface SavedSummariesListProps {
  summaries: Summarizer[];
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  isLoading?: boolean;
}

export function SavedSummariesList({
  summaries,
  onDelete,
  onEdit,
  isLoading = false,
}: SavedSummariesListProps) {
  const [selectedFormat, setSelectedFormat] = useState<SummaryFormat | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSummaries = summaries.filter((summary) => {
    const matchesFormat = selectedFormat === 'all' || summary.format === selectedFormat;
    const matchesSearch = summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFormat && matchesSearch;
  });

  const formatIcon = {
    bullet: <FileText className="h-4 w-4" />,
    tldr: <Zap className="h-4 w-4" />,
    qa: <Brain className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs
          value={selectedFormat}
          onValueChange={(value) => setSelectedFormat(value as SummaryFormat | 'all')}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bullet" className="flex items-center gap-2">
              {formatIcon.bullet} Bullet
            </TabsTrigger>
            <TabsTrigger value="tldr" className="flex items-center gap-2">
              {formatIcon.tldr} TL;DR
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              {formatIcon.qa} Q&A
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredSummaries.length > 0 ? (
        <div className="grid gap-6 grid-cols-1">
          {filteredSummaries.map((summary) => (
            <SavedSummaryCard
              key={summary.id}
              summary={summary}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'No summaries match your search'
              : selectedFormat === 'all'
              ? 'No saved summaries yet'
              : `No saved summaries in ${selectedFormat.toUpperCase()} format`}
          </p>
        </div>
      )}
    </div>
  );
}
