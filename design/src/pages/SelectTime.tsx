import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { GoBackButton, PrimaryButton } from "../components/Layout";
import { ExhibitionSummary, formatDateLong } from "../components/BookingHeader";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";

const TIMES = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function SelectTime() {
  const { draft, setDraft } = useBooking();
  const navigate = useNavigate();
  const exhibition = findExhibition(draft.exhibitionId);
  const [time, setTime] = useState<string | null>(draft.time ?? null);

  if (!exhibition || !draft.date) {
    return (
      <Layout>
        <div className="p-6">
          Pick a date first.{" "}
          <Link className="text-primary" to="/">
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const cont = () => {
    if (!time) return;
    setDraft({ time });
    navigate("/book/tickets");
  };

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <ExhibitionSummary
          exhibition={exhibition}
          date={formatDateLong(draft.date)}
        />

        <p className="text-navy text-[14px] font-bold mb-2">Select time</p>
        <div className="space-y-2 mb-5">
          {TIMES.map((t) => {
            const selected = time === t;
            return (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-[16px] font-bold transition ${
                  selected
                    ? "bg-primary text-white"
                    : "bg-white/80 text-navy hover:bg-white"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <PrimaryButton onClick={cont} disabled={!time}>
            Continue
          </PrimaryButton>
          <GoBackButton />
        </div>
      </div>
    </Layout>
  );
}
