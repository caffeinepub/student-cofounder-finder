import { Button } from "@/components/ui/button";
/**
 * ViewStudentsPage.tsx
 * Shows all saved student profiles in a grid of cards.
 * Reads from localStorage -- no backend needed.
 */
import { useState } from "react";
import type { Page } from "../App";
import type { StudentProfile } from "./CreateProfilePage";
import StudentCard from "./StudentCard";

interface ViewStudentsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ViewStudentsPage({
  onNavigate,
}: ViewStudentsPageProps) {
  // Read profiles from localStorage every time this page is shown
  // We use useState with an initializer function so it only reads once on mount
  const [students] = useState<StudentProfile[]>(() => {
    return JSON.parse(localStorage.getItem("students") || "[]");
  });

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Browse Students
          </h2>
          <p className="text-muted-foreground text-sm">
            {students.length > 0
              ? `${students.length} student${students.length === 1 ? "" : "s"} looking for teammates`
              : "No profiles yet. Be the first to create one!"}
          </p>
        </div>

        {/* If no profiles exist, show an empty state with a CTA */}
        {students.length === 0 ? (
          <div
            data-ocid="students.empty_state"
            className="text-center py-20 bg-card rounded-xl border border-border shadow-card"
          >
            <p className="text-4xl mb-4">🎓</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No students yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Create the first profile and start finding teammates!
            </p>
            <Button
              data-ocid="students.create.primary_button"
              onClick={() => onNavigate("create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              Create Profile
            </Button>
          </div>
        ) : (
          // Grid of student cards
          <div
            data-ocid="students.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {students.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
