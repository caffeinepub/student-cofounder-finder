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
 * The form where students fill in their details to create a profile.
 * On submit, the data is saved to Firestore.
 * If the user is not logged in, they are auto-logged in after creation.
 */
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useState } from "react";
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
  contactInfo?: string; // kept for backward compat (old profiles)
  phone?: string; // new: phone number
  email?: string; // new: email address
  college?: string; // new: college / university
}

interface CreateProfilePageProps {
  onNavigate: (page: Page) => void;
  // Called after successful creation -- sets currentUser and navigates to browse
  onLogin: (contact: string) => void;
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

export default function CreateProfilePage({
  onNavigate,
  onLogin,
}: CreateProfilePageProps) {
  // If the user is already logged in, block profile creation
  const currentUser = localStorage.getItem("currentUser");

  const [form, setForm] = useState({
    name: "",
    age: "",
    role: "",
    branch: "",
    skills: "",
    projectIdea: "",
    college: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      // Load existing profiles from Firestore for duplicate check
      const snapshot = await getDocs(collection(db, "users"));
      const existing: StudentProfile[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<StudentProfile, "id">),
        id: doc.id,
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

      // Build the profile object (no id -- Firestore auto-generates)
      const newProfile: Omit<StudentProfile, "id"> = {
        name: form.name,
        age: form.age,
        role: form.role,
        ...(form.branch ? { branch: form.branch } : {}),
        skills: form.skills,
        projectIdea: form.projectIdea,
        college: form.college.trim(),
        ...(cleanedPhone ? { phone: cleanedPhone } : {}),
        ...(cleanedEmail ? { email: cleanedEmail } : {}),
        contactInfo, // keep for login compat
      };

      // Save to Firestore
      await addDoc(collection(db, "users"), newProfile);

      // Auto-login: set currentUser and navigate to browse
      onLogin(contactInfo || form.name.trim());
    } catch (err) {
      console.error("Profile creation error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Blocked state: user already has a profile ---
  if (currentUser) {
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

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Create Your Profile
          </h2>
          <p className="text-muted-foreground text-sm">
            Tell other students about yourself and what you're building.
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

            {/* College / University (required) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="college"
                className="text-sm font-medium text-foreground"
              >
                College / University <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="profile.college.input"
                id="college"
                type="text"
                placeholder="e.g. Mumbai University"
                value={form.college}
                onChange={(e) => handleChange("college", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
            </div>

            {/* Phone Number (optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                data-ocid="profile.phone.input"
                id="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
            </div>

            {/* Email Address (optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                data-ocid="profile.email.input"
                id="email"
                type="email"
                placeholder="e.g. alex@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="rounded-lg"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Enter at least your phone or email
              </p>
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

            <Button
              data-ocid="profile.form.submit_button"
              type="submit"
              className="w-full rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Profile"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
