"use client";

type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  centerLabel: string;
};

const SIZE = 200;
const RADIUS = 72;
const STROKE = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Booking status split as a donut with a legend. */
export default function StatusDonut({ segments, centerLabel }: Props) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-[170px] w-[170px]"
          role="img"
          aria-label="Booking status breakdown"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-slate-100 dark:text-slate-800"
          />

          {total > 0 &&
            segments.map((segment) => {
              if (segment.value === 0) return null;

              const length = (segment.value / total) * CIRCUMFERENCE;
              const dashOffset = -offset;

              offset += length;

              return (
                <circle
                  key={segment.label}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max(length - 3, 0)} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  className="transition-all duration-500"
                />
              );
            })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {centerLabel}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-2 sm:w-auto sm:min-w-[120px]">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {segment.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
