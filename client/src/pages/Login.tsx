import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute } from "wouter";
import { z } from "zod";
import { LogIn, Mail, Lock } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isAdminRoute] = useRoute("/admin*");

  // 이미 로그인되어 있으면 리다이렉트
  useEffect(() => {
    if (isAuthenticated && user) {
      // URL 파라미터에서 리다이렉트 경로 확인
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/admin";
      setLocation(redirectTo);
    }
  }, [isAuthenticated, user, setLocation]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      // 사용자 정보 쿼리 무효화하여 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "로그인 성공",
        description: `환영합니다, ${data.user?.firstName || data.user?.email || "사용자"}님!`,
      });

      // 리다이렉트 처리
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/admin";
      setLocation(redirectTo);
    },
    onError: (error: any) => {
      let errorMessage = "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      
      try {
        const errorData = JSON.parse(error.message.split(": ")[1] || "{}");
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // 기본 에러 메시지 사용
      }

      toast({
        title: "로그인 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  // 이미 로그인된 경우 로딩 표시
  if (isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">로그인 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-muted/30">
      <SEO
        title="로그인 - 관리자 페이지 | 오토마케터"
        description="관리자 페이지에 로그인하여 콘텐츠를 관리하세요."
        keywords="로그인, 관리자 로그인"
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">관리자 로그인</CardTitle>
          <CardDescription className="text-center">
            이메일과 비밀번호를 입력하여 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@test.com"
                          className="pl-10"
                          {...field}
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          className="pl-10"
                          {...field}
                          data-testid="input-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={mutation.isPending}
                data-testid="button-login"
              >
                {mutation.isPending ? (
                  <>
                    <span className="mr-2">로그인 중...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </>
                )}
              </Button>
            </form>
          </Form>

          {isAdminRoute && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                관리자 페이지에 접근하려면 로그인이 필요합니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

