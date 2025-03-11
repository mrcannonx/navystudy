import { Summarizer } from '@/lib/types';
import { EnhancedSavedSummaryCard } from './enhanced-saved-summary-card';
import { ClientLoadingState } from '@/components/ui/client-loading-state';
import { FileText } from 'lucide-react';

interface EnhancedSavedSummariesListProps {
  summaries: Summarizer[];
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  isLoading: boolean;
}

export function EnhancedSavedSummariesList({
  summaries,
  onDelete,
  onEdit,
  isLoading
}: EnhancedSavedSummariesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ClientLoadingState />
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Saved Summaries</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Create your first summary by entering text above and clicking "Summarize". Save your summaries to access them later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary, index) => (
        <EnhancedSavedSummaryCard
          key={summary.id}
          summary={summary}
          onDelete={onDelete}
          onEdit={onEdit}
          colorIndex={index}
        />
      ))}
    </div>
  );
}