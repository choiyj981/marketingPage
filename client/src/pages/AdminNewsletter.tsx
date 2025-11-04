import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { NewsletterSubscription } from "@shared/schema";
import { format } from "date-fns";

export default function AdminNewsletter() {
  const { user } = useAuth();

  const { data: subscribers, isLoading } = useQuery<NewsletterSubscription[]>({
    queryKey: ["/api/admin/newsletter"],
  });

  const exportToCSV = () => {
    if (!subscribers || subscribers.length === 0) return;

    const headers = ["이메일", "이름", "구독일", "상태"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map((sub) =>
        [
          sub.email,
          sub.name,
          format(new Date(sub.subscribedAt), "yyyy-MM-dd HH:mm:ss"),
          sub.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1 className="text-4xl font-bold mb-2" data-testid="text-newsletter-title">
              뉴스레터 구독자
            </h1>
            <p className="text-muted-foreground">
              뉴스레터 구독자 목록을 관리합니다
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" data-testid="button-back-admin">
                대시보드로
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={!subscribers || subscribers.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV 내보내기
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="loading-newsletter">
                로딩 중...
              </div>
            ) : !subscribers || subscribers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="empty-newsletter">
                등록된 구독자가 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이메일</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>구독일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow
                      key={subscriber.id}
                      data-testid={`row-subscriber-${subscriber.id}`}
                    >
                      <TableCell
                        className="font-medium"
                        data-testid={`text-email-${subscriber.id}`}
                      >
                        {subscriber.email}
                      </TableCell>
                      <TableCell data-testid={`text-name-${subscriber.id}`}>
                        {subscriber.name}
                      </TableCell>
                      <TableCell data-testid={`text-date-${subscriber.id}`}>
                        {format(new Date(subscriber.subscribedAt), "yyyy-MM-dd HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscriber.status === "active" ? "default" : "secondary"
                          }
                          data-testid={`badge-status-${subscriber.id}`}
                        >
                          {subscriber.status === "active" ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {subscribers && subscribers.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            총 {subscribers.length}명의 구독자
          </div>
        )}
      </div>
    </div>
  );
}
