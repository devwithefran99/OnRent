
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Headphones,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find Your Equipment",
    description:
      "Explore our wide collection of equipment and find exactly what you need for your project.",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  {
    number: "02",
    title: "Choose & Book",
    description:
      "Select your preferred equipment, choose rental dates, and submit your booking request.",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
  },
  {
    number: "03",
    title: "Make Secure Payment",
    description:
      "Complete your rental payment securely through our trusted Stripe payment gateway.",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600",
  },
  {
    number: "04",
    title: "Get Your Equipment",
    description:
      "Receive your booked equipment and get started with your work or project.",
    icon: Truck,
    color: "bg-orange-100 text-orange-600",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description: "Connect with verified equipment owners.",
  },
  {
    icon: Clock,
    title: "Flexible Rentals",
    description: "Choose daily, weekly, or monthly rentals.",
  },
  {
    icon: Headphones,
    title: "Easy Experience",
    description: "Enjoy a simple and convenient rental process.",
  },
];

const HowItWorks = () => {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_45%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Simple. Smart. Convenient.
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Renting Equipment Has Never Been{" "}
            <span className="text-blue-400">Easier</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            From finding the right equipment to completing your booking,
            OnRent makes the entire rental journey simple and hassle-free.
          </p>

          <Link
            href="/equipment"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Equipment
            <ArrowRight size={19} />
          </Link>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              The Process
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              How OnRent Works
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Getting the equipment you need is just four simple steps.
              Start your rental journey with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
                    >
                      <Icon size={27} />
                    </div>

                    <span className="text-4xl font-bold text-slate-100 transition group-hover:text-blue-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-20 group-hover:bg-orange-600" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
                Why OnRent
              </p>

              <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                A Better Way to Rent Equipment
              </h2>

              <p className="mt-5 leading-8 text-slate-500">
                We bring equipment owners and customers together through
                a convenient rental marketplace. Find what you need,
                book with confidence, and focus on what matters most.
              </p>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-orange-600"
              >
                Learn More About Us
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="space-y-5">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                    }}
                    className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center sm:px-12 md:py-20"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
            Find the right equipment for your next project.
            Explore our collection and start renting today.
          </p>

          <Link
            href="/equipment"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 transition hover:bg-orange-600 hover:text-white"
          >
            Browse Equipment
            <ArrowRight size={19} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default HowItWorks;
