import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Booking = {
  exhibitionId: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  counts: Record<string, number>;
  paymentMethod: string;
  bookingId: string;
  purchasedAt: string; // ISO datetime
};

type BookingDraft = Partial<Omit<Booking, "bookingId" | "purchasedAt">>;

type BookingContextValue = {
  draft: BookingDraft;
  setDraft: (patch: BookingDraft) => void;
  resetDraft: () => void;
  bookings: Booking[];
  commitBooking: (
    payment: string,
  ) => Booking;
};

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft>({});
  const [bookings, setBookings] = useState<Booking[]>([]);

  const setDraft = (patch: BookingDraft) =>
    setDraftState((d) => ({ ...d, ...patch }));
  const resetDraft = () => setDraftState({});

  const commitBooking = (payment: string): Booking => {
    const booking: Booking = {
      exhibitionId: draft.exhibitionId ?? "",
      date: draft.date ?? "",
      time: draft.time ?? "",
      counts: draft.counts ?? {},
      paymentMethod: payment,
      bookingId: `VM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      purchasedAt: new Date().toISOString(),
    };
    setBookings((b) => [booking, ...b]);
    return booking;
  };

  const value = useMemo<BookingContextValue>(
    () => ({ draft, setDraft, resetDraft, bookings, commitBooking }),
    [draft, bookings],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
