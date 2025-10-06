import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Play, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ELEVENLABS_VOICES, ElevenLabsVoice } from "@/hooks/useElevenLabsTTS";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onVoiceSelect: (voiceId: string) => void;
  onPreview: (voiceId: string) => void;
}

const categoryColors: Record<string, string> = {
  female: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  male: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  fun: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  cute: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
  animated: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  professional: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

const categoryLabels: Record<string, string> = {
  female: '👩 Female',
  male: '👨 Male',
  fun: '🎉 Fun',
  cute: '🌸 Cute',
  animated: '🎬 Animated',
  professional: '💼 Professional',
};

export const VoiceSelector = ({ selectedVoiceId, onVoiceSelect, onPreview }: VoiceSelectorProps) => {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVoices = selectedCategory === 'all' 
    ? ELEVENLABS_VOICES 
    : ELEVENLABS_VOICES.filter(v => v.category === selectedCategory);

  const categories = Array.from(new Set(ELEVENLABS_VOICES.map(v => v.category)));

  const handlePreview = async (voice: ElevenLabsVoice) => {
    setPreviewingId(voice.id);
    await onPreview(voice.id);
    // Reset after a delay
    setTimeout(() => setPreviewingId(null), 3000);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2" aria-label="Choose voice">
          <Mic className="h-4 w-4" />
          Choose Voice
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Pick Your Perfect Voice! 🎙️
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Try different voices by clicking the play button. Pick your favorite! 
          </p>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ✨</TabsTrigger>
            <TabsTrigger value="female">👩 Female</TabsTrigger>
            <TabsTrigger value="male">👨 Male</TabsTrigger>
            <TabsTrigger value="fun">🎉 Fun</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <VoiceList 
              voices={ELEVENLABS_VOICES} 
              selectedVoiceId={selectedVoiceId}
              previewingId={previewingId}
              onSelect={onVoiceSelect}
              onPreview={handlePreview}
            />
          </TabsContent>
          <TabsContent value="female" className="mt-4">
            <VoiceList 
              voices={ELEVENLABS_VOICES.filter(v => v.category === 'female')} 
              selectedVoiceId={selectedVoiceId}
              previewingId={previewingId}
              onSelect={onVoiceSelect}
              onPreview={handlePreview}
            />
          </TabsContent>
          <TabsContent value="male" className="mt-4">
            <VoiceList 
              voices={ELEVENLABS_VOICES.filter(v => v.category === 'male')} 
              selectedVoiceId={selectedVoiceId}
              previewingId={previewingId}
              onSelect={onVoiceSelect}
              onPreview={handlePreview}
            />
          </TabsContent>
          <TabsContent value="fun" className="mt-4">
            <VoiceList 
              voices={ELEVENLABS_VOICES.filter(v => ['fun', 'cute', 'animated'].includes(v.category))} 
              selectedVoiceId={selectedVoiceId}
              previewingId={previewingId}
              onSelect={onVoiceSelect}
              onPreview={handlePreview}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium mb-1 flex items-center gap-2">
            ✨ Pro Tip:
          </p>
          <p className="text-sm text-muted-foreground">
            Click the <Play className="h-3 w-3 inline" /> button to hear each voice say their greeting! 
            Choose one that makes you smile! 😊
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface VoiceListProps {
  voices: ElevenLabsVoice[];
  selectedVoiceId: string;
  previewingId: string | null;
  onSelect: (voiceId: string) => void;
  onPreview: (voice: ElevenLabsVoice) => void;
}

const VoiceList = ({ voices, selectedVoiceId, previewingId, onSelect, onPreview }: VoiceListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              selectedVoiceId === voice.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {selectedVoiceId === voice.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="text-4xl">{voice.emoji}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  {voice.name}
                  <Badge variant="secondary" className="text-xs">
                    {voice.category}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {voice.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  "{voice.previewText}"
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreview(voice)}
                disabled={previewingId === voice.id}
                className="flex-1"
              >
                {previewingId === voice.id ? (
                  <>
                    <span className="animate-pulse">🔊</span> Playing...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" /> Preview
                  </>
                )}
              </Button>
              {selectedVoiceId !== voice.id && (
                <Button
                  size="sm"
                  onClick={() => onSelect(voice.id)}
                  className="flex-1"
                >
                  Select
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
