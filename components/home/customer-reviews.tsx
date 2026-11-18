"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck } from "lucide-react";

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

        {/* Review Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
            >
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
                    <BadgeCheck
                      size={16}
                      className="shrink-0 text-blue-500"
                    />
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {review.role} · {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;
