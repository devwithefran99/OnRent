"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient, getAccessToken } from "@/lib/auth-client";
import { isValidImageUrl } from "@/lib/validation";

type ProfileUser = {
  name: string;
  email: string;
  image: string | null;
  role: string;
  phone: string;
  address: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: user.name,
    image: user.image ?? "",
    phone: user.phone,
    address: user.address,
  });
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (form.image.trim() && !isValidImageUrl(form.image)) {
      toast.error("Photo must be a valid link starting with http.");
      return;
    }

    setSaving(true);

    const { error } = await authClient.updateUser({
      name: form.name.trim(),
      image: form.image.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });

    if (error) {
      setSaving(false);
      toast.error(error.message ?? "Could not update your profile.");
      return;
    }

    // Refresh the cached JWT so the Express API sees the new name.
    await getAccessToken({ force: true });

    toast.success("Profile updated successfully");
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Summary card */}
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        {form.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image}
            alt={form.name || "Profile photo"}
            className="mx-auto h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-100"
          />
        ) : (
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl font-bold text-white">
            {initials(form.name || "OnRent")}
          </span>
        )}

        <h2 className="mt-4 truncate text-lg font-bold text-slate-900">
          {form.name || "Your name"}
        </h2>

        <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-sm text-slate-500">
          <Mail size={14} />
          {user.email}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <ShieldCheck size={13} />
          {user.role}
        </span>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <UserRound size={13} />
            Account email
          </p>
          <p className="mt-1 truncate text-sm font-medium text-slate-900">
            {user.email}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Email change is disabled for security.
          </p>
        </div>
      </aside>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-lg font-bold text-slate-900">Personal details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your name, photo and contact information.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Your full name"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              value={user.email}
              disabled
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={update("phone")}
              placeholder="+880 1XXX-XXXXXX"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="image" className={labelClass}>
              Photo URL
            </label>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={update("image")}
              placeholder="https://example.com/your-photo.jpg"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Paste a direct image link. Leave empty to use your initials.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <textarea
              id="address"
              value={form.address}
              onChange={update("address")}
              rows={3}
              placeholder="House, road, city"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
