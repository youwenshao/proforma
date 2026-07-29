"use client";

import { Badge } from "@/components/ui/badge";
import evidenceDistribution from "./evidence-distribution.json";
import { pitchContent } from "./content";

const { empiricalChart } = pitchContent.evidence;

type DistributionBin = {
  rangeLow: number | null;
  rangeHigh: number | null;
  count: number;
  sharePct: number;
};

const distribution = evidenceDistribution as {
  bins: DistributionBin[];
  metrics: { anyOverrunRate: number; materialCreepRate: number };
  nonOngoingSampleSize: number;
};

const CHART_LEFT = 44;
const CHART_RIGHT = 600;
const CHART_TOP = 34;
const CHART_BASELINE_Y = 226;
const BAR_GAP = 1.5;

const bins = distribution.bins;
const barWidth = (CHART_RIGHT - CHART_LEFT) / bins.length - BAR_GAP;
const maxSharePct = Math.max(...bins.map((bin) => bin.sharePct));
const plotHeight = CHART_BASELINE_Y - CHART_TOP;
const yMax = Math.ceil((maxSharePct * 1.15) / 5) * 5;

function barX(index: number) {
  return CHART_LEFT + index * (barWidth + BAR_GAP);
}

function barColor(bin: DistributionBin) {
  if (bin.rangeHigh !== null && bin.rangeHigh <= 0) {
    return "fill-muted-foreground/25";
  }
  if (bin.rangeLow !== null && bin.rangeLow >= 0.05) {
    return "fill-primary";
  }
  return "fill-primary/45";
}

function formatPct(fraction: number) {
  return `${(fraction * 100).toFixed(2)}%`;
}

function thresholdX(boundary: number) {
  const index = bins.findIndex((bin) => bin.rangeLow === boundary);
  return index === -1 ? null : barX(index);
}

const anyOverrunX = thresholdX(0);
const materialCreepX = thresholdX(0.05);

export function EvidenceRealChart() {
  return (
    <div
      className="mt-6 rounded-2xl border border-white/20 bg-white/45 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-card/50 sm:p-8"
      data-evidence-real-chart
    >
      <figure>
        <figcaption>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{empiricalChart.title}</p>
            <Badge variant="secondary">{empiricalChart.badge}</Badge>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {empiricalChart.caption}
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground/80">
            {empiricalChart.insight}
          </p>
        </figcaption>

        <svg
          aria-labelledby="evidence-real-chart-title evidence-real-chart-desc"
          className="mt-5 w-full"
          fill="none"
          role="img"
          viewBox="0 0 620 300"
        >
          <title id="evidence-real-chart-title">{empiricalChart.title}</title>
          <desc id="evidence-real-chart-desc">
            {empiricalChart.caption} {empiricalChart.insight}{" "}
            {formatPct(distribution.metrics.anyOverrunRate)} any-stage overrun.{" "}
            {formatPct(distribution.metrics.materialCreepRate)} material scope creep. Based on{" "}
            {distribution.nonOngoingSampleSize} non-ongoing synthetic matters.
          </desc>

          <text
            className="fill-muted-foreground text-[11px]"
            textAnchor="middle"
            transform={`rotate(-90 14 ${CHART_TOP + plotHeight / 2})`}
            x="14"
            y={CHART_TOP + plotHeight / 2}
          >
            {empiricalChart.axes.y}
          </text>

          <line
            className="stroke-border"
            strokeWidth="1.5"
            x1={CHART_LEFT}
            x2={CHART_RIGHT}
            y1={CHART_BASELINE_Y}
            y2={CHART_BASELINE_Y}
          />

          {bins.map((bin, index) => {
            const height = (bin.sharePct / yMax) * plotHeight;
            const label =
              bin.rangeLow === null
                ? `< ${(bin.rangeHigh! * 100).toFixed(0)}%`
                : bin.rangeHigh === null
                  ? `\u2265 ${(bin.rangeLow * 100).toFixed(0)}%`
                  : `${(bin.rangeLow * 100).toFixed(0)}% to ${(bin.rangeHigh * 100).toFixed(0)}%`;
            return (
              <rect
                aria-label={`${label}: ${bin.sharePct.toFixed(1)}% of matters`}
                className={barColor(bin)}
                data-evidence-real-bar
                height={height}
                key={`${bin.rangeLow ?? "neg-inf"}-${bin.rangeHigh ?? "inf"}`}
                rx="1.5"
                width={barWidth}
                x={barX(index)}
                y={CHART_BASELINE_Y - height}
              />
            );
          })}

          {[-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0].map((tickValue) => {
            const index = bins.findIndex((bin) => bin.rangeLow === tickValue);
            if (index === -1) {
              return null;
            }
            return (
              <text
                className="fill-muted-foreground text-[10px]"
                key={tickValue}
                textAnchor="middle"
                x={barX(index)}
                y={CHART_BASELINE_Y + 16}
              >
                {tickValue === 1.0
                  ? "100%+"
                  : `${tickValue > 0 ? "+" : ""}${Math.round(tickValue * 100)}%`}
              </text>
            );
          })}
          <text
            className="fill-muted-foreground text-[11px] font-medium"
            textAnchor="middle"
            x={(CHART_LEFT + CHART_RIGHT) / 2}
            y={CHART_BASELINE_Y + 34}
          >
            {empiricalChart.axes.x}
          </text>

          {anyOverrunX !== null && (
            <g>
              <line
                className="stroke-foreground/50"
                strokeDasharray="4 5"
                strokeWidth="1.5"
                x1={anyOverrunX}
                x2={anyOverrunX}
                y1={CHART_TOP}
                y2={CHART_BASELINE_Y}
              />
              <text
                className="fill-foreground text-[11px] font-medium"
                x={anyOverrunX + 6}
                y={CHART_TOP + 10}
              >
                {empiricalChart.thresholds.anyOverrun}
              </text>
            </g>
          )}
          {materialCreepX !== null && (
            <g>
              <line
                className="stroke-foreground/50"
                strokeDasharray="4 5"
                strokeWidth="1.5"
                x1={materialCreepX}
                x2={materialCreepX}
                y1={CHART_TOP}
                y2={CHART_BASELINE_Y}
              />
              <text
                className="fill-foreground text-[11px] font-medium"
                x={materialCreepX + 6}
                y={CHART_TOP + 24}
              >
                {empiricalChart.thresholds.materialCreep}
              </text>
            </g>
          )}
        </svg>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm bg-muted-foreground/25"
            />
            {empiricalChart.legend.onPlan}
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/45"
            />
            {empiricalChart.legend.anyOverrun}
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm bg-primary"
            />
            {empiricalChart.legend.materialCreep}
          </li>
        </ul>

        <p className="mt-3 text-xs text-muted-foreground/70">{empiricalChart.sourceNote}</p>
      </figure>
    </div>
  );
}
