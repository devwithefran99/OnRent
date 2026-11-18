"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Wallet,
  CalendarCheck,
  Truck,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: BadgeCheck,
    title: "Verified Quality",
    description:
      "Every listing is inspected and verified before it goes live, so you know exactly what you are renting.",
  },
  {
    id: 2,
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "No hidden fees or surprise charges. The price you see is the price you pay, every single time.",
  },
  {
    id: 3,
    icon: CalendarCheck,
    title: "Flexible Rentals",
    description:
      "Rent by the day, week, or month. Extend your booking or return early whenever your project changes.",
  },
  {
    id: 4,
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Equipment delivered to your site on time, anywhere in Chattogram and across Bangladesh.",
  },
  {
    id: 5,
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Real people, ready to help before, during, and after your rental. No bots, no long waits.",
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: "Secure Booking",
    description:
      "Your payments and personal details are protected end to end with trusted payment partners.",
  },
];

const stats = [
  { id: 1, value: "500+", label: "Equipment Listed" },
  { id: 2, value: "1.2k+", label: "Happy Renters" },
  { id: 3, value: "30+", label: "Categories" },
  { id: 4, value: "24/7", label: "Customer Support" },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="bg-slate-50 py-16 md:py-24">
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
            Why Choose Us
          </span>

          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Rent Smarter with <span className="text-blue-500">OnRent</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            We take the hassle out of equipment rental so you can focus on
            getting the job done — on time and on budget.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ id, icon: Icon, title, description }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition duration-300 group-hover:bg-blue-500 group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900 transition group-hover:text-blue-500">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 grid grid-cols-2 gap-5 rounded-2xl bg-slate-900 p-8 sm:p-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
