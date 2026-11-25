"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  PackageSearch,
} from "lucide-react";

const steps = [
  {
    id: "01",
    icon: PackageSearch,
    title: "Find the right equipment",
    description:
      "Search by name, category or location and compare verified listings from trusted owners near you.",
  },
  {
    id: "02",
    icon: CalendarCheck,
    title: "Book your dates",
    description:
      "Pick your rental dates and quantity. See the full price instantly before you send the request.",
  },
  {
    id: "03",
    icon: CreditCard,
    title: "Pay and get to work",
    description:
      "Complete a secure online payment and the owner delivers the equipment to your site on time.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-blue-500">
            How It Works
          </span>

          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            From Search to Site in{" "}
            <span className="text-blue-500">Three Steps</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            Renting equipment should be as easy as ordering online. Here is how
            OnRent keeps it simple.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connector line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-16 hidden border-t-2 border-dashed border-blue-100 md:block"
          />

          {steps.map(({ id, icon: Icon, title, description }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl sm:p-8"
            >
              <span className="absolute right-5 top-4 text-3xl font-black text-slate-100">
                {id}
              </span>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <Icon size={26} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/equipment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-orange-600 hover:shadow-orange-600/20 sm:w-auto"
          >
            Browse Equipment
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/signup"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 sm:w-auto"
          >
            List Your Equipment
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
