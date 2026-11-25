"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { isValidImageUrl } from "@/lib/validation";
import { cn } from "@/lib/utils";

type CategoryItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

export default function AdminCategories() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: CategoryItem[] }>("/api/admin/categories")
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load categories."
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

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", image: "" });
    setShowForm(true);
  };

  const openEdit = (item: CategoryItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      image: item.image,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", description: "", image: "" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      toast.error("Please enter a category name.");
      return;
    }

    if (form.image.trim() && !isValidImageUrl(form.image)) {
      toast.error("Image must be a valid link starting with http.");
      return;
    }

    setSaving(true);

    try {
      await apiFetch(
        editingId
          ? `/api/admin/categories/${editingId}`
          : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify({
            name,
            description: form.description.trim(),
            image: form.image.trim(),
          }),
        }
      );

      toast.success(editingId ? "Category updated" : "Category created");
      closeForm();
      setReloadKey((key) => key + 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save the category."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (item: CategoryItem) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await apiFetch(`/api/admin/categories/${item.id}`, {
        method: "DELETE",
      });

      setItems((current) => current.filter((row) => row.id !== item.id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Tags size={19} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {items.length} {items.length === 1 ? "category" : "categories"}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Renaming updates every related equipment. A category can only be
              deleted when no equipment uses it.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={showForm ? closeForm : openCreate}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          {showForm ? (
            <>
              <X size={15} />
              Close form
            </>
          ) : (
            <>
              <Plus size={15} />
              Add category
            </>
          )}
        </button>
      </div>

      {/* Add / edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-bold text-slate-900">
            {editingId ? "Edit category" : "New category"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            The image is optional. Empty categories stay hidden on the home page
            until equipment is added.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category-name" className={labelClass}>
                Name
              </label>
              <input
                id="category-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Power Tools"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="category-image" className={labelClass}>
                Cover image URL (optional)
              </label>
              <input
                id="category-image"
                type="url"
                value={form.image}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image: event.target.value,
                  }))
                }
                placeholder="https://example.com/category.jpg"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="category-description" className={labelClass}>
                Short description (optional)
              </label>
              <input
                id="category-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="What kind of equipment belongs here?"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={15} />
                  {editingId ? "Save changes" : "Create category"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl bg-slate-200/70"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
          <RefreshCw size={26} className="text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Could not load categories
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

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Tags size={26} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No categories yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            Add your first category so owners can choose it when listing
            equipment.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={15} />
            Add category
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-36 bg-gradient-to-br from-slate-800 to-blue-900">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/40">
                    {item.name.charAt(0)}
                  </span>
                )}

                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm backdrop-blur">
                  {item.count} {item.count === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="p-4">
                <h3 className="truncate font-bold text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">
                  {item.description || "No description added yet."}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      item.count > 0 ? "text-emerald-600" : "text-slate-400"
                    )}
                  >
                    {item.count > 0
                      ? "In use by equipment"
                      : "Not used yet"}
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => removeCategory(item)}
                      disabled={item.count > 0 || deletingId === item.id}
                      title={
                        item.count > 0
                          ? "Move or delete the related equipment first"
                          : "Delete category"
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
