import { Link } from "react-router-dom";
import Layout, { PrimaryButton } from "../components/Layout";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";
import { formatDateLong } from "../components/BookingHeader";

export default function MyTickets() {
  const { bookings } = useBooking();

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6">
        <h1 className="text-navy text-[20px] font-bold mb-3">My Tickets</h1>

        {bookings.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 text-center mb-4">
            <p className="text-navy/60 text-[14px] mb-4">
              You don't have any tickets yet.
            </p>
            <PrimaryButton to="/">Browse exhibitions</PrimaryButton>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {bookings.map((b) => {
              const exhibition = findExhibition(b.exhibitionId);
              if (!exhibition) return null;
              const totalCount = Object.values(b.counts).reduce(
                (s, n) => s + n,
                0,
              );
              return (
                <Link
                  key={b.bookingId}
                  to={`/ticket/${b.bookingId}`}
                  className="block bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-[110px] h-[110px] flex-shrink-0 bg-navy/10">
                      <img
                        src={exhibition.image}
                        alt={exhibition.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 px-3 py-3">
                      <p className="text-navy text-[14px] font-bold leading-tight line-clamp-2 mb-1">
                        {exhibition.title}
                      </p>
                      <p className="text-navy/70 text-[11px] font-bold mb-2 truncate">
                        {exhibition.museum}
                      </p>
                      <div className="flex items-center gap-2 text-navy text-[12px] font-bold">
                        <span>{formatDateLong(b.date)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-navy text-[12px] font-bold">
                          {b.time} · {totalCount} ticket{totalCount === 1 ? "" : "s"}
                        </span>
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          to="/"
          className="block w-full bg-primary/30 text-navy text-center py-2.5 rounded-[10px] text-[20px] font-bold"
        >
          Browse exhibitions
        </Link>
      </div>
    </Layout>
  );
}
