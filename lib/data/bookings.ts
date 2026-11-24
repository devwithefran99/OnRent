export type BookingStatus = "pending" | "approved" | "rejected" | "completed";

export type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerId: string;
  ownerName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  quantity: number;
  units: number;
  rentalType: string;
  unitPrice: number;
  totalPrice: number;
  phone: string;
  address: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
};

export const bookingStatusStyles: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-600",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-600",
  rejected: "border-red-200 bg-red-50 text-red-600",
  completed: "border-blue-200 bg-blue-50 text-blue-600",
};

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}
