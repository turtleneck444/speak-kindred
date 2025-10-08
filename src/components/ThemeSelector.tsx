import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme, Theme } from "@/hooks/useTheme";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Change theme"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold">Choose Your Fun Theme! 🎨</DialogTitle>
          <p className="text-muted-foreground mt-2">Pick a theme that makes you happy and helps you communicate better</p>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => changeTheme(theme.id)}
              className={cn(
                "flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-3 transition-all hover:scale-105 active:scale-95",
                currentTheme === theme.id
                  ? "border-primary bg-primary/15 shadow-lg ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/60 hover:shadow-md"
              )}
              aria-label={`Select ${theme.name} theme`}
            >
              <div 
                className="text-4xl sm:text-5xl drop-shadow-lg" 
                aria-hidden="true"
                style={{
                  filter: currentTheme === theme.id ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
                }}
              >
                {theme.icon}
              </div>
              <div className="font-bold text-base sm:text-lg text-center">{theme.name}</div>
              <div className="flex gap-1 flex-wrap justify-center">
                {Object.entries(theme.colors)
                  .filter(([key]) => key.startsWith('aac-'))
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-foreground/20 shadow-md"
                      style={{ backgroundColor: `hsl(${value})` }}
                      aria-hidden="true"
                    />
                  ))}
              </div>
              {currentTheme === theme.id && (
                <div className="text-xs font-semibold text-primary">✓ Active</div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Accessibility Tip:</strong> All themes are designed with high contrast for better visibility. 
            Patterns add visual interest while maintaining readability. 🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
