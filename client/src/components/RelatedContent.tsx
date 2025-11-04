import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { BlogPost, Product } from "@shared/schema";

interface RelatedContentProps {
  type: "blog" | "product";
  currentId: string;
  tags: string[];
}

export default function RelatedContent({ type, currentId, tags }: RelatedContentProps) {
  const { data: blogs } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: type === "blog",
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: type === "product",
  });

  // Find related content based on tags
  const relatedItems = type === "blog"
    ? blogs?.filter(blog => 
        blog.id !== currentId && 
        blog.tags?.some(tag => tags.includes(tag))
      ).slice(0, 3) || []
    : products?.filter(product => 
        product.id !== currentId && 
        product.tags?.some(tag => tags.includes(tag))
      ).slice(0, 3) || [];

  if (relatedItems.length === 0) return null;

  return (
    <div className="py-12 md:py-16 bg-muted/30" data-testid="related-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-8" data-testid="text-related-title">
          관련 콘텐츠
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedItems.map((item) => (
            <Link 
              key={item.id} 
              href={type === "blog" ? `/blog/${item.slug}` : `/products/${item.slug}`}
            >
              <Card className="overflow-hidden hover-elevate active-elevate-2 h-full" data-testid={`card-related-${item.slug}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge data-testid={`badge-category-${item.slug}`}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-title-${item.slug}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4" data-testid={`text-description-${item.slug}`}>
                    {type === "blog" ? (item as BlogPost).excerpt : (item as Product).description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    자세히 보기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
