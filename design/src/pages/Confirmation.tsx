import { Link, useNavigate } from "react-router-dom";
import Layout, { GoBackButton, PrimaryButton } from "../components/Layout";
import { formatDateLong } from "../components/BookingHeader";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";

export default function Confirmation() {
  const { draft } = useBooking();
  const exhibition = findExhibition(draft.exhibitionId);
  const navigate = useNavigate();

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

  const lines = exhibition.tickets
    .map((t) => ({ ticket: t, n: draft.counts?.[t.id] ?? 0 }))
    .filter(({ n }) => n > 0);

  const total = lines.reduce((s, { ticket, n }) => s + ticket.price * n, 0);

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <div className="bg-white/80 rounded-2xl p-5 mb-4">
          <div className="h-[160px] bg-navy/10 mb-3 overflow-hidden rounded-md">
            <img
              src={exhibition.image}
              alt={exhibition.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-navy text-[16px] font-bold leading-6 mb-2">
            {exhibition.title}
          </p>
          <p className="text-navy/80 text-[14px] font-bold mb-3">
            {exhibition.museum}
          </p>
          <p className="text-navy text-[20px] font-bold opacity-80">
            {formatDateLong(draft.date)}
          </p>
          <p className="text-navy text-[20px] font-bold opacity-80 mb-4">
            {draft.time}
          </p>

          <div className="space-y-2 mb-3">
            {lines.map(({ ticket, n }) => (
              <div
                key={ticket.id}
                className="flex justify-between text-navy text-[16px] font-bold"
              >
                <span>
                  {ticket.label}{" "}
                  {ticket.sub && (
                    <span className="font-normal text-[10px]">
                      {ticket.sub}
                    </span>
                  )}{" "}
                  ×{n}
                </span>
                <span>
                  ¥{ticket.price.toLocaleString()} ×{n}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-navy/20 pt-3 flex justify-between text-navy text-[16px] font-bold">
            <span>Total</span>
            <span>¥{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <PrimaryButton onClick={() => navigate("/book/payment")}>
            Proceed to Payment
          </PrimaryButton>
          <GoBackButton />
        </div>
      </div>
    </Layout>
  );
}
