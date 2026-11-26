"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  LockKeyhole,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, type Booking } from "@/lib/data/bookings";

type PaymentConfig = {
  currency: string;
  bdtPerUsd: number;
  configured: boolean;
};

type SessionResponse = {
  sessionId: string;
  status: string;
  paymentStatus: string;
  amountTotal: number | null;
  currency: string;
  booking: Booking | null;
};

type VerifyState = "idle" | "checking" | "paid" | "pending" | "failed";

function formatTaka(value: number) {
  return `৳${Math.round(value).toLocaleString("en-BD")}`;
}

function formatCharge(amountMinor: number, currency: string) {
  const value = amountMinor / 100;
  const symbol =
    currency === "usd" ? "$" : currency === "bdt" ? "৳" : `${currency.toUpperCase()} `;

  return `${symbol}${value.toFixed(2)}`;
}

function rentalPeriodLabel(booking: Booking) {
  const unit =
    booking.rentalType === "Weekly"
      ? "week"
      : booking.rentalType === "Monthly"
        ? "month"
        : "day";

  return `${booking.units} ${unit}${booking.units === 1 ? "" : "s"}`;
}

function estimatedCharge(booking: Booking, config: PaymentConfig | null) {
  if (!config || !config.bdtPerUsd) return null;

  return Math.max(Math.round((booking.totalPrice / config.bdtPerUsd) * 100), 50);
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#f4f7fb] px-4 pb-16 pt-10 dark:bg-slate-950 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 right-[-8%] h-[380px] w-[380px] rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[360px] w-[360px] rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/10" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">{children}</div>
    </main>
  );
}

function LoadingCard({ label = "Loading your booking…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Loader2 size={30} className="animate-spin text-blue-600" />
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Booking summary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review the rental before you pay.
          </p>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
          Approved
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={booking.equipmentImage}
              alt={booking.equipmentName}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/equipment/${booking.equipmentId}`}
              className="block truncate text-base font-bold text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              {booking.equipmentName}
            </Link>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Owned by {booking.ownerName || "OnRent owner"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <CalendarDays size={12} /> Start date
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(booking.startDate)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <CalendarDays size={12} /> End date
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(booking.endDate)}
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">
              Unit price
            </dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {formatTaka(booking.unitPrice)} × {rentalPeriodLabel(booking)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Quantity</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {booking.quantity}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
            <dt className="font-semibold text-slate-900 dark:text-white">
              Total
            </dt>
            <dd className="text-lg font-bold text-slate-900 dark:text-white">
              {formatTaka(booking.totalPrice)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function CheckoutCard({
  booking,
  config,
  paying,
  error,
  onPay,
}: {
  booking: Booking;
  config: PaymentConfig | null;
  paying: boolean;
  error: string | null;
  onPay: () => void;
}) {
  const charge = estimatedCharge(booking, config);
  const currency = config?.currency ?? "usd";

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <CreditCard size={19} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Pay securely
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Stripe
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Amount due
        </p>
        <p className="mt-1 text-3xl font-bold">{formatTaka(booking.totalPrice)}</p>
        {charge !== null && (
          <p className="mt-1 text-xs text-slate-400">
            Charged as {formatCharge(charge, currency)} ({currency.toUpperCase()}
            ) — converted from BDT.
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onPay}
        disabled={paying || !config?.configured}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600 hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {paying ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Redirecting to Stripe…
          </>
        ) : (
          <>
            <LockKeyhole size={16} />
            Pay now
          </>
        )}
      </button>

      {config && !config.configured && (
        <p className="mt-3 text-center text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Online payments are not configured yet. Please contact support.
        </p>
      )}

      <ul className="mt-5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
        <li className="flex items-center gap-2">
          <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
          Card details are handled by Stripe, never by OnRent.
        </li>
        <li className="flex items-center gap-2">
          <BadgeCheck size={14} className="shrink-0 text-emerald-500" />
          Your booking is marked paid automatically after checkout.
        </li>
      </ul>

      <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-center text-[10px] text-slate-400 dark:border-slate-700">
        Testing? Use card 4242 4242 4242 4242 with any future expiry and CVC.
      </p>
    </section>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId =
    searchParams.get("bookingId") ?? searchParams.get("booking_id");
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");

  useEffect(() => {
    let active = true;

    apiFetch<PaymentConfig>("/api/payments/config")
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch(() => {
        // The checkout card simply hides the conversion note.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      const data = await apiFetch<{ items: Booking[] }>("/api/bookings/my");
      const items = data.items ?? [];

      if (!active) return;

      setBookings(items);

      if (bookingId) {
        const found = items.find((item) => item.id === bookingId) ?? null;
        setBooking(found);

        if (!found) {
          setError("We could not find that booking on your account.");
        }
      }
    }

    async function run() {
      try {
        if (status === "success" && sessionId) {
          setVerifyState("checking");

          try {
            const result = await apiFetch<SessionResponse>(
              `/api/payments/session/${encodeURIComponent(sessionId)}`
            );

            if (!active) return;

            if (result.booking) setBooking(result.booking);

            if (result.paymentStatus === "paid") {
              setVerifyState("paid");
            } else {
              setVerifyState("pending");
            }
          } catch (verifyError) {
            if (!active) return;

            setVerifyState("failed");
            setError(
              verifyError instanceof Error
                ? verifyError.message
                : "We could not verify this payment."
            );

            await loadBookings();
          }

          return;
        }

        await loadBookings();
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load your bookings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [bookingId, sessionId, status]);

  const handlePay = async () => {
    if (!booking) return;

    setPaying(true);
    setError(null);

    try {
      const data = await apiFetch<{
        url?: string;
        paid?: boolean;
        sessionId?: string;
      }>("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking.id }),
      });

      if (data.paid && data.sessionId) {
        router.push(
          `/payment?status=success&session_id=${encodeURIComponent(
            data.sessionId
          )}&booking_id=${encodeURIComponent(booking.id)}`
        );
        return;
      }

      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.href = data.url;
    } catch (payError) {
      setError(
        payError instanceof Error
          ? payError.message
          : "Could not start the payment."
      );
      setPaying(false);
    }
  };

  const payableBookings = (bookings ?? []).filter(
    (item) => item.status === "approved" && item.paymentStatus !== "paid"
  );

  const backHref = "/dashboard/rentals";

  const header = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to my rentals
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Secure checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Complete the payment for your approved rental.
        </p>
      </div>

      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
        <ShieldCheck size={13} />
        Stripe protected
      </span>
    </div>
  );

  if (verifyState === "paid") {
    return (
      <PageFrame>
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-500/30 dark:bg-slate-900">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-6 py-10 text-center text-white">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/10">
                <CheckCircle2 size={34} />
              </span>
              <h1 className="relative mt-4 text-2xl font-bold sm:text-3xl">
                Payment successful
              </h1>
              <p className="relative mt-2 text-sm text-emerald-50">
                Your rental is confirmed and your payment is recorded.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {booking ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={booking.equipmentImage}
                        alt={booking.equipmentName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900 dark:text-white">
                        {booking.equipmentName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(booking.startDate)} →{" "}
                        {formatDate(booking.endDate)}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-950/50">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">
                        Amount paid
                      </dt>
                      <dd className="font-bold text-slate-900 dark:text-white">
                        {formatTaka(booking.totalPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500 dark:text-slate-400">
                        Payment status
                      </dt>
                      <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Paid
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">
                        Transaction
                      </dt>
                      <dd className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                        {booking.transactionId ?? sessionId}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your payment was received. Open My Rentals to see the updated
                  booking.
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/dashboard/rentals"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  View my rentals
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/equipment"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Browse equipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageFrame>
    );
  }

  if (loading || verifyState === "checking") {
    return (
      <PageFrame>
        {header}
        <LoadingCard
          label={
            verifyState === "checking"
              ? "Verifying your payment…"
              : "Loading your booking…"
          }
        />
      </PageFrame>
    );
  }

  if (verifyState === "pending") {
    return (
      <PageFrame>
        {header}
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-500/30 dark:bg-slate-900">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
            <Clock3 size={26} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Payment is processing
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Stripe has not confirmed the payment yet. This usually takes a few
            seconds. Refresh in a moment and we will update your booking.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            <RefreshCw size={15} />
            Check again
          </button>
        </div>
      </PageFrame>
    );
  }

  if (!booking) {
    return (
      <PageFrame>
        {header}

        {error ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
              <XCircle size={26} />
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              We could not open this checkout
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {error}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                href="/dashboard/rentals"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Go to my rentals
              </Link>
              <Link
                href="/signin?redirect=/payment"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign in again
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <PackageOpen size={19} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Choose a booking to pay
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Only approved and unpaid rentals appear here.
                </p>
              </div>
            </div>

            {payableBookings.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-slate-700">
                <Sparkles size={22} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Nothing to pay right now
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-6 text-slate-500 dark:text-slate-400">
                  Once an owner approves your booking request, it will show up
                  here so you can complete the payment.
                </p>
                <Link
                  href="/dashboard/rentals"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  View my rentals
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {payableBookings.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={item.equipmentImage}
                          alt={item.equipmentName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {item.equipmentName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(item.startDate)} →{" "}
                          {formatDate(item.endDate)} ·{" "}
                          {formatTaka(item.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/payment?bookingId=${item.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
                    >
                      Pay now
                      <ArrowRight size={13} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </PageFrame>
    );
  }

  if (booking.paymentStatus === "paid") {
    return (
      <PageFrame>
        {header}
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-500/30 dark:bg-slate-900">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
            <CheckCircle2 size={26} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            This booking is already paid
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            No further payment is needed. You can track the rental from your
            dashboard.
          </p>
          <Link
            href="/dashboard/rentals"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            View my rentals
            <ArrowRight size={15} />
          </Link>
        </div>
      </PageFrame>
    );
  }

  if (booking.status !== "approved") {
    return (
      <PageFrame>
        {header}
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-500/30 dark:bg-slate-900">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
            <Clock3 size={26} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            This booking is not ready for payment
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            {booking.status === "pending"
              ? "The owner has not approved this request yet. You can pay as soon as it is approved."
              : `This booking is ${booking.status}, so it cannot be paid.`}
          </p>
          <Link
            href="/dashboard/rentals"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Back to my rentals
            <ArrowRight size={15} />
          </Link>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      {header}

      {status === "cancelled" && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <TriangleAlert size={17} className="mt-0.5 shrink-0" />
          Payment was cancelled. Your booking is still approved — you can pay
          whenever you are ready.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <BookingSummary booking={booking} />

        <div className="lg:sticky lg:top-24">
          <CheckoutCard
            booking={booking}
            config={config}
            paying={paying}
            error={error}
            onPay={handlePay}
          />

          <p className="mt-4 flex items-start gap-2 px-1 text-[11px] leading-5 text-slate-400">
            <LockKeyhole size={13} className="mt-0.5 shrink-0" />
            <span>
              Payments are processed securely by Stripe. OnRent never stores
              your card details.{" "}
              <Link
                href="/how-it-works"
                className="font-semibold underline hover:text-blue-600"
              >
                Learn how it works
              </Link>
            </span>
          </p>
        </div>
      </div>
    </PageFrame>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <LoadingCard label="Preparing secure checkout…" />
        </PageFrame>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
