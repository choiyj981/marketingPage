import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card
      className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      data-testid={`card-service-${service.id}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16" />
      
      <CardHeader className="pb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="font-display font-semibold text-xl leading-tight" data-testid={`text-title-${service.id}`}>
          {service.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed" data-testid={`text-description-${service.id}`}>
          {service.description}
        </p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2.5 pt-2">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2.5" data-testid={`text-feature-${index}`}>
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
