import { Button } from "@/components/ui/button";
/**
 * StudentCard.tsx
 * Displays one student's profile as a card.
 * Has a "Contact" button that toggles showing the contact info.
 */
import { useState } from "react";
import type { StudentProfile } from "./CreateProfilePage";

interface StudentCardProps {
  student: StudentProfile;
  index: number; // Position in the list (used for data-ocid markers)
}

export default function StudentCard({ student, index }: StudentCardProps) {
  // Tracks whether the contact info is visible for this card
  const [showContact, setShowContact] = useState(false);

  // Split the skills string into an array so we can show them as pill tags
  // e.g. "React, Python" → ["React", "Python"]
  const skillList = student.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean); // Remove any empty entries

  // Role badge color -- each role gets its own subtle color
  const roleBadgeColor: Record<string, string> = {
    Developer: "bg-blue-50 text-blue-700",
    Designer: "bg-purple-50 text-purple-700",
    Editor: "bg-green-50 text-green-700",
    Other: "bg-gray-50 text-gray-700",
  };
  const roleColor =
    roleBadgeColor[student.role] ?? "bg-muted text-muted-foreground";

  return (
    <div
      data-ocid={`students.item.${index}`}
      className="bg-card rounded-xl border border-border shadow-card flex flex-col overflow-hidden"
    >
      {/* Card body */}
      <div className="p-6 flex-1 flex flex-col gap-3">
        {/* Name + Role row */}
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
          </div>
          {/* Role badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${roleColor}`}
          >
            {student.role}
          </span>
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

        {/* Contact info -- only visible after button click */}
        {showContact && student.contactInfo && (
          <div
            data-ocid={`students.item.${index}.panel`}
            className="mt-1 p-3 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
              Contact
            </p>
            <p className="text-sm text-foreground break-all">
              {student.contactInfo}
            </p>
          </div>
        )}
      </div>

      {/* Card footer with Contact button */}
      <div className="px-6 pb-6">
        <Button
          data-ocid={`students.item.${index}.button`}
          onClick={() => setShowContact((prev) => !prev)}
          className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {showContact ? "Hide Contact" : "Contact"}
        </Button>
      </div>
    </div>
  );
}
