import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Delete, Space, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

interface VirtualKeyboardProps {
  onType: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onSpeak: () => void;
  className?: string;
}

const QWERTY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const PUNCTUATION = ['.', ',', '!', '?', "'", '"', '-', '(', ')', '/'];

export const VirtualKeyboard = ({
  onType,
  onBackspace,
  onSpace,
  onClear,
  onSpeak,
  className
}: VirtualKeyboardProps) => {
  const [mode, setMode] = useState<'letters' | 'numbers'>('letters');
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyPress = (key: string) => {
    if (mode === 'letters' && !capsLock) {
      onType(key.toLowerCase());
    } else {
      onType(key);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'letters' ? 'numbers' : 'letters');
  };

  return (
    <div className={cn("bg-card border-t border-border p-2 sm:p-3", className)}>
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Mode indicator */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {mode === 'letters' ? (capsLock ? 'ABC (CAPS)' : 'abc') : '123'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs h-7"
          >
            Clear All
          </Button>
        </div>

        {mode === 'letters' ? (
          <>
            {/* Letter rows */}
            {QWERTY_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((letter) => (
                  <Button
                    key={letter}
                    onClick={() => handleKeyPress(letter)}
                    className="h-10 sm:h-12 flex-1 max-w-[60px] text-base sm:text-lg font-semibold touch-manipulation"
                    variant="outline"
                    aria-label={`Type ${letter}`}
                  >
                    {capsLock ? letter : letter.toLowerCase()}
                  </Button>
                ))}
              </div>
            ))}

            {/* Punctuation row */}
            <div className="flex justify-center gap-1">
              {PUNCTUATION.map((mark) => (
                <Button
                  key={mark}
                  onClick={() => onType(mark)}
                  className="h-10 sm:h-12 flex-1 max-w-[50px] text-base sm:text-lg font-semibold touch-manipulation"
                  variant="outline"
                  aria-label={`Type ${mark}`}
                >
                  {mark}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Numbers */}
            <div className="flex justify-center gap-1">
              {NUMBERS.map((num) => (
                <Button
                  key={num}
                  onClick={() => onType(num)}
                  className="h-10 sm:h-12 flex-1 max-w-[60px] text-base sm:text-lg font-semibold touch-manipulation"
                  variant="outline"
                  aria-label={`Type ${num}`}
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Common symbols */}
            <div className="flex justify-center gap-1">
              {['@', '#', '$', '%', '&', '*', '+', '=', '<', '>'].map((symbol) => (
                <Button
                  key={symbol}
                  onClick={() => onType(symbol)}
                  className="h-10 sm:h-12 flex-1 max-w-[60px] text-base sm:text-lg font-semibold touch-manipulation"
                  variant="outline"
                  aria-label={`Type ${symbol}`}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Bottom row - special keys */}
        <div className="flex gap-1 sm:gap-2">
          <Button
            onClick={toggleMode}
            className="h-12 sm:h-14 flex-1 text-sm sm:text-base font-semibold touch-manipulation"
            variant="secondary"
            aria-label={mode === 'letters' ? 'Switch to numbers' : 'Switch to letters'}
          >
            {mode === 'letters' ? '123' : 'ABC'}
          </Button>

          {mode === 'letters' && (
            <Button
              onClick={() => setCapsLock(!capsLock)}
              className={cn(
                "h-12 sm:h-14 flex-1 text-sm sm:text-base font-semibold touch-manipulation",
                capsLock && "bg-primary text-primary-foreground"
              )}
              variant="secondary"
              aria-label={capsLock ? 'Caps lock on' : 'Caps lock off'}
            >
              <ArrowLeft className="h-5 w-5 rotate-90" />
            </Button>
          )}

          <Button
            onClick={onSpace}
            className="h-12 sm:h-14 flex-[3] text-sm sm:text-base font-semibold touch-manipulation"
            variant="outline"
            aria-label="Space"
          >
            <Space className="h-5 w-5 mr-2" />
            Space
          </Button>

          <Button
            onClick={onBackspace}
            className="h-12 sm:h-14 flex-1 text-sm sm:text-base font-semibold touch-manipulation"
            variant="secondary"
            aria-label="Backspace"
          >
            <Delete className="h-5 w-5" />
          </Button>

          <Button
            onClick={onSpeak}
            className="h-12 sm:h-14 flex-1 text-sm sm:text-base font-semibold touch-manipulation bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Speak message"
          >
            <Check className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick phrases row */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {['please', 'thank you', 'yes', 'no', 'help', 'more', 'stop'].map((phrase) => (
            <Button
              key={phrase}
              onClick={() => onType(phrase + ' ')}
              className="h-9 px-3 whitespace-nowrap text-xs sm:text-sm touch-manipulation"
              variant="ghost"
              aria-label={`Add ${phrase}`}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
