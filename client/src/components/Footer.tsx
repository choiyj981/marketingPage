import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
    products: [
      { label: "Products", href: "/products" },
      { label: "Services", href: "/services" },
      { label: "Resources", href: "/resources" },
      { label: "Pricing", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Refund Policy", href: "#" },
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-display font-bold text-xl">Business Platform</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A comprehensive platform for digital products, programs, and business services with premium quality.
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
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <a
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover-elevate active-elevate-2 px-1 py-0.5 rounded"
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <a
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover-elevate active-elevate-2 px-1 py-0.5 rounded"
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
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
              © {new Date().getFullYear()} Business Platform. All rights reserved.
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
