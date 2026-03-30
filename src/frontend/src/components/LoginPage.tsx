/**
 * LoginPage.tsx
 * Simple login screen where users enter their email or phone to log in.
 * Checks against saved profiles in localStorage.
 */
import { useState } from "react";
import type { Page } from "../App";
import type { StudentProfile } from "./CreateProfilePage";

interface LoginPageProps {
  onLogin: (contact: string) => void;
  onNavigate: (page: Page) => void;
}

// Normalize contact: lowercase, remove spaces
function cleanContact(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const cleaned = cleanContact(contact);
    if (!cleaned) {
      setError("Please enter your email or phone.");
      return;
    }

    // Load all saved profiles from localStorage
    const students: StudentProfile[] = JSON.parse(
      localStorage.getItem("students") || "[]",
    );

    // Check if any profile matches after cleaning:
    // Try contactInfo (old profiles), phone, and email fields
    const match = students.find((s) => {
      const byContactInfo = s.contactInfo
        ? cleanContact(s.contactInfo) === cleaned
        : false;
      const byPhone = s.phone ? cleanContact(s.phone) === cleaned : false;
      const byEmail = s.email ? cleanContact(s.email) === cleaned : false;
      return byContactInfo || byPhone || byEmail;
    });

    if (match) {
      // Found! Log the user in using whichever contact matched
      const loginKey =
        match.contactInfo || match.phone || match.email || cleaned;
      onLogin(cleanContact(loginKey));
    } else {
      setError("No profile found. Please create your profile first.");
    }
  };

  return (
    // Full-screen centered layout with subtle background
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #F3EEFF 100%)",
      }}
    >
      {/* Brand logo above the card */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-1" style={{ color: "#2563EB" }}>
          👥 TeamUp
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Find teammates. Build projects. Grow together.
        </p>
      </div>

      {/* Login card */}
      <div
        className="bg-white rounded-2xl border shadow-lg p-8 w-full max-w-sm"
        style={{ borderColor: "#E5E7EB" }}
        data-ocid="login.card"
      >
        <h2
          className="text-xl font-bold mb-1 text-center"
          style={{ color: "#1F2937" }}
        >
          Welcome back!
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: "#6B7280" }}>
          Log in to find your teammates.
        </p>

        {/* Contact input */}
        <div className="space-y-3">
          <input
            data-ocid="login.input"
            type="text"
            placeholder="Enter your email or phone"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setError(""); // Clear error on type
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all"
            style={{
              borderColor: error ? "#EF4444" : "#D1D5DB",
              color: "#1F2937",
            }}
          />

          {/* Error message */}
          {error && (
            <p
              data-ocid="login.error_state"
              className="text-xs"
              style={{ color: "#EF4444" }}
            >
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            data-ocid="login.primary_button"
            type="button"
            onClick={handleLogin}
            className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-transform active:scale-95 hover:opacity-90"
            style={{ background: "#2563EB" }}
          >
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 border-t" style={{ borderColor: "#F3F4F6" }} />

        {/* Create profile link */}
        <p className="text-center text-sm" style={{ color: "#6B7280" }}>
          Don't have a profile?{" "}
          <button
            data-ocid="login.create_profile.link"
            type="button"
            onClick={() => onNavigate("create")}
            className="font-semibold underline underline-offset-2 transition-colors hover:opacity-80"
            style={{ color: "#7C3AED" }}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
