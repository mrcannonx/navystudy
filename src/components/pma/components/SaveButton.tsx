"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  isSaving: boolean;
  onSaveAction: () => void;
  className?: string;
}

/**
 * Component that displays a save button with loading state
 */
export function SaveButton({ isSaving, onSaveAction, className = "" }: SaveButtonProps) {
  return (
    <Button
      onClick={onSaveAction}
      disabled={isSaving}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          <span>Save</span>
        </>
      )}
    </Button>
  );
}