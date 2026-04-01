/**
 * Navbar.tsx
 * The top navigation bar shown on every page.
 * When logged in: shows logo + Home + Browse + Bell (requests) + Edit Profile + Logout.
 * When not logged in: shows only the logo.
 */
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import { db } from "../firebase";
import ConnectionRequestsPanel from "./ConnectionRequestsPanel";

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
  const [showPanel, setShowPanel] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending request count for the badge
  useEffect(() => {
    if (!currentUser) return;
    const fetchCount = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("toUser", "==", currentUser),
          where("status", "==", "pending"),
        );
        const snapshot = await getDocs(q);
        setPendingCount(snapshot.size);
      } catch (err) {
        console.error("Failed to fetch request count:", err);
      }
    };
    fetchCount();
  }, [currentUser]);

  // Refresh count after panel closes (user may have accepted/rejected)
  const handleClosePanel = () => {
    setShowPanel(false);
    if (!currentUser) return;
    const refreshCount = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("toUser", "==", currentUser),
          where("status", "==", "pending"),
        );
        const snapshot = await getDocs(q);
        setPendingCount(snapshot.size);
      } catch (_) {
        // silently ignore
      }
    };
    refreshCount();
  };

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
          &#128101; TeamUp
        </button>

        {/* Right side: nav links + action buttons (only when logged in) */}
        {currentUser && (
          <nav className="flex items-center gap-4">
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

            {/* Bell icon -- connection requests */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                data-ocid="nav.requests.button"
                onClick={() => setShowPanel((prev) => !prev)}
                aria-label="Connection Requests"
                style={{
                  background: showPanel ? "#EFF6FF" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: 8,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                {/* Bell SVG */}
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1F2937"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {/* Unread badge */}
                {pendingCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "#FF2D55",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 16,
                      height: 16,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {showPanel && currentUser && (
                <ConnectionRequestsPanel
                  currentUser={currentUser}
                  onClose={handleClosePanel}
                />
              )}
            </div>

            {/* Edit Profile button -- purple style */}
            <button
              type="button"
              data-ocid="nav.edit_profile.button"
              onClick={() => onNavigate("edit")}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-95"
              style={{
                color: "#FFFFFF",
                background: "#7C3AED",
              }}
            >
              Edit Profile
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
