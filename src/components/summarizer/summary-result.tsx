import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { SummaryFormat } from './summarizer-constants';

interface SummaryResultProps {
  summary: string;
  format: SummaryFormat;
  originalLength: number;
  onClear: () => void;
}

export function SummaryResult({ summary, format, originalLength, onClear }: SummaryResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const compressionRatio = ((summary.length / originalLength) * 100).toFixed(1);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="text-sm text-muted-foreground">
            Format: {format} | Compression: {compressionRatio}%
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="p-6 border rounded-lg bg-muted/50 dark:bg-gray-800/50">
        {summary}
      </div>
    </div>
  );
}
