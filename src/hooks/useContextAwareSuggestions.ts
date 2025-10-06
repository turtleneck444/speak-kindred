import { useState, useEffect } from 'react';

interface ContextSuggestion {
  phrase: string;
  confidence: number;
  reason: string;
  icon?: string;
}

export const useContextAwareSuggestions = () => {
  const [suggestions, setSuggestions] = useState<ContextSuggestion[]>([]);

  useEffect(() => {
    const updateSuggestions = () => {
      const newSuggestions: ContextSuggestion[] = [];
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      const month = now.getMonth();

      // Time-based suggestions
      if (hour >= 6 && hour < 12) {
        newSuggestions.push({
          phrase: 'Good morning',
          confidence: 0.9,
          reason: 'Morning greeting',
          icon: 'Sunrise'
        });
        newSuggestions.push({
          phrase: "I'm hungry",
          confidence: 0.8,
          reason: 'Breakfast time',
          icon: 'Coffee'
        });
      } else if (hour >= 12 && hour < 17) {
        newSuggestions.push({
          phrase: 'Good afternoon',
          confidence: 0.9,
          reason: 'Afternoon greeting',
          icon: 'Sun'
        });
        newSuggestions.push({
          phrase: 'I need a break',
          confidence: 0.7,
          reason: 'Afternoon rest',
          icon: 'Coffee'
        });
      } else if (hour >= 17 && hour < 21) {
        newSuggestions.push({
          phrase: 'Good evening',
          confidence: 0.9,
          reason: 'Evening greeting',
          icon: 'Sunset'
        });
        newSuggestions.push({
          phrase: "I'm hungry",
          confidence: 0.8,
          reason: 'Dinner time',
          icon: 'Utensils'
        });
      } else {
        newSuggestions.push({
          phrase: 'Good night',
          confidence: 0.9,
          reason: 'Bedtime greeting',
          icon: 'Moon'
        });
        newSuggestions.push({
          phrase: "I'm tired",
          confidence: 0.85,
          reason: 'Bedtime',
          icon: 'Bed'
        });
      }

      // Day-based suggestions
      if (day === 0 || day === 6) {
        // Weekend
        newSuggestions.push({
          phrase: 'Can we go out',
          confidence: 0.7,
          reason: 'Weekend activity',
          icon: 'Car'
        });
      } else {
        // Weekday
        if (hour >= 7 && hour < 9) {
          newSuggestions.push({
            phrase: 'Time to get ready',
            confidence: 0.75,
            reason: 'Morning routine',
            icon: 'Clock'
          });
        }
      }

      // Season-based suggestions
      if (month >= 11 || month <= 2) {
        // Winter
        newSuggestions.push({
          phrase: "I'm cold",
          confidence: 0.65,
          reason: 'Winter season',
          icon: 'Snowflake'
        });
      } else if (month >= 6 && month <= 8) {
        // Summer
        newSuggestions.push({
          phrase: "I'm hot",
          confidence: 0.65,
          reason: 'Summer season',
          icon: 'Sun'
        });
        newSuggestions.push({
          phrase: 'I need water',
          confidence: 0.7,
          reason: 'Stay hydrated',
          icon: 'Droplet'
        });
      }

      // Common needs throughout the day
      newSuggestions.push({
        phrase: 'I need the bathroom',
        confidence: 0.8,
        reason: 'Common need',
        icon: 'Home'
      });

      // Sort by confidence
      newSuggestions.sort((a, b) => b.confidence - a.confidence);

      setSuggestions(newSuggestions.slice(0, 6)); // Top 6 suggestions
    };

    updateSuggestions();
    
    // Update every 15 minutes
    const interval = setInterval(updateSuggestions, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return suggestions;
};

// Hook for activity-based suggestions
export const useActivitySuggestions = (recentWords: string[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (recentWords.length === 0) return;

    const lastWord = recentWords[recentWords.length - 1]?.toLowerCase();
    const newSuggestions: string[] = [];

    // Context-based word suggestions
    const contextMap: Record<string, string[]> = {
      'i': ['want', 'need', 'like', 'feel', 'am'],
      'want': ['water', 'food', 'help', 'to go', 'to play'],
      'need': ['help', 'bathroom', 'water', 'food', 'a break'],
      'feel': ['happy', 'sad', 'tired', 'good', 'bad'],
      'i am': ['happy', 'sad', 'tired', 'hungry', 'thirsty'],
      'can': ['you help', 'I have', 'we go', 'I go', 'you'],
      'thank': ['you', 'you very much'],
      'good': ['morning', 'afternoon', 'evening', 'night', 'job'],
      'please': ['help', 'wait', 'stop', 'come', 'go'],
      'where': ['is', 'are we', 'are you', 'do we go'],
      'when': ['will we', 'can we', 'do we', 'is it'],
      'what': ['is this', 'is that', 'time is it', 'do you mean'],
      'who': ['is that', 'are you', 'is here', 'is coming'],
      'why': ['not', 'is it', 'are we', 'did you'],
      'how': ['are you', 'do I', 'can I', 'much', 'many'],
    };

    // Find matching context
    for (const [context, words] of Object.entries(contextMap)) {
      if (lastWord?.includes(context) || context.includes(lastWord)) {
        newSuggestions.push(...words);
        break;
      }
    }

    // If no context match, provide common follow-ups
    if (newSuggestions.length === 0) {
      newSuggestions.push('please', 'now', 'later', 'yes', 'no', 'thank you');
    }

    setSuggestions(newSuggestions.slice(0, 5));
  }, [recentWords]);

  return suggestions;
};

// Hook for emotional support suggestions
export const useEmotionalSupportSuggestions = (detectedEmotion?: string) => {
  const suggestions: Record<string, ContextSuggestion[]> = {
    sad: [
      { phrase: 'I need a hug', confidence: 0.9, reason: 'Comfort', icon: 'Heart' },
      { phrase: 'Can you help me', confidence: 0.85, reason: 'Support', icon: 'HelpCircle' },
      { phrase: 'I want to talk', confidence: 0.8, reason: 'Communication', icon: 'MessageSquare' },
    ],
    angry: [
      { phrase: 'I need a break', confidence: 0.9, reason: 'Cool down', icon: 'Pause' },
      { phrase: 'Please wait', confidence: 0.85, reason: 'Time to calm', icon: 'Clock' },
      { phrase: 'I need space', confidence: 0.8, reason: 'Personal space', icon: 'Maximize2' },
    ],
    tired: [
      { phrase: 'I need to rest', confidence: 0.95, reason: 'Rest time', icon: 'Moon' },
      { phrase: 'I want to sit down', confidence: 0.85, reason: 'Take a seat', icon: 'Armchair' },
      { phrase: 'Can we go home', confidence: 0.8, reason: 'Go home', icon: 'Home' },
    ],
    hungry: [
      { phrase: 'I need food', confidence: 0.95, reason: 'Meal time', icon: 'Utensils' },
      { phrase: 'Can I have a snack', confidence: 0.85, reason: 'Snack', icon: 'Cookie' },
      { phrase: 'I want to eat', confidence: 0.8, reason: 'Eating', icon: 'Utensils' },
    ],
  };

  return detectedEmotion ? suggestions[detectedEmotion] || [] : [];
};
