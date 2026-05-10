import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import {
  exhibitions,
  popularIds,
  allResultIds,
  type Exhibition,
} from "../data/exhibitions";

const SCHEDULE_OPTIONS = ["Now Showing", "Coming Soon", "Ending Soon"];
const AREA_OPTIONS = ["Ueno", "Roppongi", "Ginza", "Shibuya", "Asakusa", "Shinjuku", "Ebisu"];
const SUBJECT_OPTIONS = ["history", "photography", "technology", "art", "science", "culture", "anime & manga"];
const AGE_OPTIONS = ["Family-friendly", "Adults only"];

type Filters = {
  schedule: string[];
  area: string[];
  subject: string[];
  age: string[];
};

const EMPTY_FILTERS: Filters = { schedule: [], area: [], subject: [], age: [] };

function countFilters(f: Filters) {
  return f.schedule.length + f.area.length + f.subject.length + f.age.length;
}

const SUBJECT_TAG_MAP: Record<string, string[]> = {
  history: ["History", "Ukiyoe", "Edo"],
  photography: ["Photo", "Photography"],
  technology: ["Technology"],
  art: ["Art", "Contemporary", "Creative", "FineArt", "Impressionist", "Classic", "Craft", "Ceramics", "Modern", "Illustration", "PictureBook"],
  science: ["Science", "Space", "Dinosaur", "Nature", "Insects", "Education"],
  culture: ["Culture", "Urban", "Architecture"],
  "anime & manga": ["Anime", "Manga"],
};

function getSubjects(ex: Exhibition): string[] {
  return Object.entries(SUBJECT_TAG_MAP)
    .filter(([, tags]) => ex.tags.some((t) => tags.includes(t)))
    .map(([subject]) => subject);
}

function matchesFilters(ex: Exhibition, filters: Filters, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q && !ex.title.toLowerCase().includes(q) && !ex.museum.toLowerCase().includes(q)) return false;
  if (filters.schedule.length > 0 && !filters.schedule.includes(ex.schedule)) return false;
  if (filters.area.length > 0 && !filters.area.includes(ex.area)) return false;
  if (filters.subject.length > 0 && !filters.subject.some((s) => getSubjects(ex).includes(s))) return false;
  if (filters.age.length > 0) {
    const wantsFamily = filters.age.includes("Family-friendly");
    const wantsAdults = filters.age.includes("Adults only");
    if (wantsFamily && !wantsAdults && ex.ageGroup !== "family-friendly") return false;
    if (wantsAdults && !wantsFamily && ex.ageGroup === "family-friendly") return false;
  }
  return true;
}

function FilterChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-[13px] font-bold border ${
        selected
          ? "bg-primary text-white border-primary"
          : "bg-white text-navy border-navy/20"
      }`}
    >
      {label}
    </button>
  );
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-navy text-[14px] font-bold mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <FilterChip
            key={opt}
            label={opt}
            selected={selected.includes(opt)}
            onToggle={() => onToggle(opt)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSheet({
  open,
  pending,
  onToggle,
  onClear,
  onApply,
  onClose,
}: {
  open: boolean;
  pending: Filters;
  onToggle: (category: keyof Filters, value: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const count = countFilters(pending);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 z-50 max-w-[414px] mx-auto bg-cream rounded-t-3xl shadow-xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-navy/20" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-navy/10">
          <h2 className="text-navy text-[18px] font-bold">Filter</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-navy/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12Z" />
            </svg>
          </button>
        </div>
        <div className="px-5 pt-4 overflow-y-auto max-h-[60vh]">
          <FilterSection
            title="Schedule"
            options={SCHEDULE_OPTIONS}
            selected={pending.schedule}
            onToggle={(v) => onToggle("schedule", v)}
          />
          <FilterSection
            title="Area"
            options={AREA_OPTIONS}
            selected={pending.area}
            onToggle={(v) => onToggle("area", v)}
          />
          <FilterSection
            title="Subject"
            options={SUBJECT_OPTIONS}
            selected={pending.subject}
            onToggle={(v) => onToggle("subject", v)}
          />
          <FilterSection
            title="Age"
            options={AGE_OPTIONS}
            selected={pending.age}
            onToggle={(v) => onToggle("age", v)}
          />
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-navy/10">
          <button
            onClick={onClear}
            className="flex-1 border-2 border-primary text-primary text-[16px] font-bold py-2.5 rounded-[10px]"
          >
            Clear all
          </button>
          <button
            onClick={onApply}
            className="flex-1 bg-primary text-white text-[16px] font-bold py-2.5 rounded-[10px]"
          >
            {count > 0 ? `Apply (${count})` : "Apply"}
          </button>
        </div>
      </div>
    </>
  );
}

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
        small ? "w-[137px] flex-shrink-0" : "min-w-0"
      }`}
    >
      <div className="h-[113px] bg-gray-200">
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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filters>(() => {
    const state = location.state as { subjectFilter?: string; ageFilter?: string } | null;
    if (state?.subjectFilter) return { ...EMPTY_FILTERS, subject: [state.subjectFilter] };
    if (state?.ageFilter) return { ...EMPTY_FILTERS, age: [state.ageFilter] };
    return EMPTY_FILTERS;
  });
  const [pendingFilters, setPendingFilters] = useState<Filters>(EMPTY_FILTERS);

  function openFilter() {
    setPendingFilters(activeFilters);
    setFilterOpen(true);
  }

  function applyFilter() {
    setActiveFilters(pendingFilters);
    setFilterOpen(false);
  }

  function togglePending(category: keyof Filters, value: string) {
    setPendingFilters((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  const activeCount = countFilters(activeFilters);
  const isFiltering = searchQuery.trim().length > 0 || activeCount > 0;

  // Popular Exhibitions: curated featured items — always unfiltered, hidden while searching
  const popular = allResultIds
    .map((id) => exhibitions.find((e) => e.id === id))
    .filter((e): e is Exhibition => Boolean(e));

  // All Results: full catalog filtered when search/filters are active
  const all = popularIds
    .map((id) => exhibitions.find((e) => e.id === id))
    .filter((e): e is Exhibition => Boolean(e))
    .filter((e) => !isFiltering || matchesFilters(e, activeFilters, searchQuery));

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">

        {/* 1. Popular Exhibitions — only shown when no search or filter is active */}
        {!isFiltering && (
          <>
            <h1 className="text-navy text-[20px] font-bold mb-3">Popular Exhibitions</h1>
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {popular.map((ex) => (
                <ExhibitionCard key={ex.id} exhibition={ex} small />
              ))}
            </div>
          </>
        )}

        {/* 2. Search bar */}
        <div className="bg-white border-2 border-primary rounded-full h-14 flex items-center px-5 mb-5">
          <input
            className="flex-1 text-[16px] text-navy bg-transparent outline-none placeholder:text-navy/40"
            placeholder="search exhibitions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button aria-label="Search" className="p-1 text-navy/70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
          </button>
          <button
            aria-label="Filter"
            onClick={openFilter}
            className="relative p-1 ml-2 text-navy/70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={activeCount > 0 ? "#3FB8AF" : "currentColor"}>
              <path d="M3 18h6v-2H3v2Zm0-5h12v-2H3v2Zm0-7v2h18V6H3Z" />
            </svg>
            {activeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* 3. All Results — 2-column grid */}
        <h2 className="text-navy text-[20px] font-bold mb-3">All Results</h2>
        <div className="grid grid-cols-2 gap-4">
          {all.map((ex) => (
            <ExhibitionCard key={ex.id} exhibition={ex} />
          ))}
          {all.length === 0 && (
            <p className="col-span-2 text-navy/50 text-[14px] py-4">No results</p>
          )}
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

      <FilterSheet
        open={filterOpen}
        pending={pendingFilters}
        onToggle={togglePending}
        onClear={() => setPendingFilters(EMPTY_FILTERS)}
        onApply={applyFilter}
        onClose={() => setFilterOpen(false)}
      />
    </Layout>
  );
}
