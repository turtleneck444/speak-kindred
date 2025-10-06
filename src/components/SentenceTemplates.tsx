import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SentenceTemplate {
  id: string;
  pattern: string;
  category: string;
  slots: string[];
  example: string;
  frequency?: number;
}

interface SentenceTemplatesProps {
  onTemplateSelect: (template: SentenceTemplate) => void;
}

const templates: SentenceTemplate[] = [
  // Basic needs templates
  { id: '1', pattern: 'I want {object}', category: 'needs', slots: ['object'], example: 'I want water' },
  { id: '2', pattern: 'I need {object}', category: 'needs', slots: ['object'], example: 'I need help' },
  { id: '3', pattern: 'Can I have {object}', category: 'needs', slots: ['object'], example: 'Can I have food' },
  { id: '4', pattern: 'I would like {object}', category: 'needs', slots: ['object'], example: 'I would like a break' },
  
  // Feelings templates
  { id: '5', pattern: 'I feel {emotion}', category: 'feelings', slots: ['emotion'], example: 'I feel happy' },
  { id: '6', pattern: 'I am {emotion}', category: 'feelings', slots: ['emotion'], example: 'I am tired' },
  { id: '7', pattern: 'I am feeling {emotion} because {reason}', category: 'feelings', slots: ['emotion', 'reason'], example: 'I am feeling happy because...' },
  
  // Questions templates
  { id: '8', pattern: 'Where is {object}', category: 'questions', slots: ['object'], example: 'Where is my phone' },
  { id: '9', pattern: 'When will {action}', category: 'questions', slots: ['action'], example: 'When will we go' },
  { id: '10', pattern: 'Who is {person}', category: 'questions', slots: ['person'], example: 'Who is here' },
  { id: '11', pattern: 'What is {object}', category: 'questions', slots: ['object'], example: 'What is that' },
  { id: '12', pattern: 'Why is {situation}', category: 'questions', slots: ['situation'], example: 'Why is it dark' },
  { id: '13', pattern: 'How do I {action}', category: 'questions', slots: ['action'], example: 'How do I do this' },
  
  // Social templates
  { id: '14', pattern: 'Can you help me with {task}', category: 'social', slots: ['task'], example: 'Can you help me with this' },
  { id: '15', pattern: 'Thank you for {action}', category: 'social', slots: ['action'], example: 'Thank you for helping' },
  { id: '16', pattern: 'I like {object}', category: 'social', slots: ['object'], example: 'I like you' },
  { id: '17', pattern: 'I don\'t like {object}', category: 'social', slots: ['object'], example: 'I don\'t like this' },
  { id: '18', pattern: 'Can we {action}', category: 'social', slots: ['action'], example: 'Can we go home' },
  
  // Time-based templates
  { id: '19', pattern: 'Good {time}', category: 'greetings', slots: ['time'], example: 'Good morning' },
  { id: '20', pattern: 'See you {time}', category: 'greetings', slots: ['time'], example: 'See you later' },
  
  // Activity templates
  { id: '21', pattern: 'I want to {action}', category: 'activities', slots: ['action'], example: 'I want to play' },
  { id: '22', pattern: 'Can I {action}', category: 'activities', slots: ['action'], example: 'Can I go outside' },
  { id: '23', pattern: 'Let\'s {action}', category: 'activities', slots: ['action'], example: 'Let\'s eat' },
  
  // Emergency templates
  { id: '24', pattern: 'I need help with {problem}', category: 'emergency', slots: ['problem'], example: 'I need help with this' },
  { id: '25', pattern: 'Something is wrong with {object}', category: 'emergency', slots: ['object'], example: 'Something is wrong with me' },
  { id: '26', pattern: 'Please call {person}', category: 'emergency', slots: ['person'], example: 'Please call mom' },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  needs: { label: 'Basic Needs', color: 'default' },
  feelings: { label: 'Feelings', color: 'secondary' },
  questions: { label: 'Questions', color: 'default' },
  social: { label: 'Social', color: 'outline' },
  greetings: { label: 'Greetings', color: 'default' },
  activities: { label: 'Activities', color: 'secondary' },
  emergency: { label: 'Emergency', color: 'destructive' },
};

export const SentenceTemplates = ({ onTemplateSelect }: SentenceTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = selectedCategory
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0" aria-label="Sentence templates">
          <FileText className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sentence Templates
          </SheetTitle>
        </SheetHeader>

        {/* Category Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category]?.label || category}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4 text-left hover:bg-accent"
                onClick={() => onTemplateSelect(template)}
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-base">
                      {template.pattern.replace(/{(\w+)}/g, '___')}
                    </span>
                    <Badge variant={categoryLabels[template.category]?.color as any || "default"}>
                      {categoryLabels[template.category]?.label || template.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Example: {template.example}
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {template.slots.map(slot => (
                      <Badge key={slot} variant="secondary" className="text-xs">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-1">💡 How to use:</p>
          <p className="text-muted-foreground">
            Select a template, then tap tiles to fill in the blanks. This helps build grammatically correct sentences!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
