import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@shared/schema";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title="광고 교육 프로그램 & 디지털 제품 | 모두의광고"
        description="체계적인 광고 교육과 실전 마케팅 자료. 페이스북 광고 강의, 구글 애즈 교육, SNS 마케팅 과정 등 전문 광고 교육 프로그램을 만나보세요."
        keywords="광고 교육, 광고 강의, 마케팅 교육, 페이스북 광고 강의, 구글 애즈 교육, SNS 마케팅 과정, 디지털 마케팅 교육, 온라인 광고 교육"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4" data-testid="text-page-title">
            광고 교육 프로그램 & 디지털 제품
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl" style={{ lineHeight: '1.8' }} data-testid="text-page-subtitle">
            체계적인 광고 교육과 실전 마케팅 자료
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover-elevate active-elevate-2"
              onClick={() => setSelectedCategory(null)}
              data-testid="badge-category-all"
            >
              전체 제품
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground" data-testid="text-results-count">
            {filteredProducts.length}개의 제품
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-96 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2" data-testid="text-no-results" style={{ lineHeight: '1.7' }}>
              제품이 없습니다
            </p>
            <p className="text-sm text-muted-foreground" style={{ lineHeight: '1.7' }}>
              다른 카테고리를 선택해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
