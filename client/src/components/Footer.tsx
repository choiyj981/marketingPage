import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">오토마케터</span>
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
                    onClick={() => {
                      if (link.href.startsWith('/')) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
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
                    onClick={() => {
                      if (link.href.startsWith('/')) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
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
              © {new Date().getFullYear()} 오토마케터. All rights reserved.
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
          
          {/* Version Info */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <span className="font-mono">
                v{import.meta.env.VITE_VERSION || import.meta.env.VITE_BUILD_TIME || '1.0.0'}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono">
                {import.meta.env.VITE_BUILD_TIME || (() => {
                  const now = new Date();
                  const year = now.getFullYear();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  return `${year}-${month}-${day} ${hours}:${minutes}`;
                })()}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono">{import.meta.env.MODE || 'production'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
