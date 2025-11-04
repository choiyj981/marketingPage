import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FaqEntry } from "@shared/schema";

export default function AdminFaq() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: faqs, isLoading } = useQuery<FaqEntry[]>({
    queryKey: ["/api/admin/faq"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/faq/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      toast({
        title: "FAQ 삭제 완료",
        description: "FAQ가 성공적으로 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "FAQ 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-faq-title">
              FAQ 관리
            </h1>
            <p className="text-muted-foreground">
              자주 묻는 질문을 관리합니다
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" data-testid="button-back-admin">
                대시보드로
              </Button>
            </Link>
            <Link href="/admin/faq/new">
              <Button data-testid="button-create-faq">
                <Plus className="h-4 w-4 mr-2" />
                새 FAQ 추가
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="loading-faq">
                로딩 중...
              </div>
            ) : !faqs || faqs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="empty-faq">
                등록된 FAQ가 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>질문</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">표시 순서</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id} data-testid={`row-faq-${faq.id}`}>
                      <TableCell className="font-medium" data-testid={`text-question-${faq.id}`}>
                        {faq.question}
                      </TableCell>
                      <TableCell data-testid={`text-category-${faq.id}`}>
                        {faq.category}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={faq.status === "published" ? "default" : "secondary"}
                          data-testid={`badge-status-${faq.id}`}
                        >
                          {faq.status === "published" ? "공개" : "비공개"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center" data-testid={`text-order-${faq.id}`}>
                        {faq.displayOrder}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/faq/${faq.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-edit-${faq.id}`}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              수정
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-delete-${faq.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>FAQ 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말 이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid={`button-cancel-delete-${faq.id}`}>
                                  취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(faq.id)}
                                  data-testid={`button-confirm-delete-${faq.id}`}
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
