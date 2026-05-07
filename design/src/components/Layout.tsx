import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

function StatusBar() {
  return (
    <div className="flex h-[44px] items-center justify-between px-6 text-[14px] font-medium text-navy">
      <span>9:30</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 0a8 8 0 0 1 5.66 2.34l-1.06 1.06A6.5 6.5 0 0 0 8 1.5a6.5 6.5 0 0 0-4.6 1.9L2.34 2.34A8 8 0 0 1 8 0Zm0 3a5 5 0 0 1 3.54 1.46l-1.06 1.06A3.5 3.5 0 0 0 8 4.5a3.5 3.5 0 0 0-2.48 1.02L4.46 4.46A5 5 0 0 1 8 3Zm0 3a2 2 0 0 1 1.41.59L8 8 6.59 6.59A2 2 0 0 1 8 6Z" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4" y="5" width="3" height="6" rx="0.5" />
          <rect x="8" y="3" width="3" height="8" rx="0.5" />
          <rect x="12" y="0" width="3" height="11" rx="0.5" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="18"
            height="10"
            rx="2"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2" y="2" width="13" height="7" rx="1" fill="currentColor" />
          <rect
            x="20"
            y="3.5"
            width="1.5"
            height="4"
            rx="0.5"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-primary h-[64px] flex items-center px-4 text-cream">
      <Link
        to="/my-tickets"
        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        aria-label="My tickets"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.5 0-8 1.75-8 5v1h16v-1c0-3.25-4.5-5-8-5Z" />
        </svg>
      </Link>
      <Link
        to="/"
        className="flex-1 text-center text-[24px] font-bold tracking-tight"
      >
        Visit Museums
      </Link>
      <button className="w-10 h-10 flex items-center justify-center" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
        </svg>
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primaryLight text-navy h-[100px] flex items-center justify-center">
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center w-[320px] text-center">
        <span className="text-[16px] font-medium">About</span>
        <span className="text-[16px] font-medium">Q&amp;A</span>
        <span className="text-[16px] font-medium">Privacy</span>
        <span className="text-[16px] font-medium">Terms</span>
        <p className="basis-full text-[12px] font-bold">Visit museums ©2026</p>
      </div>
    </footer>
  );
}

export function PrimaryButton({
  children,
  onClick,
  to,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
}) {
  const cls =
    "block w-full bg-primary disabled:opacity-50 text-white font-bold text-[20px] text-center py-2.5 rounded-[10px]";
  if (to && !disabled) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function GoBackButton({ to }: { to?: string }) {
  const location = useLocation();
  const dest = to ?? -1;
  const content = (
    <span className="flex items-center justify-center gap-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12Z" />
      </svg>
      <span className="text-[20px] font-bold">Go back</span>
    </span>
  );
  const cls =
    "block w-full bg-primary/30 text-navy text-center py-2.5 rounded-[10px]";
  if (typeof dest === "string") {
    return (
      <Link to={dest} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button
      onClick={() => window.history.back()}
      className={cls}
      key={location.pathname}
    >
      {content}
    </button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="phone-shell flex flex-col">
      <StatusBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
