import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Volume2, Zap, Grid3x3, Eye, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SettingsPanelProps {
  preferences: {
    enableWordPrediction: boolean;
    enableScanning: boolean;
    scanningSpeed: number;
    enableAutoSpeak: boolean;
    showRecentlyUsed: boolean;
    maxRecentTiles: number;
    enableEmergencyBar: boolean;
    tileSize: string;
    gridColumns: number;
  };
  ttsSettings: {
    rate: number;
    pitch: number;
    voice: string;
  };
  voices: SpeechSynthesisVoice[];
  onPreferencesChange: (preferences: any) => void;
  onTTSSettingsChange: (settings: any) => void;
}

export const SettingsPanel = ({ 
  preferences, 
  ttsSettings,
  voices,
  onPreferencesChange, 
  onTTSSettingsChange 
}: SettingsPanelProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Communication Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Speech</h3>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label>Voice</Label>
                  <Select 
                    value={ttsSettings.voice} 
                    onValueChange={(value) => onTTSSettingsChange({ ...ttsSettings, voice: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Voice</SelectItem>
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Speech Rate: {ttsSettings.rate.toFixed(2)}</Label>
                  <Slider
                    value={[ttsSettings.rate]}
                    onValueChange={([value]) => onTTSSettingsChange({ ...ttsSettings, rate: value })}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Speech Pitch: {ttsSettings.pitch.toFixed(2)}</Label>
                  <Slider
                    value={[ttsSettings.pitch]}
                    onValueChange={([value]) => onTTSSettingsChange({ ...ttsSettings, pitch: value })}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-speak">Auto-speak after tile</Label>
                  <Switch
                    id="auto-speak"
                    checked={preferences.enableAutoSpeak}
                    onCheckedChange={(checked) => 
                      onPreferencesChange({ ...preferences, enableAutoSpeak: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Display</h3>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label>Tile Size</Label>
                  <Select 
                    value={preferences.tileSize} 
                    onValueChange={(value) => onPreferencesChange({ ...preferences, tileSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grid Columns: {preferences.gridColumns}</Label>
                  <Slider
                    value={[preferences.gridColumns]}
                    onValueChange={([value]) => onPreferencesChange({ ...preferences, gridColumns: value })}
                    min={2}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Features</h3>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="word-prediction">Word Prediction</Label>
                  <Switch
                    id="word-prediction"
                    checked={preferences.enableWordPrediction}
                    onCheckedChange={(checked) => 
                      onPreferencesChange({ ...preferences, enableWordPrediction: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-bar">Emergency Bar</Label>
                  <Switch
                    id="emergency-bar"
                    checked={preferences.enableEmergencyBar}
                    onCheckedChange={(checked) => 
                      onPreferencesChange({ ...preferences, enableEmergencyBar: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="recently-used">Show Recently Used</Label>
                  <Switch
                    id="recently-used"
                    checked={preferences.showRecentlyUsed}
                    onCheckedChange={(checked) => 
                      onPreferencesChange({ ...preferences, showRecentlyUsed: checked })
                    }
                  />
                </div>

                {preferences.showRecentlyUsed && (
                  <div className="space-y-2 pl-4">
                    <Label>Max Recent Tiles: {preferences.maxRecentTiles}</Label>
                    <Slider
                      value={[preferences.maxRecentTiles]}
                      onValueChange={([value]) => 
                        onPreferencesChange({ ...preferences, maxRecentTiles: value })
                      }
                      min={3}
                      max={12}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Accessibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Accessibility</h3>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scanning-mode">Scanning Mode</Label>
                  <Switch
                    id="scanning-mode"
                    checked={preferences.enableScanning}
                    onCheckedChange={(checked) => 
                      onPreferencesChange({ ...preferences, enableScanning: checked })
                    }
                  />
                </div>

                {preferences.enableScanning && (
                  <div className="space-y-2 pl-4">
                    <Label>Scan Speed: {preferences.scanningSpeed}ms</Label>
                    <Slider
                      value={[preferences.scanningSpeed]}
                      onValueChange={([value]) => 
                        onPreferencesChange({ ...preferences, scanningSpeed: value })
                      }
                      min={500}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
