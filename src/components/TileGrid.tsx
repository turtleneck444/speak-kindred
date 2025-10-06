import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { Star, Edit } from "lucide-react";

export interface Tile {
  id: string;
  label: string;
  speech_text: string;
  color: string;
  next_board_id?: string | null;
  is_favorite?: boolean;
  order_index: number;
  icon_name?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  board_id?: string | null;
}

interface TileGridProps {
  tiles: Tile[];
  onTileClick: (tile: Tile) => void;
  isEditMode: boolean;
  onTileEdit?: (tile: Tile) => void;
  tileSize?: 'small' | 'medium' | 'large' | 'extra-large';
  gridColumns?: number;
}

const colorMap: Record<string, string> = {
  '#3A86FF': 'bg-[hsl(var(--aac-blue))]',
  '#06D6A0': 'bg-[hsl(var(--aac-green))]',
  '#EF476F': 'bg-[hsl(var(--aac-red))]',
  '#FFD166': 'bg-[hsl(var(--aac-yellow))]',
  '#8E7DBE': 'bg-[hsl(var(--aac-purple))]',
  '#FF6B35': 'bg-[hsl(var(--aac-orange))]',
};

const sizeClasses = {
  'small': 'h-20 text-sm',
  'medium': 'h-24 text-base',
  'large': 'h-32 text-lg',
  'extra-large': 'h-40 text-xl',
};

export const TileGrid = ({ 
  tiles, 
  onTileClick, 
  isEditMode, 
  onTileEdit,
  tileSize = 'medium',
  gridColumns = 4
}: TileGridProps) => {
  const handleClick = (tile: Tile) => {
    if (isEditMode && onTileEdit) {
      onTileEdit(tile);
    } else {
      onTileClick(tile);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  }[gridColumns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={cn("grid gap-3 p-4", gridColsClass)}>
      {tiles.map((tile) => (
        <Button
          key={tile.id}
          onClick={() => handleClick(tile)}
          className={cn(
            "aac-tile relative",
            colorMap[tile.color] || "bg-primary",
            "text-white hover:opacity-90 transition-opacity",
            "flex flex-col items-center justify-center gap-2",
            sizeClasses[tileSize]
          )}
          aria-label={`${tile.label}. Says: ${tile.speech_text}`}
        >
          {tile.is_favorite && (
            <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-300 fill-yellow-300" aria-hidden="true" />
          )}
          {isEditMode && (
            <Edit className="absolute top-2 left-2 h-4 w-4 text-white/70" aria-hidden="true" />
          )}
          {tile.image_url ? (
            <img 
              src={tile.image_url} 
              alt="" 
              className="h-12 w-12 object-contain mb-1"
              aria-hidden="true"
            />
          ) : tile.icon_name ? (
            <div className="mb-1" aria-hidden="true">
              {getIcon(tile.icon_name)}
            </div>
          ) : null}
          <span className="text-center break-words w-full px-2 font-semibold leading-tight">
            {tile.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
