import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Page } from "../App";
import type { StudentProfile } from "./CreateProfilePage";
import StudentCard from "./StudentCard";

const ROLE_OPTIONS = [
  "All Roles",
  "Developer",
  "Designer",
  "Editor",
  "Other",
] as const;
type RoleFilter = (typeof ROLE_OPTIONS)[number];

interface ViewStudentsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ViewStudentsPage({
  onNavigate,
}: ViewStudentsPageProps) {
  // Load all student profiles from localStorage
  const [students] = useState<StudentProfile[]>(() => {
    return JSON.parse(localStorage.getItem("students") || "[]");
  });

  const [selectedRole, setSelectedRole] = useState<RoleFilter>("All Roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");

  // Check if any filter is currently active
  const isFilterActive =
    selectedRole !== "All Roles" ||
    searchQuery.trim() !== "" ||
    collegeQuery.trim() !== "";

  // Apply all filters together: role AND skill search AND college (case-insensitive, partial)
  const filteredStudents = students.filter((s) => {
    const matchesRole = selectedRole === "All Roles" || s.role === selectedRole;

    // Skill search: partial case-insensitive match
    const matchesSearch =
      searchQuery.trim() === "" ||
      s.skills.toLowerCase().includes(searchQuery.trim().toLowerCase());

    // College filter: match against s.college; if no college field, only pass when filter is empty
    const matchesCollege =
      collegeQuery.trim() === "" ||
      (s.college
        ? s.college.toLowerCase().includes(collegeQuery.trim().toLowerCase())
        : false);

    return matchesRole && matchesSearch && matchesCollege;
  });

  // Count label: "X Students Available" when no filter, "X Students Found" when filter active
  const displayCount = filteredStudents.length;
  const countLabel = isFilterActive ? "Students Found" : "Students Available";

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("All Roles");
    setCollegeQuery("");
  };

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Browse Students
          </h2>
        </div>

        {/* Case 1: No profiles exist in localStorage at all */}
        {students.length === 0 ? (
          <div
            data-ocid="students.empty_state"
            className="text-center py-20 bg-card rounded-xl border border-border shadow-card"
          >
            <p className="text-4xl mb-4">🎓</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No students have joined yet
            </h3>
            <Button
              data-ocid="students.create.primary_button"
              onClick={() => onNavigate("create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              Create Your Profile
            </Button>
          </div>
        ) : (
          <>
            {/* Search + Filter row */}
            <div className="flex flex-col gap-3 mb-4">
              {/* Row 1: skill search + role dropdown + college input (+ clear on desktop) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Search by skill */}
                <input
                  type="text"
                  data-ocid="students.search_input"
                  placeholder="Search by skill (e.g., Java, Design)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />

                {/* Role filter dropdown */}
                <select
                  id="role-filter"
                  data-ocid="students.filter.select"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as RoleFilter)
                  }
                  className="w-full sm:w-40 rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                {/* College filter input */}
                <input
                  type="text"
                  data-ocid="students.college.search_input"
                  placeholder="Filter by college"
                  value={collegeQuery}
                  onChange={(e) => setCollegeQuery(e.target.value)}
                  className="w-full sm:w-48 rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />

                {/* Clear Filters button: inline on sm+ when filter is active */}
                {isFilterActive && (
                  <button
                    type="button"
                    data-ocid="students.filter.secondary_button"
                    onClick={clearFilters}
                    className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Row 2: Clear Filters button stacked on mobile only */}
              {isFilterActive && (
                <div className="sm:hidden">
                  <button
                    type="button"
                    data-ocid="students.filter.cancel_button"
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Top profile count */}
            <p className="text-sm text-muted-foreground mb-6">
              <strong className="text-foreground">{displayCount}</strong>{" "}
              {countLabel}
            </p>

            {/* Case 2: Filters active but no results */}
            {filteredStudents.length === 0 ? (
              <div
                data-ocid="students.filter.empty_state"
                className="text-center py-20 bg-card rounded-xl border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  No students found
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div
                data-ocid="students.list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredStudents.map((student, index) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    index={index + 1}
                  />
                ))}
              </div>
            )}

            {/* Bottom count */}
            {filteredStudents.length > 0 && (
              <p className="text-sm text-muted-foreground text-center mt-8">
                Showing{" "}
                <strong className="text-foreground">
                  {filteredStudents.length}
                </strong>{" "}
                student{filteredStudents.length !== 1 ? "s" : ""}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
