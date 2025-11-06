import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseContextAwareSuggestionsProps {
  currentText: string;
  recentWords: string[];
  enabled: boolean;
}

export const useContextAwareSuggestions = ({
  currentText,
  recentWords,
  enabled
}: UseContextAwareSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = useCallback(async () => {
    if (!enabled || !currentText || currentText.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggestions', {
        body: {
          currentText,
          recentWords: recentWords.slice(-10),
          userContext: 'AAC communication device'
        }
      });

      if (error) {
        console.error('Error fetching AI suggestions:', error);
        setSuggestions([]);
        return;
      }

      if (data?.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error in useContextAwareSuggestions:', error);
      setSuggestions([]);
      
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          toast({
            title: "Rate Limit Reached",
            description: "Please wait a moment before requesting more suggestions.",
            variant: "destructive",
          });
        } else if (error.message.includes('402')) {
          toast({
            title: "AI Credits Depleted",
            description: "Please add credits to continue using AI suggestions.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentText, recentWords, enabled, toast]);

  // Debounce the suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 800);

    return () => clearTimeout(timer);
  }, [fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    refreshSuggestions: fetchSuggestions
  };
};
