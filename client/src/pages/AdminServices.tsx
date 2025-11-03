import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminServices() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: services, isLoading } = useQuery<Service[]>({ 
    queryKey: ["/api/services"] 
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "삭제 완료",
        description: "서비스가 삭제되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredServices = services?.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-back-admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              관리자 대시보드
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle data-testid="text-services-title">서비스 관리</CardTitle>
              <Link href="/admin/services/new">
                <Button data-testid="button-create-service">
                  <Plus className="h-4 w-4 mr-2" />
                  새 서비스 추가
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-services"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredServices && filteredServices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>아이콘</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id} data-testid={`row-service-${service.id}`}>
                        <TableCell className="font-medium" data-testid={`text-service-title-${service.id}`}>
                          {service.title}
                        </TableCell>
                        <TableCell data-testid={`text-service-icon-${service.id}`}>
                          {service.icon}
                        </TableCell>
                        <TableCell className="max-w-md truncate" data-testid={`text-service-description-${service.id}`}>
                          {service.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/admin/services/${service.id}/edit`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-edit-service-${service.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("정말 삭제하시겠습니까?")) {
                                  deleteMutation.mutate(service.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-service-${service.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                서비스가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
