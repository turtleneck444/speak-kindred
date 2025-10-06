import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Tile {
  id: string;
  label: string;
  speech_text: string;
  color: string;
  next_board_id?: string | null;
  is_favorite?: boolean;
  order_index: number;
}

interface TileGridProps {
  tiles: Tile[];
  onTileClick: (tile: Tile) => void;
  isEditMode: boolean;
  onTileEdit?: (tile: Tile) => void;
}

const colorMap: Record<string, string> = {
  '#3A86FF': 'bg-[hsl(var(--aac-blue))]',
  '#06D6A0': 'bg-[hsl(var(--aac-green))]',
  '#EF476F': 'bg-[hsl(var(--aac-red))]',
  '#FFD166': 'bg-[hsl(var(--aac-yellow))]',
  '#8E7DBE': 'bg-[hsl(var(--aac-purple))]',
  '#FF6B35': 'bg-[hsl(var(--aac-orange))]',
};

export const TileGrid = ({ tiles, onTileClick, isEditMode, onTileEdit }: TileGridProps) => {
  const handleClick = (tile: Tile) => {
    if (isEditMode && onTileEdit) {
      onTileEdit(tile);
    } else {
      onTileClick(tile);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
      {tiles.map((tile) => (
        <Button
          key={tile.id}
          onClick={() => handleClick(tile)}
          className={cn(
            "aac-tile relative",
            colorMap[tile.color] || "bg-primary",
            "text-white hover:opacity-90 transition-opacity",
            "flex flex-col items-center justify-center gap-2"
          )}
          aria-label={`${tile.label}. Says: ${tile.speech_text}`}
        >
          {tile.is_favorite && (
            <span className="absolute top-1 right-1 text-yellow-300" aria-hidden="true">
              ★
            </span>
          )}
          <span className="text-center break-words w-full px-2">
            {tile.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
