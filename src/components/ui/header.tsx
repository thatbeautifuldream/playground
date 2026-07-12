"use client";

import {
  MoonIcon,
  PlayIcon,
  ShareIcon,
  SunIcon,
  WandSparklesIcon,
} from "lucide-react";
import GitHubButton from "react-github-btn";
import { Button } from "./button";
import { TouchTarget } from "./touch-target";

interface HeaderProps {
  onRun?: () => void;
  onThemeToggle?: () => void;
  onShare?: () => void;
  onFormat?: () => void;
}

export function Header({ onRun, onThemeToggle, onShare, onFormat }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 lg:h-8 px-3 bg-background border-b border-border flex-shrink-0">
      <div className="flex items-center space-x-2 min-w-0">
        <span className="text-base lg:text-sm font-medium text-muted-foreground truncate">
          TS Playground
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <div className="hidden lg:flex items-center text-xs -mb-1">
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

        {onFormat && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFormat}
            className="relative h-9 lg:h-6 px-3 lg:px-2 text-sm lg:text-xs cursor-pointer"
            title="Format (Ctrl/Cmd+S)"
          >
            <WandSparklesIcon className="size-4 lg:size-3 lg:mr-1" />
            <span className="hidden lg:inline">Format</span>
            <TouchTarget />
          </Button>
        )}

        {onRun && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRun}
            className="relative h-9 lg:h-6 px-3 lg:px-2 text-sm lg:text-xs cursor-pointer"
            title="Run (Ctrl/Cmd+Enter)"
          >
            <PlayIcon className="size-4 lg:size-3 lg:mr-1" />
            <span className="hidden lg:inline">Run</span>
            <TouchTarget />
          </Button>
        )}

        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="relative h-9 lg:h-6 px-3 lg:px-2 text-sm lg:text-xs cursor-pointer"
            title="Copy share link"
          >
            <ShareIcon className="size-4 lg:size-3 lg:mr-1" />
            <span className="hidden lg:inline">Share</span>
            <TouchTarget />
          </Button>
        )}

        {onThemeToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="relative h-9 w-9 lg:h-6 lg:w-6 cursor-pointer"
            title="Toggle theme"
          >
            <SunIcon className="size-4 lg:size-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-4 lg:size-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
            <TouchTarget />
          </Button>
        )}
      </div>
    </header>
  );
}
