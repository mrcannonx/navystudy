import { FileText, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

type SummaryFormat = 'bullet' | 'tldr' | 'qa';

interface FormatSelectorProps {
  selectedFormat: SummaryFormat;
  onFormatChange: (format: SummaryFormat) => void;
}

export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  const formats = [
    {
      id: 'bullet' as const,
      icon: FileText,
      label: 'Bullet Points'
    },
    {
      id: 'tldr' as const,
      icon: Zap,
      label: 'TL;DR'
    },
    {
      id: 'qa' as const,
      icon: Brain,
      label: 'Q&A'
    }
  ];

  return (
    <div className="flex gap-3 mb-6">
      {formats.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={selectedFormat === id ? 'default' : 'outline'}
          onClick={() => onFormatChange(id)}
          className="flex-1"
        >
          <Icon className="h-4 w-4 mr-2" /> {label}
        </Button>
      ))}
    </div>
  );
}
