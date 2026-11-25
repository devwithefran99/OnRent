"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  categories,
  rentalTypes,
  type Equipment,
} from "@/lib/data/equipment";

type FormState = {
  name: string;
  category: string;
  location: string;
  price: string;
  rentalType: string;
  quantity: string;
  image: string;
  description: string;
  brand: string;
  model: string;
  condition: string;
  terms: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

export default function EquipmentForm({
  mode,
  equipmentId,
  initial,
}: {
  mode: "create" | "edit";
  equipmentId?: string;
  initial?: Partial<Equipment>;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    category: initial?.category ?? categories[0],
    location: initial?.location ?? "",
    price: initial?.price ? String(initial.price) : "",
    rentalType: initial?.rentalType ?? rentalTypes[0],
    quantity: initial?.quantity ? String(initial.quantity) : "1",
    image: initial?.image ?? "",
    description: initial?.description ?? "",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    condition: initial?.condition ?? "Good",
    terms: initial?.terms ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [categoryOptions, setCategoryOptions] =
    useState<string[]>(categories);

  // Owners get the latest category list from the database.
  useEffect(() => {
    let active = true;

    apiFetch<{ items: { name: string }[] }>("/api/categories")
      .then((data) => {
        if (!active) return;

        const names = data.items.map((item) => item.name);

        if (names.length === 0) return;

        setCategoryOptions(names);
        setForm((current) =>
          names.includes(current.category)
            ? current
            : { ...current, category: names[0] }
        );
      })
      .catch(() => {
        // API unreachable? Keep the default category list.
      });

    return () => {
      active = false;
    };
  }, []);

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.location.trim() || !form.image.trim()) {
      toast.error("Name, location and image URL are required.");
      return;
    }

    if (Number(form.price) <= 0 || Number(form.quantity) <= 0) {
      toast.error("Price and quantity must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const body = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        availableQuantity: Number(form.quantity),
      };

      if (mode === "edit" && equipmentId) {
        await apiFetch(`/api/equipment/${equipmentId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        toast.success("Equipment updated");
      } else {
        await apiFetch("/api/equipment", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Equipment submitted for admin approval");
      }

      router.push("/dashboard/equipment");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save equipment"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "edit" ? "Edit equipment" : "Equipment details"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "edit"
                ? "Update your listing information."
                : "New listings are reviewed by an admin before going live."}
            </p>
          </div>

          <Link
            href="/dashboard/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Equipment name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. Mini Excavator"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={update("category")}
              className={inputClass}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rentalType" className={labelClass}>
              Rental type
            </label>
            <select
              id="rentalType"
              value={form.rentalType}
              onChange={update("rentalType")}
              className={inputClass}
            >
              {rentalTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              value={form.location}
              onChange={update("location")}
              placeholder="e.g. Chattogram"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price (৳ per {form.rentalType.toLowerCase()})
            </label>
            <input
              id="price"
              type="number"
              min={1}
              value={form.price}
              onChange={update("price")}
              placeholder="e.g. 2500"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className={labelClass}>
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={update("quantity")}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="condition" className={labelClass}>
              Condition
            </label>
            <select
              id="condition"
              value={form.condition}
              onChange={update("condition")}
              className={inputClass}
            >
              {["Excellent", "Good", "Fair"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className={labelClass}>
              Brand (optional)
            </label>
            <input
              id="brand"
              value={form.brand}
              onChange={update("brand")}
              placeholder="e.g. Caterpillar"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="model" className={labelClass}>
              Model (optional)
            </label>
            <input
              id="model"
              value={form.model}
              onChange={update("model")}
              placeholder="e.g. 305E2"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="image" className={labelClass}>
              Image URL
            </label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={update("image")}
              placeholder="https://example.com/equipment.jpg"
              className={inputClass}
              required
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Paste a direct image link (imgbb or any public URL).
            </p>

            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt="Equipment preview"
                className="mt-3 h-44 w-full rounded-xl border border-slate-200 object-cover"
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={update("description")}
              rows={4}
              placeholder="Tell renters about the equipment, included accessories and delivery."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="terms" className={labelClass}>
              Rental terms (optional)
            </label>
            <textarea
              id="terms"
              value={form.terms}
              onChange={update("terms")}
              rows={3}
              placeholder="e.g. Valid ID required. Return in the same condition."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard/equipment"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              {mode === "edit" ? "Save changes" : "Submit equipment"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
