import { Button } from "@/components/ui/button";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSummarize: () => void;
  isLoading: boolean;
}

export function TextInput({ value, onChange, onClear, onSummarize, isLoading }: TextInputProps) {
  return (
    <div className="relative">
      <textarea
        className="w-full h-48 p-6 rounded-lg mb-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Paste your text here and select a format: Bullet Points for organized lists, TL;DR for quick summaries, or Q&A for structured breakdowns..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value.length} characters
        </span>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClear}
            disabled={!value.trim() || isLoading}
          >
            Clear
          </Button>
          <Button
            onClick={onSummarize}
            disabled={isLoading || !value.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              'Summarize'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
