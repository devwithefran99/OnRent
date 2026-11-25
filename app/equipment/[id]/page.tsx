import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Star,
  Store,
  Tag,
  XCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import FavoriteButton from "@/components/equipment/FavoriteButton";
import BookingForm from "@/components/equipment/BookingForm";
import { type Equipment } from "@/lib/data/equipment";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function getEquipment(id: string): Promise<Equipment | null> {
  try {
    const response = await fetch(`${API_URL}/api/equipment/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { item?: Equipment };
    return data.item ?? null;
  } catch {
    return null;
  }
}

function initials(name?: string) {
  return (name || "OnRent")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getEquipment(id);

  if (!item) {
    return { title: "Equipment Not Found | OnRent" };
  }

  return {
    title: `${item.name} for Rent in ${item.location} | OnRent`,
    description: `Rent a ${item.name} (${item.category}) in ${item.location} for ৳${item.price.toLocaleString("en-BD")} per ${item.rentalType.toLowerCase()}.`,
  };
}

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // P3: equipment details are private. Guests are sent to sign in first.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/signin?redirect=/equipment/${id}`);
  }

  const item = await getEquipment(id);

  if (!item) {
    notFound();
  }

  const details = [
    { icon: Tag, label: "Category", value: item.category },
    { icon: CalendarDays, label: "Rental type", value: item.rentalType },
    { icon: MapPin, label: "Location", value: item.location },
    {
      icon: item.available ? CheckCircle2 : XCircle,
      label: "Availability",
      value: item.available ? "Available now" : "Currently booked",
    },
    { icon: Tag, label: "Brand", value: item.brand || "OnRent verified" },
    {
      icon: CheckCircle2,
      label: "Condition",
      value: item.condition || "Good",
    },
  ];

  return (
    <main className="bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to all equipment
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-blue-600 shadow-sm backdrop-blur">
              {item.category}
            </span>

            <span
              className={
                item.available
                  ? "absolute right-4 top-4 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur"
                  : "absolute right-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-semibold text-orange-400 shadow-sm backdrop-blur"
              }
            >
              {item.available ? "Available" : "Currently booked"}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Star size={15} className="fill-orange-500 text-orange-500" />
              <span className="font-semibold text-slate-900">
                {item.rating.toFixed(1)}
              </span>
              <span>({item.reviews} reviews)</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {item.name}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={15} className="shrink-0 text-blue-500" />
              {item.location}
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {item.description ||
                `A ${item.category.toLowerCase()} available for ${item.rentalType.toLowerCase()} rental in ${item.location}. Book directly from a verified owner and get it delivered to your site.`}
            </p>

            {item.ownerName && (
              <p className="mt-3 text-xs font-medium text-slate-400">
                Listed by {item.ownerName}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Rental price</p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  ৳{item.price.toLocaleString("en-BD")}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    / {item.rentalType.toLowerCase()}
                  </span>
                </p>
              </div>

              <div className="flex items-end">
                <FavoriteButton equipmentId={item.id} />
              </div>
            </div>

            <BookingForm
              equipmentId={item.id}
              price={item.price}
              rentalType={item.rentalType}
              availableQuantity={
                item.availableQuantity ?? (item.available ? 1 : 0)
              }
            />

            <Link
              href="/equipment"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              Browse more equipment
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-slate-900">
            Equipment details
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Icon size={14} className="text-blue-500" />
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Owner information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Store size={18} className="text-blue-600" />
              Owner information
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                {initials(item.ownerName)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span className="truncate">
                    {item.ownerName || "OnRent verified owner"}
                  </span>
                  <BadgeCheck size={15} className="shrink-0 text-blue-500" />
                </p>

                <p className="truncate text-xs text-slate-500">
                  {item.ownerEmail || "Contact this owner through OnRent"}
                </p>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Verified owner
              </span>
            </div>

            {item.ownerEmail && (
              <a
                href={`mailto:${item.ownerEmail}`}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
              >
                <Mail size={15} />
                Email owner
              </a>
            )}
          </div>

          {/* Rental terms */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FileText size={18} className="text-blue-600" />
              Rental terms &amp; conditions
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {item.terms?.trim() ||
                "The owner has not added extra terms. Standard OnRent rules apply: return the equipment in the same condition, on the agreed date, and report any damage before handover."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
