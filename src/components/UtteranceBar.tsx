import { Button } from "@/components/ui/button";
import { Volume2, X, Delete, ArrowLeft } from "lucide-react";
import { QuickPhrasesPanel, QuickPhrase } from "./QuickPhrasesPanel";

interface UtteranceBarProps {
  text: string;
  words: string[];
  onSpeak: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDeleteWord: () => void;
  isSpeaking: boolean;
  quickPhrases: QuickPhrase[];
  onQuickPhraseSelect: (phrase: string) => void;
}

export const UtteranceBar = ({ 
  text, 
  words,
  onSpeak, 
  onClear, 
  onBackspace,
  onDeleteWord,
  isSpeaking,
  quickPhrases,
  onQuickPhraseSelect
}: UtteranceBarProps) => {
  return (
    <div className="bg-[hsl(var(--utterance-bg))] border-b-4 border-primary p-4">
      <div className="flex items-center gap-3">
        <div 
          className="flex-1 min-h-[80px] bg-background rounded-lg p-4 flex items-center"
          role="textbox"
          aria-label="Current sentence"
          aria-live="polite"
        >
          <p className="text-2xl font-semibold text-foreground break-words">
            {text || "Tap tiles to build a sentence..."}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={onSpeak}
              disabled={!text || isSpeaking}
              className="min-w-[140px] h-[38px] text-base"
              aria-label="Speak sentence"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Speak
            </Button>
            <QuickPhrasesPanel 
              phrases={quickPhrases}
              onPhraseSelect={onQuickPhraseSelect}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDeleteWord}
              disabled={words.length === 0}
              className="flex-1 h-[38px]"
              aria-label="Delete last word"
            >
              <Delete className="mr-2 h-4 w-4" />
              Word
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onBackspace}
              disabled={!text}
              className="flex-1 h-[38px]"
              aria-label="Backspace"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onClear}
              disabled={!text}
              className="h-[38px] px-4"
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
