/**
 * Navbar.tsx
 * The top navigation bar shown on every page.
 * When logged in: shows logo + Home + Browse + Logout button.
 * When not logged in: shows only the logo.
 */
import type { Page } from "../App";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser: string | null;
  onLogout: () => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}: NavbarProps) {
  // Style for nav links -- highlights active page with pink underline
  const linkClass = (page: Page) =>
    `text-sm font-medium cursor-pointer transition-colors px-1 py-0.5 ${
      currentPage === page
        ? "text-foreground font-semibold border-b-2 pb-0.5"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const linkStyle = (page: Page) =>
    currentPage === page ? { borderBottomColor: "#FF2D55" } : {};

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("home")}
          className="text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors"
        >
          👥 TeamUp
        </button>

        {/* Right side: nav links + logout (only when logged in) */}
        {currentUser && (
          <nav className="flex items-center gap-6">
            <button
              type="button"
              data-ocid="nav.home.link"
              onClick={() => onNavigate("home")}
              className={linkClass("home")}
              style={linkStyle("home")}
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.browse.link"
              onClick={() => onNavigate("browse")}
              className={linkClass("browse")}
              style={linkStyle("browse")}
            >
              Browse Students
            </button>

            {/* Logout button -- clean, subtle red style */}
            <button
              type="button"
              data-ocid="nav.logout.button"
              onClick={onLogout}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg border transition-all hover:opacity-90 active:scale-95"
              style={{
                color: "#EF4444",
                borderColor: "#FCA5A5",
                background: "#FFF5F5",
              }}
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
