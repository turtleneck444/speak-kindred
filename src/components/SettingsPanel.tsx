import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsType {
  rate: number;
  pitch: number;
  voice: string;
  dwellMode?: boolean;
  dwellMs?: number;
  scanSpeed?: number;
  textScale?: number;
  highContrast?: boolean;
}

interface SettingsPanelProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  voices: SpeechSynthesisVoice[];
}

export const SettingsPanel = ({ settings, onSettingsChange, voices }: SettingsPanelProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const saveSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ settings: settings as any })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Settings Saved",
          description: "Your settings have been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{t('settings')}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="voice">{t('voice')}</Label>
          <Select
            value={settings.voice}
            onValueChange={(value) =>
              onSettingsChange({ ...settings, voice: value })
            }
          >
            <SelectTrigger id="voice">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="speed">{t('speed')}: {settings.rate.toFixed(2)}</Label>
          <Slider
            id="speed"
            value={[settings.rate]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, rate: value })
            }
            min={0.1}
            max={2.0}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pitch">{t('pitch')}: {settings.pitch.toFixed(2)}</Label>
          <Slider
            id="pitch"
            value={[settings.pitch]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, pitch: value })
            }
            min={0.1}
            max={2.0}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scanSpeed">{t('scan_speed')}: {settings.scanSpeed}ms</Label>
          <Slider
            id="scanSpeed"
            value={[settings.scanSpeed || 1000]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, scanSpeed: value })
            }
            min={500}
            max={3000}
            step={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dwellTime">{t('dwell_time')}: {settings.dwellMs}ms</Label>
          <Slider
            id="dwellTime"
            value={[settings.dwellMs || 2000]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, dwellMs: value })
            }
            min={500}
            max={5000}
            step={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textScale">{t('text_size')}: {settings.textScale?.toFixed(1)}x</Label>
          <Slider
            id="textScale"
            value={[settings.textScale || 1.2]}
            onValueChange={([value]) =>
              onSettingsChange({ ...settings, textScale: value })
            }
            min={0.8}
            max={2.0}
            step={0.1}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dwellMode">{t('dwell_mode')}</Label>
          <Switch
            id="dwellMode"
            checked={settings.dwellMode || false}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, dwellMode: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="highContrast">{t('high_contrast')}</Label>
          <Switch
            id="highContrast"
            checked={settings.highContrast || false}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, highContrast: checked })
            }
          />
        </div>
        
        <Button onClick={saveSettings} className="w-full" size="lg">
          {t('save_settings')}
        </Button>
      </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
