"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";

const PopularEquipment = () => {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Equipment[] }>("/api/equipment?limit=50&sort=newest")
      .then((data) => {
        if (!active) return;

        // Highest rated first, then the most reviewed, then available items.
        const popular = data.items
          .filter((item) => item.available)
          .sort(
            (a, b) =>
              b.rating - a.rating ||
              b.reviews - a.reviews ||
              Number(b.available) - Number(a.available)
          )
          .slice(0, 4);

        setItems(popular);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-orange-500">
              <Flame size={15} />
              Popular Equipment
            </span>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Top Rated by <span className="text-blue-500">Renters</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              The most loved machines and gear on OnRent, ranked by real
              customer ratings.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex w-fit items-center gap-2 font-semibold text-blue-500 transition hover:text-orange-500"
          >
            View All Equipment
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[26rem] animate-pulse rounded-2xl border border-slate-200/80 bg-slate-200/70"
              />
            ))}
          </div>
        ) : error || items.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Flame size={26} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Popular items are loading in
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
              Browse the full marketplace to see every approved listing.
            </p>
            <Link
              href="/equipment"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Equipment
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularEquipment;
