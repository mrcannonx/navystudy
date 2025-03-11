import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingDependency } from "@/types/study-settings";

interface NumberSettingProps {
  name: string;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  dependency?: SettingDependency;
  disabled?: boolean;
}

export function NumberSetting({
  name,
  label,
  description,
  value,
  onChange,
  min,
  max,
  dependency,
  disabled
}: NumberSettingProps) {
  const hasRequirements = dependency?.requires.length ?? 0 > 0;
  const hasSuggestions = dependency?.suggests.length ?? 0 > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col space-y-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>
          {(hasRequirements || hasSuggestions) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  {hasRequirements && (
                    <div>
                      <p className="font-semibold">Required Settings:</p>
                      <ul className="list-disc pl-4">
                        {dependency?.requires.map(req => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {hasSuggestions && (
                    <div className="mt-2">
                      <p className="font-semibold">Suggested Settings:</p>
                      <ul className="list-disc pl-4">
                        {dependency?.suggests.map(sug => (
                          <li key={sug}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Input
          id={name}
          type="number"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
          className="w-24 text-right"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
