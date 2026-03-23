import { Button } from "@/components/ui/button";
/**
 * HomePage.tsx
 * The landing page with a big hero section and two call-to-action buttons.
 * This is the first thing users see when they open the app.
 */
import { Rocket, Users } from "lucide-react";
import type { Page } from "../App";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* ── Hero Section ── */}
      {/* Full-width blue background with headline and CTA buttons */}
      <section className="bg-primary py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            CoFounder Finder
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-primary-foreground/80 mb-10">
            Find teammates for your projects
          </p>

          {/* Two CTA buttons side by side */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Filled white button */}
            <Button
              data-ocid="hero.create.primary_button"
              size="lg"
              onClick={() => onNavigate("create")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 rounded-lg"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Create Profile
            </Button>

            {/* Outlined button */}
            <Button
              data-ocid="hero.browse.secondary_button"
              size="lg"
              variant="outline"
              onClick={() => onNavigate("browse")}
              className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold px-8 rounded-lg"
            >
              <Users className="mr-2 h-4 w-4" />
              View Students
            </Button>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>

          {/* Three simple steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Share your name, role, skills, and the project idea you're excited about."
            />
            <StepCard
              number="2"
              title="Browse Students"
              description="Explore profiles from students looking for teammates across different roles."
            />
            <StepCard
              number="3"
              title="Reach Out"
              description="Find someone whose skills complement yours and get in touch directly."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * StepCard
 * A small card showing one step in the "How It Works" section.
 * Kept as a local component since it's only used here.
 */
function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-xl p-6 text-center border border-border shadow-card">
      {/* Step number circle */}
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
