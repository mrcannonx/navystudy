"use client"

import { useState } from 'react'
import { Edit, Trash2, Loader2 } from 'lucide-react'
import { BragSheetEntry, SectionKey } from './types'
import { cn } from '@/lib/utils'

interface BragSheetItemProps {
  entry: BragSheetEntry;
  onSelectAction: (entry: BragSheetEntry) => Promise<void>;
  onEditAction?: (entry: BragSheetEntry) => void;
  onDeleteAction?: (entryId: number | string) => void;
  categoryDisplayName: string; // Pre-computed category name instead of function
}

export function BragSheetItem({
  entry,
  onSelectAction,
  onEditAction,
  onDeleteAction,
  categoryDisplayName
}: BragSheetItemProps) {
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Format date for display (YYYY-MM-DD to YYYY-MM-DD)
  const formattedDate = entry.date;
  
  // Handle the add to evaluation action
  const handleAddToEvaluation = async () => {
    try {
      setIsLoading(true);
      await onSelectAction(entry);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      {/* Header section */}
      <div className="flex flex-col space-y-2">
        {/* Title row - full width */}
        <h3 className="font-medium text-gray-900 w-full">{entry.title}</h3>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {categoryDisplayName}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs mt-2 mb-3 line-clamp-3">{entry.description}</p>
      
      {/* Metrics */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {entry.metrics.map((metric, i) => (
          <span
            key={i}
            className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100"
          >
            {metric}
          </span>
        ))}
      </div>
      
      {/* Date and action buttons row - aligned right */}
      <div className="flex justify-end items-center gap-1 text-gray-500 mb-2">
        <span className="text-xs">{formattedDate}</span>
        {onEditAction && (
          <button
            className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEditAction(entry);
            }}
            title="Edit accomplishment"
          >
            <Edit size={14} />
          </button>
        )}
        {onDeleteAction && (
          <button
            className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAction(entry.id);
            }}
            title="Delete accomplishment"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      
      {/* Action button */}
      <button
        className={cn(
          "text-xs py-1.5 px-3 rounded w-full flex items-center justify-center mt-1 font-medium transition-colors",
          entry.added
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "bg-green-100 text-green-700 hover:bg-green-200",
          isLoading && "opacity-70 cursor-not-allowed"
        )}
        onClick={handleAddToEvaluation}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          entry.added ? "Re-add to Evaluation" : "Add to Evaluation"
        )}
      </button>
    </div>
  );
}