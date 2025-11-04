import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MetricsSnapshot } from "@shared/schema";
import { useState } from "react";

export default function AdminMetrics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingValues, setEditingValues] = useState<Record<string, number>>({});

  const { data: metrics, isLoading } = useQuery<MetricsSnapshot[]>({
    queryKey: ["/api/metrics"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ name, value }: { name: string; value: number }) => {
      return apiRequest("PUT", "/api/admin/metrics", { name, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      toast({
        title: "메트릭 업데이트 완료",
        description: "메트릭이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "업데이트 실패",
        description: "메트릭 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleValueChange = (name: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingValues((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSave = (metric: MetricsSnapshot) => {
    const newValue = editingValues[metric.name] ?? metric.value;
    updateMutation.mutate({ name: metric.name, value: newValue });
  };

  const getCurrentValue = (metric: MetricsSnapshot) => {
    return editingValues[metric.name] ?? metric.value;
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
            <h1 className="text-4xl font-bold mb-2" data-testid="text-metrics-title">
              통계 관리
            </h1>
            <p className="text-muted-foreground">
              플랫폼 통계를 관리하고 업데이트합니다
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
              <div className="p-8 text-center text-muted-foreground" data-testid="loading-metrics">
                로딩 중...
              </div>
            ) : !metrics || metrics.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground" data-testid="empty-metrics">
                등록된 메트릭이 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>메트릭 이름</TableHead>
                    <TableHead>현재 값</TableHead>
                    <TableHead>마지막 업데이트</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id} data-testid={`row-metric-${metric.name}`}>
                      <TableCell className="font-medium" data-testid={`text-name-${metric.name}`}>
                        {metric.name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={getCurrentValue(metric)}
                          onChange={(e) =>
                            handleValueChange(metric.name, e.target.value)
                          }
                          className="w-32"
                          data-testid={`input-value-${metric.name}`}
                        />
                      </TableCell>
                      <TableCell data-testid={`text-updated-${metric.name}`}>
                        {new Date(metric.updatedAt).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave(metric)}
                          disabled={
                            updateMutation.isPending ||
                            getCurrentValue(metric) === metric.value
                          }
                          data-testid={`button-save-${metric.name}`}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          저장
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">안내</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 메트릭 값을 수정한 후 "저장" 버튼을 클릭하세요.</li>
            <li>• 메트릭은 홈페이지 통계 섹션에 표시됩니다.</li>
            <li>• 값은 0 이상의 정수만 입력할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
