import type { Exhibition } from "../data/exhibitions";

export function ExhibitionSummary({
  exhibition,
  date,
  time,
}: {
  exhibition: Exhibition;
  date?: string;
  time?: string;
}) {
  return (
    <div className="bg-white/80 rounded-2xl p-5 mb-3">
      <p className="text-navy text-[16px] font-bold leading-6 line-clamp-2 mb-2">
        {exhibition.title}
      </p>
      <p className="text-navy/80 text-[14px] font-bold mb-2">
        {exhibition.museum}
      </p>
      {date && (
        <p className="text-navy text-[20px] font-bold opacity-80">{date}</p>
      )}
      {time && (
        <p className="text-navy text-[20px] font-bold opacity-80 mt-1">{time}</p>
      )}
    </div>
  );
}

export function formatDateLong(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
