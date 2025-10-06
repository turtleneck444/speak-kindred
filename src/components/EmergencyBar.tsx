import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmergencyPhrase {
  id: string;
  phrase: string;
  icon?: 'alert' | 'phone' | 'help' | 'emergency';
}

interface EmergencyBarProps {
  phrases: EmergencyPhrase[];
  onPhraseSelect: (phrase: string) => void;
  className?: string;
}

const iconMap = {
  alert: AlertTriangle,
  phone: Phone,
  help: HelpCircle,
  emergency: AlertCircle,
};

export const EmergencyBar = ({ phrases, onPhraseSelect, className }: EmergencyBarProps) => {
  if (phrases.length === 0) return null;

  return (
    <div className={cn("bg-red-50 dark:bg-red-950/20 border-b-4 border-red-500 p-2 sm:p-3", className)}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-1 sm:px-2">
        {/* Emergency label */}
        <div className="flex items-center gap-2 shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm sm:text-base font-semibold text-red-900 dark:text-red-100">
            Emergency
          </span>
        </div>
        
        {/* Emergency buttons - stack on mobile, horizontal scroll on larger screens */}
        <div className="grid grid-cols-2 sm:flex gap-2 flex-1 sm:overflow-x-auto">
          {phrases.slice(0, 4).map((phrase) => {
            const Icon = iconMap[phrase.icon || 'alert'];
            return (
              <Button
                key={phrase.id}
                onClick={() => onPhraseSelect(phrase.phrase)}
                variant="destructive"
                className="shrink-0 font-semibold h-12 sm:h-11 touch-manipulation text-xs sm:text-sm"
                size="lg"
                aria-label={`Emergency: ${phrase.phrase}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">{phrase.phrase}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
