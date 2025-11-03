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
import { insertProductSchema, type Product } from "@shared/schema";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formSchema = insertProductSchema.extend({
  featured: z.number().default(0),
  badge: z.string().optional(),
});

export default function AdminProductForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/products/:id/edit");
  const isEditing = !!params?.id;
  const [imageUploading, setImageUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", params?.id],
    enabled: isEditing,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      fullDescription: "",
      price: "",
      imageUrl: "",
      category: "",
      badge: "",
      featured: 0,
      features: [],
    },
    values: product ? {
      ...product,
      featured: product.featured || 0,
      badge: product.badge || "",
    } : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing && params?.id) {
        await apiRequest("PUT", `/api/products/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: isEditing ? "수정 완료" : "작성 완료",
        description: `제품이 ${isEditing ? "수정" : "추가"}되었습니다.`,
      });
      setLocation("/admin/products");
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

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues("features");
      form.setValue("features", [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
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
            onClick={() => setLocation("/admin/products")}
            data-testid="button-back-products-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-form-title">
              {isEditing ? "제품 수정" : "새 제품 추가"}
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
                        <Input {...field} placeholder="product-url" data-testid="input-slug" />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="온라인 강의">온라인 강의</SelectItem>
                            <SelectItem value="GPT 템플릿">GPT 템플릿</SelectItem>
                            <SelectItem value="컨설팅">컨설팅</SelectItem>
                            <SelectItem value="도구">도구</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>가격</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="₩99,000" data-testid="input-price" />
                        </FormControl>
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
                      <FormLabel>간단 설명</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세 설명</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} data-testid="input-full-description" />
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

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>특징</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              placeholder="특징 입력"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addFeature();
                                }
                              }}
                              data-testid="input-feature"
                            />
                            <Button
                              type="button"
                              onClick={addFeature}
                              data-testid="button-add-feature"
                            >
                              추가
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="gap-1">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  className="ml-1"
                                  data-testid={`button-remove-feature-${index}`}
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
                    name="badge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>배지 (선택)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="HOT, NEW 등" data-testid="input-badge" />
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
                        <FormLabel>추천 제품</FormLabel>
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
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    data-testid="button-submit-product"
                  >
                    {saveMutation.isPending ? "저장 중..." : isEditing ? "수정하기" : "추가하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/products")}
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
