import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import type { FaqEntry } from "@shared/schema";

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const { data: faqs, isLoading } = useQuery<FaqEntry[]>({
    queryKey: ["/api/faq"],
    queryFn: async () => {
      const response = await fetch("/api/faq");
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      return response.json();
    },
  });

  const categories = ["전체", "광고 운영", "결제", "기술 지원"];

  const filteredFaqs = faqs?.filter(
    (faq) => selectedCategory === "전체" || faq.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title="자주 묻는 질문 - 광고 운영 FAQ | 오토마케터"
        description="광고 운영, 광고 교육, 광고 서비스에 대해 자주 묻는 질문과 답변을 확인하세요. 페이스북 광고, 구글 애즈, SNS 마케팅 관련 궁금증을 해결해드립니다."
        keywords="광고 FAQ, 광고 질문, 광고 운영 가이드, 페이스북 광고 FAQ, 구글 애즈 FAQ, 광고 교육 FAQ"
      />
      <StructuredData
        type="faq"
        faqs={faqs?.map(faq => ({
          question: faq.question,
          answer: faq.answer
        })) || []}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" data-testid="text-faq-title">
            자주 묻는 질문
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-faq-subtitle">
            궁금하신 내용을 빠르게 찾아보세요
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto" data-testid="tabs-faq-categories">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                data-testid={`tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {isLoading ? (
                <Card className="p-8">
                  <p className="text-center text-muted-foreground" data-testid="text-loading">
                    FAQ를 불러오는 중...
                  </p>
                </Card>
              ) : filteredFaqs.length === 0 ? (
                <Card className="p-8">
                  <p className="text-center text-muted-foreground" data-testid="text-no-faqs">
                    해당 카테고리에 FAQ가 없습니다
                  </p>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faq">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border rounded-lg px-6"
                      data-testid={`faq-item-${faq.id}`}
                    >
                      <AccordionTrigger className="text-left hover:no-underline" data-testid={`faq-question-${faq.id}`}>
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed" data-testid={`faq-answer-${faq.id}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Contact CTA */}
        <Card className="p-8 text-center bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-xl mb-2" data-testid="text-contact-cta-title">
            찾으시는 답변이 없으신가요?
          </h3>
          <p className="text-muted-foreground mb-4" data-testid="text-contact-cta-subtitle">
            문의하기를 통해 직접 질문해주세요
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2"
            data-testid="link-contact"
          >
            문의하기
          </a>
        </Card>
      </div>
    </div>
  );
}
