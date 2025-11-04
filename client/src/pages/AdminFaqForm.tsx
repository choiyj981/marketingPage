import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFaqEntrySchema, type FaqEntry, type InsertFaqEntry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link, useParams, useLocation } from "wouter";

export default function AdminFaqForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: faqs } = useQuery<FaqEntry[]>({
    queryKey: ["/api/admin/faq"],
    enabled: isEditing,
  });

  const faq = faqs?.find((f) => f.id === id);

  const form = useForm<InsertFaqEntry>({
    resolver: zodResolver(insertFaqEntrySchema),
    defaultValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      category: faq?.category || "",
      displayOrder: faq?.displayOrder || 0,
      status: (faq?.status as "published" | "draft" | undefined) || "published",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFaqEntry) => {
      return apiRequest("POST", "/api/admin/faq", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      toast({
        title: "FAQ 생성 완료",
        description: "FAQ가 성공적으로 생성되었습니다.",
      });
      setLocation("/admin/faq");
    },
    onError: () => {
      toast({
        title: "생성 실패",
        description: "FAQ 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertFaqEntry) => {
      return apiRequest("PUT", `/api/admin/faq/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      toast({
        title: "FAQ 수정 완료",
        description: "FAQ가 성공적으로 수정되었습니다.",
      });
      setLocation("/admin/faq");
    },
    onError: () => {
      toast({
        title: "수정 실패",
        description: "FAQ 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFaqEntry) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>접근 권한 없음</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">관리자 권한이 필요합니다.</p>
            <Link href="/">
              <Button className="mt-4">홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-form-title">
            {isEditing ? "FAQ 수정" : "새 FAQ 추가"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "FAQ 정보를 수정합니다" : "새로운 FAQ를 추가합니다"}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>질문</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="자주 묻는 질문을 입력하세요"
                          data-testid="input-question"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>답변</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="답변을 입력하세요"
                          rows={6}
                          data-testid="input-answer"
                          {...field}
                        />
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
                      <FormControl>
                        <Input
                          placeholder="예: 일반, 서비스, 결제"
                          data-testid="input-category"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>표시 순서</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          data-testid="input-display-order"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상태</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        data-testid="select-status"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="상태를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="published" data-testid="option-published">
                            공개
                          </SelectItem>
                          <SelectItem value="draft" data-testid="option-draft">
                            비공개
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Link href="/admin/faq" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      data-testid="button-cancel"
                    >
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "저장 중..."
                      : isEditing
                      ? "수정하기"
                      : "등록하기"}
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
