import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tile } from "./TileGrid";

interface RecentlyUsedProps {
  tiles: Tile[];
  onTileClick: (tile: Tile) => void;
  maxTiles?: number;
  isEnabled: boolean;
}

const colorMap: Record<string, string> = {
  '#3A86FF': 'bg-[hsl(var(--aac-blue))]',
  '#06D6A0': 'bg-[hsl(var(--aac-green))]',
  '#EF476F': 'bg-[hsl(var(--aac-red))]',
  '#FFD166': 'bg-[hsl(var(--aac-yellow))]',
  '#8E7DBE': 'bg-[hsl(var(--aac-purple))]',
  '#FF6B35': 'bg-[hsl(var(--aac-orange))]',
};

export const RecentlyUsed = ({ tiles, onTileClick, maxTiles = 6, isEnabled }: RecentlyUsedProps) => {
  if (!isEnabled || tiles.length === 0) return null;

  const recentTiles = tiles.slice(0, maxTiles);

  return (
    <div className="border-b bg-background/50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Recently Used</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {recentTiles.map((tile) => (
          <Button
            key={tile.id}
            onClick={() => onTileClick(tile)}
            className={cn(
              "shrink-0 h-16 px-4",
              colorMap[tile.color] || "bg-primary",
              "text-white hover:opacity-90 transition-opacity"
            )}
            aria-label={`Recently used: ${tile.label}`}
          >
            <span className="text-sm font-medium">{tile.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
