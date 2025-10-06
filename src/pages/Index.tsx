import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthForm } from "@/components/AuthForm";
import { TileGrid, Tile } from "@/components/TileGrid";
import { UtteranceBar } from "@/components/UtteranceBar";
import { EditModeDialog } from "@/components/EditModeDialog";
import { CategoryNav, Category } from "@/components/CategoryNav";
import { EmergencyBar, EmergencyPhrase } from "@/components/EmergencyBar";
import { WordPrediction } from "@/components/WordPrediction";
import { RecentlyUsed } from "@/components/RecentlyUsed";
import { QuickPhrase } from "@/components/QuickPhrasesPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useTTS } from "@/hooks/useTTS";
import { useElevenLabsTTS } from "@/hooks/useElevenLabsTTS";
import { VoiceSelector } from "@/components/VoiceSelector";
import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Preferences {
  enableWordPrediction: boolean;
  enableScanning: boolean;
  scanningSpeed: number;
  enableAutoSpeak: boolean;
  showRecentlyUsed: boolean;
  maxRecentTiles: number;
  enableEmergencyBar: boolean;
  tileSize: 'small' | 'medium' | 'large' | 'extra-large';
  gridColumns: number;
}

const defaultPreferences: Preferences = {
  enableWordPrediction: true,
  enableScanning: false,
  scanningSpeed: 1500,
  enableAutoSpeak: false,
  showRecentlyUsed: true,
  maxRecentTiles: 6,
  enableEmergencyBar: true,
  tileSize: 'medium',
  gridColumns: 4,
};

// ⚡ DEVELOPMENT MODE - Set to true to bypass authentication
const DEV_MODE = true;

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [utterance, setUtterance] = useState<string[]>([]);
  const [allTiles, setAllTiles] = useState<Tile[]>([]); // Store all tiles
  const [tiles, setTiles] = useState<Tile[]>([]); // Filtered tiles to display
  const [recentTiles, setRecentTiles] = useState<Tile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>([]);
  const [emergencyPhrases, setEmergencyPhrases] = useState<EmergencyPhrase[]>([]);
  const [wordPredictions, setWordPredictions] = useState<string[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [caregiverPin, setCaregiverPin] = useState("1234");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [ttsSettings, setTtsSettings] = useState({ rate: 0.45, pitch: 1.0, voice: "default" });
  const [selectedVoiceId, setSelectedVoiceId] = useState("EXAVITQu4vr4xnSDxMaL"); // Default to Sarah
  
  // Use ElevenLabs for amazing AI voices! 🎙️
  const elevenLabs = useElevenLabsTTS({ voiceId: selectedVoiceId });
  // Fallback to browser TTS if ElevenLabs not available
  const browserTTS = useTTS(ttsSettings);
  
  // Use ElevenLabs if available, otherwise fallback to browser TTS
  const speak = elevenLabs.isAvailable ? elevenLabs.speak : browserTTS.speak;
  const isSpeaking = elevenLabs.isAvailable ? elevenLabs.isSpeaking : browserTTS.isSpeaking;
  const voices = elevenLabs.isAvailable ? elevenLabs.voices : browserTTS.voices;
  
  const { toast } = useToast();

  useEffect(() => {
    if (DEV_MODE) {
      // In dev mode, skip authentication and load demo data
      loadDemoData();
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (DEV_MODE) return;
    
    if (session?.user) {
      loadUserData();
    }
  }, [session]);

  useEffect(() => {
    if (DEV_MODE) return;

    if (session?.user && currentBoardId) {
      loadTiles(currentBoardId);
      loadRecentTiles();
    }
  }, [currentBoardId, activeCategory]);

  useEffect(() => {
    // Filter tiles based on active category (for dev mode)
    if (DEV_MODE && allTiles.length > 0) {
      if (activeCategory) {
        setTiles(allTiles.filter(tile => tile.category_id === activeCategory));
      } else {
        setTiles(allTiles); // Show all tiles when no category selected
      }
    }
  }, [activeCategory, allTiles]);

  useEffect(() => {
    // Update word predictions when utterance changes
    if (preferences.enableWordPrediction && utterance.length > 0) {
      // In dev mode, provide mock predictions
      if (DEV_MODE) {
        const lastWord = utterance[utterance.length - 1];
        if (lastWord && lastWord.length > 2) {
          setWordPredictions(["please", "now", "soon", "later", "today"]);
        }
      } else {
        updateWordPredictions();
      }
    } else {
      setWordPredictions([]);
    }
  }, [utterance, preferences.enableWordPrediction]);

  const loadDemoData = () => {
    // Demo categories
    setCategories([
      { id: '1', name: 'Basic', icon: 'MessageSquare', color: '#3A86FF', order_index: 0 },
      { id: '2', name: 'Feelings', icon: 'Heart', color: '#EF476F', order_index: 1 },
      { id: '3', name: 'People', icon: 'Users', color: '#8E7DBE', order_index: 2 },
      { id: '4', name: 'Actions', icon: 'Zap', color: '#FFD166', order_index: 3 },
      { id: '5', name: 'Places', icon: 'MapPin', color: '#06D6A0', order_index: 4 },
      { id: '6', name: 'Food', icon: 'Utensils', color: '#FF6B35', order_index: 5 },
    ]);

    // Demo tiles - Organized by category
    const allDemoTiles = [
      // Category 1: Basic (Blue)
      { id: '1', label: "I want", speech_text: "I want", color: "#3A86FF", order_index: 0, icon_name: "MessageSquare", board_id: '1', category_id: '1' },
      { id: '2', label: "Yes", speech_text: "Yes", color: "#06D6A0", order_index: 1, icon_name: "Check", board_id: '1', category_id: '1' },
      { id: '3', label: "No", speech_text: "No", color: "#EF476F", order_index: 2, icon_name: "X", board_id: '1', category_id: '1' },
      { id: '4', label: "Please", speech_text: "Please", color: "#3A86FF", order_index: 3, icon_name: "Hand", board_id: '1', category_id: '1' },
      { id: '5', label: "Thank you", speech_text: "Thank you", color: "#FF6B35", order_index: 4, icon_name: "Heart", board_id: '1', category_id: '1' },
      { id: '6', label: "Help", speech_text: "Please help me", color: "#8E7DBE", order_index: 5, icon_name: "HelpCircle", board_id: '1', category_id: '1' },
      { id: '7', label: "More", speech_text: "I want more", color: "#3A86FF", order_index: 6, icon_name: "Plus", board_id: '1', category_id: '1' },
      { id: '8', label: "Stop", speech_text: "Stop", color: "#EF476F", order_index: 7, icon_name: "Hand", board_id: '1', category_id: '1' },
      { id: '9', label: "Wait", speech_text: "Please wait", color: "#FFD166", order_index: 8, icon_name: "Clock", board_id: '1', category_id: '1' },
      { id: '10', label: "Go", speech_text: "Let's go", color: "#06D6A0", order_index: 9, icon_name: "ArrowRight", board_id: '1', category_id: '1' },
      
      // Category 2: Feelings (Red/Pink)
      { id: '11', label: "Happy", speech_text: "I'm happy", color: "#06D6A0", order_index: 10, icon_name: "Smile", board_id: '1', category_id: '2' },
      { id: '12', label: "Sad", speech_text: "I'm sad", color: "#EF476F", order_index: 11, icon_name: "Frown", board_id: '1', category_id: '2' },
      { id: '13', label: "Angry", speech_text: "I'm angry", color: "#EF476F", order_index: 12, icon_name: "Angry", board_id: '1', category_id: '2' },
      { id: '14', label: "Scared", speech_text: "I'm scared", color: "#8E7DBE", order_index: 13, icon_name: "AlertCircle", board_id: '1', category_id: '2' },
      { id: '15', label: "Excited", speech_text: "I'm excited", color: "#FFD166", order_index: 14, icon_name: "Zap", board_id: '1', category_id: '2' },
      { id: '16', label: "Tired", speech_text: "I'm tired", color: "#8E7DBE", order_index: 15, icon_name: "Moon", board_id: '1', category_id: '2' },
      { id: '17', label: "Love", speech_text: "I love you", color: "#FF6B35", order_index: 16, icon_name: "Heart", board_id: '1', category_id: '2' },
      { id: '18', label: "Confused", speech_text: "I'm confused", color: "#8E7DBE", order_index: 17, icon_name: "HelpCircle", board_id: '1', category_id: '2' },
      { id: '19', label: "Proud", speech_text: "I'm proud", color: "#FFD166", order_index: 18, icon_name: "Award", board_id: '1', category_id: '2' },
      { id: '20', label: "Calm", speech_text: "I'm calm", color: "#06D6A0", order_index: 19, icon_name: "Wind", board_id: '1', category_id: '2' },
      
      // Category 3: People (Purple)
      { id: '21', label: "Mom", speech_text: "I want mom", color: "#8E7DBE", order_index: 20, icon_name: "User", board_id: '1', category_id: '3' },
      { id: '22', label: "Dad", speech_text: "I want dad", color: "#8E7DBE", order_index: 21, icon_name: "User", board_id: '1', category_id: '3' },
      { id: '23', label: "Sister", speech_text: "I want my sister", color: "#8E7DBE", order_index: 22, icon_name: "User", board_id: '1', category_id: '3' },
      { id: '24', label: "Brother", speech_text: "I want my brother", color: "#8E7DBE", order_index: 23, icon_name: "User", board_id: '1', category_id: '3' },
      { id: '25', label: "Friend", speech_text: "I want my friend", color: "#8E7DBE", order_index: 24, icon_name: "Users", board_id: '1', category_id: '3' },
      { id: '26', label: "Teacher", speech_text: "I need the teacher", color: "#8E7DBE", order_index: 25, icon_name: "GraduationCap", board_id: '1', category_id: '3' },
      { id: '27', label: "Doctor", speech_text: "I need a doctor", color: "#EF476F", order_index: 26, icon_name: "Stethoscope", board_id: '1', category_id: '3' },
      { id: '28', label: "Grandma", speech_text: "I want grandma", color: "#8E7DBE", order_index: 27, icon_name: "Heart", board_id: '1', category_id: '3' },
      
      // Category 4: Actions (Yellow)
      { id: '29', label: "Eat", speech_text: "I want to eat", color: "#FFD166", order_index: 28, icon_name: "Utensils", board_id: '1', category_id: '4' },
      { id: '30', label: "Drink", speech_text: "I want to drink", color: "#FFD166", order_index: 29, icon_name: "Coffee", board_id: '1', category_id: '4' },
      { id: '31', label: "Play", speech_text: "I want to play", color: "#FFD166", order_index: 30, icon_name: "Gamepad2", board_id: '1', category_id: '4' },
      { id: '32', label: "Sleep", speech_text: "I want to sleep", color: "#8E7DBE", order_index: 31, icon_name: "Moon", board_id: '1', category_id: '4' },
      { id: '33', label: "Watch TV", speech_text: "I want to watch TV", color: "#FFD166", order_index: 32, icon_name: "Tv", board_id: '1', category_id: '4' },
      { id: '34', label: "Read", speech_text: "I want to read", color: "#FFD166", order_index: 33, icon_name: "Book", board_id: '1', category_id: '4' },
      { id: '35', label: "Listen", speech_text: "I want to listen to music", color: "#FFD166", order_index: 34, icon_name: "Music", board_id: '1', category_id: '4' },
      { id: '36', label: "Walk", speech_text: "I want to go for a walk", color: "#06D6A0", order_index: 35, icon_name: "Footprints", board_id: '1', category_id: '4' },
      { id: '37', label: "Talk", speech_text: "I want to talk", color: "#3A86FF", order_index: 36, icon_name: "MessageCircle", board_id: '1', category_id: '4' },
      { id: '38', label: "Bathroom", speech_text: "I need the bathroom", color: "#FFD166", order_index: 37, icon_name: "Home", board_id: '1', category_id: '4' },
      
      // Category 5: Places (Green)
      { id: '39', label: "Home", speech_text: "I want to go home", color: "#06D6A0", order_index: 38, icon_name: "Home", board_id: '1', category_id: '5' },
      { id: '40', label: "School", speech_text: "I want to go to school", color: "#06D6A0", order_index: 39, icon_name: "School", board_id: '1', category_id: '5' },
      { id: '41', label: "Park", speech_text: "I want to go to the park", color: "#06D6A0", order_index: 40, icon_name: "Trees", board_id: '1', category_id: '5' },
      { id: '42', label: "Store", speech_text: "I want to go to the store", color: "#06D6A0", order_index: 41, icon_name: "ShoppingCart", board_id: '1', category_id: '5' },
      { id: '43', label: "Outside", speech_text: "I want to go outside", color: "#06D6A0", order_index: 42, icon_name: "Sun", board_id: '1', category_id: '5' },
      { id: '44', label: "Room", speech_text: "I want to go to my room", color: "#06D6A0", order_index: 43, icon_name: "Bed", board_id: '1', category_id: '5' },
      { id: '45', label: "Bathroom", speech_text: "I need to go to the bathroom", color: "#06D6A0", order_index: 44, icon_name: "DoorOpen", board_id: '1', category_id: '5' },
      { id: '46', label: "Hospital", speech_text: "I need to go to the hospital", color: "#EF476F", order_index: 45, icon_name: "Hospital", board_id: '1', category_id: '5' },
      
      // Category 6: Food (Orange)
      { id: '47', label: "Water", speech_text: "I want water", color: "#3A86FF", order_index: 46, icon_name: "Droplet", board_id: '1', category_id: '6' },
      { id: '48', label: "Juice", speech_text: "I want juice", color: "#FF6B35", order_index: 47, icon_name: "Wine", board_id: '1', category_id: '6' },
      { id: '49', label: "Milk", speech_text: "I want milk", color: "#FF6B35", order_index: 48, icon_name: "Milk", board_id: '1', category_id: '6' },
      { id: '50', label: "Snack", speech_text: "I want a snack", color: "#FF6B35", order_index: 49, icon_name: "Cookie", board_id: '1', category_id: '6' },
      { id: '51', label: "Fruit", speech_text: "I want fruit", color: "#FF6B35", order_index: 50, icon_name: "Apple", board_id: '1', category_id: '6' },
      { id: '52', label: "Bread", speech_text: "I want bread", color: "#FF6B35", order_index: 51, icon_name: "Sandwich", board_id: '1', category_id: '6' },
      { id: '53', label: "Pizza", speech_text: "I want pizza", color: "#FF6B35", order_index: 52, icon_name: "Pizza", board_id: '1', category_id: '6' },
      { id: '54', label: "Ice cream", speech_text: "I want ice cream", color: "#FF6B35", order_index: 53, icon_name: "IceCream", board_id: '1', category_id: '6' },
      { id: '55', label: "Hungry", speech_text: "I'm hungry", color: "#FFD166", order_index: 54, icon_name: "Utensils", board_id: '1', category_id: '6' },
      { id: '56', label: "Thirsty", speech_text: "I'm thirsty", color: "#3A86FF", order_index: 55, icon_name: "Droplets", board_id: '1', category_id: '6' },
    ];
    
    setAllTiles(allDemoTiles);
    setTiles(allDemoTiles); // Initially show all tiles

    // Demo quick phrases
    setQuickPhrases([
      { id: '1', phrase: 'I need help', category: 'emergency', is_emergency: true },
      { id: '2', phrase: 'Call for assistance', category: 'emergency', is_emergency: true },
      { id: '3', phrase: "I'm in pain", category: 'emergency', is_emergency: true },
      { id: '4', phrase: 'Emergency', category: 'emergency', is_emergency: true },
      { id: '5', phrase: "I'm okay", category: 'general', is_emergency: false },
      { id: '6', phrase: 'Thank you for helping', category: 'general', is_emergency: false },
      { id: '7', phrase: 'I need the bathroom', category: 'basic_needs', is_emergency: false },
      { id: '8', phrase: "I'm hungry", category: 'basic_needs', is_emergency: false },
      { id: '9', phrase: "I'm thirsty", category: 'basic_needs', is_emergency: false },
      { id: '10', phrase: "I'm tired", category: 'feelings', is_emergency: false },
    ]);

    // Demo emergency phrases
    setEmergencyPhrases([
      { id: '1', phrase: 'I need help', icon: 'alert' as const },
      { id: '2', phrase: 'Call for assistance', icon: 'phone' as const },
      { id: '3', phrase: "I'm in pain", icon: 'alert' as const },
      { id: '4', phrase: 'Emergency', icon: 'emergency' as const },
    ]);

    toast({ 
      title: "Development Mode", 
      description: "Running in demo mode. Set DEV_MODE = false in Index.tsx to use real authentication." 
    });
  };

  const loadUserData = async () => {
    if (!session?.user) return;

    // Load profile with PIN and preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("caregiver_pin, preferences, settings")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      if (profile.caregiver_pin) {
        setCaregiverPin(profile.caregiver_pin);
      }
      if (profile.preferences) {
        setPreferences({ ...defaultPreferences, ...(profile.preferences as any) });
      }
      if (profile.settings) {
        const settings = profile.settings as any;
        setTtsSettings({
          rate: settings.rate || 0.45,
          pitch: settings.pitch || 1.0,
          voice: settings.voice || "default",
        });
      }
    }

    // Load categories
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .eq("owner_id", session.user.id)
      .order("order_index");

    if (cats) {
      setCategories(cats);
    }

    // Load quick phrases
    const { data: phrases } = await supabase
      .from("quick_phrases")
      .select("*")
      .eq("owner_id", session.user.id);

    if (phrases) {
      setQuickPhrases(phrases);
      setEmergencyPhrases(
        phrases
          .filter(p => p.is_emergency)
          .slice(0, 4)
          .map(p => ({ id: p.id, phrase: p.phrase, icon: 'alert' as const }))
      );
    }

    // Load or create default board
    let { data: boards } = await supabase
      .from("boards")
      .select("*")
      .eq("owner_id", session.user.id)
      .limit(1);

    if (!boards || boards.length === 0) {
      await createDefaultBoard();
    } else {
      setCurrentBoardId(boards[0].id);
    }
  };

  const createDefaultBoard = async () => {
    if (!session?.user) return;

    const { data: board } = await supabase
      .from("boards")
      .insert({
        owner_id: session.user.id,
        name: "Home",
        is_default: true,
      })
      .select()
      .single();

    if (board) {
      const defaultTiles = [
        { label: "I want", speech_text: "I want", color: "#3A86FF", order_index: 0, icon_name: "MessageSquare" },
        { label: "Yes", speech_text: "Yes", color: "#06D6A0", order_index: 1, icon_name: "Check" },
        { label: "No", speech_text: "No", color: "#EF476F", order_index: 2, icon_name: "X" },
        { label: "Bathroom", speech_text: "I need the bathroom", color: "#FFD166", order_index: 3, icon_name: "Home" },
        { label: "Help", speech_text: "Please help me", color: "#8E7DBE", order_index: 4, icon_name: "HelpCircle" },
        { label: "Thank you", speech_text: "Thank you", color: "#FF6B35", order_index: 5, icon_name: "Heart" },
        { label: "Water", speech_text: "I need water", color: "#3A86FF", order_index: 6, icon_name: "Droplet" },
        { label: "Food", speech_text: "I'm hungry", color: "#FFD166", order_index: 7, icon_name: "Utensils" },
        { label: "Tired", speech_text: "I'm tired", color: "#8E7DBE", order_index: 8, icon_name: "Moon" },
        { label: "Happy", speech_text: "I'm happy", color: "#06D6A0", order_index: 9, icon_name: "Smile" },
        { label: "Sad", speech_text: "I'm sad", color: "#EF476F", order_index: 10, icon_name: "Frown" },
        { label: "Love you", speech_text: "I love you", color: "#FF6B35", order_index: 11, icon_name: "Heart" },
      ];

      await supabase.from("tiles").insert(
        defaultTiles.map(tile => ({ ...tile, board_id: board.id }))
      );

      setCurrentBoardId(board.id);
    }
  };

  const loadTiles = async (boardId: string) => {
    let query = supabase
      .from("tiles")
      .select("*")
      .eq("board_id", boardId);

    if (activeCategory) {
      query = query.eq("category_id", activeCategory);
    }

    const { data } = await query.order("order_index", { ascending: true });

    if (data) {
      setTiles(data);
    }
  };

  const loadRecentTiles = async () => {
    if (!session?.user || !preferences.showRecentlyUsed) return;

    const { data } = await supabase
      .from("usage_events")
      .select(`
        tile_id,
        tiles (*)
      `)
      .eq("user_id", session.user.id)
      .order("occurred_at", { ascending: false })
      .limit(preferences.maxRecentTiles);

    if (data) {
      const uniqueTiles = Array.from(
        new Map(
          data
            .map(e => e.tiles)
            .filter(Boolean)
            .map(tile => [tile.id, tile])
        ).values()
      ) as Tile[];
      setRecentTiles(uniqueTiles);
    }
  };

  const updateWordPredictions = async () => {
    if (!session?.user || utterance.length === 0) return;

    const lastWord = utterance[utterance.length - 1];
    if (!lastWord || lastWord.length < 2) return;

    const { data } = await supabase.rpc("get_word_predictions", {
      p_user_id: session.user.id,
      p_prefix: lastWord,
      p_limit: 5,
    });

    if (data) {
      setWordPredictions(data.map((w: any) => w.word));
    }
  };

  const trackWordUsage = async (word: string) => {
    if (DEV_MODE || !session?.user) return;
    
    await supabase.rpc("update_word_history", {
      p_user_id: session.user.id,
      p_word: word,
    });
  };

  const handleTileClick = (tile: Tile) => {
    const newUtterance = [...utterance, tile.speech_text];
    setUtterance(newUtterance);
    
    // Track word usage
    trackWordUsage(tile.speech_text);
    
    // Track tile usage
    if (!DEV_MODE && session?.user) {
      supabase.from("usage_events").insert({
        user_id: session.user.id,
        tile_id: tile.id,
      });
    }

    // Auto-speak if enabled
    if (preferences.enableAutoSpeak) {
      speak(tile.speech_text);
    }

    // Reload recent tiles
    if (!DEV_MODE) {
      setTimeout(() => loadRecentTiles(), 100);
    } else {
      // In dev mode, simulate recent tiles
      setRecentTiles(prev => {
        const newRecent = [tile, ...prev.filter(t => t.id !== tile.id)].slice(0, preferences.maxRecentTiles);
        return newRecent;
      });
    }
  };

  const handleSpeak = () => {
    const text = utterance.join(" ");
    speak(text);
    setUtterance([]);
  };

  const handleClear = () => {
    setUtterance([]);
  };

  const handleBackspace = () => {
    if (utterance.length === 0) return;
    const text = utterance.join(" ");
    const newText = text.slice(0, -1);
    const newWords = newText.split(" ").filter(w => w.length > 0);
    setUtterance(newWords);
  };

  const handleDeleteWord = () => {
    if (utterance.length === 0) return;
    setUtterance(utterance.slice(0, -1));
  };

  const handleQuickPhraseSelect = (phrase: string) => {
    speak(phrase);
    toast({ title: "Quick phrase spoken", description: phrase });
  };

  const handleEmergencyPhrase = (phrase: string) => {
    speak(phrase);
    toast({ 
      title: "Emergency phrase", 
      description: phrase,
      variant: "destructive"
    });
  };

  const handleWordPredictionSelect = (word: string) => {
    setUtterance([...utterance, word]);
    trackWordUsage(word);
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setShowPinDialog(true);
    }
  };

  const handlePinVerify = (pin: string) => {
    if (pin === caregiverPin) {
      setIsEditMode(true);
      return true;
    }
    return false;
  };

  const handlePreferencesChange = async (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    
    if (!DEV_MODE && session?.user) {
      await supabase
        .from("profiles")
        .update({ preferences: newPreferences as any })
        .eq("id", session.user.id);
    }
  };

  const handleTTSSettingsChange = async (newSettings: typeof ttsSettings) => {
    setTtsSettings(newSettings);
    
    if (!DEV_MODE && session?.user) {
      await supabase
        .from("profiles")
        .update({ 
          settings: {
            rate: newSettings.rate,
            pitch: newSettings.pitch,
            voice: newSettings.voice,
          }
        })
        .eq("id", session.user.id);
    }
  };

  const handleSignOut = async () => {
    if (DEV_MODE) {
      toast({ title: "Demo Mode", description: "Sign out disabled in dev mode" });
      return;
    }
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (!DEV_MODE && !session) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rehman AI</h1>
          {DEV_MODE && <span className="text-xs opacity-75">Demo Mode</span>}
        </div>
        <div className="flex gap-2">
          {elevenLabs.isAvailable && (
            <div className="bg-white/10 rounded-md">
              <VoiceSelector
                selectedVoiceId={selectedVoiceId}
                onVoiceSelect={(voiceId) => {
                  setSelectedVoiceId(voiceId);
                  const voiceName = elevenLabs.voices.find(v => v.id === voiceId)?.name || 'Unknown';
                  toast({ 
                    title: "Voice Changed! 🎙️", 
                    description: `Now using ${voiceName}'s voice!`,
                    duration: 2000
                  });
                }}
                onPreview={elevenLabs.previewVoice}
              />
            </div>
          )}
          <SettingsPanel
            preferences={preferences}
            ttsSettings={ttsSettings}
            voices={browserTTS.voices}
            onPreferencesChange={handlePreferencesChange}
            onTTSSettingsChange={handleTTSSettingsChange}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={handleEditModeToggle}
            aria-label={isEditMode ? "Exit edit mode" : "Enter edit mode"}
          >
            {isEditMode ? <LockOpen className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </Button>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Emergency Bar */}
      {preferences.enableEmergencyBar && (
        <EmergencyBar
          phrases={emergencyPhrases}
          onPhraseSelect={handleEmergencyPhrase}
        />
      )}

      {/* Utterance Bar */}
      <UtteranceBar
        text={utterance.join(" ")}
        words={utterance}
        onSpeak={handleSpeak}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onDeleteWord={handleDeleteWord}
        isSpeaking={isSpeaking}
        quickPhrases={quickPhrases}
        onQuickPhraseSelect={handleQuickPhraseSelect}
      />

      {/* Word Prediction */}
      <WordPrediction
        predictions={wordPredictions}
        onWordSelect={handleWordPredictionSelect}
        isEnabled={preferences.enableWordPrediction}
      />

      {/* Category Navigation */}
      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
        />
      )}

      {/* Recently Used */}
      <RecentlyUsed
        tiles={recentTiles}
        onTileClick={handleTileClick}
        maxTiles={preferences.maxRecentTiles}
        isEnabled={preferences.showRecentlyUsed}
      />

      {/* Tile Grid */}
      <div className="flex-1 overflow-auto">
        <TileGrid
          tiles={tiles}
          onTileClick={handleTileClick}
          isEditMode={isEditMode}
          tileSize={preferences.tileSize}
          gridColumns={preferences.gridColumns}
        />
      </div>

      {/* Edit Mode Dialog */}
      <EditModeDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onVerify={handlePinVerify}
      />
    </div>
  );
};

export default Index;
