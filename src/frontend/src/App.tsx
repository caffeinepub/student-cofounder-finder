/**
 * App.tsx
 * Root component that manages which page is currently visible.
 * We use a simple string state instead of a router -- keeping it beginner-friendly!
 */
import { useState } from "react";
import CreateProfilePage from "./components/CreateProfilePage";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import ViewStudentsPage from "./components/ViewStudentsPage";

// The three pages our app can show
export type Page = "home" | "create" | "browse";

export default function App() {
  // 'currentPage' tracks which page is shown. Starts on the home page.
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar is always visible at the top */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main content area -- shows the active page */}
      <main className="flex-1">
        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "create" && (
          <CreateProfilePage onNavigate={setCurrentPage} />
        )}
        {currentPage === "browse" && (
          <ViewStudentsPage onNavigate={setCurrentPage} />
        )}
      </main>

      {/* Footer is always visible at the bottom */}
      <Footer />
    </div>
  );
}
