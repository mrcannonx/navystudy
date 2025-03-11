"use client"

import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ModeAvailabilityWarningProps {
  modeAvailability: {
    available: boolean;
    reason?: string;
  };
  modeRequirements: {
    description: string;
  };
}

export function ModeAvailabilityWarning({
  modeAvailability,
  modeRequirements
}: ModeAvailabilityWarningProps) {
  if (modeAvailability.available) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Study Mode Limited</AlertTitle>
      <AlertDescription>
        {modeAvailability.reason || "This study mode is not available for this deck"}. Using basic study features instead.
        <div className="mt-2 text-sm text-muted-foreground">
          {modeRequirements.description}
        </div>
      </AlertDescription>
    </Alert>
  );
}