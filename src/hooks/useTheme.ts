import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Theme = 
  | 'default'
  | 'superhero'
  | 'ocean'
  | 'jungle'
  | 'space'
  | 'candy'
  | 'dinosaur'
  | 'rainbow'
  | 'princess'
  | 'robot'
  | 'zebra'
  | 'tiger'
  | 'elephant'
  | 'chameleon'
  | 'metal'
  | 'rose-gold'
  | 'underwater'
  | 'forest';

export const themes = {
  default: {
    name: 'Classic',
    icon: '🎨',
    pattern: undefined,
    colors: {
      primary: '217 91% 60%',
      secondary: '162 63% 46%',
      accent: '45 93% 60%',
      background: '210 20% 98%',
      'aac-blue': '217 91% 60%',
      'aac-green': '162 63% 46%',
      'aac-red': '0 84% 60%',
      'aac-yellow': '45 93% 60%',
      'aac-purple': '271 50% 65%',
      'aac-orange': '27 96% 61%',
    },
  },
  superhero: {
    name: 'Superhero',
    icon: '🦸',
    pattern: undefined,
    colors: {
      primary: '210 100% 45%',
      secondary: '0 85% 55%',
      accent: '45 100% 50%',
      background: '220 15% 95%',
      'aac-blue': '210 100% 45%',
      'aac-green': '145 70% 45%',
      'aac-red': '0 85% 55%',
      'aac-yellow': '45 100% 50%',
      'aac-purple': '270 60% 55%',
      'aac-orange': '25 100% 55%',
    },
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    pattern: undefined,
    colors: {
      primary: '195 85% 50%',
      secondary: '175 60% 45%',
      accent: '190 70% 65%',
      background: '195 30% 96%',
      'aac-blue': '200 90% 55%',
      'aac-green': '175 60% 45%',
      'aac-red': '10 80% 60%',
      'aac-yellow': '45 85% 65%',
      'aac-purple': '260 45% 60%',
      'aac-orange': '30 85% 60%',
    },
  },
  jungle: {
    name: 'Jungle',
    icon: '🦁',
    pattern: undefined,
    colors: {
      primary: '120 45% 40%',
      secondary: '85 65% 50%',
      accent: '40 75% 55%',
      background: '80 25% 95%',
      'aac-blue': '195 60% 50%',
      'aac-green': '120 50% 45%',
      'aac-red': '355 75% 55%',
      'aac-yellow': '45 90% 55%',
      'aac-purple': '280 40% 55%',
      'aac-orange': '25 85% 55%',
    },
  },
  space: {
    name: 'Space',
    icon: '🚀',
    pattern: undefined,
    colors: {
      primary: '250 80% 55%',
      secondary: '280 70% 60%',
      accent: '200 100% 70%',
      background: '240 20% 12%',
      'aac-blue': '220 90% 65%',
      'aac-green': '160 60% 55%',
      'aac-red': '340 85% 60%',
      'aac-yellow': '50 100% 65%',
      'aac-purple': '270 75% 65%',
      'aac-orange': '30 95% 60%',
    },
  },
  candy: {
    name: 'Candy',
    icon: '🍭',
    pattern: undefined,
    colors: {
      primary: '340 95% 70%',
      secondary: '280 85% 70%',
      accent: '180 75% 65%',
      background: '330 40% 97%',
      'aac-blue': '200 85% 70%',
      'aac-green': '160 65% 60%',
      'aac-red': '350 90% 65%',
      'aac-yellow': '45 95% 70%',
      'aac-purple': '280 85% 70%',
      'aac-orange': '30 95% 70%',
    },
  },
  dinosaur: {
    name: 'Dinosaur',
    icon: '🦕',
    pattern: undefined,
    colors: {
      primary: '100 40% 45%',
      secondary: '85 55% 50%',
      accent: '35 70% 55%',
      background: '90 20% 94%',
      'aac-blue': '195 55% 50%',
      'aac-green': '105 50% 45%',
      'aac-red': '5 75% 55%',
      'aac-yellow': '40 80% 55%',
      'aac-purple': '275 45% 55%',
      'aac-orange': '25 80% 55%',
    },
  },
  rainbow: {
    name: 'Rainbow',
    icon: '🌈',
    pattern: undefined,
    colors: {
      primary: '0 85% 60%',
      secondary: '120 70% 50%',
      accent: '240 80% 60%',
      background: '0 0% 98%',
      'aac-blue': '210 90% 60%',
      'aac-green': '140 75% 50%',
      'aac-red': '350 85% 60%',
      'aac-yellow': '50 95% 60%',
      'aac-purple': '270 70% 60%',
      'aac-orange': '30 95% 60%',
    },
  },
  princess: {
    name: 'Princess',
    icon: '👑',
    pattern: undefined,
    colors: {
      primary: '320 75% 70%',
      secondary: '280 65% 70%',
      accent: '45 85% 75%',
      background: '320 35% 97%',
      'aac-blue': '200 70% 70%',
      'aac-green': '160 55% 65%',
      'aac-red': '340 80% 65%',
      'aac-yellow': '50 90% 70%',
      'aac-purple': '280 75% 70%',
      'aac-orange': '30 85% 70%',
    },
  },
  robot: {
    name: 'Robot',
    icon: '🤖',
    pattern: undefined,
    colors: {
      primary: '200 70% 50%',
      secondary: '180 60% 50%',
      accent: '160 65% 55%',
      background: '200 15% 92%',
      'aac-blue': '205 75% 55%',
      'aac-green': '165 65% 50%',
      'aac-red': '355 70% 55%',
      'aac-yellow': '45 80% 60%',
      'aac-purple': '265 55% 60%',
      'aac-orange': '30 85% 60%',
    },
  },
  zebra: {
    name: 'Zebra',
    icon: '🦓',
    pattern: 'zebra',
    colors: {
      primary: '0 0% 15%',
      secondary: '0 0% 95%',
      accent: '45 90% 55%',
      background: '0 0% 98%',
      'aac-blue': '220 70% 45%',
      'aac-green': '145 60% 40%',
      'aac-red': '0 75% 55%',
      'aac-yellow': '45 90% 55%',
      'aac-purple': '275 55% 50%',
      'aac-orange': '30 90% 55%',
    },
  },
  tiger: {
    name: 'Tiger',
    icon: '🐯',
    pattern: 'tiger',
    colors: {
      primary: '25 95% 45%',
      secondary: '0 0% 10%',
      accent: '30 100% 60%',
      background: '35 40% 94%',
      'aac-blue': '200 65% 50%',
      'aac-green': '150 55% 45%',
      'aac-red': '0 80% 50%',
      'aac-yellow': '40 95% 60%',
      'aac-purple': '280 50% 55%',
      'aac-orange': '25 95% 55%',
    },
  },
  elephant: {
    name: 'Elephant',
    icon: '🐘',
    pattern: 'elephant',
    colors: {
      primary: '210 15% 45%',
      secondary: '200 20% 60%',
      accent: '200 70% 55%',
      background: '210 20% 96%',
      'aac-blue': '205 70% 55%',
      'aac-green': '155 50% 50%',
      'aac-red': '0 70% 60%',
      'aac-yellow': '45 85% 65%',
      'aac-purple': '270 45% 60%',
      'aac-orange': '30 80% 60%',
    },
  },
  chameleon: {
    name: 'Chameleon',
    icon: '🦎',
    pattern: 'chameleon',
    colors: {
      primary: '130 60% 45%',
      secondary: '160 70% 50%',
      accent: '90 75% 55%',
      background: '120 25% 95%',
      'aac-blue': '190 70% 50%',
      'aac-green': '135 70% 45%',
      'aac-red': '355 75% 55%',
      'aac-yellow': '55 90% 60%',
      'aac-purple': '280 60% 55%',
      'aac-orange': '35 85% 60%',
    },
  },
  metal: {
    name: 'Metal',
    icon: '⚙️',
    pattern: 'metal',
    colors: {
      primary: '210 15% 35%',
      secondary: '210 10% 50%',
      accent: '45 85% 65%',
      background: '210 12% 88%',
      'aac-blue': '210 60% 50%',
      'aac-green': '155 45% 50%',
      'aac-red': '0 65% 55%',
      'aac-yellow': '45 85% 60%',
      'aac-purple': '270 40% 55%',
      'aac-orange': '30 80% 60%',
    },
  },
  'rose-gold': {
    name: 'Rose Gold',
    icon: '🌹',
    pattern: 'rose-gold',
    colors: {
      primary: '340 65% 60%',
      secondary: '30 80% 70%',
      accent: '45 90% 70%',
      background: '340 35% 97%',
      'aac-blue': '200 70% 65%',
      'aac-green': '155 55% 55%',
      'aac-red': '350 80% 60%',
      'aac-yellow': '45 90% 70%',
      'aac-purple': '310 60% 65%',
      'aac-orange': '30 85% 65%',
    },
  },
  underwater: {
    name: 'Underwater',
    icon: '🐠',
    pattern: 'underwater',
    colors: {
      primary: '190 85% 45%',
      secondary: '175 70% 50%',
      accent: '200 90% 70%',
      background: '190 30% 94%',
      'aac-blue': '195 85% 50%',
      'aac-green': '165 70% 48%',
      'aac-red': '10 80% 60%',
      'aac-yellow': '50 85% 65%',
      'aac-purple': '260 55% 60%',
      'aac-orange': '35 85% 60%',
    },
  },
  forest: {
    name: 'Forest',
    icon: '🌲',
    pattern: 'forest',
    colors: {
      primary: '140 50% 35%',
      secondary: '100 45% 40%',
      accent: '80 70% 55%',
      background: '120 20% 94%',
      'aac-blue': '200 60% 50%',
      'aac-green': '135 55% 42%',
      'aac-red': '0 75% 55%',
      'aac-yellow': '50 85% 60%',
      'aac-purple': '275 45% 55%',
      'aac-orange': '30 85% 60%',
    },
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', user.id)
          .single();

        const settings = profile?.settings as Record<string, any> | null;
        if (settings?.theme) {
          applyTheme(settings.theme as Theme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (theme: Theme) => {
    const themeData = themes[theme];
    const themeColors = themeData.colors;
    const root = document.documentElement;

    // Apply CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply pattern if available
    if (themeData.pattern) {
      root.setAttribute('data-pattern', themeData.pattern);
    } else {
      root.removeAttribute('data-pattern');
    }

    // Add dark class for space theme
    if (theme === 'space') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setCurrentTheme(theme);
  };

  const changeTheme = async (theme: Theme) => {
    applyTheme(theme);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', user.id)
          .single();

        const currentSettings = (profile?.settings as Record<string, any>) || {};
        const updatedSettings = {
          ...currentSettings,
          theme,
        };

        await supabase
          .from('profiles')
          .update({ settings: updatedSettings })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return {
    currentTheme,
    changeTheme,
    isLoading,
    themes: Object.entries(themes).map(([key, value]) => ({
      id: key as Theme,
      ...value,
    })),
  };
}
