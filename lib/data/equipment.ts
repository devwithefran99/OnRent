export type CategoryName =
  | "Construction Equipment"
  | "Photography Equipment"
  | "Vehicles & Transportation"
  | "Agriculture Equipment"
  | "Electronics"
  | "Event Equipment";

export type RentalType = "Daily" | "Weekly" | "Monthly";

/**
 * Only listings with status "approved" are shown on the public equipment page.
 */
export type ListingStatus = "approved" | "pending" | "rejected";

export type Equipment = {
  id: number;
  slug: string;
  name: string;
  category: CategoryName;
  location: string;
  price: number;
  rentalType: RentalType;
  rating: number;
  reviews: number;
  image: string;
  featured: boolean;
  available: boolean;
  status: ListingStatus;
  /** ISO date string, used for the "Recently Added" sort. */
  createdAt: string;
};

export const categories: CategoryName[] = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export const rentalTypes: RentalType[] = ["Daily", "Weekly", "Monthly"];

export const equipmentList: Equipment[] = [
  {
    id: 1,
    slug: "mini-excavator",
    name: "Mini Excavator",
    category: "Construction Equipment",
    location: "Chattogram",
    price: 8500,
    rentalType: "Daily",
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
    status: "approved",
    createdAt: "2026-09-02",
  },
  {
    id: 2,
    slug: "professional-dslr-camera",
    name: "Professional DSLR Camera",
    category: "Photography Equipment",
    location: "Dhaka",
    price: 2500,
    rentalType: "Daily",
    rating: 5,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
    status: "approved",
    createdAt: "2026-10-14",
  },
  {
    id: 3,
    slug: "twenty-foot-delivery-truck",
    name: "20ft Delivery Truck",
    category: "Vehicles & Transportation",
    location: "Chattogram",
    price: 6500,
    rentalType: "Weekly",
    rating: 4.7,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-08-21",
  },
  {
    id: 4,
    slug: "power-tiller",
    name: "Power Tiller",
    category: "Agriculture Equipment",
    location: "Cumilla",
    price: 5000,
    rentalType: "Daily",
    rating: 4.8,
    reviews: 41,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-07-11",
  },
  {
    id: 5,
    slug: "heavy-duty-generator",
    name: "Heavy Duty Generator",
    category: "Electronics",
    location: "Chattogram",
    price: 3500,
    rentalType: "Daily",
    rating: 4.6,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-06-30",
  },
  {
    id: 6,
    slug: "event-sound-system",
    name: "Event Sound System",
    category: "Event Equipment",
    location: "Sylhet",
    price: 4000,
    rentalType: "Weekly",
    rating: 4.9,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85",
    featured: true,
    available: true,
    status: "approved",
    createdAt: "2026-11-06",
  },
  {
    id: 7,
    slug: "scaffolding-set",
    name: "Scaffolding Set",
    category: "Construction Equipment",
    location: "Dhaka",
    price: 1200,
    rentalType: "Weekly",
    rating: 4.5,
    reviews: 37,
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-05-19",
  },
  {
    id: 8,
    slug: "cine-prime-lens-kit",
    name: "Cine Prime Lens Kit",
    category: "Photography Equipment",
    location: "Dhaka",
    price: 3200,
    rentalType: "Daily",
    rating: 4.8,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-10-01",
  },
  {
    id: 9,
    slug: "commuter-motorcycle",
    name: "Commuter Motorcycle",
    category: "Vehicles & Transportation",
    location: "Chattogram",
    price: 1500,
    rentalType: "Daily",
    rating: 4.6,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-04-27",
  },
  {
    id: 10,
    slug: "dslr-drone",
    name: "DSLR Drone",
    category: "Photography Equipment",
    location: "Dhaka",
    price: 2800,
    rentalType: "Weekly",
    rating: 4.9,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-11-12",
  },
  {
    id: 11,
    slug: "portable-projector",
    name: "Portable Projector",
    category: "Event Equipment",
    location: "Rajshahi",
    price: 1800,
    rentalType: "Monthly",
    rating: 4.5,
    reviews: 29,
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-09-24",
  },
  {
    id: 12,
    slug: "industrial-power-drill",
    name: "Industrial Power Drill",
    category: "Construction Equipment",
    location: "Chattogram",
    price: 800,
    rentalType: "Daily",
    rating: 4.7,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-03-16",
  },
  {
    id: 13,
    slug: "desktop-workstation",
    name: "Desktop Workstation",
    category: "Electronics",
    location: "Dhaka",
    price: 2200,
    rentalType: "Monthly",
    rating: 4.4,
    reviews: 31,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "approved",
    createdAt: "2026-08-05",
  },
  {
    id: 14,
    slug: "commercial-treadmill",
    name: "Commercial Treadmill",
    category: "Electronics",
    location: "Chattogram",
    price: 2000,
    rentalType: "Monthly",
    rating: 4.3,
    reviews: 18,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: false,
    status: "approved",
    createdAt: "2026-02-08",
  },
  {
    id: 15,
    slug: "mini-harvester",
    name: "Mini Harvester",
    category: "Agriculture Equipment",
    location: "Rangpur",
    price: 7200,
    rentalType: "Weekly",
    rating: 4.8,
    reviews: 24,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: false,
    status: "approved",
    createdAt: "2026-10-22",
  },
  {
    id: 16,
    slug: "tower-light",
    name: "Tower Light",
    category: "Construction Equipment",
    location: "Khulna",
    price: 4300,
    rentalType: "Daily",
    rating: 0,
    reviews: 0,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "pending",
    createdAt: "2026-11-16",
  },
  {
    id: 17,
    slug: "vintage-video-camera",
    name: "Vintage Video Camera",
    category: "Photography Equipment",
    location: "Barishal",
    price: 900,
    rentalType: "Daily",
    rating: 0,
    reviews: 0,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85",
    featured: false,
    available: true,
    status: "rejected",
    createdAt: "2026-11-10",
  },
];

/** Public listings only — pending/rejected items never reach the UI. */
export const approvedEquipment: Equipment[] = equipmentList.filter(
  (item) => item.status === "approved"
);

export const priceBounds = {
  min: 0,
  max: Math.max(...approvedEquipment.map((item) => item.price)),
};

export type CategoryFilter = "All" | CategoryName;
export type RentalTypeFilter = "All" | RentalType;
export type AvailabilityFilter = "All" | "Available" | "Booked";
export type SortKey = "price-asc" | "price-desc" | "newest";

export type EquipmentFilters = {
  query?: string;
  category?: CategoryFilter;
  rentalType?: RentalTypeFilter;
  availability?: AvailabilityFilter;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
};

/**
 * Search + filter + sort approved equipment.
 *
 * Frontend-only for now. When the backend is ready, keep this same signature
 * and replace the body with:
 *   const res = await fetch(`/api/equipment?${new URLSearchParams(params)}`);
 *   return res.json();
 */
export function searchEquipment({
  query = "",
  category = "All",
  rentalType = "All",
  availability = "All",
  minPrice = priceBounds.min,
  maxPrice = priceBounds.max,
  sort = "newest",
}: EquipmentFilters = {}): Equipment[] {
  const term = query.trim().toLowerCase();

  const results = approvedEquipment.filter((item) => {
    const matchesQuery =
      term.length === 0 ||
      item.name.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term);

    const matchesCategory = category === "All" || item.category === category;

    const matchesRentalType =
      rentalType === "All" || item.rentalType === rentalType;

    const matchesAvailability =
      availability === "All" ||
      (availability === "Available" ? item.available : !item.available);

    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesRentalType &&
      matchesAvailability &&
      matchesPrice
    );
  });

  switch (sort) {
    case "price-asc":
      return results.sort((a, b) => a.price - b.price);
    case "price-desc":
      return results.sort((a, b) => b.price - a.price);
    default:
      return results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function getEquipmentBySlug(slug: string): Equipment | undefined {
  return approvedEquipment.find((item) => item.slug === slug);
}
