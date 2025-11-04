import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Check, X } from "lucide-react";
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
import type { Review, Product } from "@shared/schema";
import { format } from "date-fns";

export default function AdminReviews() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const getProductName = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    return product?.title || "알 수 없음";
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/admin/reviews/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "상태 업데이트 완료",
        description: "리뷰 상태가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "업데이트 실패",
        description: "리뷰 상태 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "리뷰 삭제 완료",
        description: "리뷰가 성공적으로 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "리뷰 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "승인됨";
      case "pending":
        return "대기 중";
      case "rejected":
        return "거부됨";
      default:
        return status;
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-reviews-title">
              리뷰 관리
            </h1>
            <p className="text-muted-foreground">
              제품 리뷰를 관리하고 승인합니다
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" data-testid="button-back-admin">
              대시보드로
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="loading-reviews">
                로딩 중...
              </div>
            ) : !reviews || reviews.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="empty-reviews">
                등록된 리뷰가 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제품명</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead className="text-center">별점</TableHead>
                    <TableHead>리뷰 내용</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                      <TableCell className="font-medium" data-testid={`text-product-${review.id}`}>
                        {getProductName(review.productId)}
                      </TableCell>
                      <TableCell data-testid={`text-author-${review.id}`}>
                        <div>
                          <div className="font-medium">{review.authorName}</div>
                          <div className="text-xs text-muted-foreground">
                            {review.authorEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center" data-testid={`text-rating-${review.id}`}>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{review.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {review.body}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(review.status)}
                          data-testid={`badge-status-${review.id}`}
                        >
                          {getStatusText(review.status)}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-date-${review.id}`}>
                        {format(new Date(review.createdAt), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {review.status !== "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: review.id,
                                  status: "approved",
                                })
                              }
                              data-testid={`button-approve-${review.id}`}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              승인
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: review.id,
                                  status: "rejected",
                                })
                              }
                              data-testid={`button-reject-${review.id}`}
                            >
                              <X className="h-4 w-4 mr-1" />
                              거부
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-delete-${review.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-testid={`button-cancel-delete-${review.id}`}>
                                  취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(review.id)}
                                  data-testid={`button-confirm-delete-${review.id}`}
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
