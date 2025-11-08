import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  badge?: string;
}

export default function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  badge,
}: HeroProps) {
  return (
    <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F4F9FF] via-white to-[#EEF2FF]">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center animate-fade-in">
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-primary/10 text-primary border border-primary/20"
            data-testid="text-hero-badge"
          >
            <Sparkles className="h-4 w-4" />
            {badge}
          </div>
        )}

        <h1 
          className="font-display tracking-tight mb-6 leading-tight max-w-5xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground font-bold"
          style={{ lineHeight: '1.2' }}
          data-testid="text-hero-title"
        >
          {title}
        </h1>

        <p 
          className="max-w-3xl mx-auto mb-10 text-lg md:text-xl text-foreground/80"
          style={{ lineHeight: '1.8' }}
          data-testid="text-hero-subtitle"
        >
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryCTA && (
            <Link href={primaryCTA.href}>
              <Button
                size="lg"
                className="text-base px-8 gap-2 transition-all shadow-lg hover:shadow-xl"
                data-testid="button-hero-primary-cta"
              >
                {primaryCTA.text}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {secondaryCTA && (
            <Link href={secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 transition-all"
                data-testid="button-hero-secondary-cta"
              >
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>

    </section>
  );
}
