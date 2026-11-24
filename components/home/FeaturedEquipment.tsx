
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";

const FeaturedEquipment = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Equipment[] }>("/api/equipment/featured")
      .then((data) => {
        if (active) setEquipmentList(data.items);
      })
      .catch(() => {
        if (active) setEquipmentList([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-blue-500">
              Explore Our Collection
            </span>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured <span className="text-blue-500">Equipment</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover quality equipment available for rent.
              Find the right tools and machines for your next project.
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

        {/* Equipment Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentList.map((equipment, index) => (
              <motion.div
                key={equipment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Equipment Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
                    {equipment.category}
                  </span>
                </div>

                {/* Equipment Information */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-500">
                    {equipment.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="shrink-0 text-blue-500" />
                    <span>{equipment.location}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Rental Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ৳{equipment.price.toLocaleString("en-BD")}
                        <span className="text-xs font-normal text-gray-500">
                          {" "}/ {equipment.rentalType}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={14} />
                      Flexible
                    </div>
                  </div>

                  <Link
                    href={`/equipment/${equipment.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedEquipment;
