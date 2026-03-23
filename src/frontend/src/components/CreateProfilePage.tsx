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
 * On submit, the data is saved to localStorage and the user is sent to Browse.
 */
import { useState } from "react";
import type { Page } from "../App";

// The shape of a student profile
export interface StudentProfile {
  id: string; // Unique ID so we can tell profiles apart
  name: string;
  age: string;
  role: string;
  skills: string; // Comma-separated, e.g. "React, Python, Design"
  projectIdea: string;
  contactInfo: string;
}

interface CreateProfilePageProps {
  onNavigate: (page: Page) => void;
}

export default function CreateProfilePage({
  onNavigate,
}: CreateProfilePageProps) {
  // Form field values -- one state object for all fields
  const [form, setForm] = useState({
    name: "",
    age: "",
    role: "",
    skills: "",
    projectIdea: "",
    contactInfo: "",
  });

  // Simple error message shown if the user leaves required fields empty
  const [error, setError] = useState("");

  // Update a single field in the form state
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  // Called when the user clicks "Submit"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page from refreshing

    // Basic validation -- make sure key fields are filled
    if (!form.name.trim() || !form.role || !form.skills.trim()) {
      setError("Please fill in your name, role, and skills.");
      return;
    }

    // Build the new profile object
    const newProfile: StudentProfile = {
      id: Date.now().toString(), // Simple unique ID using timestamp
      ...form,
    };

    // Read existing profiles from localStorage (or empty array if none)
    const existing: StudentProfile[] = JSON.parse(
      localStorage.getItem("students") || "[]",
    );

    // Add the new profile and save back to localStorage
    const updated = [...existing, newProfile];
    localStorage.setItem("students", JSON.stringify(updated));

    // Go to Browse page so the user can see their new profile
    onNavigate("browse");
  };

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Create Your Profile
          </h2>
          <p className="text-muted-foreground text-sm">
            Tell other students about yourself and what you're building.
          </p>
        </div>

        {/* Form card */}
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
              />
            </div>

            {/* Role dropdown */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.role}
                onValueChange={(value) => handleChange("role", value)}
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
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5">
              <Label
                htmlFor="contactInfo"
                className="text-sm font-medium text-foreground"
              >
                Contact Info
              </Label>
              <Input
                data-ocid="profile.contactInfo.input"
                id="contactInfo"
                type="text"
                placeholder="e.g. alex@email.com or +1 555 0123"
                value={form.contactInfo}
                onChange={(e) => handleChange("contactInfo", e.target.value)}
                className="rounded-lg"
              />
            </div>

            {/* Validation error message */}
            {error && (
              <p
                data-ocid="profile.form.error_state"
                className="text-sm text-destructive font-medium"
              >
                {error}
              </p>
            )}

            {/* Submit button */}
            <Button
              data-ocid="profile.form.submit_button"
              type="submit"
              className="w-full rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Create Profile
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
