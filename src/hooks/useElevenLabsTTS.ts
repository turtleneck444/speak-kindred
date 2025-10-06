import { useState, useCallback, useRef } from 'react';

export interface ElevenLabsVoice {
  id: string;
  name: string;
  category: 'female' | 'male' | 'fun' | 'cute' | 'animated' | 'professional';
  description: string;
  emoji: string;
  previewText: string;
}

// Curated voice library with fun personalities!
export const ELEVENLABS_VOICES: ElevenLabsVoice[] = [
  // Female Professional Voices
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    category: 'female',
    description: 'Warm and friendly female voice',
    emoji: '👩‍💼',
    previewText: 'Hello! My name is Sarah.'
  },
  {
    id: 'ThT5KcBeYPX3keUQqHPh',
    name: 'Dorothy',
    category: 'female',
    description: 'Pleasant and clear female voice',
    emoji: '👩',
    previewText: 'Hi there! I\'m Dorothy.'
  },
  
  // Male Professional Voices
  {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    category: 'male',
    description: 'Young and energetic male voice',
    emoji: '👨',
    previewText: 'Hey! I\'m Josh.'
  },
  {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    category: 'male',
    description: 'Deep and confident male voice',
    emoji: '👨‍💼',
    previewText: 'Hello, I\'m Arnold.'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'male',
    description: 'Clear and articulate male voice',
    emoji: '🧑',
    previewText: 'Hi, my name is Adam.'
  },
  
  // Fun & Animated Voices
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Matilda',
    category: 'fun',
    description: 'Warm British accent, storyteller vibes',
    emoji: '🎭',
    previewText: 'Brilliant! I\'m Matilda!'
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    category: 'fun',
    description: 'Well-rounded and versatile',
    emoji: '🎪',
    previewText: 'Hello friend! I\'m Antoni!'
  },
  {
    id: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    category: 'cute',
    description: 'Young and sweet female voice',
    emoji: '🌸',
    previewText: 'Hi! I\'m Elli! Nice to meet you!'
  },
  {
    id: 'pqHfZKP75CvOlQylNhV4',
    name: 'Bill',
    category: 'fun',
    description: 'Friendly and approachable',
    emoji: '😊',
    previewText: 'Hey there! I\'m Bill!'
  },
  
  // Animated/Character Voices
  {
    id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    category: 'animated',
    description: 'Hoarse and characterful',
    emoji: '🎬',
    previewText: 'Greetings! I\'m Callum!'
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    category: 'fun',
    description: 'Australian accent, casual and friendly',
    emoji: '🦘',
    previewText: 'G\'day mate! I\'m Charlie!'
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    category: 'professional',
    description: 'Deep British accent',
    emoji: '🎩',
    previewText: 'Good day, I\'m Daniel.'
  },
  
  // Cute & Sweet Voices
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    category: 'cute',
    description: 'Young Swedish accent, sweet and gentle',
    emoji: '🌼',
    previewText: 'Hello! I\'m Charlotte!'
  },
  {
    id: 'jBpfuIE2acCO8z3wKNLl',
    name: 'Gigi',
    category: 'cute',
    description: 'Childlike and playful',
    emoji: '🎀',
    previewText: 'Hi! I\'m Gigi! Let\'s be friends!'
  },
];

interface UseElevenLabsTTSOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export const useElevenLabsTTS = (options: UseElevenLabsTTSOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const VOICE_ID = options.voiceId || 'EXAVITQu4vr4xnSDxMaL'; // Default to Sarah

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    if (!API_KEY) {
      console.error('ElevenLabs API key not configured');
      setError('Voice API not configured');
      return;
    }

    // Stop any current speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: options.stability || 0.5,
              similarity_boost: options.similarityBoost || 0.75,
              style: options.style || 0,
              use_speaker_boost: options.useSpeakerBoost !== false,
            },
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onplay = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        setError('Failed to play audio');
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();

    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted, not an error
        return;
      }
      console.error('ElevenLabs TTS error:', err);
      setError(err.message);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  }, [API_KEY, VOICE_ID, options.stability, options.similarityBoost, options.style, options.useSpeakerBoost]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const previewVoice = useCallback(async (voiceId: string) => {
    const voice = ELEVENLABS_VOICES.find(v => v.id === voiceId);
    if (voice) {
      // Temporarily use this voice for preview
      const tempOptions = { ...options, voiceId };
      const tempSpeak = async (text: string) => {
        if (!API_KEY) return;
        
        try {
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
              method: 'POST',
              headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY,
              },
              body: JSON.stringify({
                text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75,
                },
              }),
            }
          );

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
          audio.onended = () => URL.revokeObjectURL(audioUrl);
        } catch (err) {
          console.error('Preview error:', err);
        }
      };
      
      await tempSpeak(voice.previewText);
    }
  }, [API_KEY, options]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    previewVoice,
    voices: ELEVENLABS_VOICES,
    isAvailable: !!API_KEY,
  };
};
