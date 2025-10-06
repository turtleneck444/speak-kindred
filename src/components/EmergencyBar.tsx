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
    <div className={cn("bg-red-50 dark:bg-red-950/20 border-b-4 border-red-500 p-2", className)}>
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-2 shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-900 dark:text-red-100">
            Emergency
          </span>
        </div>
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {phrases.slice(0, 4).map((phrase) => {
            const Icon = iconMap[phrase.icon || 'alert'];
            return (
              <Button
                key={phrase.id}
                onClick={() => onPhraseSelect(phrase.phrase)}
                variant="destructive"
                className="shrink-0 font-semibold"
                size="lg"
                aria-label={`Emergency: ${phrase.phrase}`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {phrase.phrase}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
