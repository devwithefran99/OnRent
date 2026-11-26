"use client";

import { useId, useState } from "react";
import type { MonthPoint } from "@/lib/data/analytics";

type Props = {
  data: MonthPoint[];
  accent: string;
  accentTo: string;
};

const WIDTH = 640;
const HEIGHT = 230;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 18;
const PAD_BOTTOM = 32;

/** Monthly booking volume as rounded bars. */
export default function BookingsBarChart({ data, accent, accentTo }: Props) {
  const rawId = useId();
  const gradientId = `bars-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [hover, setHover] = useState<number | null>(null);

  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const slot = data.length > 0 ? innerWidth / data.length : innerWidth;
  const barWidth = Math.min(slot * 0.46, 46);

  const maxValue = Math.max(...data.map((point) => point.bookings), 1);
  const topValue = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const ticks = [0, 0.5, 1];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Bookings for the last six months"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={accentTo} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {ticks.map((ratio) => {
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
                {Math.round(topValue * (1 - ratio))}
              </text>
            </g>
          );
        })}

        {data.map((point, index) => {
          const height = (point.bookings / topValue) * innerHeight;
          const x = PAD_LEFT + index * slot + (slot - barWidth) / 2;
          const y = PAD_TOP + innerHeight - height;
          const isHovered = hover === index;

          return (
            <g
              key={point.key}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              <rect
                x={PAD_LEFT + index * slot}
                y={PAD_TOP}
                width={slot}
                height={innerHeight}
                fill="transparent"
              />
              <rect
                x={x}
                y={height > 0 ? y : PAD_TOP + innerHeight - 2}
                width={barWidth}
                height={height > 0 ? height : 2}
                rx={8}
                fill={`url(#${gradientId})`}
                opacity={isHovered || hover === null ? 1 : 0.55}
                className="transition-opacity"
              />
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="chart-tick fill-slate-400 dark:fill-slate-500"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          style={{
            left: `${((PAD_LEFT + hover * slot + slot / 2) / WIDTH) * 100}%`,
            top: "28%",
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {data[hover].label}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {data[hover].bookings} booking
            {data[hover].bookings === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </div>
  );
}
