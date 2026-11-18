"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen, Search, SlidersHorizontal, X } from "lucide-react";
import EquipmentCard from "./EquipmentCard";
import {
  categories,
  priceBounds,
  rentalTypes,
  searchEquipment,
  type AvailabilityFilter,
  type CategoryFilter,
  type CategoryName,
  type RentalTypeFilter,
  type SortKey,
} from "@/lib/data/equipment";
import { cn } from "@/lib/utils";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Recently Added" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const rentalTypeOptions: { value: RentalTypeFilter; label: string }[] = [
  { value: "All", label: "All rental types" },
  ...rentalTypes.map((type) => ({
    value: type as RentalTypeFilter,
    label: type,
  })),
];

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: "All", label: "Any availability" },
  { value: "Available", label: "Available now" },
  { value: "Booked", label: "Currently booked" },
];

const PAGE_SIZE = 9;

const selectClass =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const selectIconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

const SelectArrow = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EquipmentExplorer = ({
  initialCategory = "All",
}: {
  initialCategory?: string;
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>(
    categories.includes(initialCategory as CategoryName)
      ? (initialCategory as CategoryName)
      : "All"
  );
  const [rentalType, setRentalType] = useState<RentalTypeFilter>("All");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("All");
  const [minPrice, setMinPrice] = useState(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [sort, setSort] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Counts respect every other active filter, so the pill numbers stay truthful.
  const counts = useMemo(() => {
    const base = { query, rentalType, availability, minPrice, maxPrice };
    const map: Record<string, number> = {
      All: searchEquipment(base).length,
    };

    for (const name of categories) {
      map[name] = searchEquipment({ ...base, category: name }).length;
    }

    return map;
  }, [query, rentalType, availability, minPrice, maxPrice]);

  const results = useMemo(
    () =>
      searchEquipment({
        query,
        category,
        rentalType,
        availability,
        minPrice,
        maxPrice,
        sort,
      }),
    [query, category, rentalType, availability, minPrice, maxPrice, sort]
  );

  const visibleItems = results.slice(0, visible);

  const isPriceFiltered =
    minPrice > priceBounds.min || maxPrice < priceBounds.max;

  const activeFilters =
    (category !== "All" ? 1 : 0) +
    (query.trim().length > 0 ? 1 : 0) +
    (rentalType !== "All" ? 1 : 0) +
    (availability !== "All" ? 1 : 0) +
    (isPriceFiltered ? 1 : 0);

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setRentalType("All");
    setAvailability("All");
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setSort("newest");
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search: name or location */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(PAGE_SIZE);
                }}
                placeholder="Search by equipment name or location…"
                aria-label="Search equipment by name or location"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Rental type */}
            <div className="relative w-full lg:w-44">
              <span className={selectIconClass}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 8v4l3 2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </span>

              <select
                value={rentalType}
                onChange={(event) => {
                  setRentalType(event.target.value as RentalTypeFilter);
                  setVisible(PAGE_SIZE);
                }}
                aria-label="Filter by rental type"
                className={selectClass}
              >
                {rentalTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <SelectArrow />
            </div>

            {/* Availability */}
            <div className="relative w-full lg:w-48">
              <span className={selectIconClass}>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <select
                value={availability}
                onChange={(event) => {
                  setAvailability(event.target.value as AvailabilityFilter);
                  setVisible(PAGE_SIZE);
                }}
                aria-label="Filter by availability"
                className={selectClass}
              >
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <SelectArrow />
            </div>

            {/* Sort */}
            <div className="relative w-full lg:w-52">
              <SlidersHorizontal size={16} className={selectIconClass} />

              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortKey);
                  setVisible(PAGE_SIZE);
                }}
                aria-label="Sort equipment"
                className={selectClass}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <SelectArrow />
            </div>
          </div>

          <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
            {/* Category Pills */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(["All", ...categories] as CategoryFilter[]).map((name) => {
                const isActive = category === name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setCategory(name);
                      setVisible(PAGE_SIZE);
                    }}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                      isActive
                        ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {name}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-400"
                      )}
                    >
                      {counts[name] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
              <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Price range
              </p>

              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex flex-1 items-center gap-3">
                  <label
                    htmlFor="min-price"
                    className="w-8 shrink-0 text-xs font-medium text-slate-500"
                  >
                    Min
                  </label>

                  <input
                    id="min-price"
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={100}
                    value={minPrice}
                    onChange={(event) => {
                      setMinPrice(
                        Math.min(Number(event.target.value), maxPrice)
                      );
                      setVisible(PAGE_SIZE);
                    }}
                    className="h-2 flex-1 cursor-pointer accent-blue-500"
                  />

                  <span className="w-20 shrink-0 text-right text-sm font-semibold text-slate-900">
                    ৳{minPrice.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="flex flex-1 items-center gap-3">
                  <label
                    htmlFor="max-price"
                    className="w-8 shrink-0 text-xs font-medium text-slate-500"
                  >
                    Max
                  </label>

                  <input
                    id="max-price"
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={100}
                    value={maxPrice}
                    onChange={(event) => {
                      setMaxPrice(
                        Math.max(Number(event.target.value), minPrice)
                      );
                      setVisible(PAGE_SIZE);
                    }}
                    className="h-2 flex-1 cursor-pointer accent-blue-500"
                  />

                  <span className="w-20 shrink-0 text-right text-sm font-semibold text-slate-900">
                    ৳{maxPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Meta */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {visibleItems.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "item" : "items"}
          </p>

          {activeFilters > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <X size={15} />
              Clear filters ({activeFilters})
            </button>
          )}
        </div>

        {/* Grid */}
        {visibleItems.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % PAGE_SIZE) * 0.04 }}
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <PackageOpen size={26} />
            </span>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No equipment found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
              Try a different equipment name or location, widen your price
              range, or change the category, rental type, and availability
              filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More */}
        {visible < results.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600"
            >
              Load more equipment
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EquipmentExplorer;
