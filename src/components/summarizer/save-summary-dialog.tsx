import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface SaveSummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  isSaving: boolean;
  error: string | null;
}

export function SaveSummaryDialog({
  isOpen,
  onOpenChange,
  onSave,
  title,
  onTitleChange,
  isSaving,
  error
}: SaveSummaryDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Save Summary</DialogTitle>
        <DialogDescription>
          Enter a title to save your summary for future reference.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Input
          placeholder="Enter a title for your summary"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!title.trim() || isSaving}
        >
          {isSaving ? (
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
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
