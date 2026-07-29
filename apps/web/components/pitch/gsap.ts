import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Scrub-friendly count-up: writes a formatted number into `el` as the
 * timeline progresses, so scrolling backwards also rewinds the number.
 */
export function addCountUp(
  timeline: gsap.core.Timeline,
  el: Element,
  value: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    position?: gsap.Position;
    useGrouping?: boolean;
  } = {},
) {
  const {
    decimals = 0,
    prefix = "",
    suffix = "",
    duration = 1,
    position,
    useGrouping = true,
  } = options;
  const proxy = { value: 0 };
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  });

  timeline.to(
    proxy,
    {
      value,
      duration,
      ease: "power1.out",
      onUpdate: () => {
        el.textContent = `${prefix}${formatter.format(proxy.value)}${suffix}`;
      },
    },
    position,
  );
}
