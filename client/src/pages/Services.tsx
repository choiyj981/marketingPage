import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Professional services tailored to your unique business needs, delivered by our expert team.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg" data-testid="text-no-results">
              No services available at the moment
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team is ready to discuss your unique requirements and create a tailored solution for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-contact-cta">
                Get in Touch
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
