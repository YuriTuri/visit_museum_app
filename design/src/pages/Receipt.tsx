import { Link, useParams } from "react-router-dom";
import Layout, { PrimaryButton } from "../components/Layout";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";
import { formatDateLong } from "../components/BookingHeader";

const METHOD_LABELS: Record<string, string> = {
  credit: "Credit Card",
  paypay: "PayPay",
  linepay: "LINE Pay",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  konbini: "Convenience Store",
};

export default function Receipt() {
  const { id } = useParams();
  const { bookings } = useBooking();
  const booking = bookings.find((b) => b.bookingId === id);
  const exhibition = booking ? findExhibition(booking.exhibitionId) : undefined;

  if (!booking || !exhibition) {
    return (
      <Layout>
        <div className="p-6">
          Receipt not found.{" "}
          <Link className="text-primary" to="/">
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const lines = exhibition.tickets
    .map((t) => ({ ticket: t, n: booking.counts[t.id] ?? 0 }))
    .filter(({ n }) => n > 0);
  const total = lines.reduce((s, { ticket, n }) => s + ticket.price * n, 0);
  const purchasedAt = new Date(booking.purchasedAt);

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <div className="flex flex-col items-center mb-4 mt-2">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="m9 16.17-3.88-3.88L3.7 13.7 9 19l12-12-1.41-1.42Z" />
            </svg>
          </div>
          <h1 className="text-navy text-[20px] font-bold">Payment Complete</h1>
          <p className="text-navy/60 text-[14px]">Your tickets are ready</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-dashed border-navy/20">
            <p className="text-navy/60 text-[12px] font-bold mb-1">
              Booking ID
            </p>
            <p className="text-navy text-[18px] font-bold tracking-wider">
              {booking.bookingId}
            </p>
          </div>
          <div className="px-5 py-4 space-y-3">
            <Row label="Exhibition" value={exhibition.title} />
            <Row label="Museum" value={exhibition.museum} />
            <Row label="Date" value={formatDateLong(booking.date)} />
            <Row label="Time" value={booking.time} />
            <Row
              label="Payment method"
              value={METHOD_LABELS[booking.paymentMethod] ?? booking.paymentMethod}
            />
            <Row
              label="Purchased"
              value={purchasedAt.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
          </div>
          <div className="px-5 py-4 border-t border-dashed border-navy/20 space-y-2">
            {lines.map(({ ticket, n }) => (
              <div
                key={ticket.id}
                className="flex justify-between text-navy text-[14px]"
              >
                <span>
                  {ticket.label} ×{n}
                </span>
                <span>¥{(ticket.price * n).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-navy text-[16px] font-bold pt-2 border-t border-navy/10">
              <span>Total Paid</span>
              <span className="text-accent">¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <PrimaryButton to={`/ticket/${booking.bookingId}`}>
            View My Ticket
          </PrimaryButton>
          <Link
            to="/"
            className="block w-full bg-primary/30 text-navy text-center py-2.5 rounded-[10px] text-[20px] font-bold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-navy/60 text-[14px]">{label}</span>
      <span className="text-navy text-[14px] font-bold text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
