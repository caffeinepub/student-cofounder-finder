import { Button } from "@/components/ui/button";
/**
 * HomePage.tsx
 * The landing page with a big hero section and two call-to-action buttons.
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
      <section
        className="py-28 md:py-32 px-6 text-center"
        style={{ background: "linear-gradient(to right, #2563EB, #7C3AED)" }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Problem hook */}
          <p className="text-lg md:text-xl font-medium text-primary-foreground mb-3">
            Struggling to find teammates for your project?
          </p>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 leading-tight">
            TeamUp
          </h1>

          {/* Value proposition line */}
          <p className="text-base md:text-lg font-semibold text-primary-foreground mb-3">
            Find teammates in your college in 30 seconds.
          </p>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-8">
            Find teammates. Build projects. Grow together.
          </p>

          {/* Two CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="hero.create.primary_button"
              size="lg"
              onClick={() => onNavigate("create")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 rounded-lg min-w-[160px] shadow-lg hover:shadow-xl transition-all active:scale-95 hover:scale-105"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start Building Your Team
            </Button>

            <Button
              data-ocid="hero.browse.secondary_button"
              size="lg"
              variant="outline"
              onClick={() => onNavigate("browse")}
              className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold px-8 rounded-lg min-w-[160px] hover:shadow-md transition-all active:scale-95"
            >
              <Users className="mr-2 h-4 w-4" />
              Find Teammates Now
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-primary-foreground/60 text-center">
            Join 100+ students already building projects 🚀
          </p>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">
            How It Works
          </h2>
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

      {/* ── Who Is This For Section ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-10">
            Who is this for?
          </h2>
          <ul className="text-left inline-block space-y-4">
            {[
              "College students building projects",
              "Hackathon teams",
              "Startup ideas",
              "School students learning skills",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-lg text-foreground"
              >
                <span
                  className="font-bold text-xl"
                  style={{ color: "#7C3AED" }}
                >
                  ✔
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: { number: string; title: string; description: string }) {
  return (
    <div className="bg-card rounded-xl p-8 text-center border border-border shadow-md hover:shadow-lg transition-shadow duration-200">
      <div
        className="w-12 h-12 rounded-full font-bold text-xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: "#7C3AED20", color: "#7C3AED" }}
      >
        {number}
      </div>
      <h3 className="font-semibold text-base text-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
