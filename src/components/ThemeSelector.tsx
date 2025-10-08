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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => changeTheme(theme.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:scale-105",
                currentTheme === theme.id
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border hover:border-primary/50"
              )}
              aria-label={`Select ${theme.name} theme`}
            >
              <div className="text-5xl" aria-hidden="true">
                {theme.icon}
              </div>
              <div className="font-semibold text-lg">{theme.name}</div>
              <div className="flex gap-1">
                {Object.entries(theme.colors)
                  .filter(([key]) => key.startsWith('aac-'))
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${value})` }}
                      aria-hidden="true"
                    />
                  ))}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
