import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthForm } from "@/components/AuthForm";
import { TileGrid, Tile } from "@/components/TileGrid";
import { UtteranceBar } from "@/components/UtteranceBar";
import { EditModeDialog } from "@/components/EditModeDialog";
import { useTTS } from "@/hooks/useTTS";
import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [utterance, setUtterance] = useState<string[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [caregiverPin, setCaregiverPin] = useState("1234");
  
  const { speak, isSpeaking } = useTTS({ rate: 0.45, pitch: 1.0, voice: "default" });
  const { toast } = useToast();

  useEffect(() => {
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
    if (session?.user) {
      loadUserData();
    }
  }, [session]);

  const loadUserData = async () => {
    if (!session?.user) return;

    // Load profile with PIN
    const { data: profile } = await supabase
      .from("profiles")
      .select("caregiver_pin")
      .eq("id", session.user.id)
      .single();

    if (profile?.caregiver_pin) {
      setCaregiverPin(profile.caregiver_pin);
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
      loadTiles(boards[0].id);
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
        { label: "I want", speech_text: "I want", color: "#3A86FF", order_index: 0 },
        { label: "Yes", speech_text: "Yes", color: "#06D6A0", order_index: 1 },
        { label: "No", speech_text: "No", color: "#EF476F", order_index: 2 },
        { label: "Bathroom", speech_text: "I need the bathroom", color: "#FFD166", order_index: 3 },
        { label: "Help", speech_text: "Please help me", color: "#8E7DBE", order_index: 4 },
        { label: "Thank you", speech_text: "Thank you", color: "#FF6B35", order_index: 5 },
      ];

      await supabase.from("tiles").insert(
        defaultTiles.map(tile => ({ ...tile, board_id: board.id }))
      );

      setCurrentBoardId(board.id);
      loadTiles(board.id);
    }
  };

  const loadTiles = async (boardId: string) => {
    const { data } = await supabase
      .from("tiles")
      .select("*")
      .eq("board_id", boardId)
      .order("order_index", { ascending: true });

    if (data) {
      setTiles(data);
    }
  };

  const handleTileClick = (tile: Tile) => {
    setUtterance([...utterance, tile.speech_text]);
    
    // Track usage
    if (session?.user) {
      supabase.from("usage_events").insert({
        user_id: session.user.id,
        tile_id: tile.id,
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

  const handleSignOut = async () => {
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

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SpeakKindred</h1>
        <div className="flex gap-2">
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

      {/* Utterance Bar */}
      <UtteranceBar
        text={utterance.join(" ")}
        onSpeak={handleSpeak}
        onClear={handleClear}
        isSpeaking={isSpeaking}
      />

      {/* Tile Grid */}
      <div className="flex-1 overflow-auto">
        <TileGrid
          tiles={tiles}
          onTileClick={handleTileClick}
          isEditMode={isEditMode}
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
