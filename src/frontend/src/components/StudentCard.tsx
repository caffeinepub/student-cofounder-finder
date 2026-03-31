/**
 * StudentCard.tsx
 * Displays one student's profile as a card.
 * Shows 3 contact action buttons: Call, WhatsApp, Email.
 * Also shows projectDescription if available.
 */
import type { StudentProfile } from "./CreateProfilePage";

interface StudentCardProps {
  student: StudentProfile;
  index: number;
}

// Build WhatsApp URL: strip non-digits, add country code 91 if number < 12 digits
function buildWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const number = digits.length >= 12 ? digits : `91${digits}`;
  return `https://wa.me/${number}`;
}

export default function StudentCard({ student, index }: StudentCardProps) {
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

  // Derive phone and email from new fields or fall back to old contactInfo
  // Old profiles may have only contactInfo; detect by checking for "@"
  const phone =
    student.phone ||
    (!student.email && student.contactInfo && !student.contactInfo.includes("@")
      ? student.contactInfo
      : undefined);
  const email =
    student.email ||
    (student.contactInfo?.includes("@") ? student.contactInfo : undefined);

  // Shared disabled style for unavailable buttons
  const disabledStyle = "pointer-events-none opacity-40 cursor-not-allowed";

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
            {/* College name shown below age */}
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

        {/* Project Description (optional, shown only if available) */}
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

      {/* Card footer: 3 contact action buttons */}
      <div className="px-6 pb-6">
        {/* Mobile: stacked vertically; sm+: horizontal row */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* ── Call button (blue) ── */}
          {phone ? (
            <a
              data-ocid={`students.item.${index}.button`}
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2563EB" }}
            >
              📞 Call
            </a>
          ) : (
            <span
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-white text-center ${disabledStyle}`}
              style={{ backgroundColor: "#6B7280" }}
            >
              📞 Call
            </span>
          )}

          {/* ── WhatsApp button (green) ── */}
          {phone ? (
            <a
              data-ocid={`students.item.${index}.button`}
              href={buildWhatsAppUrl(phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#22C55E" }}
            >
              💬 WhatsApp
            </a>
          ) : (
            <span
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-white text-center ${disabledStyle}`}
              style={{ backgroundColor: "#6B7280" }}
            >
              💬 WhatsApp
            </span>
          )}

          {/* ── Email button (neutral outline) ── */}
          {email ? (
            <a
              data-ocid={`students.item.${index}.button`}
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-center border border-border transition-colors hover:bg-muted"
              style={{ color: "#1F2937" }}
            >
              ✉️ Email
            </a>
          ) : (
            <span
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-center border border-border ${disabledStyle}`}
              style={{ color: "#1F2937" }}
            >
              ✉️ Email
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
