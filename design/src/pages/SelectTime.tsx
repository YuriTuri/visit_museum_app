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

type Congestion = "low" | "moderate" | "busy";

const TIME_CONGESTION: Record<string, Congestion> = {
  "10:00": "low",
  "11:00": "moderate",
  "12:00": "busy",
  "13:00": "busy",
  "14:00": "moderate",
  "15:00": "moderate",
  "16:00": "low",
  "17:00": "low",
};

const CONGESTION_STYLE: Record<Congestion, { dot: string; label: string; text: string }> = {
  low:      { dot: "bg-green-500", label: "Not busy",  text: "text-green-600" },
  moderate: { dot: "bg-amber-400", label: "Moderate",  text: "text-amber-500" },
  busy:     { dot: "bg-red-500",   label: "Busy",      text: "text-red-500"   },
};

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
            const { dot, label, text } = CONGESTION_STYLE[TIME_CONGESTION[t]];
            return (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`w-full px-5 py-4 rounded-2xl text-[16px] font-bold transition flex items-center justify-between ${
                  selected
                    ? "bg-primary text-white"
                    : "bg-white/80 text-navy hover:bg-white"
                }`}
              >
                <span>{t}</span>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                  <span className={`text-[12px] font-bold ${selected ? "text-white/80" : text}`}>
                    {label}
                  </span>
                </span>
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
