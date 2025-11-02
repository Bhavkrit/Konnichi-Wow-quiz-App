import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="rounded-full transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-500 animate-in spin-in-180 duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 animate-in spin-in-180 duration-500" />
      )}
    </Button>
  );
}
