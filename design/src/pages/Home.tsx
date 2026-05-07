import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  exhibitions,
  popularIds,
  allResultIds,
  type Exhibition,
} from "../data/exhibitions";

function ExhibitionCard({
  exhibition,
  small,
}: {
  exhibition: Exhibition;
  small?: boolean;
}) {
  return (
    <Link
      to={`/exhibition/${exhibition.id}`}
      className={`bg-white rounded-lg shadow-card flex flex-col overflow-hidden ${
        small ? "w-[110px]" : "flex-1 basis-[164px]"
      }`}
    >
      <div className={`${small ? "h-[90px]" : "h-[113px]"} bg-gray-200`}>
        <img
          src={exhibition.image}
          alt={exhibition.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 px-2 pt-3 pb-2 flex-1">
        <p className="font-bold text-navy text-[14px] leading-[1.2] line-clamp-2 min-h-[34px]">
          {exhibition.title}
        </p>
        <p className="font-bold text-navy/80 text-[10px] leading-tight truncate">
          {exhibition.museum}
        </p>
        <p className="font-bold text-navy/80 text-[10px] leading-tight truncate">
          {exhibition.dates}
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          {exhibition.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-chipBg rounded-[10px] px-1.5 text-[10px] font-bold text-accent/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const popular = popularIds
    .map((id) => exhibitions.find((e) => e.id === id))
    .filter((e): e is Exhibition => Boolean(e));
  const all = allResultIds
    .map((id) => exhibitions.find((e) => e.id === id))
    .filter((e): e is Exhibition => Boolean(e));

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <h1 className="text-navy text-[20px] font-bold mb-3">All Results</h1>
        <div className="flex gap-2 mb-5">
          {all.map((ex) => (
            <ExhibitionCard key={ex.id} exhibition={ex} small />
          ))}
        </div>

        <div className="bg-white border-2 border-primary rounded-full h-14 flex items-center px-5 mb-5">
          <span className="flex-1 text-[16px] text-navy">search exhibitions</span>
          <button aria-label="Search" className="p-1 text-navy/70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
          </button>
          <button aria-label="Sort" className="p-1 text-navy/70 ml-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h6v-2H3v2Zm0-5h12v-2H3v2Zm0-7v2h18V6H3Z" />
            </svg>
          </button>
        </div>

        <h2 className="text-navy text-[20px] font-bold mb-3">
          Popular Exhibitions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {popular.map((ex) => (
            <ExhibitionCard key={ex.id} exhibition={ex} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-navy">
          <button aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
            </svg>
          </button>
          <span className="bg-navy text-cream rounded-lg px-3 py-1 text-[16px] font-medium">
            1
          </span>
          <span className="rounded-lg px-3 py-1 text-[16px] font-medium">2</span>
          <span className="rounded-lg px-3 py-1 text-[16px] font-medium">3</span>
          <span className="px-3">...</span>
          <span className="rounded-lg px-3 py-1 text-[16px] font-medium">30</span>
          <span className="rounded-lg px-3 py-1 text-[16px] font-medium">32</span>
          <button aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4L13.2 12Z" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
}
