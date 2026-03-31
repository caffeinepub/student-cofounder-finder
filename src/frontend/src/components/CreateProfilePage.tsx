import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
/**
 * CreateProfilePage.tsx
 * The form where students fill in their details to create or edit a profile.
 * Supports two modes:
 *   - Create mode (default): creates a new Firestore document
 *   - Edit mode: pre-fills form with existing data and updates Firestore document
 */
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import { db } from "../firebase";

// The shape of a student profile
export interface StudentProfile {
  id: string;
  name: string;
  age: string;
  role: string;
  branch?: string; // Optional: Branch / Domain field
  skills: string;
  projectIdea: string;
  projectDescription?: string; // Optional: longer project description
  contactInfo?: string; // kept for backward compat (old profiles)
  phone?: string; // phone number
  email?: string; // email address
  college?: string; // college / university
}

interface CreateProfilePageProps {
  onNavigate: (page: Page) => void;
  // Called after successful creation -- sets currentUser and navigates to browse
  onLogin: (contact: string) => void;
  // Edit mode: pre-fill form with existing data
  editMode?: boolean;
  // The logged-in user's contact (email or phone) -- used to find their Firestore doc
  currentUser?: string | null;
}

// Normalize contact: lowercase, remove spaces
function cleanContact(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

// Branch / Domain options
const BRANCH_OPTIONS = [
  "Computer Science / IT",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Communication",
  "Chemical Engineering",
  "Biotechnology",
  "Pharmacy",
  "Medical / Healthcare",
  "Business / Commerce",
  "Arts / Humanities",
  "Science (Physics / Chemistry / Maths)",
  "Other",
];

// Predefined Indian colleges list for autocomplete
const INDIAN_COLLEGES = [
  // Andhra Pradesh
  "Jawaharlal Nehru Technological University Kakinada (JNTUK)",
  "Jawaharlal Nehru Technological University Anantapur (JNTUA)",
  "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
  "Andhra University",
  "Sri Venkateswara University",
  "Acharya Nagarjuna University",
  "Koneru Lakshmaiah Education Foundation (KL University)",
  "VIT-AP University",
  "SRM University AP",
  "Vignan's Foundation for Science Technology & Research",
  "Gayatri Vidya Parishad College of Engineering",
  "Raghu Engineering College",
  "Lakireddy Bali Reddy College of Engineering",
  "Seshadri Rao Gudlavalleru Engineering College",
  "RVR & JC College of Engineering",
  "Bapatla Engineering College",
  "Narasaraopeta Engineering College",
  "PB Siddhartha College of Arts & Science",
  "DNR College of Engineering & Technology",
  "Vasireddy Venkatadri Institute of Technology (VVIT)",
  // Telangana
  "Osmania University",
  "University of Hyderabad",
  "BITS Pilani Hyderabad Campus",
  "Chaitanya Bharathi Institute of Technology (CBIT)",
  "Gokaraju Rangaraju Institute of Engineering & Technology (GRIET)",
  "CVR College of Engineering",
  "Malla Reddy Engineering College",
  "Vardhaman College of Engineering",
  // IITs
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Kharagpur",
  "IIT Kanpur",
  "IIT Roorkee",
  "IIT Hyderabad",
  "IIT Tirupati",
  "IIT Gandhinagar",
  "IIT BHU Varanasi",
  "IIT Guwahati",
  // NITs
  "NIT Warangal",
  "NIT Trichy",
  "NIT Calicut",
  "NIT Surathkal",
  "NIT Rourkela",
  "NIT Kurukshetra",
  "NIT Jaipur",
  "NIT Allahabad",
  "NIT Nagpur",
  // Other major Indian universities
  "BITS Pilani",
  "VIT University Vellore",
  "Manipal Institute of Technology",
  "SRM Institute of Science and Technology",
  "Amrita Vishwa Vidyapeetham",
  "PSG College of Technology",
  "Thapar Institute of Engineering & Technology",
  "Delhi Technological University",
  "Netaji Subhas University of Technology",
  "Mumbai University",
  "Pune University",
  "Anna University",
  "Bangalore University",
  "Calcutta University",
];

/**
 * CollegeAutocomplete
 * A text input with dropdown suggestions from INDIAN_COLLEGES.
 * Shows up to 6 matches as user types; allows free-form entry too.
 */
function CollegeAutocomplete({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter colleges matching input (case-insensitive), max 6
  const suggestions =
    value.trim().length >= 1
      ? INDIAN_COLLEGES.filter((c) =>
          c.toLowerCase().includes(value.trim().toLowerCase()),
        ).slice(0, 6)
      : [];

  const handleSelect = (college: string) => {
    onChange(college);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        data-ocid="profile.college.input"
        id="college"
        type="text"
        placeholder="e.g. Mumbai University"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() =>
          // slight delay so click on suggestion registers first
          setTimeout(() => setShowSuggestions(false), 150)
        }
        disabled={disabled}
        autoComplete="off"
        className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-white shadow-lg">
          {suggestions.map((college) => (
            <button
              key={college}
              type="button"
              onMouseDown={() => handleSelect(college)}
              className="w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {college}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreateProfilePage({
  onNavigate,
  onLogin,
  editMode = false,
  currentUser,
}: CreateProfilePageProps) {
  // In create mode only: check if user is already logged in (block duplicate creation)
  const sessionUser = currentUser ?? localStorage.getItem("currentUser");

  const [form, setForm] = useState({
    name: "",
    age: "",
    role: "",
    branch: "",
    skills: "",
    projectIdea: "",
    projectDescription: "",
    college: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Firestore document ID used when updating in edit mode
  const [editDocId, setEditDocId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(editMode);

  /**
   * In edit mode: fetch the current user's profile from Firestore and pre-fill the form.
   */
  useEffect(() => {
    if (!editMode || !sessionUser) {
      setLoadingEdit(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const cleaned = cleanContact(sessionUser);

        // Find the document that matches the current user's phone or email
        const found = snapshot.docs.find((d) => {
          const data = d.data() as Omit<StudentProfile, "id">;
          const docPhone = data.phone ? cleanContact(data.phone) : "";
          const docEmail = data.email ? cleanContact(data.email) : "";
          const docContact = data.contactInfo
            ? cleanContact(data.contactInfo)
            : "";
          return (
            docPhone === cleaned ||
            docEmail === cleaned ||
            docContact === cleaned
          );
        });

        if (found) {
          const data = found.data() as Omit<StudentProfile, "id">;
          setEditDocId(found.id);
          // Pre-fill form with existing data
          setForm({
            name: data.name || "",
            age: data.age || "",
            role: data.role || "",
            branch: data.branch || "",
            skills: data.skills || "",
            projectIdea: data.projectIdea || "",
            projectDescription: data.projectDescription || "",
            college: data.college || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile for edit:", err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoadingEdit(false);
      }
    };

    loadProfile();
  }, [editMode, sessionUser]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.role || !form.skills.trim()) {
      setError("Please fill in your name, role, and skills.");
      return;
    }

    // College is required
    if (!form.college.trim()) {
      setError("Please enter your college name.");
      return;
    }

    // At least phone or email required
    const cleanedPhone = cleanContact(form.phone);
    const cleanedEmail = cleanContact(form.email);

    if (!cleanedPhone && !cleanedEmail) {
      setError("Please enter at least your phone number or email.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editMode && editDocId) {
        // --- EDIT MODE: update the existing Firestore document ---
        const updatedFields: Omit<StudentProfile, "id"> = {
          name: form.name.trim(),
          age: form.age,
          role: form.role,
          ...(form.branch ? { branch: form.branch } : { branch: "" }),
          skills: form.skills.trim(),
          projectIdea: form.projectIdea,
          ...(form.projectDescription
            ? { projectDescription: form.projectDescription }
            : {}),
          college: form.college.trim(),
          // phone and email are read-only in edit mode; keep existing values
          ...(cleanedPhone ? { phone: cleanedPhone } : {}),
          ...(cleanedEmail ? { email: cleanedEmail } : {}),
          contactInfo: cleanedPhone || cleanedEmail, // keep for login compat
        };

        await updateDoc(doc(db, "users", editDocId), updatedFields);
        // Navigate to browse after saving
        onNavigate("browse");
      } else {
        // --- CREATE MODE: duplicate check + add new document ---
        const snapshot = await getDocs(collection(db, "users"));
        const existing: StudentProfile[] = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<StudentProfile, "id">),
          id: d.id,
        }));

        // Check for duplicate phone
        if (cleanedPhone) {
          const dupPhone = existing.find((s) => {
            const sp = s.phone
              ? cleanContact(s.phone)
              : !s.email && s.contactInfo && !s.contactInfo.includes("@")
                ? cleanContact(s.contactInfo)
                : "";
            return sp && sp === cleanedPhone;
          });
          if (dupPhone) {
            setError("This phone number is already registered.");
            setSubmitting(false);
            return;
          }
        }

        // Check for duplicate email
        if (cleanedEmail) {
          const dupEmail = existing.find((s) => {
            const se = s.email
              ? cleanContact(s.email)
              : s.contactInfo?.includes("@")
                ? cleanContact(s.contactInfo)
                : "";
            return se && se === cleanedEmail;
          });
          if (dupEmail) {
            setError("This email is already registered.");
            setSubmitting(false);
            return;
          }
        }

        // contactInfo for login compat: prefer phone, fallback email
        const contactInfo = cleanedPhone || cleanedEmail;

        // Build the profile object
        const newProfile: Omit<StudentProfile, "id"> = {
          name: form.name.trim(),
          age: form.age,
          role: form.role,
          ...(form.branch ? { branch: form.branch } : {}),
          skills: form.skills.trim(),
          projectIdea: form.projectIdea,
          ...(form.projectDescription
            ? { projectDescription: form.projectDescription }
            : {}),
          college: form.college.trim(),
          ...(cleanedPhone ? { phone: cleanedPhone } : {}),
          ...(cleanedEmail ? { email: cleanedEmail } : {}),
          contactInfo,
        };

        await addDoc(collection(db, "users"), newProfile);
        // Auto-login: set currentUser and navigate to browse
        onLogin(contactInfo || form.name.trim());
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Blocked state: create mode but user already has a profile ---
  if (!editMode && sessionUser) {
    return (
      <section className="py-16 px-6 bg-background">
        <div className="max-w-lg mx-auto text-center">
          <div
            className="bg-white rounded-2xl border shadow-lg p-10"
            style={{ borderColor: "#E5E7EB" }}
            data-ocid="profile.blocked.card"
          >
            <div className="text-4xl mb-4">🙅</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#1F2937" }}
            >
              You already have a profile!
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Each account can only have one profile on TeamUp.
            </p>
            <button
              data-ocid="profile.browse.button"
              type="button"
              onClick={() => onNavigate("browse")}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-transform hover:opacity-90 active:scale-95"
              style={{ background: "#2563EB" }}
            >
              Browse Students
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Edit mode: redirect to login if not logged in
  if (editMode && !sessionUser) {
    onNavigate("login");
    return null;
  }

  // Edit mode loading state
  if (loadingEdit) {
    return (
      <section className="py-16 px-6 bg-background">
        <div className="max-w-lg mx-auto text-center">
          <div className="py-24 flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Loading profile"
            />
            <p className="text-sm text-muted-foreground">
              Loading your profile...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {editMode ? "Edit Your Profile" : "Create Your Profile"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {editMode
              ? "Update your details and save changes."
              : "Tell other students about yourself and what you're building."}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="profile.name.input"
                id="name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <Label
                htmlFor="age"
                className="text-sm font-medium text-foreground"
              >
                Age
              </Label>
              <Input
                data-ocid="profile.age.input"
                id="age"
                type="number"
                placeholder="e.g. 20"
                min="10"
                max="30"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.role}
                onValueChange={(value) => handleChange("role", value)}
                disabled={submitting}
              >
                <SelectTrigger
                  data-ocid="profile.role.select"
                  className="rounded-lg w-full"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Branch / Domain (optional) */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Branch / Domain
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Select
                value={form.branch}
                onValueChange={(value) => handleChange("branch", value)}
                disabled={submitting}
              >
                <SelectTrigger
                  data-ocid="profile.branch.select"
                  className="rounded-lg w-full"
                >
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCH_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <Label
                htmlFor="skills"
                className="text-sm font-medium text-foreground"
              >
                Skills <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="profile.skills.input"
                id="skills"
                type="text"
                placeholder="e.g. React, Python, Figma (comma-separated)"
                value={form.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>

            {/* Project Idea */}
            <div className="space-y-1.5">
              <Label
                htmlFor="projectIdea"
                className="text-sm font-medium text-foreground"
              >
                Project Idea
              </Label>
              <Input
                data-ocid="profile.projectIdea.input"
                id="projectIdea"
                type="text"
                placeholder="e.g. An app to track study groups"
                value={form.projectIdea}
                onChange={(e) => handleChange("projectIdea", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
            </div>

            {/* Project Description (optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="projectDescription"
                className="text-sm font-medium text-foreground"
              >
                Project Description
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <textarea
                data-ocid="profile.projectDescription.textarea"
                id="projectDescription"
                placeholder="e.g. A web app where students post their project needs and others can apply to join..."
                value={form.projectDescription}
                onChange={(e) =>
                  handleChange("projectDescription", e.target.value)
                }
                rows={3}
                disabled={submitting}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* College / University (required) -- with autocomplete */}
            <div className="space-y-1.5">
              <Label
                htmlFor="college"
                className="text-sm font-medium text-foreground"
              >
                College / University <span className="text-destructive">*</span>
              </Label>
              <CollegeAutocomplete
                value={form.college}
                onChange={(val) => handleChange("college", val)}
                disabled={submitting}
              />
            </div>

            {/* Phone Number (read-only in edit mode) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  {editMode ? "(cannot be changed)" : "(optional)"}
                </span>
              </Label>
              <Input
                data-ocid="profile.phone.input"
                id="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={(e) =>
                  !editMode && handleChange("phone", e.target.value)
                }
                className={`rounded-lg ${
                  editMode ? "opacity-60 cursor-not-allowed" : ""
                }`}
                readOnly={editMode}
                disabled={submitting && !editMode}
              />
            </div>

            {/* Email Address (read-only in edit mode) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  {editMode ? "(cannot be changed)" : "(optional)"}
                </span>
              </Label>
              <Input
                data-ocid="profile.email.input"
                id="email"
                type="email"
                placeholder="e.g. alex@email.com"
                value={form.email}
                onChange={(e) =>
                  !editMode && handleChange("email", e.target.value)
                }
                className={`rounded-lg ${
                  editMode ? "opacity-60 cursor-not-allowed" : ""
                }`}
                readOnly={editMode}
                disabled={submitting && !editMode}
              />
              {!editMode && (
                <p className="text-xs text-muted-foreground">
                  Enter at least your phone or email
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p
                data-ocid="profile.form.error_state"
                className="text-sm text-destructive font-medium"
              >
                {error}
              </p>
            )}

            <div className="flex gap-3">
              {editMode && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg"
                  onClick={() => onNavigate("browse")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                data-ocid="profile.form.submit_button"
                type="submit"
                className="flex-1 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={submitting}
              >
                {submitting
                  ? editMode
                    ? "Saving..."
                    : "Creating..."
                  : editMode
                    ? "Save Changes"
                    : "Create Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
