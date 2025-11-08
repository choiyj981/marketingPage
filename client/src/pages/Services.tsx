import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ServiceCard from "@/components/ServiceCard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Service } from "@shared/schema";

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#F4F9FF]">
      <SEO
        title="광고 컨설팅 서비스 - 전문가 1:1 맞춤 전략 | 오토마케터"
        description="전문가의 1:1 맞춤형 광고 컨설팅과 전략 수립. 페이스북 광고, 구글 애즈, SNS 마케팅 등 귀사의 비즈니스에 최적화된 광고 전략을 제공합니다."
        keywords="광고 컨설팅, 마케팅 컨설팅, 광고 대행, 페이스북 광고 대행, 구글 애즈 대행, SNS 마케팅 대행, 광고 전략 수립, 맞춤 광고 전략"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4" data-testid="text-page-title">
            광고 컨설팅 서비스
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl" style={{ lineHeight: '1.8' }} data-testid="text-page-subtitle">
            전문가의 1:1 맞춤형 광고 컨설팅과 전략 수립
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
            <p className="text-muted-foreground text-lg" data-testid="text-no-results" style={{ lineHeight: '1.7' }}>
              현재 제공 가능한 서비스가 없습니다
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4" data-testid="text-cta-title">
              맞춤형 솔루션이 필요하신가요?
            </h2>
            <p className="text-lg text-muted-foreground mb-8" style={{ lineHeight: '1.8' }} data-testid="text-cta-subtitle">
              전문가 팀이 귀하의 요구사항을 분석하고 최적의 광고 전략을 제안합니다.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-contact-cta">
                문의하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
