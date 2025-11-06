import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export interface QuickPhrase {
  id: string;
  phrase: string;
  category: string;
  is_emergency: boolean;
  usage_count?: number;
  user_id?: string | null;
  is_custom?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface QuickPhrasesPanelProps {
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

export const QuickPhrasesPanel = ({ onPhraseSelect }: QuickPhrasesPanelProps) => {
  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newIsEmergency, setNewIsEmergency] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_phrases')
        .select('*')
        .order('is_emergency', { ascending: false })
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setPhrases(data || []);
    } catch (error) {
      console.error('Error loading quick phrases:', error);
    }
  };

  const addCustomPhrase = async () => {
    if (!newPhrase.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add custom phrases.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('quick_phrases')
        .insert({
          phrase: newPhrase.trim(),
          category: newCategory,
          is_emergency: newIsEmergency,
          is_custom: true,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Phrase added",
        description: "Your custom phrase has been added successfully.",
      });

      setNewPhrase('');
      setNewCategory('general');
      setNewIsEmergency(false);
      setIsAddingPhrase(false);
      loadPhrases();
    } catch (error) {
      console.error('Error adding phrase:', error);
      toast({
        title: "Error",
        description: "Failed to add custom phrase.",
        variant: "destructive",
      });
    }
  };

  const handlePhraseSelect = async (phrase: QuickPhrase) => {
    // Track usage
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('quick_phrases')
          .update({ usage_count: (phrase.usage_count || 0) + 1 })
          .eq('id', phrase.id);
      }
    } catch (error) {
      console.error('Error tracking phrase usage:', error);
    }

    onPhraseSelect(phrase.phrase);
  };

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
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Quick Phrases
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddingPhrase(!isAddingPhrase)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </SheetTitle>
        </SheetHeader>

        {isAddingPhrase && (
          <div className="mt-4 p-4 border rounded-lg space-y-3">
            <div className="space-y-2">
              <Label htmlFor="new-phrase">Phrase</Label>
              <Input
                id="new-phrase"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="Enter a new phrase..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="basic_needs">Basic Needs</SelectItem>
                  <SelectItem value="feelings">Feelings</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-emergency"
                checked={newIsEmergency}
                onChange={(e) => setNewIsEmergency(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="is-emergency">Mark as emergency</Label>
            </div>
            <Button onClick={addCustomPhrase} className="w-full">
              Add Phrase
            </Button>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
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
                      onClick={() => handlePhraseSelect(phrase)}
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
