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
    <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-gray-900" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          animationDuration: '4s',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center animate-fade-in">
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/30"
            data-testid="text-hero-badge"
          >
            <Sparkles className="h-4 w-4" />
            {badge}
          </div>
        )}

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight mb-6 leading-tight max-w-5xl mx-auto" data-testid="text-hero-title" style={{ lineHeight: '1.2' }}>
          {title}
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10" data-testid="text-hero-subtitle" style={{ lineHeight: '1.8' }}>
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryCTA && (
            <Link href={primaryCTA.href}>
              <Button
                size="lg"
                className="text-base px-8 gap-2 shadow-lg hover:shadow-xl transition-shadow"
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
                className="text-base px-8"
                data-testid="button-hero-secondary-cta"
              >
                {secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
