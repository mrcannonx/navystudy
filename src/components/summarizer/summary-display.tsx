import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SaveSummaryDialog } from "./save-summary-dialog";

interface SummaryDisplayProps {
  summary: string | null;
  error: string | null;
  isSaveDialogOpen: boolean;
  onSaveDialogOpenChange: (open: boolean) => void;
  summaryTitle: string;
  onSummaryTitleChange: (title: string) => void;
  onSave: () => void;
  isSaving: boolean;
  saveError: string | null;
}

export function SummaryDisplay({
  summary,
  error,
  isSaveDialogOpen,
  onSaveDialogOpenChange,
  summaryTitle,
  onSummaryTitleChange,
  onSave,
  isSaving,
  saveError
}: SummaryDisplayProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <Dialog open={isSaveDialogOpen} onOpenChange={onSaveDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Summary
              </Button>
            </DialogTrigger>
            <SaveSummaryDialog
              isOpen={isSaveDialogOpen}
              onOpenChange={onSaveDialogOpenChange}
              title={summaryTitle}
              onTitleChange={onSummaryTitleChange}
              onSave={onSave}
              isSaving={isSaving}
              error={saveError}
            />
          </Dialog>
        </div>
        <div 
          className="prose prose-blue dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      </div>
    </div>
  );
}
