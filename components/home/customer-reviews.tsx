"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck, Pause } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "Construction Contractor",
    location: "Chattogram",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    review:
      "I rented an excavator for a two-week site job. It arrived on time and in perfect condition. The whole process took less than ten minutes.",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "Wedding Photographer",
    location: "Dhaka",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    review:
      "The camera gear was spotless and the pricing was exactly what was shown online. No hidden charges, no surprises at pickup.",
  },
  {
    id: 3,
    name: "Rakib Hasan",
    role: "Event Organizer",
    location: "Sylhet",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    review:
      "Booked a full sound system for a three-day event. Support answered at 1 AM when we needed a replacement cable. Genuinely impressive.",
  },
  {
    id: 4,
    name: "Sadia Islam",
    role: "Furniture Business Owner",
    location: "Dhaka",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    review:
      "I needed a delivery truck at short notice for a furniture order. The owner confirmed within minutes and the truck arrived the same afternoon. Smooth, fair and reliable.",
  },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating
            ? "fill-orange-500 text-orange-500"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: (typeof reviews)[number] }) => (
  <article className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl">
    <Quote
      size={36}
      className="absolute right-5 top-5 fill-blue-50 text-blue-50 transition duration-300 group-hover:fill-blue-100 group-hover:text-blue-100"
    />

    <Stars rating={review.rating} />

    <p className="relative mt-4 flex-1 text-sm leading-7 text-gray-600">
      {review.review}
    </p>

    {/* Reviewer */}
    <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
      <Image
        src={review.image}
        alt={review.name}
        width={44}
        height={44}
        sizes="44px"
        className="h-11 w-11 rounded-full object-cover"
      />

      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <span className="truncate">{review.name}</span>
          <BadgeCheck size={16} className="shrink-0 text-blue-500" />
        </p>

        <p className="truncate text-xs text-gray-500">
          {review.role} · {review.location}
        </p>
      </div>
    </div>
  </article>
);

const CustomerReviews = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-blue-500">
              Customer Reviews
            </span>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Trusted by Renters{" "}
              <span className="text-blue-500">Across Bangladesh</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Real feedback from contractors, creators, and business owners who
              rent with OnRent every day.
            </p>
          </div>

          {/* Aggregate Rating */}
          <div className="flex w-fit items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-4xl font-bold text-slate-900">4.9</p>

            <div>
              <Stars rating={5} />

              <p className="mt-1.5 text-xs text-gray-500">
                Based on 1,200+ reviews
              </p>
            </div>
          </div>
        </motion.div>

        {/* Auto-scrolling review marquee */}
        <div
          className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8"
          role="region"
          aria-label="Customer reviews carousel"
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

          <div className="onrent-marquee flex w-max items-stretch py-2">
            {[...reviews, ...reviews].map((review, index) => {
              const isDuplicate = index >= reviews.length;

              return (
                <div
                  key={`${review.id}-${index}`}
                  aria-hidden={isDuplicate || undefined}
                  className="w-[calc(100vw-2rem)] shrink-0 pr-5 sm:w-[19rem] lg:w-[20rem] xl:w-[22rem]"
                >
                  <ReviewCard review={review} />
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Pause size={12} />
          Hover to pause · reviews scroll automatically
        </p>
      </div>
    </section>
  );
};

export default CustomerReviews;
