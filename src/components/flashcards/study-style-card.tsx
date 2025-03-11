
import { ReactNode, memo } from "react"
import { Check, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { STUDY_MODE_THEMES } from "@/config/study-styles"
import type { StudyMode } from "./types/study-settings"
import { CardValidator } from "@/lib/card-validator"

interface StudyStyleCardProps {
  icon: ReactNode
  title: string
  description: string
  features: {
    initial: string[];
    additional: string[];
  }
  mode: StudyMode
  isSelected: boolean
  cardsPerSession: number
  onCardsChange: (value: number) => void
  onClick: () => void
  currentDeckCardCount?: number
}

export const StudyStyleCard = memo(function StudyStyleCard({
  icon,
  title,
  description,
  features,
  mode,
  isSelected,
  cardsPerSession,
  onCardsChange,
  onClick,
  currentDeckCardCount
}: StudyStyleCardProps) {
  const theme = STUDY_MODE_THEMES[mode]
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full p-4 rounded-xl border transition-all duration-300 flex flex-col h-full
        ${isSelected 
          ? `bg-gradient-to-br ${theme.gradient} border-transparent text-white shadow-xl ${theme.glow} scale-[1.02]` 
          : `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
             hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md
             hover:scale-[1.01]`
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`
          p-2 rounded-lg self-start
          ${isSelected 
            ? 'bg-white/20' 
            : 'bg-gray-50 dark:bg-gray-700'
          }
        `}>
          {icon}
        </div>
        <h3 className="font-medium text-lg text-left">{title}</h3>
      </div>

      {/* Description and Requirements */}
      <div className="space-y-2 mb-3 text-left">
        <p className={`
          text-sm
          ${isSelected 
            ? 'text-white/90' 
            : 'text-gray-600 dark:text-gray-300'
          }
        `}>
          {description}
        </p>
        
        {/* Mode Requirements */}
        {currentDeckCardCount !== undefined && (
          <div className={`
            text-sm flex items-center gap-2
            ${isSelected 
              ? 'text-white/80' 
              : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            <AlertCircle className="w-4 h-4" />
            <span>
              {CardValidator.getModeRequirements(mode).description}
              {currentDeckCardCount < CardValidator.getModeRequirements(mode).minimumCards && (
                <span className="block text-xs mt-0.5">
                  Current deck has {currentDeckCardCount} cards
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[...features.initial, ...features.additional].map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className={`
                block w-1 h-1 rounded-full mt-[0.4rem] flex-shrink-0
                ${isSelected 
                  ? 'bg-white/60' 
                  : 'bg-gray-400 dark:bg-gray-500'
                }
              `} />
              <span className={`
                text-sm leading-5 whitespace-nowrap
                ${isSelected 
                  ? 'text-white/80' 
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards per Session */}
      <div 
        className="mt-3 text-left"
        onClick={(e) => e.stopPropagation()} // Prevent card selection when interacting with input
      >
        <Label 
          htmlFor={`cards-${title}`}
          className={isSelected ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}
        >
          Cards per Session
        </Label>
        <Input
          id={`cards-${title}`}
          type="number"
          min={1}
          max={50}
          value={cardsPerSession}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              const validValue = Math.min(Math.max(value, 1), 50);
              if (validValue !== cardsPerSession) {
                onCardsChange(validValue);
              }
            } else {
              // Reset to current value if invalid
              e.target.value = cardsPerSession.toString();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            // Allow empty input while typing
            if (value === '') return;
            
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
              // Don't clamp while typing, wait for blur
              onCardsChange(numValue);
            }
          }}
          className={`
            mt-1 bg-white/10
            ${isSelected 
              ? 'text-white placeholder-white/50 border-white/20' 
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
        />
      </div>
    </button>
  )
});
