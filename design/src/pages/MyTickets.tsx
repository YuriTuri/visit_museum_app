import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useBooking } from "../context/BookingContext";
import { findExhibition } from "../data/exhibitions";
import { formatDateLong } from "../components/BookingHeader";

export default function MyTickets() {
  const { bookings } = useBooking();

  return (
    <Layout>
      <div className="px-4 pt-5 pb-6 flex flex-col gap-4">
        <h1 className="text-navy text-[24px] font-bold">My Tickets</h1>

        {bookings.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 text-center">
            <p className="text-navy/60 text-[14px]">
              You don't have any tickets yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const exhibition = findExhibition(b.exhibitionId);
              if (!exhibition) return null;
              return (
                <Link
                  key={b.bookingId}
                  to={`/ticket/${b.bookingId}`}
                  className="flex items-center bg-white/80 rounded-2xl px-[10px] py-4 gap-4"
                >
                  <div className="w-[90px] h-[80px] flex-shrink-0 overflow-hidden rounded bg-navy/10">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-navy text-[16px] font-bold leading-6 truncate">
                      {exhibition.title}
                    </p>
                    <p className="text-navy/80 text-[12px] font-bold mt-1 truncate">
                      {exhibition.museum}
                    </p>
                    <div className="flex items-center justify-between text-navy/80 text-[14px] font-bold mt-1">
                      <span>{formatDateLong(b.date)}</span>
                      <span>{b.time}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-primary/30 text-navy py-2.5 rounded-[10px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
          </svg>
          <span className="text-[20px] font-bold">Go back to Home</span>
        </Link>
      </div>
    </Layout>
  );
}
