import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ResourceCard from "@/components/ResourceCard";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { Resource } from "@shared/schema";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  // Get unique categories
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <SEO
        title="마케팅 자료실 - 무료 광고 운영 가이드 & 템플릿 | 모두의광고"
        description="광고 운영에 필요한 모든 자료를 무료로 제공합니다. 광고 운영 가이드, 마케팅 템플릿, 캠페인 체크리스트 등 실전에서 바로 사용할 수 있는 자료를 다운로드하세요."
        keywords="광고 자료, 마케팅 자료, 광고 가이드, 마케팅 템플릿, 광고 템플릿, 캠페인 가이드, 무료 광고 자료, 광고 운영 가이드"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4" data-testid="text-page-title">
            마케팅 자료실
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl" style={{ lineHeight: '1.8' }} data-testid="text-page-subtitle">
            광고 운영에 필요한 가이드, 템플릿, 도구를 제공합니다
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="자료 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover-elevate active-elevate-2"
              onClick={() => setSelectedCategory(null)}
              data-testid="badge-category-all"
            >
              전체
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground" data-testid="text-results-count">
            {filteredResources.length}개의 자료
          </p>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2" data-testid="text-no-results" style={{ lineHeight: '1.7' }}>
              자료가 없습니다
            </p>
            <p className="text-sm text-muted-foreground" style={{ lineHeight: '1.7' }}>
              검색어나 필터를 변경해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
