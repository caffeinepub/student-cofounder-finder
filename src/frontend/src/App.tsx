/**
 * App.tsx
 * Root component that manages which page is currently visible.
 * Shows a splash screen once per session (skipped if user is already logged in).
 */
import { useState } from "react";
import CreateProfilePage from "./components/CreateProfilePage";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import ViewStudentsPage from "./components/ViewStudentsPage";

// Pages our app can show
export type Page = "home" | "create" | "browse" | "login";

/**
 * Decide whether to show the splash screen:
 * - Skip if the user is already logged in (returning user)
 * - Skip if the splash has already been shown this session
 * - Otherwise show it
 */
function shouldShowSplash(): boolean {
  // Already logged in → skip splash entirely
  if (localStorage.getItem("currentUser")) return false;
  // Already shown this session → skip
  if (sessionStorage.getItem("splashShown")) return false;
  return true;
}

export default function App() {
  // Show splash screen on first load of the session (only for logged-out users)
  const [showSplash, setShowSplash] = useState<boolean>(shouldShowSplash);

  // Check localStorage on startup -- if a user is already logged in, go to home
  const [currentPage, setCurrentPage] = useState<Page>(
    localStorage.getItem("currentUser") ? "home" : "login",
  );

  // Track the logged-in user's contact (or null if not logged in)
  const [currentUser, setCurrentUser] = useState<string | null>(
    localStorage.getItem("currentUser"),
  );

  // Called when the splash animation finishes — move to login
  const handleSplashDone = () => {
    setShowSplash(false);
  };

  // Called when login succeeds (from LoginPage or CreateProfilePage)
  const handleLogin = (contact: string) => {
    localStorage.setItem("currentUser", contact);
    setCurrentUser(contact);
    setCurrentPage("home");
  };

  // Called when user clicks Logout in the navbar
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setCurrentPage("login");
  };

  // After profile creation for a non-logged-in user, log them in and go to browse
  const handleProfileCreated = (contact: string) => {
    localStorage.setItem("currentUser", contact);
    setCurrentUser(contact);
    setCurrentPage("browse");
  };

  // Show splash screen if needed (rendered on top of everything)
  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Only show Navbar when user is logged in (not on the login page) */}
      {currentPage !== "login" && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main content area */}
      <main className="flex-1">
        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
        )}
        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "create" && (
          <CreateProfilePage
            onNavigate={setCurrentPage}
            onLogin={handleProfileCreated}
          />
        )}
        {currentPage === "browse" && (
          <ViewStudentsPage onNavigate={setCurrentPage} />
        )}
      </main>

      {/* Footer only on non-login pages */}
      {currentPage !== "login" && <Footer />}
    </div>
  );
}
