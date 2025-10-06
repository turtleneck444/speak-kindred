import { Button } from "@/components/ui/button";
import { Volume2, X } from "lucide-react";

interface UtteranceBarProps {
  text: string;
  onSpeak: () => void;
  onClear: () => void;
  isSpeaking: boolean;
}

export const UtteranceBar = ({ text, onSpeak, onClear, isSpeaking }: UtteranceBarProps) => {
  return (
    <div className="bg-[hsl(var(--utterance-bg))] border-b-4 border-primary p-4">
      <div className="flex items-center gap-3">
        <div 
          className="flex-1 min-h-[60px] bg-background rounded-lg p-4 flex items-center"
          role="textbox"
          aria-label="Current sentence"
          aria-live="polite"
        >
          <p className="text-2xl font-semibold text-foreground">
            {text || "Tap tiles to build a sentence..."}
          </p>
        </div>
        <Button
          size="lg"
          onClick={onSpeak}
          disabled={!text || isSpeaking}
          className="min-w-[120px] h-[60px] text-xl"
          aria-label="Speak sentence"
        >
          <Volume2 className="mr-2 h-6 w-6" />
          Speak
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={onClear}
          disabled={!text}
          className="h-[60px] w-[60px] p-0"
          aria-label="Clear sentence"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
