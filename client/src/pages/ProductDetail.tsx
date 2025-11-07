import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Check, Download } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import SocialShare from "@/components/SocialShare";
import ReviewSection from "@/components/ReviewSection";
import RelatedContent from "@/components/RelatedContent";
import NaverBlogProductPage from "@/components/NaverBlogProductPage";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:slug");
  const slug = params?.slug;

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="h-96 animate-pulse bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Custom layout for naver-blog-automation product
  if (slug === "naver-blog-automation") {
    return (
      <div className="min-h-screen">
        <SEO
          title={`${product.title} - 네이버 블로그 자동화 프로그램 | 오토마케터`}
          description={product.description || product.fullDescription}
          keywords={`네이버 블로그 자동화, 블로그 자동화 프로그램, 서로이웃 자동화, 댓글 자동 작성, ${product.tags?.join(', ') || '블로그 마케팅, 자동화 도구'}`}
          image={product.imageUrl}
          url={window.location.href}
          type="product"
        />
        <StructuredData
          type="product"
          name={product.title}
          description={product.description || product.fullDescription}
          price={product.price}
          imageUrl={product.imageUrl || ''}
          url={window.location.href}
        />
        <NaverBlogProductPage product={product} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={`${product.title} - 광고 교육 | 오토마케터`}
        description={product.description || product.fullDescription}
        keywords={`${product.category}, 광고 교육, 광고 강의, ${product.tags?.join(', ') || '마케팅 교육, 디지털 광고'}`}
        image={product.imageUrl}
        url={window.location.href}
        type="product"
      />
      <StructuredData
        type="product"
        name={product.title}
        description={product.description || product.fullDescription}
        price={product.price}
        imageUrl={product.imageUrl || ''}
        url={window.location.href}
      />
      {/* Back Button */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-12 md:py-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={`${product.title} - ${product.category} 광고 교육 프로그램`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
              {product.badge && (
                <div className="absolute top-6 right-6">
                  <Badge className="bg-highlight text-white font-semibold text-lg px-4 py-2" data-testid="badge-product">
                    {product.badge}
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-4" data-testid="badge-category">
                  {product.category}
                </Badge>
                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight" data-testid="text-title">
                  {product.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-description">
                  {product.description}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-primary" data-testid="text-price">
                  {product.price}
                </span>
              </div>

              <div className="space-y-4">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 w-full" data-testid="button-get-started">
                    Get Started
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </Button>
                </Link>
                <SocialShare title={product.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Full Description */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-display font-bold text-3xl mb-4">Product Overview</h2>
                <p className="text-foreground/90 text-lg leading-relaxed" data-testid="text-full-description">
                  {product.fullDescription}
                </p>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-2xl mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3" data-testid={`text-feature-${index}`}>
                        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Button */}
              {product.attachmentUrl && (
                <div className="mt-8 pt-8 border-t">
                  <Button
                    onClick={() => {
                      window.location.href = `/api/products/${product.id}/download`;
                    }}
                    className="gap-2"
                    data-testid="button-download-attachment"
                  >
                    <Download className="h-4 w-4" />
                    {product.attachmentFilename || "파일 다운로드"}
                    {product.attachmentSize && ` (${product.attachmentSize})`}
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div>
              <Card className="sticky top-24">
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Starting at</p>
                    <p className="text-3xl font-bold text-primary">{product.price}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Link href="/contact">
                      <Button className="w-full" size="lg" data-testid="button-sidebar-cta">
                        Get Started Now
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg" data-testid="button-contact-sales">
                      Contact Sales
                    </Button>
                  </div>

                  <div className="pt-6 border-t space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">24/7 customer support</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-muted-foreground">Free updates and upgrades</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection productId={product.id} />

      {/* Related Content */}
      <RelatedContent type="product" currentId={product.id} tags={product.tags || []} />
    </div>
  );
}
