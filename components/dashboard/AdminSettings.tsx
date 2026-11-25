"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Coins,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Settings2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

type Settings = {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  defaultRentalTerms: string;
  autoApproveListings: boolean;
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const currencies = ["BDT", "USD", "EUR", "GBP", "INR"];

export default function AdminSettings() {
  const [form, setForm] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch<{ settings: Settings }>("/api/admin/settings")
      .then((data) => {
        if (active) setForm(data.settings);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load settings."
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

  const update = (field: keyof Settings, value: string | boolean) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    if (!form.siteName.trim()) {
      toast.error("Site name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supportEmail.trim())) {
      toast.error("Support email is not valid.");
      return;
    }

    setSaving(true);

    try {
      const data = await apiFetch<{ settings: Settings }>(
        "/api/admin/settings",
        {
          method: "PATCH",
          body: JSON.stringify({
            siteName: form.siteName.trim(),
            supportEmail: form.supportEmail.trim(),
            supportPhone: form.supportPhone.trim(),
            address: form.address.trim(),
            currency: form.currency,
            defaultRentalTerms: form.defaultRentalTerms.trim(),
            autoApproveListings: form.autoApproveListings,
          }),
        }
      );

      setForm(data.settings);
      toast.success("Platform settings saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save the settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl bg-slate-200/70"
          />
        ))}
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
        <RefreshCw size={26} className="text-red-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Could not load settings
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {error ?? "Something went wrong."}
        </p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError(null);
            setReloadKey((key) => key + 1);
          }}
          className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            General information
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          These details appear across the marketplace and in support messages.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="siteName" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" />
                Site name
              </span>
            </label>
            <input
              id="siteName"
              value={form.siteName}
              onChange={(event) => update("siteName", event.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="currency" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Coins size={14} className="text-slate-400" />
                Currency
              </span>
            </label>
            <select
              id="currency"
              value={form.currency}
              onChange={(event) => update("currency", event.target.value)}
              className={inputClass}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="supportEmail" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" />
                Support email
              </span>
            </label>
            <input
              id="supportEmail"
              type="email"
              value={form.supportEmail}
              onChange={(event) => update("supportEmail", event.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="supportPhone" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" />
                Support phone
              </span>
            </label>
            <input
              id="supportPhone"
              value={form.supportPhone}
              onChange={(event) => update("supportPhone", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                Business address
              </span>
            </label>
            <input
              id="address"
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Rental defaults */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Rental defaults
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Used as the default terms and listing approval behaviour for new
          equipment.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="defaultRentalTerms" className={labelClass}>
              Default rental terms &amp; conditions
            </label>
            <textarea
              id="defaultRentalTerms"
              value={form.defaultRentalTerms}
              onChange={(event) =>
                update("defaultRentalTerms", event.target.value)
              }
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Auto-approve new listings
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                When enabled, owner listings go live immediately instead of
                waiting for admin review.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={form.autoApproveListings}
              onClick={() =>
                update("autoApproveListings", !form.autoApproveListings)
              }
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition",
                form.autoApproveListings
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {form.autoApproveListings ? (
                <ToggleRight size={16} />
              ) : (
                <ToggleLeft size={16} />
              )}
              {form.autoApproveListings ? "On" : "Off"}
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              Save settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
