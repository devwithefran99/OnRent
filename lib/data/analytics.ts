/**
 * Pure helpers that turn a list of bookings into the numbers the dashboard
 * charts need. Nothing here talks to the API, so the existing endpoints and
 * booking logic stay untouched.
 */

export type AnalyticsBooking = {
  totalPrice?: number;
  status?: string;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  equipmentName?: string;
};

export type MonthPoint = {
  key: string;
  label: string;
  revenue: number;
  bookings: number;
};

export type BookingStatus = "pending" | "approved" | "rejected" | "completed";

export type BookingAnalytics = {
  months: MonthPoint[];
  statusCounts: Record<BookingStatus, number>;
  totalRevenue: number;
  totalBookings: number;
  currentMonthBookings: number;
  monthDelta: number;
  activeRentals: number;
  averageValue: number;
  topEquipment: { name: string; count: number; revenue: number }[];
  hasData: boolean;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const REVENUE_STATUSES = new Set(["approved", "completed"]);

export function buildBookingAnalytics(
  bookings: AnalyticsBooking[],
  monthCount = 6
): BookingAnalytics {
  const now = new Date();

  const months: MonthPoint[] = [];

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTH_LABELS[date.getMonth()],
      revenue: 0,
      bookings: 0,
    });
  }

  const monthIndex = new Map(months.map((month) => [month.key, month]));

  const statusCounts: Record<BookingStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  };

  const equipment = new Map<string, { count: number; revenue: number }>();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let totalRevenue = 0;
  let recognisedBookings = 0;
  let activeRentals = 0;

  for (const booking of bookings) {
    const status = (booking.status ?? "pending") as BookingStatus;

    if (status in statusCounts) {
      statusCounts[status] += 1;
    }

    const created = booking.createdAt ? new Date(booking.createdAt) : null;
    const isRevenue = REVENUE_STATUSES.has(status);
    const price = Number(booking.totalPrice) || 0;

    if (created && !Number.isNaN(created.getTime())) {
      const bucket = monthIndex.get(
        `${created.getFullYear()}-${created.getMonth()}`
      );

      if (bucket) {
        bucket.bookings += 1;

        if (isRevenue) {
          bucket.revenue += price;
        }
      }
    }

    if (isRevenue) {
      totalRevenue += price;
      recognisedBookings += 1;

      if (booking.equipmentName) {
        const entry = equipment.get(booking.equipmentName) ?? {
          count: 0,
          revenue: 0,
        };

        entry.count += 1;
        entry.revenue += price;
        equipment.set(booking.equipmentName, entry);
      }
    }

    if (status === "approved" && booking.endDate) {
      const end = new Date(booking.endDate);

      if (!Number.isNaN(end.getTime()) && end >= today) {
        activeRentals += 1;
      }
    }
  }

  const currentMonth = months[months.length - 1]?.bookings ?? 0;
  const previousMonth = months[months.length - 2]?.bookings ?? 0;

  const monthDelta =
    previousMonth === 0
      ? currentMonth > 0
        ? 100
        : 0
      : Math.round(((currentMonth - previousMonth) / previousMonth) * 100);

  return {
    months,
    statusCounts,
    totalRevenue,
    totalBookings: bookings.length,
    currentMonthBookings: currentMonth,
    monthDelta,
    activeRentals,
    averageValue:
      recognisedBookings > 0
        ? Math.round(totalRevenue / recognisedBookings)
        : 0,
    topEquipment: [...equipment.entries()]
      .map(([name, entry]) => ({ name, ...entry }))
      .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
      .slice(0, 4),
    hasData: bookings.length > 0,
  };
}

/** 125000 -> "125k", 1250000 -> "1.3M" — short labels for chart axes. */
export function compactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  }

  return String(Math.round(value));
}

export function formatTaka(value: number) {
  return `৳${Math.round(value).toLocaleString("en-BD")}`;
}
