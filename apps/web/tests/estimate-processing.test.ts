import {
  REVEAL_ESTIMATE_SESSION_KEY,
  consumeEstimateReveal,
  getRandomProcessingDelayMs,
  markEstimateForReveal,
} from "@/lib/estimate-processing";

describe("estimate processing helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns a random delay between 3000 and 5000 ms", () => {
    const delays = Array.from({ length: 20 }, () => getRandomProcessingDelayMs());

    for (const delay of delays) {
      expect(delay).toBeGreaterThanOrEqual(3000);
      expect(delay).toBeLessThanOrEqual(5000);
    }
  });

  it("marks and consumes a reveal flag for a fresh estimate", () => {
    markEstimateForReveal("estimate-123");

    expect(sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY)).toBe("estimate-123");
    expect(consumeEstimateReveal("estimate-123")).toBe(true);
    expect(sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY)).toBeNull();
  });

  it("does not consume a reveal flag for a different estimate", () => {
    markEstimateForReveal("estimate-123");

    expect(consumeEstimateReveal("estimate-456")).toBe(false);
    expect(sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY)).toBe("estimate-123");
  });
});
