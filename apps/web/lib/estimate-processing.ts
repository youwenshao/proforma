export const PROCESSING_STATUS_MESSAGE_KEYS = [
  "processing.analyzing",
  "processing.calibrating",
  "processing.building",
  "processing.preparing",
] as const;

export const REVEAL_ESTIMATE_SESSION_KEY = "proforma.estimate-reveal";

export const DISSOLVE_DURATION_MS = 500;

export function getRandomProcessingDelayMs(): number {
  return 3000 + Math.floor(Math.random() * 2001);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function markEstimateForReveal(estimateId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(REVEAL_ESTIMATE_SESSION_KEY, estimateId);
}

export function consumeEstimateReveal(estimateId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const pendingId = sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY);
  if (pendingId !== estimateId) {
    return false;
  }

  sessionStorage.removeItem(REVEAL_ESTIMATE_SESSION_KEY);
  return true;
}
