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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, X } from "lucide-react";
import { insertServiceSchema, type Service } from "@shared/schema";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminServiceForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/services/:id/edit");
  const isEditing = !!params?.id;
  const [featureInput, setFeatureInput] = useState("");

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ["/api/admin/services", params?.id],
    enabled: isEditing && !!params?.id,
  });

  const form = useForm<z.infer<typeof insertServiceSchema>>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      icon: "",
      features: [],
    },
  });

  // 데이터 로드 후 폼 리셋
  useEffect(() => {
    if (service && isEditing) {
      form.reset(service);
    }
  }, [service, isEditing, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertServiceSchema>) => {
      if (isEditing && params?.id) {
        await apiRequest("PUT", `/api/services/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/services", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: isEditing ? "수정 완료" : "작성 완료",
        description: `서비스가 ${isEditing ? "수정" : "추가"}되었습니다.`,
      });
      setLocation("/admin/services");
    },
    onError: (error: Error) => {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
              {[1, 2, 3, 4].map((i) => (
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
            onClick={() => setLocation("/admin/services")}
            data-testid="button-back-services-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-form-title">
              {isEditing ? "서비스 수정" : "새 서비스 추가"}
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
                        <Input {...field} placeholder="service-url" data-testid="input-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>아이콘</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="lucide 아이콘 이름 (예: Zap, Target)" data-testid="input-icon" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    data-testid="button-submit-service"
                  >
                    {saveMutation.isPending ? "저장 중..." : isEditing ? "수정하기" : "추가하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/services")}
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
