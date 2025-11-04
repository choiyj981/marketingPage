import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import type { BlogPost, Product } from "@shared/schema";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data, isLoading } = useQuery<{ blogs: BlogPost[], products: Product[] }>({
    queryKey: ["/api/search", debouncedQuery],
    enabled: debouncedQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) throw new Error("Failed to search");
      return response.json();
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (type: "blog" | "product", slug: string) => {
    setLocation(type === "blog" ? `/blog/${slug}` : `/products/${slug}`);
    setSearchQuery("");
    setIsOpen(false);
    onClose?.();
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const totalResults = (data?.blogs.length || 0) + (data?.products.length || 0);

  return (
    <div ref={wrapperRef} className="relative w-full" data-testid="search-bar">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9"
          data-testid="input-search"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && debouncedQuery && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg" data-testid="search-results-dropdown">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground" data-testid="text-loading">
              검색 중...
            </div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground" data-testid="text-no-results">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="p-2">
              {/* Blog Results */}
              {data?.blogs && data.blogs.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground" data-testid="text-blog-results-header">
                    블로그 ({data.blogs.length})
                  </div>
                  <div className="space-y-1">
                    {data.blogs.map((blog) => (
                      <button
                        key={blog.id}
                        onClick={() => handleResultClick("blog", blog.slug)}
                        className="w-full text-left p-3 rounded-md hover-elevate active-elevate-2 transition-colors"
                        data-testid={`result-blog-${blog.slug}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {blog.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {blog.excerpt}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {blog.category}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Results */}
              {data?.products && data.products.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground" data-testid="text-product-results-header">
                    제품 ({data.products.length})
                  </div>
                  <div className="space-y-1">
                    {data.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick("product", product.slug)}
                        className="w-full text-left p-3 rounded-md hover-elevate active-elevate-2 transition-colors"
                        data-testid={`result-product-${product.slug}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {product.category}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
