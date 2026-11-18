
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Construction Equipment",
    description: "Heavy machinery for every construction project.",
    image:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "Photography Equipment",
    description: "Professional cameras and photography gear.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "Vehicles & Transportation",
    description: "Reliable vehicles for work and transportation.",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "Agriculture Equipment",
    description: "Modern tools for smarter farming.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: "Electronics",
    description: "Essential electronics for work and creativity.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: "Event Equipment",
    description: "Everything you need for memorable events.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=85",
  },
];

const Categories = () => {
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
      </div>
    </section>
  );
};

export default Categories;
