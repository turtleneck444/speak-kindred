import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage, LanguageOption } from '@/hooks/useLanguage';
import { ScrollArea } from '@/components/ui/scroll-area';

export const LanguageSelector = () => {
  const { language, setLanguage, languages } = useLanguage();

  const handleLanguageSelect = (code: LanguageOption['code']) => {
    setLanguage(code);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="gap-2 text-lg h-14"
        >
          <Languages className="h-6 w-6" />
          {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.nativeName}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-2xl">Choose Language / Elegir Idioma / Choisir la Langue</SheetTitle>
          <SheetDescription className="text-base">
            Select your preferred language for the app
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(80vh-120px)] mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                variant={language === lang.code ? "default" : "outline"}
                size="lg"
                className="h-20 text-lg flex items-center justify-start gap-4 relative overflow-hidden group"
              >
                <span className="text-4xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{lang.nativeName}</span>
                  <span className="text-sm opacity-70">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
