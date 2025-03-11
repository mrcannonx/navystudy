import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingDependency } from "@/types/study-settings";

interface SettingToggleProps {
  name: string;
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  dependency?: SettingDependency;
  disabled?: boolean;
}

export function SettingToggle({
  name,
  label,
  description,
  value,
  onChange,
  dependency,
  disabled
}: SettingToggleProps) {
  const hasRequirements = dependency?.requires.length ?? 0 > 0;
  const hasSuggestions = dependency?.suggests.length ?? 0 > 0;

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
        <Switch
          id={name}
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
