import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Download } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import SocialShare from "@/components/SocialShare";
import RelatedContent from "@/components/RelatedContent";
import type { BlogPost } from "@shared/schema";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: any) => void;
      contentLoaded: () => void;
      run: (config: any) => Promise<void>;
    };
  }
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  // Mermaid 다이어그램 자동 렌더링
  useEffect(() => {
    if (!post?.content || !contentRef.current) return;
    
    // Mermaid가 로드되었는지 확인하고 렌더링
    if (window.mermaid) {
      // DOM이 완전히 렌더링된 후 Mermaid 렌더링
      const timer = setTimeout(() => {
        window.mermaid?.contentLoaded();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [post?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#F4F9FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="h-96 animate-pulse bg-muted" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#F4F9FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FF]">
      <SEO
        title={`${post.title} | 오토마케터 블로그`}
        description={post.excerpt}
        keywords={`${post.category}, 광고 블로그, 마케팅 전략, ${post.tags?.join(', ') || '광고 운영, 디지털 마케팅'}`}
        image={post.imageUrl}
        url={window.location.href}
        type="article"
      />
      <StructuredData
        type="blog"
        title={post.title}
        description={post.excerpt}
        author={post.author}
        publishedAt={post.publishedAt}
        imageUrl={post.imageUrl}
        url={window.location.href}
      />
      {/* Back Button */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-muted">
        <img
          src={post.imageUrl}
          alt={`${post.title} - ${post.category} 광고 마케팅 블로그 포스트`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-category">
              {post.category}
            </Badge>
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight" data-testid="text-title">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-white/90 text-sm">
              <span className="flex items-center gap-2" data-testid="text-date">
                <Calendar className="h-4 w-4" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-2" data-testid="text-readtime">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Author */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground" data-testid="text-author">
                  {post.author}
                </p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            <SocialShare title={post.title} />
          </div>

          {/* Excerpt */}
          <div className="mb-8">
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-excerpt">
              {post.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none" data-testid="text-content">
            <div
              ref={contentRef}
              className="text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Download Button */}
          {post.attachmentUrl && (
            <div className="mt-8 pt-8 border-t">
              <Button
                onClick={() => {
                  window.location.href = `/api/blog/${post.id}/download`;
                }}
                className="gap-2"
                data-testid="button-download-attachment"
              >
                <Download className="h-4 w-4" />
                {post.attachmentFilename || "파일 다운로드"}
                {post.attachmentSize && ` (${post.attachmentSize})`}
              </Button>
            </div>
          )}
        </div>
      </article>

      {/* Related Content */}
      <RelatedContent type="blog" currentId={post.id} tags={post.tags || []} />
    </div>
  );
}
