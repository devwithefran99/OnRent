"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  Mail,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

type Role = "customer" | "owner" | "admin";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  listings: number;
  bookings: number;
};

const filters = [
  { value: "all", label: "All users" },
  { value: "customer", label: "Customers" },
  { value: "owner", label: "Owners" },
  { value: "admin", label: "Admins" },
] as const;

type Filter = (typeof filters)[number]["value"];

const roleStyles: Record<Role, string> = {
  admin: "border-violet-200 bg-violet-50 text-violet-600",
  owner: "border-orange-200 bg-orange-50 text-orange-600",
  customer: "border-blue-200 bg-blue-50 text-blue-600",
};

const roleIcons: Record<Role, typeof Users> = {
  admin: ShieldCheck,
  owner: Store,
  customer: UserRound,
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatJoined(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsers() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: AdminUser[] }>("/api/admin/users")
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load users."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  const counts = {
    all: items.length,
    customer: items.filter((user) => user.role === "customer").length,
    owner: items.filter((user) => user.role === "owner").length,
    admin: items.filter((user) => user.role === "admin").length,
  };

  const term = search.trim().toLowerCase();
  const visibleItems = items.filter((user) => {
    if (filter !== "all" && user.role !== filter) return false;

    if (!term) return true;

    return `${user.name} ${user.email}`.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-5">
      {/* Filters + search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                filter === item.value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
              )}
            >
              {item.label}
              <span
                className={cn(
                  "ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  filter === item.value
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {counts[item.value]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
          <RefreshCw size={26} className="text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Could not load users
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Users size={26} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No users found
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            {term
              ? "Try a different name or email."
              : "There are no accounts in this role yet."}
          </p>
        </div>
      )}

      {!loading && !error && visibleItems.length > 0 && (
        <div className="space-y-3">
          {visibleItems.map((user) => {
            const role = user.role ?? "customer";
            const RoleIcon = roleIcons[role] ?? UserRound;

            return (
              <article
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {user.image ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-2 ring-slate-100">
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                    {initials(user.name || "OnRent")}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-slate-900">
                      {user.name}
                    </p>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        roleStyles[role]
                      )}
                    >
                      <RoleIcon size={11} />
                      {role}
                    </span>

                    {user.emailVerified && (
                      <BadgeCheck
                        size={15}
                        className="text-emerald-500"
                        aria-label="Email verified"
                      />
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-slate-500">
                    <Mail size={12} className="shrink-0" />
                    {user.email}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={12} />
                    Joined {formatJoined(user.createdAt)}
                  </p>
                </div>

                {/* Counts */}
                <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-56">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      <Package size={11} />
                      Listings
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-slate-900">
                      {user.listings}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      <CalendarDays size={11} />
                      Bookings
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-slate-900">
                      {user.bookings}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
