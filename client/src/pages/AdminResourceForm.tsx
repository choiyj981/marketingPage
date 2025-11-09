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
import { ArrowLeft, X } from "lucide-react";
import { insertResourceSchema, type Resource } from "@shared/schema";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formSchema = insertResourceSchema.extend({
  featured: z.number().default(0),
  downloads: z.number().default(0),
});

export default function AdminResourceForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/resources/:id/edit");
  const isEditing = !!params?.id;
  const [fileUploading, setFileUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { data: resource, isLoading } = useQuery<Resource>({
    queryKey: ["/api/admin/resources", params?.id],
    enabled: isEditing && !!params?.id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      fileType: "",
      fileSize: "",
      downloadUrl: "",
      category: "",
      downloads: 0,
      author: "Business Platform",
      publishedAt: new Date().toISOString().split("T")[0],
      featured: 0,
      tags: [],
    },
  });

  // 데이터 로드 후 폼 리셋
  useEffect(() => {
    if (resource && isEditing) {
      form.reset({
        ...resource,
        featured: resource.featured || 0,
        downloads: resource.downloads || 0,
        publishedAt: resource.publishedAt ? new Date(resource.publishedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      });
    }
  }, [resource, isEditing, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing && params?.id) {
        await apiRequest("PUT", `/api/resources/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/resources", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: isEditing ? "수정 완료" : "작성 완료",
        description: `자료가 ${isEditing ? "수정" : "추가"}되었습니다.`,
      });
      setLocation("/admin/resources");
    },
    onError: (error: Error) => {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("파일 업로드 실패");

      const data = await response.json();
      form.setValue("downloadUrl", data.url);
      form.setValue("fileSize", data.size || "알 수 없음");
      toast({
        title: "업로드 완료",
        description: "파일이 업로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "파일 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
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
            onClick={() => setLocation("/admin/resources")}
            data-testid="button-back-resources-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-form-title">
              {isEditing ? "자료 수정" : "새 자료 추가"}
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
                        <Input {...field} placeholder="resource-url" data-testid="input-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="템플릿">템플릿</SelectItem>
                            <SelectItem value="가이드">가이드</SelectItem>
                            <SelectItem value="도구">도구</SelectItem>
                            <SelectItem value="문서">문서</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fileType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>파일 유형</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-file-type">
                              <SelectValue placeholder="파일 유형 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="DOCX">DOCX</SelectItem>
                            <SelectItem value="XLSX">XLSX</SelectItem>
                            <SelectItem value="ZIP">ZIP</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>다운로드 파일</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input {...field} placeholder="파일 URL" data-testid="input-download-url" />
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              onChange={handleFileUpload}
                              disabled={fileUploading}
                              data-testid="input-file-upload"
                              className="flex-1"
                            />
                            {fileUploading && <span className="text-sm text-muted-foreground">업로드 중...</span>}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fileSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>파일 크기</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2.5MB" data-testid="input-file-size" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>태그</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="태그 입력"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTag();
                                }
                              }}
                              data-testid="input-tag"
                            />
                            <Button
                              type="button"
                              onClick={addTag}
                              data-testid="button-add-tag"
                            >
                              추가
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="gap-1">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(index)}
                                  className="ml-1"
                                  data-testid={`button-remove-tag-${index}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
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
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추천 자료</FormLabel>
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
                    data-testid="button-submit-resource"
                  >
                    {saveMutation.isPending ? "저장 중..." : isEditing ? "수정하기" : "추가하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/resources")}
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
