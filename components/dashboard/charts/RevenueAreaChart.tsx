"use client";

import { useId, useState } from "react";
import {
  compactCurrency,
  formatTaka,
  type MonthPoint,
} from "@/lib/data/analytics";

type Props = {
  data: MonthPoint[];
  accent: string;
  accentTo: string;
};

const WIDTH = 640;
const HEIGHT = 250;
const PAD_LEFT = 52;
const PAD_RIGHT = 16;
const PAD_TOP = 18;
const PAD_BOTTOM = 34;

function niceCeil(value: number) {
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const normalized = value / base;

  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

  return step * base;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const midX = (previous.x + current.x) / 2;

    path += ` C ${midX} ${previous.y}, ${midX} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

/** Revenue trend for the last months, drawn as a gradient area chart. */
export default function RevenueAreaChart({ data, accent, accentTo }: Props) {
  const rawId = useId();
  const gradientId = `revenue-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [hover, setHover] = useState<number | null>(null);

  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const maxValue = Math.max(...data.map((point) => point.revenue), 1);
  const topValue = Math.max(niceCeil(maxValue), 1000);

  const points = data.map((point, index) => ({
    ...point,
    x: PAD_LEFT + index * stepX,
    y: PAD_TOP + innerHeight - (point.revenue / topValue) * innerHeight,
  }));

  const line = smoothPath(points);
  const area = `${line} L ${PAD_LEFT + innerWidth} ${PAD_TOP + innerHeight} L ${PAD_LEFT} ${PAD_TOP + innerHeight} Z`;
  const active = hover !== null ? points[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Revenue for the last six months"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accentTo} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = PAD_TOP + innerHeight * ratio;

          return (
            <g key={ratio}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeDasharray="4 6"
                className="text-slate-500"
              />
              <text
                x={PAD_LEFT - 10}
                y={y + 4}
                textAnchor="end"
                className="chart-tick fill-slate-400 dark:fill-slate-500"
              >
                {compactCurrency(topValue * (1 - ratio))}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={accent}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {points.map((point, index) => (
          <g key={point.key}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hover === index ? 5 : 3}
              fill="#fff"
              stroke={accent}
              strokeWidth={2.5}
              className="transition-all"
            />
            <text
              x={point.x}
              y={HEIGHT - 10}
              textAnchor="middle"
              className="chart-tick fill-slate-400 dark:fill-slate-500"
            >
              {point.label}
            </text>
            <rect
              x={point.x - stepX / 2}
              y={PAD_TOP}
              width={stepX}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        ))}

        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={PAD_TOP}
            y2={PAD_TOP + innerHeight}
            stroke={accent}
            strokeOpacity={0.35}
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[120%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900"
          style={{
            left: `${(active.x / WIDTH) * 100}%`,
            top: `${(active.y / HEIGHT) * 100}%`,
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {active.label}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {formatTaka(active.revenue)}
          </p>
          <p className="text-[11px] text-slate-500">
            {active.bookings} booking{active.bookings === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </div>
  );
}
