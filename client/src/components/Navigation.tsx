import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, User, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SearchBar from "@/components/SearchBar";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "홈" },
    { path: "/blog", label: "블로그" },
    { path: "/products", label: "강의/제품" },
  ];

  const moreLinks = [
    { path: "/services", label: "서비스" },
    { path: "/resources", label: "자료실" },
    { path: "/faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            data-testid="link-home"
            className="flex items-center space-x-2.5 hover-elevate active-elevate-2 px-2 py-1 rounded-md transition-colors"
          >
            <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg md:text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              모두의광고
            </span>
          </Link>

          {/* Desktop Search & Navigation */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                data-testid={`link-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                  location === link.path
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  data-testid="button-more-menu"
                >
                  더보기
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <DropdownMenuItem
                      data-testid={`link-${link.label.toLowerCase()}`}
                      className="cursor-pointer"
                    >
                      {link.label}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth & CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <span className="text-sm text-foreground/70">
                    안녕하세요, {user?.firstName || user?.email || '사용자'}님
                  </span>
                  <Button 
                    variant="ghost"
                    onClick={() => window.location.href = '/api/logout'}
                    data-testid="button-logout"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-login"
                >
                  <User className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              )
            )}
            <Link href="/contact">
              <Button data-testid="button-contact-cta">
                시작하기
              </Button>
            </Link>
          </div>

          {/* Mobile Search & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              data-testid="button-mobile-search"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-4 mt-8">
                {[...navLinks, ...moreLinks].map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                    className={`block px-4 py-3 rounded-md text-base font-medium transition-colors hover-elevate ${
                      location === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <Link href="/contact">
                    <Button
                      className="w-full"
                      onClick={() => setIsMobileOpen(false)}
                      data-testid="button-mobile-contact"
                    >
                      시작하기
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>

          {/* Mobile Search Dialog */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogTitle className="sr-only">검색</DialogTitle>
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
