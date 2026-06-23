"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

export const HOME_AURORA_BACKGROUNDS = [
  "/auroras/background-1.jpg",
  "/auroras/background-2.jpg",
  "/auroras/background-3.jpg",
] as const;

let selectedHomeBackground: string | null = null;

function subscribe() {
  return () => {};
}

function getHomeBackgroundSnapshot() {
  if (!selectedHomeBackground) {
    const index = Math.floor(Math.random() * HOME_AURORA_BACKGROUNDS.length);
    selectedHomeBackground = HOME_AURORA_BACKGROUNDS[index];
  }

  return selectedHomeBackground;
}

function getServerBackgroundSnapshot() {
  return null;
}

export function RandomAuroraBackground() {
  const backgroundUrl = useSyncExternalStore(
    subscribe,
    getHomeBackgroundSnapshot,
    getServerBackgroundSnapshot,
  );

  return (
    <div
      aria-hidden="true"
      className="aurora-background aurora-background-random"
      data-testid="random-aurora-background"
      style={
        backgroundUrl
          ? ({ "--aurora-image": `url("${backgroundUrl}")` } as CSSProperties)
          : undefined
      }
    />
  );
}
