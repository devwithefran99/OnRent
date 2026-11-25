"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Rent the Right Equipment. Get Every Job Done.",
    description:
      "Find and rent quality equipment from trusted owners. Make your projects easier with simple, affordable, and flexible equipment rentals.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 2,
    title: "Everything You Need, Just a Rental Away.",
    description:
      "From construction tools to photography gear, discover the right equipment for every project in one convenient place.",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 3,
    title: "Own Equipment? Turn It Into Opportunity.",
    description:
      "List your equipment on OnRent, connect with customers, and earn money by renting out your unused equipment.",
    image:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=2000&q=85",
  },
];

// How long each slide stays on screen (ms)
const AUTOPLAY_DELAY = 6000;

// Slide animation: direction 1 = next (enters from right), -1 = previous (enters from left)
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.6,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.6,
  }),
};

const slideTransition: Transition = {
  x: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
  opacity: { duration: 0.6 },
};

const Hero = () => {
  const [[currentSlide, direction], setSlide] = useState([0, 1]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = (dir: number) => {
    setSlide(([prev]) => [(prev + dir + slides.length) % slides.length, dir]);
  };

  const goToSlide = (index: number) => {
    setSlide(([prev]) => (index === prev ? [prev, 1] : [index, index > prev ? 1 : -1]));
  };

  // Autoplay: the timer restarts after every slide change (including manual clicks)
  // and stops while the mouse is over the hero.
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => paginate(1), AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [currentSlide, isPaused]);

  const slide = slides[currentSlide];

  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="relative flex min-h-[480px] items-center bg-cover bg-center px-6 py-16 sm:min-h-[540px] sm:px-12 lg:min-h-[600px] lg:px-20"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="relative z-10 max-w-2xl"
            >
              <span className="mb-5 inline-block rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300">
                Welcome to OnRent
              </span>

              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-gray-200 sm:text-base md:text-lg">
                {slide.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/equipment"
                  className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 sm:text-base"
                >
                  Explore Equipment
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900 sm:text-base"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-blue-500 sm:left-5 sm:h-12 sm:w-12"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={() => paginate(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-blue-500 sm:right-5 sm:h-12 sm:w-12"
        >
          <ArrowRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-orange-500"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;