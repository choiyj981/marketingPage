import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      className="group overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-highlight text-white font-semibold" data-testid={`badge-${product.badge.toLowerCase()}`}>
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
          <Badge variant="secondary" data-testid={`badge-category-${product.category}`}>
            {product.category}
          </Badge>
          <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            {product.price}
          </span>
        </div>
        
        <h3 className="font-display font-semibold text-xl leading-tight" data-testid={`text-title-${product.id}`}>
          {product.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-2 pt-2">
            {product.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm" data-testid={`text-feature-${index}`}>
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button className="w-full gap-2 group/btn" data-testid={`button-view-${product.id}`}>
            Learn More
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
