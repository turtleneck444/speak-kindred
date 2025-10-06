import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface WordPredictionProps {
  predictions: string[];
  onWordSelect: (word: string) => void;
  isEnabled: boolean;
}

export const WordPrediction = ({ predictions, onWordSelect, isEnabled }: WordPredictionProps) => {
  if (!isEnabled || predictions.length === 0) return null;

  return (
    <div className="bg-muted/50 border-b px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Suggested</span>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-2">
            {predictions.map((word, index) => (
              <Button
                key={`${word}-${index}`}
                variant="secondary"
                size="sm"
                onClick={() => onWordSelect(word)}
                className="shrink-0 text-base font-medium"
                aria-label={`Suggested word: ${word}`}
              >
                {word}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};
