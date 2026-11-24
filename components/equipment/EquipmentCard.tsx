import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { Equipment } from "@/lib/data/equipment";
import { cn } from "@/lib/utils";

const EquipmentCard = ({ item }: { item: Equipment }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-blue-600 shadow-sm backdrop-blur">
          {item.category}
        </span>

        {/* Availability status */}
        <span
          className={cn(
            "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur",
            item.available
              ? "bg-emerald-500/90 text-white"
              : "bg-slate-950/85 text-orange-400"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              item.available ? "bg-white" : "bg-orange-400"
            )}
          />
          {item.available ? "Available" : "Currently booked"}
        </span>

        {/* Rental type */}
        <span className="absolute bottom-4 left-4 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {item.rentalType} rental
        </span>

        {/* Rating */}
        {item.reviews > 0 && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star size={12} className="fill-orange-500 text-orange-500" />
            {item.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-600">
          {item.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="shrink-0 text-blue-500" />
          <span>{item.location}</span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Rental price</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              ৳{item.price.toLocaleString("en-BD")}
              <span className="ml-1 text-xs font-normal text-slate-500">
                / {item.rentalType.toLowerCase()}
              </span>
            </p>
          </div>

          <p className="text-xs text-slate-400">{item.reviews} reviews</p>
        </div>

        <Link
          href={`/equipment/${item.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          View Details
          <ArrowRight
            size={16}
            className="transition duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
};

export default EquipmentCard;
