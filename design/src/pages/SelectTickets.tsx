import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { GoBackButton, PrimaryButton } from "../components/Layout";
import { ExhibitionSummary, formatDateLong } from "../components/BookingHeader";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";

export default function SelectTickets() {
  const { draft, setDraft } = useBooking();
  const navigate = useNavigate();
  const exhibition = findExhibition(draft.exhibitionId);
  const [counts, setCounts] = useState<Record<string, number>>(
    draft.counts ?? {},
  );

  if (!exhibition || !draft.date || !draft.time) {
    return (
      <Layout>
        <div className="p-6">
          Pick date and time first.{" "}
          <Link className="text-primary" to="/">
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const total = Object.entries(counts).reduce(
    (sum, [id, n]) =>
      sum +
      (exhibition.tickets.find((t) => t.id === id)?.price ?? 0) * (n ?? 0),
    0,
  );
  const totalCount = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);

  const cont = () => {
    setDraft({ counts });
    navigate("/book/confirm");
  };

  const set = (id: string, delta: number) => {
    setCounts((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }));
  };

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <ExhibitionSummary
          exhibition={exhibition}
          date={formatDateLong(draft.date)}
          time={draft.time}
        />

        <p className="text-navy text-[14px] font-bold mb-2">Select tickets</p>
        <div className="space-y-2 mb-3">
          {exhibition.tickets.map((t) => {
            const n = counts[t.id] ?? 0;
            return (
              <div
                key={t.id}
                className="bg-white/80 rounded-2xl px-5 py-4 flex items-center justify-between"
              >
                <div className="text-navy">
                  <p className="text-[16px] font-bold">
                    {t.label}{" "}
                    {t.sub && (
                      <span className="text-[10px] font-normal">{t.sub}</span>
                    )}
                  </p>
                  <p className="text-[16px] font-bold">
                    ¥{t.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-navy">
                  <button
                    aria-label={`Decrease ${t.label}`}
                    onClick={() => set(t.id, -1)}
                    className="w-6 h-6"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="7" y="11" width="10" height="2" rx="1" />
                    </svg>
                  </button>
                  <span className="w-6 text-center text-[24px] font-bold">
                    {n}
                  </span>
                  <button
                    aria-label={`Increase ${t.label}`}
                    onClick={() => set(t.id, 1)}
                    className="w-6 h-6"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="11" y="7" width="2" height="10" rx="1" />
                      <rect x="7" y="11" width="10" height="2" rx="1" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalCount > 0 && (
          <div className="bg-white/80 rounded-2xl px-5 py-3 mb-4 flex justify-between items-center">
            <span className="text-navy text-[16px] font-bold">Total</span>
            <span className="text-accent text-[20px] font-bold">
              ¥{total.toLocaleString()}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <PrimaryButton onClick={cont} disabled={totalCount === 0}>
            Continue
          </PrimaryButton>
          <GoBackButton />
        </div>
      </div>
    </Layout>
  );
}
