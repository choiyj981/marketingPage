import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group cursor-pointer overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        data-testid={`card-blog-${post.id}`}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 backdrop-blur-sm" data-testid={`badge-category-${post.category}`}>
              {post.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${post.id}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed" data-testid={`text-excerpt-${post.id}`}>
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5" data-testid={`text-date-${post.id}`}>
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5" data-testid={`text-readtime-${post.id}`}>
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 pt-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground" data-testid={`text-author-${post.id}`}>
              {post.author}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
