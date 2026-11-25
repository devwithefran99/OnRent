"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  Loader2,
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
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
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

const roles: Role[] = ["customer", "owner", "admin"];

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
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const changeRole = async (user: AdminUser, role: Role) => {
    if (role === user.role) return;

    setUpdatingId(user.id);

    try {
      await apiFetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      setItems((current) =>
        current.map((row) => (row.id === user.id ? { ...row, role } : row))
      );

      toast.success(`${user.name} is now ${role}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not change this role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-slate-200/70"
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Listings
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Bookings
                </th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Change role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleItems.map((user) => {
                const role = user.role ?? "customer";
                const RoleIcon = roleIcons[role] ?? UserRound;
                const isSelf = user.id === currentUserId;
                const busy = updatingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="align-middle hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-2 ring-slate-100">
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white">
                            {initials(user.name || "OnRent")}
                          </span>
                        )}

                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-semibold text-slate-900">
                            <span className="truncate">{user.name}</span>
                            {user.emailVerified && (
                              <BadgeCheck
                                size={14}
                                className="shrink-0 text-emerald-500"
                                aria-label="Email verified"
                              />
                            )}
                            {isSelf && (
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 break-all text-slate-600">
                        <Mail size={12} className="shrink-0 text-slate-400" />
                        {user.email}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          roleStyles[role]
                        )}
                      >
                        <RoleIcon size={11} />
                        {role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Package size={12} className="text-slate-400" />
                        {user.listings}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <CalendarDays size={12} className="text-slate-400" />
                        {user.bookings}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatJoined(user.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={role}
                          onChange={(event) =>
                            changeRole(user, event.target.value as Role)
                          }
                          disabled={isSelf || busy}
                          aria-label={`Change role for ${user.name}`}
                          title={
                            isSelf
                              ? "You cannot change your own role"
                              : undefined
                          }
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          {roles.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        {busy && (
                          <Loader2
                            size={14}
                            className="animate-spin text-slate-400"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
