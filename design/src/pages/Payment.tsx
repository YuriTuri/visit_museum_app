import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { GoBackButton, PrimaryButton } from "../components/Layout";
import { ExhibitionSummary, formatDateLong } from "../components/BookingHeader";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";

const METHODS = [
  { id: "credit", label: "Credit Card", sub: "Visa · Mastercard · JCB · AMEX" },
  { id: "paypay", label: "PayPay" },
  { id: "linepay", label: "LINE Pay" },
  { id: "applepay", label: "Apple Pay" },
  { id: "googlepay", label: "Google Pay" },
  { id: "konbini", label: "Convenience Store" },
];

export default function Payment() {
  const { draft, commitBooking } = useBooking();
  const navigate = useNavigate();
  const exhibition = findExhibition(draft.exhibitionId);
  const [method, setMethod] = useState<string | null>(null);

  if (!exhibition || !draft.date || !draft.time || !draft.counts) {
    return (
      <Layout>
        <div className="p-6">
          Booking incomplete.{" "}
          <Link className="text-primary" to="/">
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const total = exhibition.tickets.reduce(
    (s, t) => s + (draft.counts?.[t.id] ?? 0) * t.price,
    0,
  );

  const pay = () => {
    if (!method) return;
    const booking = commitBooking(method);
    navigate(`/receipt/${booking.bookingId}`);
  };

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <ExhibitionSummary
          exhibition={exhibition}
          date={formatDateLong(draft.date)}
          time={draft.time}
        />

        <div className="bg-white/80 rounded-2xl px-5 py-4 mb-4 flex justify-between items-center">
          <span className="text-navy text-[16px] font-bold">Total</span>
          <span className="text-accent text-[20px] font-bold">
            ¥{total.toLocaleString()}
          </span>
        </div>

        <p className="text-navy text-[14px] font-bold mb-2">Select payment method</p>
        <div className="space-y-2 mb-4">
          {METHODS.map((m) => {
            const selected = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition ${
                  selected ? "bg-primary text-white" : "bg-white/80 text-navy"
                }`}
              >
                <span>
                  <span className="block text-[16px] font-bold">{m.label}</span>
                  {m.sub && (
                    <span
                      className={`block text-[12px] ${
                        selected ? "text-white/80" : "text-navy/60"
                      }`}
                    >
                      {m.sub}
                    </span>
                  )}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected ? "border-white bg-white" : "border-navy/30"
                  }`}
                >
                  {selected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <PrimaryButton onClick={pay} disabled={!method}>
            Pay ¥{total.toLocaleString()}
          </PrimaryButton>
          <GoBackButton />
        </div>
      </div>
    </Layout>
  );
}
