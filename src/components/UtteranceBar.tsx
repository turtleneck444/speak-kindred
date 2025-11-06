import { Button } from "@/components/ui/button";
import { Volume2, X, Delete, ArrowLeft, Keyboard } from "lucide-react";
import { QuickPhrasesPanel, QuickPhrase } from "./QuickPhrasesPanel";

interface UtteranceBarProps {
  text: string;
  words: string[];
  onSpeak: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDeleteWord: () => void;
  onKeyboardToggle: () => void;
  showKeyboard: boolean;
  isSpeaking: boolean;
  onQuickPhraseSelect: (phrase: string) => void;
}

export const UtteranceBar = ({ 
  text, 
  words,
  onSpeak, 
  onClear, 
  onBackspace,
  onDeleteWord,
  onKeyboardToggle,
  showKeyboard,
  isSpeaking,
  onQuickPhraseSelect
}: UtteranceBarProps) => {
  return (
    <div className="bg-[hsl(var(--utterance-bg))] border-b-4 border-primary p-3 sm:p-4">
      {/* Mobile layout: Stack vertically */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Text display area - full width on mobile */}
        <div 
          className="flex-1 min-h-[60px] sm:min-h-[80px] bg-background rounded-lg p-3 sm:p-4 flex items-center"
          role="textbox"
          aria-label="Current sentence"
          aria-live="polite"
        >
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground break-words w-full">
            {text || "Tap tiles to build a sentence..."}
          </p>
        </div>
        
        {/* Controls - responsive layout */}
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          {/* Primary actions - larger on mobile for touch */}
          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={onSpeak}
              disabled={!text || isSpeaking}
              className="flex-1 lg:min-w-[140px] h-12 sm:h-11 lg:h-[38px] text-sm sm:text-base touch-manipulation"
              aria-label="Speak sentence"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Speak
            </Button>
            <Button
              size="lg"
              variant={showKeyboard ? "default" : "outline"}
              onClick={onKeyboardToggle}
              className="h-12 sm:h-11 lg:h-[38px] px-3 sm:px-4 touch-manipulation"
              aria-label={showKeyboard ? "Hide keyboard" : "Show keyboard"}
            >
              <Keyboard className="h-5 w-5" />
            </Button>
            <QuickPhrasesPanel 
              onPhraseSelect={onQuickPhraseSelect}
            />
          </div>
          
          {/* Secondary actions - good touch targets */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDeleteWord}
              disabled={words.length === 0}
              className="flex-1 h-11 sm:h-10 lg:h-[38px] text-xs sm:text-sm touch-manipulation"
              aria-label="Delete last word"
            >
              <Delete className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Word</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onBackspace}
              disabled={!text}
              className="flex-1 h-11 sm:h-10 lg:h-[38px] touch-manipulation"
              aria-label="Backspace"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onClear}
              disabled={!text}
              className="h-11 sm:h-10 lg:h-[38px] px-3 sm:px-4 touch-manipulation"
              aria-label="Clear sentence"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
