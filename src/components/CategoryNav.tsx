import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order_index: number;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  showAllOption?: boolean;
}

export const CategoryNav = ({ 
  categories, 
  activeCategory, 
  onCategorySelect,
  showAllOption = true 
}: CategoryNavProps) => {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.Folder className="h-5 w-5" />;
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-3">
          {showAllOption && (
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => onCategorySelect(null)}
              className="shrink-0"
              aria-pressed={activeCategory === null}
            >
              <Icons.Grid3x3 className="h-5 w-5 mr-2" />
              All
            </Button>
          )}
          {categories
            .sort((a, b) => a.order_index - b.order_index)
            .map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => onCategorySelect(category.id)}
                className="shrink-0"
                style={{
                  backgroundColor: activeCategory === category.id ? category.color : undefined,
                  borderColor: category.color,
                }}
                aria-pressed={activeCategory === category.id}
              >
                {getIcon(category.icon)}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
