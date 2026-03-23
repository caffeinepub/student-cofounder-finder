/**
 * Navbar.tsx
 * The top navigation bar shown on every page.
 * Shows the brand name on the left and nav links on the right.
 */
import type { Page } from "../App";

// Props this component expects
interface NavbarProps {
  currentPage: Page; // Which page is active (used to highlight the link)
  onNavigate: (page: Page) => void; // Function to switch pages
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  // Helper to build class names -- active link gets a blue color
  const linkClass = (page: Page) =>
    `text-sm font-medium cursor-pointer transition-colors px-1 py-0.5 rounded ${
      currentPage === page
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 shadow-xs">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand name on the left */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("home")}
          className="text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors"
        >
          CoFounder Finder
        </button>

        {/* Navigation links on the right */}
        <nav className="flex items-center gap-6">
          <button
            type="button"
            data-ocid="nav.home.link"
            onClick={() => onNavigate("home")}
            className={linkClass("home")}
          >
            Home
          </button>
          <button
            type="button"
            data-ocid="nav.create.link"
            onClick={() => onNavigate("create")}
            className={linkClass("create")}
          >
            Create Profile
          </button>
          <button
            type="button"
            data-ocid="nav.browse.link"
            onClick={() => onNavigate("browse")}
            className={linkClass("browse")}
          >
            Browse Students
          </button>
        </nav>
      </div>
    </header>
  );
}
