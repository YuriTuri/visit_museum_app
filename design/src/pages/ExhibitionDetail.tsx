import { useNavigate, useParams } from "react-router-dom";
import Layout, { PrimaryButton } from "../components/Layout";
import { findExhibition } from "../data/exhibitions";
import { useBooking } from "../context/BookingContext";

const TAG_TO_SUBJECT: Record<string, string> = {
  History: "history", Ukiyoe: "history", Edo: "history",
  Photo: "photography", Photography: "photography",
  Technology: "technology",
  Art: "art", Contemporary: "art", Creative: "art", FineArt: "art",
  Impressionist: "art", Classic: "art", Craft: "art", Ceramics: "art",
  Modern: "art", Illustration: "art", PictureBook: "art",
  Science: "science", Space: "science", Dinosaur: "science",
  Nature: "science", Insects: "science", Education: "science",
  Culture: "culture", Urban: "culture", Architecture: "culture",
  Anime: "anime & manga", Manga: "anime & manga",
};

export default function ExhibitionDetail() {
  const { id } = useParams();
  const exhibition = findExhibition(id);
  const navigate = useNavigate();
  const { setDraft, resetDraft } = useBooking();

  if (!exhibition) {
    return (
      <Layout>
        <div className="p-6">Exhibition not found.</div>
      </Layout>
    );
  }

  const startBooking = () => {
    resetDraft();
    setDraft({ exhibitionId: exhibition.id, counts: {} });
    navigate("/book/date");
  };

  return (
    <Layout>
      <div className="pb-6">
        <div className="h-[264px] bg-navy/10 overflow-hidden">
          <img
            src={exhibition.image}
            alt={exhibition.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-center gap-1.5 py-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === 0 ? "bg-navy" : "bg-navy/30"
              }`}
            />
          ))}
        </div>

        <div className="px-4 pt-2">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exhibition.tags.map((tag) => {
              const subject = TAG_TO_SUBJECT[tag];
              const isFamily = tag === "Family";
              return (
                <button
                  key={tag}
                  onClick={() =>
                    navigate("/", {
                      state: isFamily
                        ? { ageFilter: "Family-friendly" }
                        : subject
                        ? { subjectFilter: subject }
                        : {},
                    })
                  }
                  className="bg-white rounded-[10px] px-1.5 text-[14px] font-bold text-accent/80 hover:bg-accent/10 transition-colors"
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <h1 className="text-navy text-[20px] font-bold leading-tight mb-2">
            {exhibition.title}
          </h1>
          <p className="text-navy/80 text-[14px] font-bold mb-1">
            {exhibition.museum}
          </p>
          <p className="text-navy/80 text-[14px] font-bold mb-4">
            {exhibition.dates}
          </p>
          <div className="flex gap-4 mb-6 text-navy">
            <button aria-label="Favorite">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35 10.55 20A33 33 0 0 1 4.6 14C2.93 11.74 2 9.74 2 7.74 2 4.55 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 16.5 2C19.58 2 22 4.55 22 7.74c0 2-.93 4-2.6 6.26A33 33 0 0 1 13.45 20Z" />
              </svg>
            </button>
            <button aria-label="Share">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16a2.91 2.91 0 0 0-2 .79l-7.05-4.11c.04-.22.05-.45.05-.68s-.01-.46-.05-.68L15.96 7.21A2.99 2.99 0 1 0 15 5c0 .23.01.46.05.68L8 9.79a3 3 0 1 0 0 4.42l7.12 4.16c-.04.21-.07.43-.07.65a2.92 2.92 0 1 0 2.92-2.92Z" />
              </svg>
            </button>
          </div>

          <button
            onClick={startBooking}
            className="block w-full bg-primary text-white font-bold text-[20px] text-center py-2.5 rounded-[10px] mb-6"
          >
            Get tickets
          </button>

          <h2 className="text-navy text-[20px] font-bold mb-2">
            About This Exhibition
          </h2>
          <p className="text-navy/80 text-[16px] leading-6 mb-6">
            {exhibition.description}
          </p>

          <Section title="Ticket Prices">
            {exhibition.tickets.map((t, i) => (
              <Row
                key={t.id}
                last={i === exhibition.tickets.length - 1}
                left={
                  <span className="text-[16px]">
                    {t.label}{" "}
                    {t.sub && (
                      <span className="text-[12px] font-bold">{t.sub}</span>
                    )}
                  </span>
                }
                right={
                  <span className="text-accent font-bold">
                    ¥{t.price.toLocaleString()}
                  </span>
                }
              />
            ))}
          </Section>

          <Section title="Opening Hours">
            {exhibition.hours.map((h, i) => (
              <Row
                key={h.label}
                last={i === exhibition.hours.length - 1}
                left={<span>{h.label}</span>}
                right={<span>{h.value}</span>}
              />
            ))}
          </Section>

          <div className="bg-white/80 rounded-2xl p-5 mb-4">
            <h3 className="text-navy text-[20px] font-bold mb-3">Location</h3>
            <p className="text-navy text-[14px] font-bold mb-1">
              {exhibition.museum}
            </p>
            <p className="text-navy text-[12px] font-bold mb-3">
              {exhibition.address}
            </p>
            <div className="bg-gray-300 h-[175px] w-full mb-3 flex items-center justify-center text-navy/50 text-sm">
              Map
            </div>
            <p className="text-navy text-[14px] font-bold mb-1">
              Nearest Station
            </p>
            <p className="text-navy text-[16px] font-medium leading-6">
              {exhibition.station}
            </p>
          </div>

          <PrimaryButton onClick={startBooking}>Get tickets</PrimaryButton>
        </div>
      </div>
    </Layout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 rounded-2xl p-5 mb-4">
      <h3 className="text-navy text-[20px] font-bold mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function Row({
  left,
  right,
  last,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 text-navy ${
        last ? "" : "border-b border-navy/10"
      }`}
    >
      <div className="font-medium text-[16px]">{left}</div>
      <div className="font-bold text-[16px]">{right}</div>
    </div>
  );
}
