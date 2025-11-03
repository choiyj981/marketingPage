import { Download, FileText, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const handleDownload = () => {
    window.open(resource.downloadUrl, '_blank');
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      data-testid={`card-resource-${resource.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 space-y-2">
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" data-testid={`badge-category-${resource.category}`}>
                {resource.category}
              </Badge>
              {resource.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}`}>
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight" data-testid={`text-title-${resource.id}`}>
              {resource.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2" data-testid={`text-description-${resource.id}`}>
              {resource.description}
            </p>
          </div>

          {/* File Icon */}
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1" data-testid={`text-filetype-${resource.id}`}>
                <span className="font-medium uppercase">{resource.fileType}</span>
                <span>•</span>
                <span>{resource.fileSize}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span data-testid={`text-date-${resource.id}`}>{resource.publishedAt}</span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2"
            data-testid={`button-download-${resource.id}`}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Download Count */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground" data-testid={`text-downloads-${resource.id}`}>
            {resource.downloads.toLocaleString()} downloads
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
