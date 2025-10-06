import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface QuickPhrase {
  id: string;
  phrase: string;
  category: string;
  is_emergency: boolean;
}

interface QuickPhrasesPanelProps {
  phrases: QuickPhrase[];
  onPhraseSelect: (phrase: string) => void;
}

const categoryLabels: Record<string, string> = {
  emergency: "Emergency",
  basic_needs: "Basic Needs",
  feelings: "Feelings",
  social: "Social",
  general: "General",
};

const categoryColors: Record<string, string> = {
  emergency: "destructive",
  basic_needs: "default",
  feelings: "secondary",
  social: "outline",
  general: "default",
};

export const QuickPhrasesPanel = ({ phrases, onPhraseSelect }: QuickPhrasesPanelProps) => {
  const groupedPhrases = phrases.reduce((acc, phrase) => {
    if (!acc[phrase.category]) {
      acc[phrase.category] = [];
    }
    acc[phrase.category].push(phrase);
    return acc;
  }, {} as Record<string, QuickPhrase[]>);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0" aria-label="Quick phrases">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Phrases
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6">
            {Object.entries(groupedPhrases).map(([category, categoryPhrases]) => (
              <div key={category} className="space-y-3">
                <Badge variant={categoryColors[category] as any} className="text-sm">
                  {categoryLabels[category] || category}
                </Badge>
                <div className="grid gap-2">
                  {categoryPhrases.map((phrase) => (
                    <Button
                      key={phrase.id}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 text-left"
                      onClick={() => onPhraseSelect(phrase.phrase)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        {phrase.is_emergency && (
                          <Star className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <span className="text-base">{phrase.phrase}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
