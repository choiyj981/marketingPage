import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import ProductCard from "@/components/ProductCard";
import ServiceCard from "@/components/ServiceCard";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, TrendingUp, Users, Download, Award, Target } from "lucide-react";
import type { BlogPost, Product, Service, MetricsSnapshot } from "@shared/schema";

export default function Home() {
  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: metrics = [], isLoading: metricsLoading } = useQuery<MetricsSnapshot[]>({
    queryKey: ["/api/metrics"],
  });

  // Get metric values by name with fallback
  const getMetric = (name: string, fallback: number = 0): number => {
    const metric = metrics.find(m => m.name === name);
    return metric?.value ?? fallback;
  };

  const features = [
    {
      icon: Zap,
      title: "빠른 성과",
      description: "즉각적인 광고 효과와 ROI 측정 가능한 마케팅 솔루션",
    },
    {
      icon: Shield,
      title: "전문성",
      description: "10년 이상의 광고 운영 경험을 바탕으로 한 전문 컨설팅",
    },
    {
      icon: TrendingUp,
      title: "검증된 결과",
      description: "수천 개 기업의 성공적인 광고 캠페인 사례",
    },
  ];

  const statsCards = [
    {
      icon: Users,
      label: "수강생",
      value: getMetric("students", 5000),
      suffix: "+",
    },
    {
      icon: Download,
      label: "다운로드",
      value: getMetric("downloads", 12000),
      suffix: "+",
    },
    {
      icon: Award,
      label: "성공 캠페인",
      value: getMetric("campaigns", 3000),
      suffix: "+",
    },
    {
      icon: Target,
      label: "평균 ROI",
      value: getMetric("avgRoi", 350),
      suffix: "%",
    },
  ];

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <SEO 
        title="오토마케터 - 광고 & 마케팅 전문 플랫폼 | 광고 교육 & 컨설팅"
        description="비즈니스 성장을 위한 효과적인 광고 솔루션과 마케팅 전략. 전문적인 광고 교육, 마케팅 자료, 컨설팅 서비스를 제공합니다. 페이스북 광고, 구글 애즈 전문가와 함께하세요."
        keywords="광고 운영, 페이스북 광고, 구글 애즈, 마케팅 교육, 광고 강의, 디지털 마케팅, 온라인 광고, 광고 컨설팅, 광고 대행, SNS 마케팅, 퍼포먼스 마케팅"
      />
      <StructuredData type="organization" />
      {/* Hero Section */}
      <Hero
        badge="오토마케터에 오신 것을 환영합니다"
        title="효과적인 광고 솔루션과 마케팅 전략"
        subtitle="비즈니스 성장을 위한 전문적인 광고 교육, 마케팅 자료, 컨설팅 서비스를 제공합니다."
        primaryCTA={{ text: "시작하기", href: "/contact" }}
        secondaryCTA={{ text: "제품 둘러보기", href: "/products" }}
      />

      {/* Stats Section */}
      <section className="py-12 md:py-16 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {metricsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 animate-pulse bg-muted" data-testid={`card-stat-loading-${i}`}>
                    <div className="h-20" />
                  </Card>
                ))}
              </>
            ) : (
              statsCards.map((stat, index) => (
                <Card 
                  key={index} 
                  className="p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in backdrop-blur-sm bg-card/95" 
                  data-testid={`card-stat-${index}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0 space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                      <stat.icon className="h-6 w-6 text-primary" data-testid={`icon-stat-${index}`} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary" data-testid={`text-stat-value-${index}`}>
                      {stat.value.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground" style={{ lineHeight: '1.7' }} data-testid={`text-stat-label-${index}`}>
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" data-testid="text-features-title">
              왜 오토마케터인가?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: '1.8' }} data-testid="text-features-subtitle">
              검증된 광고 전략과 실전 노하우를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in" data-testid={`card-feature-${index}`} style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="space-y-4 pt-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <feature.icon className="h-7 w-7 text-primary" data-testid={`icon-feature-${index}`} />
                  </div>
                  <h3 className="font-semibold text-xl" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" style={{ lineHeight: '1.8' }} data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2" data-testid="text-products-title">
                추천 강의 & 제품
              </h2>
              <p className="text-muted-foreground" style={{ lineHeight: '1.8' }} data-testid="text-products-subtitle">
                체계적인 광고 교육과 실전 마케팅 자료
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-products">
                모두 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" data-testid={`card-product-loading-${i}`} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-products">제품이 없습니다</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      {!servicesLoading && services.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4" data-testid="text-services-title">
                광고 컨설팅 서비스
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ lineHeight: '1.8' }} data-testid="text-services-subtitle">
                전문가의 1:1 맞춤형 광고 컨설팅과 전략 수립
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/services">
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-all-services">
                  모든 서비스 보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2" data-testid="text-blog-title">
                최신 광고 인사이트
              </h2>
              <p className="text-muted-foreground" style={{ lineHeight: '1.8' }} data-testid="text-blog-subtitle">
                최신 광고 트렌드와 실전 마케팅 전략
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-blog">
                모두 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" data-testid={`card-blog-loading-${i}`} />
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-blog">블로그 포스트가 없습니다</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6" data-testid="text-cta-title">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10" style={{ lineHeight: '1.8' }} data-testid="text-cta-subtitle">
            수천 개의 기업이 이미 오토마케터와 함께 성공적인 광고 캠페인을 운영하고 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 gap-2" data-testid="button-cta-contact">
                문의하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="px-8" data-testid="button-cta-resources">
                자료 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
