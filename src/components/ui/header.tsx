"use client";

import { MoonIcon, PlayIcon, SunIcon } from "lucide-react";
import GitHubButton from "react-github-btn";
import { Button } from "./button";

interface HeaderProps {
  onRun?: () => void;
  onThemeToggle?: () => void;
}

export function Header({ onRun, onThemeToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-8 px-3 bg-background border-b border-border">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">
          TypeScript REPL
        </span>
        <span className="text-xs text-muted-foreground/60">(JS works too)</span>
      </div>

      <div className="flex items-center space-x-1">
        <div className="flex items-center text-xs -mb-1">
          <GitHubButton
            href="https://github.com/thatbeautifuldream/playground"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-icon="octicon-star"
            data-show-count="true"
            aria-label="Star thatbeautifuldream/playground on GitHub"
          >
            Star
          </GitHubButton>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRun}
          className="h-6 px-2 text-xs cursor-pointer"
        >
          <PlayIcon className="h-3 w-3 mr-1" />
          Run
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="h-6 w-6 cursor-pointer"
        >
          <SunIcon className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
