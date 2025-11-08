import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "메시지가 성공적으로 전송되었습니다!",
        description: "빠른 시일 내에 답변드리겠습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "메시지 전송 실패",
        description: error.message || "나중에 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "이메일",
      content: "contact@modooads.com",
      href: "mailto:contact@modooads.com",
    },
    {
      icon: Phone,
      title: "전화",
      content: "02-1234-5678",
      href: "tel:+8221234 5678",
    },
    {
      icon: MapPin,
      title: "오시는 길",
      content: "서울시 강남구 테헤란로 123\n오토마케터 빌딩 5층",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#EEF2FF]">
      <SEO
        title="문의하기 - 광고 상담 신청 | 오토마케터"
        description="광고 운영, 마케팅 전략에 대해 궁금하신 점이 있으신가요? 전문가가 직접 답변해드립니다. 1:1 맞춤 상담을 통해 귀사의 비즈니스에 최적화된 광고 전략을 제안받으세요."
        keywords="광고 문의, 마케팅 상담, 광고 상담, 광고 전략 상담, 광고 대행 문의, 마케팅 컨설팅 문의"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4" data-testid="text-page-title">
            문의하기
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" style={{ lineHeight: '1.8' }} data-testid="text-page-subtitle">
            궁금하신 점이나 협업 제안이 있으신가요? 메시지를 보내주시면 빠르게 답변드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="font-semibold text-2xl mb-2" data-testid="text-success-title">
                      메시지를 보내주셔서 감사합니다!
                    </h3>
                    <p className="text-muted-foreground mb-6" style={{ lineHeight: '1.7' }} data-testid="text-success-message">
                      문의 내용을 잘 받았습니다. 빠른 시일 내에 답변드리겠습니다.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      data-testid="button-send-another"
                    >
                      다른 메시지 보내기
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>이름 *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="이름을 입력하세요"
                                  {...field}
                                  data-testid="input-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>이메일 *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>제목 *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="어떤 도움이 필요하신가요?"
                                {...field}
                                data-testid="input-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>메시지 *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="문의 내용을 자세히 입력해주세요..."
                                rows={6}
                                {...field}
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto gap-2"
                        disabled={mutation.isPending}
                        data-testid="button-submit"
                      >
                        {mutation.isPending ? (
                          "전송 중..."
                        ) : (
                          <>
                            메시지 보내기
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-2xl mb-6" data-testid="text-contact-info-title">연락처 정보</h2>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1" data-testid={`text-contact-${item.title.toLowerCase().replace(/\s+/g, '-')}-title`}>
                            {item.title}
                          </h3>
                          {item.href !== "#" ? (
                            <a
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                              style={{ lineHeight: '1.7' }}
                              data-testid={`link-contact-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground whitespace-pre-line" style={{ lineHeight: '1.7' }} data-testid={`text-contact-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                              {item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3" data-testid="text-business-hours-title">운영 시간</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">월요일 - 금요일</span>
                    <span className="font-medium">오전 9:00 - 오후 6:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">토요일</span>
                    <span className="font-medium">오전 10:00 - 오후 4:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">일요일</span>
                    <span className="font-medium">휴무</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
