import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

interface NaverBlogProductPageProps {
  product: {
    title: string;
    description: string;
    price: string;
    imageUrl?: string;
  };
}

export default function NaverBlogProductPage({ product }: NaverBlogProductPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(
      ".feature-card, .step-card, .scenario-card, .pricing-card"
    );
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el));
      observerRef.current?.disconnect();
    };
  }, []);

  const faqItems = [
    {
      question: "프로그램이 네이버 정책을 위반하나요?",
      answer:
        "아니요. 프로그램은 네이버가 제공하는 정상적인 기능만 사용합니다. 사람이 수동으로 하는 작업을 자동화한 것일 뿐이며, 자동 보호 기능이 내장되어 있어 과도한 사용을 방지합니다. 권장 사용량을 지키시면 안전하게 사용하실 수 있습니다.",
    },
    {
      question: "설치가 어렵나요? 컴퓨터를 잘 못 다루는데...",
      answer:
        "전혀 어렵지 않습니다! 실행 파일(.exe)을 더블클릭하면 바로 실행되며, 초기 설정은 10분이면 완료됩니다. 사용자 친화적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.",
    },
    {
      question: "무료 버전과 유료 버전의 차이는 무엇인가요?",
      answer:
        "무료 버전은 기본적인 자동화 기능(서로이웃, 댓글, 공감, 스케줄)을 1개 계정에서 사용할 수 있습니다. 유료 프로 버전은 AI 댓글 생성, 최대 8개 계정 관리, 텔레그램 알림, 우선 기술 지원 등의 고급 기능이 추가됩니다.",
    },
    {
      question: "하루에 얼마나 많은 작업을 할 수 있나요?",
      answer:
        "기술적으로는 댓글 500개 이상, 서로이웃 200명 이상이 가능합니다. 하지만 안전한 운영을 위해 댓글 30~50개, 서로이웃 50~100명 정도를 권장합니다. 처음에는 소량으로 시작하여 점차 늘려가는 것이 좋습니다.",
    },
    {
      question: "환불이 가능한가요?",
      answer:
        "네, 구매 후 7일 이내에 환불 요청을 하실 수 있습니다. 다만 무료 베이직 버전을 먼저 사용해보신 후 유료 버전을 구매하시는 것을 권장합니다.",
    },
    {
      question: "기술 지원은 어떻게 받나요?",
      answer:
        "GitHub Issues 또는 이메일을 통해 문의하실 수 있습니다. 프로 버전 사용자는 우선 기술 지원을 받으실 수 있으며, 비즈니스 버전은 24/7 전담 지원을 제공합니다.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='none'/%3E%3Ccircle cx='50' cy='50' r='2' fill='white' opacity='0.1'/%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-white/20 text-white backdrop-blur-sm border-0">
            ⚡ 2025년 최신 버전
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
            하루 10분으로
            <br />
            블로그 성장 가속화
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            네이버 블로그 운영을 완전 자동화하는 올인원 솔루션
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pricing">
              <Button size="lg" className="bg-white text-[#667eea] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold shadow-xl">
                지금 시작하기
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-bold">
                더 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { number: "95%", label: "시간 절감" },
            { number: "500+", label: "하루 댓글 자동 작성" },
            { number: "8개", label: "계정 동시 관리" },
            { number: "24/7", label: "자동 운영" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-0">
                <div className="text-4xl md:text-5xl font-bold text-[#667eea] mb-3">
                  {stat.number}
                </div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Problem Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              이런 고민 있으신가요?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              블로그 운영자라면 누구나 겪는 문제들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: "⏰",
                title: "시간이 부족해요",
                description: "댓글 작성, 서로이웃 관리에 하루 3시간 이상 소모되고 있어요",
              },
              {
                icon: "🔁",
                title: "반복 작업이 지겨워요",
                description: "매일 같은 작업을 수백 번 반복하는 게 너무 힘들어요",
              },
              {
                icon: "📉",
                title: "성장이 정체됐어요",
                description: "수동 운영으로는 한계가 있어 블로그가 성장하지 않아요",
              },
              {
                icon: "👥",
                title: "다중 계정 관리가 어려워요",
                description: "여러 블로그를 운영하는데 관리 부담이 너무 커요",
              },
            ].map((problem, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-red-500 p-6 hover:shadow-lg transition-all"
              >
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Solution Box */}
          <Card className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                ✨ 이 모든 문제를 한 번에 해결합니다
              </h3>
              <p className="text-lg md:text-xl mb-8 opacity-95">
                완전 자동화로 블로그 운영의 새로운 시대를 경험하세요
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { value: "3시간 → 10분", label: "일일 작업 시간" },
                  { value: "월 100시간", label: "시간 절감" },
                  { value: "연 1,800만원", label: "비용 절감 효과" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              강력한 4가지 핵심 기능
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              블로그 성장에 필요한 모든 것이 자동화됩니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: "🤝",
                title: "서로이웃 자동 신청",
                description: "키워드로 관련 블로그를 찾아 자동으로 서로이웃 신청",
                features: [
                  "하루 수백 개 블로그 자동 검색",
                  "중복 신청 자동 방지",
                  "그룹 꽉 차면 자동 전환",
                  "계정별 다른 키워드 설정",
                ],
              },
              {
                icon: "💬",
                title: "댓글 자동 작성",
                description: "이웃 블로그에 자연스러운 댓글을 자동으로 작성",
                features: [
                  "하루 500개 이상 댓글 가능",
                  "AI 기반 맞춤형 댓글 생성",
                  "80개 템플릿 기본 제공",
                  "중복 댓글 자동 방지",
                ],
              },
              {
                icon: "👍",
                title: "공감 자동 클릭",
                description: "특정 블로그의 게시물에 자동으로 공감 클릭",
                features: [
                  "페이지 범위 설정 가능",
                  "중복 공감 자동 방지",
                  "여러 계정 동시 실행",
                  "파트너십 강화 지원",
                ],
              },
              {
                icon: "⏰",
                title: "스케줄 자동 실행",
                description: "설정한 시간에 모든 기능을 자동으로 실행",
                features: [
                  "요일별, 시간대별 설정",
                  "여러 시간대 동시 설정",
                  "백그라운드 자동 실행",
                  "텔레그램 알림 기능",
                ],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="feature-card border-t-4 border-t-[#667eea] p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 text-[#667eea] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              사용 방법은 정말 간단합니다
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              5단계면 바로 시작할 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {[
              { number: 1, title: "프로그램 실행", description: "다운로드 후 더블클릭으로 즉시 실행" },
              { number: 2, title: "계정 추가", description: "네이버 아이디와 비밀번호 입력" },
              { number: 3, title: "키워드 설정", description: "내 블로그와 관련된 키워드 입력" },
              { number: 4, title: "스케줄 설정", description: "실행 시간과 요일 선택 (선택사항)" },
              { number: 5, title: "시작 버튼 클릭", description: "이제 모든 것이 자동으로 진행됩니다!" },
            ].map((step, index) => (
              <Card
                key={index}
                className="step-card text-center p-8 hover:shadow-lg transition-all"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Scenarios */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              실제 성공 사례
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              다양한 업종에서 검증된 효과
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {[
              {
                badge: "부동산 업종",
                title: "부산 중구 공인중개사",
                description:
                  "부산 중구 부동산 공인중개사가 블로그로 고객을 유치하기 위해 서로이웃 자동화와 댓글 자동화를 활용했습니다.",
                settings: [
                  '키워드: "부산중구, 중구부동산, 남포동"',
                  "하루 댓글: 50개",
                  "서로이웃: 하루 100명",
                  "스케줄: 평일 오전 9시, 오후 2시",
                ],
                results: [
                  { value: "+700명", label: "서로이웃 증가" },
                  { value: "4배 증가", label: "일평균 방문자 (50명 → 200명)" },
                  { value: "4배 증가", label: "고객 문의 (주 2건 → 주 8건)" },
                ],
                period: "📈 1주일 후 결과",
              },
              {
                badge: "교육 업종",
                title: "온라인 토익 강사",
                description:
                  "온라인 토익 강사가 블로그로 학생을 모집하기 위해 AI 댓글 모드와 공감 자동화를 활용했습니다.",
                settings: [
                  '키워드: "토익, 토익 공부법, 토익 고득점"',
                  "하루 댓글: 30개 (AI 모드)",
                  "공감: 파트너 블로그 100개",
                  "스케줄: 매일 오전 8시, 저녁 9시",
                ],
                results: [
                  { value: "+300명", label: "블로그 구독자 증가" },
                  { value: "하루 20개", label: "댓글 반응 (자연스러운 교류)" },
                  { value: "3배 증가", label: "수강생 유입 (월 10명 → 월 30명)" },
                ],
                period: "📈 2주일 후 결과",
              },
              {
                badge: "다중 계정 운영",
                title: "5개 블로그 마케터",
                description:
                  "5개의 블로그를 동시에 운영하는 마케터가 다중 계정 관리 기능을 활용했습니다.",
                settings: [
                  "계정 1~3: 부동산 (각각 다른 기능)",
                  "계정 4: 교육 (서로이웃 + 댓글)",
                  "계정 5: 암호화폐 (댓글 자동화)",
                ],
                results: [
                  { value: "5개 계정", label: "동시 관리 가능" },
                  { value: "90% 절감", label: "작업 시간 (5시간 → 30분)" },
                  { value: "각각 다른 전략", label: "계정별 맞춤 운영" },
                ],
                period: "📈 즉시 효과",
              },
            ].map((scenario, index) => (
              <Card
                key={index}
                className="scenario-card overflow-hidden shadow-xl lg:grid lg:grid-cols-2"
              >
                <CardContent className="p-8 md:p-12 lg:p-16">
                  <Badge className="mb-6 bg-[#667eea] text-white">{scenario.badge}</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">{scenario.title}</h3>
                  <p className="text-lg mb-6 leading-relaxed">{scenario.description}</p>
                  <div className="space-y-2">
                    <strong className="text-foreground">설정:</strong>
                    <ul className="space-y-1 text-muted-foreground">
                      {scenario.settings.map((setting, idx) => (
                        <li key={idx}>• {setting}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <h4 className="text-xl md:text-2xl font-bold mb-8">{scenario.period}</h4>
                  <div className="space-y-6">
                    {scenario.results.map((result, idx) => (
                      <div key={idx} className="border-b border-white/20 pb-4 last:border-b-0">
                        <div className="text-2xl font-bold mb-2">{result.value}</div>
                        <div className="text-sm opacity-90">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              지금 시작하세요
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              블로그 성장을 가속화할 완벽한 기회
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {[
              {
                name: "베이직",
                price: "무료",
                description: "개인 사용자를 위한 기본 기능",
                features: [
                  "서로이웃 자동 신청",
                  "댓글 자동 작성 (고정 멘트)",
                  "공감 자동 클릭",
                  "스케줄 자동 실행",
                  "1개 계정 지원",
                  "80개 댓글 템플릿",
                ],
                cta: "다운로드",
                ctaVariant: "outline" as const,
                featured: false,
              },
              {
                name: "프로",
                price: "₩49,000",
                priceUnit: "/월",
                savings: "연간 결제 시 월 39,000원 (20% 할인)",
                description: "가장 인기",
                features: [
                  "베이직 기능 전체",
                  "AI 댓글 자동 생성",
                  "최대 8개 계정 지원",
                  "텔레그램 알림",
                  "우선 기술 지원",
                  "월간 업데이트",
                  "고급 통계 및 분석",
                ],
                cta: "지금 시작하기",
                ctaVariant: "default" as const,
                featured: true,
              },
              {
                name: "비즈니스",
                price: "문의",
                description: "대량 계정 운영 및 맞춤 서비스",
                features: [
                  "프로 기능 전체",
                  "무제한 계정 지원",
                  "전담 계정 매니저",
                  "맞춤형 자동화 설정",
                  "24/7 기술 지원",
                  "API 접근 권한",
                  "월간 컨설팅",
                ],
                cta: "문의하기",
                ctaVariant: "outline" as const,
                featured: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`pricing-card p-8 md:p-12 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.featured ? "border-4 border-[#667eea] scale-105" : ""
                }`}
              >
                <CardContent className="p-0">
                  {plan.description === "가장 인기" && (
                    <Badge className="mb-4 bg-[#667eea] text-white">🔥 가장 인기</Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl md:text-5xl font-bold mb-4">
                    {plan.price}
                    {plan.priceUnit && (
                      <span className="text-lg text-muted-foreground">{plan.priceUnit}</span>
                    )}
                  </div>
                  {plan.savings && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg mb-6 font-semibold">
                      {plan.savings}
                    </div>
                  )}
                  {plan.description !== "가장 인기" && (
                    <p className="text-muted-foreground mb-8">{plan.description}</p>
                  )}
                  <ul className="space-y-3 text-left mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-[#667eea] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {feature.includes("**") ? (
                            <>
                              {feature.split("**").map((part, i) =>
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                              )}
                            </>
                          ) : (
                            feature
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button
                      variant={plan.ctaVariant}
                      size="lg"
                      className="w-full rounded-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ROI Box */}
          <Card className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">💰 투자 대비 효과 (ROI)</h3>
              <p className="text-lg md:text-xl mb-8 opacity-95">
                직원 고용 대비 연간 1,800만원 절감 효과
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { value: "월 100시간", label: "시간 절감" },
                  { value: "연 1,200시간", label: "총 절감 시간" },
                  { value: "연 1,800만원", label: "비용 절감 효과" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              궁금하신 점을 해결해드립니다
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            지금 바로 블로그 성장을 시작하세요
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95">
            하루 10분 투자로 블로그 운영의 모든 것을 자동화하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="#pricing">
              <Button size="lg" className="bg-white text-[#667eea] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-bold">
                프로 버전 구매
              </Button>
            </Link>
          </div>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-4">100% 만족 보장</h3>
              <p className="text-lg opacity-90">
                7일 이내 환불 가능 • 안전한 자동화 • 지속적인 업데이트
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

