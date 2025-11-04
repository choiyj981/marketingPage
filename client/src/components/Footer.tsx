import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: NewsletterForm) => {
      return await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "뉴스레터 구독이 완료되었습니다!",
        description: "최신 광고 인사이트를 이메일로 받아보세요.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "구독에 실패했습니다",
        description: "다시 시도해 주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterForm) => {
    subscribeMutation.mutate(data);
  };

  const footerLinks = {
    company: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "/blog" },
      { label: "채용", href: "#" },
      { label: "문의", href: "/contact" },
    ],
    products: [
      { label: "강의/제품", href: "/products" },
      { label: "서비스", href: "/services" },
      { label: "자료실", href: "/resources" },
      { label: "가격", href: "#" },
    ],
    legal: [
      { label: "개인정보처리방침", href: "#" },
      { label: "이용약관", href: "#" },
      { label: "쿠키 정책", href: "#" },
      { label: "환불 정책", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground" data-testid="text-newsletter-title">
              최신 광고 인사이트를 받아보세요
            </h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-newsletter-subtitle">
              실전 마케팅 전략과 광고 운영 팁을 이메일로 받아보세요
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1">
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="이름"
                  className="w-full"
                  data-testid="input-newsletter-name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-newsletter-name">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="이메일"
                  className="w-full"
                  data-testid="input-newsletter-email"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-newsletter-email">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={subscribeMutation.isPending}
                data-testid="button-newsletter-subscribe"
                className="sm:w-auto"
              >
                {subscribeMutation.isPending ? "구독 중..." : "구독하기"}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">모두의광고</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              효과적인 광고 솔루션과 마케팅 전략을 제공하는 프리미엄 플랫폼입니다.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                  className="w-9 h-9 rounded-md bg-secondary hover-elevate active-elevate-2 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">회사</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover-elevate active-elevate-2 px-1 py-0.5 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">서비스</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover-elevate active-elevate-2 px-1 py-0.5 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">법률</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover-elevate active-elevate-2 px-1 py-0.5 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} 알파GOGOGO. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:contact@businessplatform.com"
                className="hover:text-foreground transition-colors"
                data-testid="link-email"
              >
                contact@businessplatform.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
