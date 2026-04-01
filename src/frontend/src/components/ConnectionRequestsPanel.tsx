/**
 * ConnectionRequestsPanel.tsx
 * Dropdown panel showing incoming pending connection requests.
 * Uses the existing Firestore "requests" collection.
 */
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";

interface Request {
  id: string;
  fromUser: string;
  toUser: string;
  status: string;
  timestamp?: number;
}

interface Props {
  currentUser: string;
  onClose: () => void;
}

export default function ConnectionRequestsPanel({
  currentUser,
  onClose,
}: Props) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Fetch pending incoming requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("toUser", "==", currentUser),
          where("status", "==", "pending"),
        );
        const snapshot = await getDocs(q);
        const data: Request[] = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<Request, "id">),
          id: d.id,
        }));
        data.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [currentUser]);

  const handleAction = async (
    requestId: string,
    action: "accepted" | "rejected",
  ) => {
    setActionLoading(requestId);
    try {
      await updateDoc(doc(db, "requests", requestId), { status: action });
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to update request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Friendly short display name from contact string
  const displayName = (contact: string) => {
    if (contact.includes("@")) {
      const local = contact.split("@")[0];
      return local.length > 18 ? `${local.slice(0, 18)}2026` : local;
    }
    return contact;
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 320,
        maxWidth: "90vw",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
        border: "1px solid #E5E7EB",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1F2937" }}>
          Connection Requests
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: 20,
            lineHeight: 1,
            padding: "0 2px",
          }}
          aria-label="Close panel"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            Loading…
          </div>
        ) : requests.length === 0 ? (
          <div
            style={{
              padding: "28px 18px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            No pending requests
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid #F9FAFB",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                &#128100;
              </div>

              {/* Name + action buttons */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1F2937",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayName(req.fromUser)}
                </div>
                <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    disabled={actionLoading === req.id}
                    onClick={() => handleAction(req.id, "accepted")}
                    style={{
                      background: "#22C55E",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor:
                        actionLoading === req.id ? "not-allowed" : "pointer",
                      opacity: actionLoading === req.id ? 0.6 : 1,
                    }}
                  >
                    {actionLoading === req.id ? "…" : "Accept"}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === req.id}
                    onClick={() => handleAction(req.id, "rejected")}
                    style={{
                      background: "#FFF5F5",
                      color: "#EF4444",
                      border: "1px solid #FCA5A5",
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor:
                        actionLoading === req.id ? "not-allowed" : "pointer",
                      opacity: actionLoading === req.id ? 0.6 : 1,
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
