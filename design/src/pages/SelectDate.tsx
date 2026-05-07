import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout, { GoBackButton, PrimaryButton } from "../components/Layout";
import { ExhibitionSummary } from "../components/BookingHeader";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function SelectDate() {
  const navigate = useNavigate();
  const { draft, setDraft } = useBooking();
  const exhibition = findExhibition(draft.exhibitionId);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(draft.date ?? null);

  const cells = useMemo(() => buildMonth(year, month), [year, month]);
  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (!exhibition) {
    return (
      <Layout>
        <div className="p-6">
          No exhibition selected.{" "}
          <Link className="text-primary" to="/">
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const isoFor = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;

  const todayIso = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cont = () => {
    if (!selected) return;
    setDraft({ date: selected });
    navigate("/book/time");
  };

  const titleDate = selected
    ? new Date(selected + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "Select a date";

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <ExhibitionSummary exhibition={exhibition} />

        <div className="bg-white rounded-3xl overflow-hidden mb-4">
          <div className="border-b border-navy/10 px-6 pt-4 pb-3">
            <p className="text-[12px] font-bold text-navy/60 mb-2">
              Select date
            </p>
            <p className="text-navy text-[28px] font-medium">{titleDate}</p>
          </div>
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="px-2 py-2 text-navy/70 font-bold text-[12px]">
              {monthLabel}
            </div>
            <div className="flex">
              <button
                aria-label="Previous month"
                className="w-10 h-10 flex items-center justify-center text-navy"
                onClick={() => {
                  setMonth((m) => {
                    if (m === 0) {
                      setYear((y) => y - 1);
                      return 11;
                    }
                    return m - 1;
                  });
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
                </svg>
              </button>
              <button
                aria-label="Next month"
                className="w-10 h-10 flex items-center justify-center text-navy"
                onClick={() => {
                  setMonth((m) => {
                    if (m === 11) {
                      setYear((y) => y + 1);
                      return 0;
                    }
                    return m + 1;
                  });
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4L13.2 12Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="h-10 flex items-center justify-center text-navy text-[14px] font-bold"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((d, i) => {
                if (d === null) return <div key={i} className="h-10" />;
                const iso = isoFor(d);
                const isSelected = selected === iso;
                const isToday = iso === todayIso;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(iso)}
                    className={`h-10 m-auto w-10 flex items-center justify-center text-[14px] font-bold rounded-full transition ${
                      isSelected
                        ? "bg-primary text-white"
                        : isToday
                          ? "border border-primary text-navy"
                          : "text-navy hover:bg-navy/5"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 border-t border-transparent">
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 text-navy text-[14px] font-bold"
            >
              Clear
            </button>
            <div className="flex">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-navy text-[14px] font-bold"
              >
                Cancel
              </button>
              <button
                onClick={cont}
                className="px-4 py-2 text-navy text-[14px] font-bold"
              >
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <PrimaryButton onClick={cont} disabled={!selected}>
            Continue
          </PrimaryButton>
          <GoBackButton />
        </div>
      </div>
    </Layout>
  );
}
