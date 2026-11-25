
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  ShieldCheck,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "We believe every rental should be simple, secure, and transparent for both equipment owners and customers.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We connect equipment owners and renters to build a reliable and supportive rental community.",
  },
  {
    icon: Zap,
    title: "Simplicity & Convenience",
    description:
      "Our platform makes finding, booking, and renting equipment easier than ever.",
  },
];

const reasons = [
  "Wide range of equipment categories",
  "Easy equipment search and booking",
  "Flexible rental periods",
  "Secure online payment experience",
  "Convenient platform for owners and renters",
  "Simple rental management system",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_45%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            About OnRent
          </span>

          <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Making Equipment Rental{" "}
            <span className="text-blue-400">Simple & Accessible</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            OnRent is an equipment rental marketplace designed to connect
            equipment owners with people who need the right tools and
            equipment for their projects.
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85"
                alt="Equipment and tools"
                className="h-[350px] w-full object-cover sm:h-[450px]"
              />
            </div>

            <div className="absolute -bottom-6 right-4 rounded-2xl bg-blue-600 p-6 text-white shadow-xl sm:right-8">
              <p className="text-3xl font-bold">OnRent</p>
              <p className="mt-1 text-sm text-blue-100">
                Rent smarter, work better.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="pt-5 lg:pt-0"
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Your Trusted Partner for Equipment Rentals
            </h2>

            <p className="mt-6 leading-8 text-slate-500">
              Finding the right equipment should not be complicated or
              expensive. OnRent provides a convenient marketplace where
              customers can discover equipment for their needs and owners
              can make their equipment available for rent.
            </p>

            <p className="mt-4 leading-8 text-slate-500">
              From construction tools to photography equipment, vehicles,
              electronics, and more, our goal is to make equipment rental
              accessible through one easy-to-use platform.
            </p>

            <Link
              href="/equipment"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Equipment
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              Our Purpose
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Mission & Vision
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Building a smarter and more accessible equipment rental
              experience for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-white p-8 shadow-sm sm:p-10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Target size={28} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-slate-500">
                Our mission is to simplify equipment rentals by creating
                a reliable platform where customers can easily find and
                rent equipment while owners can connect with potential
                renters and utilize their available resources.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-3xl bg-slate-950 p-8 shadow-sm sm:p-10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">
                <Eye size={28} />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                Our vision is to become a trusted equipment rental
                marketplace where people and businesses can access
                the equipment they need without the burden of ownership.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              What Matters to Us
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              The principles that guide our platform and rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group rounded-2xl border border-slate-200 p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              The OnRent Advantage
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose OnRent?
            </h2>

            <p className="mt-5 leading-8 text-slate-500">
              We focus on making equipment rental convenient for everyone.
              Whether you need equipment or want to rent out your own,
              OnRent brings the experience together in one place.
            </p>

            <div className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3">
                  <CheckCircle2
                    size={21}
                    className="shrink-0 text-blue-600"
                  />
                  <p className="text-sm font-medium text-slate-700 sm:text-base">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85"
              alt="Construction equipment at work"
              className="h-[350px] w-full object-cover sm:h-[460px]"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-blue-600 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s Make Your Next Project Easier
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Discover the equipment you need and experience a smarter
            way to rent with OnRent.
          </p>

          <Link
            href="/equipment"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white keep-light px-7 py-3.5 font-semibold text-blue-600 transition hover:bg-orange-600 hover:text-white"
          >
            Browse Equipment
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}
