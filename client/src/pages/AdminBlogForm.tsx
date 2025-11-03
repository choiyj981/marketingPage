import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Upload } from "lucide-react";
import { insertBlogPostSchema, type BlogPost } from "@shared/schema";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = insertBlogPostSchema.extend({
  featured: z.number().default(0),
});

export default function AdminBlogForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/blog/:id/edit");
  const isEditing = !!params?.id;
  const [imageUploading, setImageUploading] = useState(false);

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", params?.id],
    enabled: isEditing,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      imageUrl: "",
      author: "Business Platform",
      authorImage: "/avatar.png",
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: "5분",
      featured: 0,
    },
    values: post ? {
      ...post,
      featured: post.featured || 0,
    } : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing && params?.id) {
        await apiRequest("PUT", `/api/blog/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/blog", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: isEditing ? "수정 완료" : "작성 완료",
        description: `블로그 포스트가 ${isEditing ? "수정" : "작성"}되었습니다.`,
      });
      setLocation("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("이미지 업로드 실패");

      const data = await response.json();
      form.setValue("imageUrl", data.url);
      toast({
        title: "업로드 완료",
        description: "이미지가 업로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/admin/blog")}
            data-testid="button-back-blog-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-form-title">
              {isEditing ? "블로그 포스트 수정" : "새 블로그 포스트 작성"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>슬러그 (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="blog-post-url" data-testid="input-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AI 트렌드">AI 트렌드</SelectItem>
                          <SelectItem value="비즈니스 전략">비즈니스 전략</SelectItem>
                          <SelectItem value="마케팅">마케팅</SelectItem>
                          <SelectItem value="기술">기술</SelectItem>
                          <SelectItem value="교육">교육</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>요약</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} data-testid="input-excerpt" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>본문</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={12} data-testid="input-content" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대표 이미지</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input {...field} placeholder="이미지 URL" data-testid="input-image-url" />
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={imageUploading}
                              data-testid="input-image-upload"
                              className="flex-1"
                            />
                            {imageUploading && <span className="text-sm text-muted-foreground">업로드 중...</span>}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>작성자</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-author" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>읽기 시간</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="5분" data-testid="input-read-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>게시일</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-published-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추천 포스트</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-featured">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">아니오</SelectItem>
                          <SelectItem value="1">예</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    data-testid="button-submit-blog"
                  >
                    {saveMutation.isPending ? "저장 중..." : isEditing ? "수정하기" : "작성하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/blog")}
                    data-testid="button-cancel"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
