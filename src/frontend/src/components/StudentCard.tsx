/**
 * StudentCard.tsx
 * Displays one student's profile as a card.
 * Contact buttons (Call, WhatsApp, Email) have been replaced with
 * a single "Request Contact" button that creates a Firestore request.
 */
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import type { StudentProfile } from "./CreateProfilePage";

interface StudentCardProps {
  student: StudentProfile;
  index: number;
  /** The currently logged-in user's contact (from localStorage). */
  currentUser: string | null;
}

export default function StudentCard({
  student,
  index,
  currentUser,
}: StudentCardProps) {
  const skillList = student.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const roleBadgeColor: Record<string, string> = {
    Developer: "bg-blue-50 text-blue-700",
    Designer: "bg-purple-50 text-purple-700",
    Editor: "bg-green-50 text-green-700",
    Other: "bg-gray-50 text-gray-700",
  };
  const roleColor =
    roleBadgeColor[student.role] ?? "bg-muted text-muted-foreground";

  // Determine the identifier for this student card (phone or email)
  const studentContact =
    student.phone ||
    student.email ||
    (student.contactInfo?.includes("@")
      ? student.contactInfo
      : student.contactInfo);

  // -- Request Contact state --
  const [showConfirm, setShowConfirm] = useState(false);
  const [requested, setRequested] = useState(false);
  const [sending, setSending] = useState(false);

  // Hide the button on the current user's own card
  const isOwnCard =
    currentUser &&
    studentContact &&
    currentUser.toLowerCase().trim() === studentContact.toLowerCase().trim();

  /** Opens the confirmation popup. Only works when logged in. */
  function handleRequestClick() {
    if (!currentUser) {
      alert("Please log in to send a connection request.");
      return;
    }
    setShowConfirm(true);
  }

  /** Confirmed: save request to Firestore and update button state. */
  async function handleConfirm() {
    if (!currentUser || !studentContact) return;
    setSending(true);
    try {
      // Prevent duplicate requests between the same pair of users
      const existing = await getDocs(
        query(
          collection(db, "requests"),
          where("fromUser", "==", currentUser),
          where("toUser", "==", studentContact),
        ),
      );
      if (!existing.empty) {
        // Already sent — just update the UI
        setRequested(true);
        setShowConfirm(false);
        return;
      }

      await addDoc(collection(db, "requests"), {
        fromUser: currentUser,
        toUser: studentContact,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      setRequested(true);
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  }

  return (
    <div
      data-ocid={`students.item.${index}`}
      className="bg-card rounded-xl border border-border shadow-card flex flex-col overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col gap-3">
        {/* Name + Role + Branch row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight">
              {student.name}
            </h3>
            {student.age && (
              <span className="text-xs text-muted-foreground">
                Age {student.age}
              </span>
            )}
            {student.college && (
              <p className="text-xs text-muted-foreground mt-0.5">
                🎓 {student.college}
              </p>
            )}
          </div>
          {/* Role badge + optional branch badge */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${roleColor}`}
            >
              {student.role}
            </span>
            {student.branch && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                {student.branch}
              </span>
            )}
          </div>
        </div>

        {/* Skills as pill tags */}
        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skillList.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Project Idea */}
        {student.projectIdea && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              Project Idea
            </p>
            <p className="text-sm text-foreground">{student.projectIdea}</p>
          </div>
        )}

        {/* Project Description (optional) */}
        {student.projectDescription && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              Project Description
            </p>
            <p className="text-sm text-foreground">
              {student.projectDescription}
            </p>
          </div>
        )}
      </div>

      {/* Card footer: Request Contact button */}
      {!isOwnCard && (
        <div className="px-6 pb-6">
          {requested ? (
            /* After request sent: disabled confirmation state */
            <button
              type="button"
              disabled
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white text-center opacity-60 cursor-not-allowed"
              style={{ backgroundColor: "#22C55E" }}
            >
              ✅ Request Sent
            </button>
          ) : (
            <button
              data-ocid={`students.item.${index}.button`}
              type="button"
              onClick={handleRequestClick}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#2563EB" }}
            >
              🤝 Request Contact
            </button>
          )}
        </div>
      )}

      {/* Confirmation popup -- uses <dialog> for proper accessibility */}
      {showConfirm && (
        <dialog
          open
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 border-0 p-0 max-w-none w-full h-full"
          onClose={() => !sending && setShowConfirm(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Send Connection Request
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Send a request to connect. Contact will be shared only if
              accepted.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={sending}
                className="flex-1 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={sending}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#2563EB" }}
              >
                {sending ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
