import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout, { GoBackButton } from "../components/Layout";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";
import { formatDateLong } from "../components/BookingHeader";

function makeQrPattern(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const cells: boolean[] = [];
  let h = hash;
  for (let i = 0; i < 21 * 21; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    cells.push((h & 1) === 1);
  }
  return cells;
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const booking = bookings.find((b) => b.bookingId === id);
  const exhibition = booking ? findExhibition(booking.exhibitionId) : undefined;

  if (!booking || !exhibition) {
    return (
      <Layout>
        <div className="p-6">
          Ticket not found.{" "}
          <Link className="text-primary" to="/my-tickets">
            View my tickets
          </Link>
        </div>
      </Layout>
    );
  }

  const [copied, setCopied] = useState(false);

  const shareTicket = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: exhibition.title, text: `My ticket for ${exhibition.title}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = exhibition.tickets
    .map((t) => ({ ticket: t, n: booking.counts[t.id] ?? 0 }))
    .filter(({ n }) => n > 0);
  const total = lines.reduce((s, { ticket, n }) => s + ticket.price * n, 0);
  const qr = makeQrPattern(booking.bookingId);

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
          <div className="h-[160px] bg-navy/10">
            <img
              src={exhibition.image}
              alt={exhibition.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-5 py-4">
            <p className="text-navy text-[18px] font-bold leading-tight mb-1">
              {exhibition.title}
            </p>
            <p className="text-navy/70 text-[12px] font-bold">
              {exhibition.museum}
            </p>
          </div>
          <div className="border-t border-dashed border-navy/30 relative">
            <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-cream" />
            <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-cream" />
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            <Field label="Date" value={formatDateLong(booking.date)} />
            <Field label="Time" value={booking.time} />
            <Field
              label="Tickets"
              value={lines
                .map(({ ticket, n }) => `${ticket.label} ×${n}`)
                .join(", ")}
            />
            <Field label="Total" value={`¥${total.toLocaleString()}`} />
          </div>

          <div className="px-5 pb-5 flex flex-col items-center">
            <p className="text-navy/60 text-[12px] font-bold mb-2">
              Show this QR at the entrance
            </p>
            <div className="bg-white p-3 border border-navy/10 rounded-md">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(21, 8px)",
                  gridAutoRows: "8px",
                }}
              >
                {qr.map((on, i) => (
                  <div
                    key={i}
                    className={on ? "bg-navy" : "bg-white"}
                    style={{ width: 8, height: 8 }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-navy text-[14px] font-bold tracking-wider">
              {booking.bookingId}
            </p>
            <button
              onClick={shareTicket}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[14px] font-bold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16a2.91 2.91 0 0 0-2 .79l-7.05-4.11c.04-.22.05-.45.05-.68s-.01-.46-.05-.68L15.96 7.21A2.99 2.99 0 1 0 15 5c0 .23.01.46.05.68L8 9.79a3 3 0 1 0 0 4.42l7.12 4.16c-.04.21-.07.43-.07.65a2.92 2.92 0 1 0 2.92-2.92Z" />
              </svg>
              {copied ? "Link copied!" : "Share ticket"}
            </button>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-4 mb-4">
          <p className="text-navy text-[14px] font-bold mb-2">
            Visiting information
          </p>
          <p className="text-navy/80 text-[12px] leading-5">
            {exhibition.address}
          </p>
          <p className="text-navy/80 text-[12px] leading-5 mt-1">
            {exhibition.station}
          </p>
        </div>

        <div className="space-y-2">
          <GoBackButton to="/my-tickets" />
          <button
            onClick={() => navigate("/")}
            className="block w-full bg-primary text-white font-bold text-[20px] text-center py-2.5 rounded-[10px]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-navy/60 text-[11px] font-bold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-navy text-[14px] font-bold leading-tight">{value}</p>
    </div>
  );
}
