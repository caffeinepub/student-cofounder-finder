/**
 * SplashScreen.tsx
 * Animated intro screen shown once per session.
 * Automatically navigates to the login page after the animation completes.
 * Skipped entirely if the user is already logged in.
 */
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  // Controls the fade-out of the entire splash screen before navigating away
  const [fadingOut, setFadingOut] = useState(false);

  // Trigger: title fades in immediately, tagline fades in after 0.8s,
  // then fade-out starts at 2.2s, and onDone is called at 2.7s (after fade-out)
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFadingOut(true), 2200);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem("splashShown", "true");
      onDone();
    }, 2700);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  // Skip button: immediately mark as shown and navigate away
  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem("splashShown", "true");
      onDone();
    }, 400);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EFF6FF 0%, #F3EEFF 100%)",
        zIndex: 9999,
        // Fade the whole screen out before navigating
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        padding: "1rem",
      }}
    >
      {/* Skip button — top right */}
      <button
        type="button"
        onClick={handleSkip}
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          background: "transparent",
          border: "1px solid #D1D5DB",
          borderRadius: "9999px",
          padding: "0.3rem 0.9rem",
          fontSize: "0.8rem",
          color: "#6B7280",
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
      >
        Skip
      </button>

      {/* Main Title — fades in + scales up */}
      <div
        style={{
          animation: "splashTitle 0.8s ease forwards",
          opacity: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            fontWeight: 800,
            background: "linear-gradient(to right, #2563EB, #7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          👥 TeamUp
        </span>
      </div>

      {/* Tagline — fades in 0.8s after title */}
      <div
        style={{
          animation: "splashTagline 0.8s ease 0.8s forwards",
          opacity: 0,
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          Find teammates in your college in 30 seconds.
        </p>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes splashTitle {
          0%   { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splashTagline {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
