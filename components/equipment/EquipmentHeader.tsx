import Link from "next/link";
import { ChevronRight, ShieldCheck, Clock, Truck } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, label: "Verified owners" },
  { icon: Clock, label: "Flexible rental terms" },
  { icon: Truck, label: "Delivery to your site" },
];

const EquipmentHeader = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-slate-200">Equipment</span>
        </nav>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-blue-400/40 bg-blue-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
              Marketplace
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              All Equipment <span className="text-blue-400">for Rent</span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Browse verified listings from trusted owners across Bangladesh.
              Compare daily rates, check availability, and book in minutes.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur"
              >
                <Icon size={15} className="text-orange-500" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EquipmentHeader;
