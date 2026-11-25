"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
};

type ApiCategory = {
  name: string;
  image: string;
  count: number;
};

// Short descriptions for the categories we already know.
const descriptions: Record<string, string> = {
  "Construction Equipment": "Heavy machinery for every construction project.",
  "Photography Equipment": "Professional cameras and photography gear.",
  "Vehicles & Transportation": "Reliable vehicles for work and transportation.",
  "Agriculture Equipment": "Modern tools for smarter farming.",
  Electronics: "Essential electronics for work and creativity.",
  "Event Equipment": "Everything you need for memorable events.",
};

// Used only if the API is unreachable, so the section never looks broken.
const fallbackCategories: Category[] = [
  {
    id: "Construction Equipment",
    name: "Construction Equipment",
    description: "Heavy machinery for every construction project.",
    image:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
  {
    id: "Photography Equipment",
    name: "Photography Equipment",
    description: "Professional cameras and photography gear.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
  {
    id: "Vehicles & Transportation",
    name: "Vehicles & Transportation",
    description: "Reliable vehicles for work and transportation.",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
  {
    id: "Agriculture Equipment",
    name: "Agriculture Equipment",
    description: "Modern tools for smarter farming.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
  {
    id: "Electronics",
    name: "Electronics",
    description: "Essential electronics for work and creativity.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
  {
    id: "Event Equipment",
    name: "Event Equipment",
    description: "Everything you need for memorable events.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=85",
    count: 0,
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=85";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: ApiCategory[] }>("/api/categories")
      .then((data) => {
        if (!active) return;

        setCategories(
          data.items.map((item) => ({
            id: item.name,
            name: item.name,
            description:
              descriptions[item.name] ??
              "Explore equipment available for rent in this category.",
            image: item.image || fallbackImage,
            count: item.count,
          }))
        );
      })
      .catch(() => {
        // Server down? Keep the homepage looking complete.
        if (active) setCategories(fallbackCategories);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Explore Categories
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Find Equipment for <span className="text-blue-600">Every Need</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore our wide range of equipment categories and find the
              right tools for your next project.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-orange-600"
          >
            Browse All Equipment
            <ArrowUpRight size={18} />
          </Link>
        </motion.div>

        {/* Category Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-slate-200/70 sm:h-72"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              No categories yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Categories will appear here when owners add equipment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(category.name)}`}
                  className="group relative block h-64 overflow-hidden rounded-2xl sm:h-72"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {category.count > 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm backdrop-blur">
                      {category.count}{" "}
                      {category.count === 1 ? "item" : "items"}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {category.name}
                      </h3>

                      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-200">
                        {category.description}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 transition duration-300 group-hover:bg-orange-600 group-hover:text-white">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
