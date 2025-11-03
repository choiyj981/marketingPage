import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { BlogPost } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlog() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({ 
    queryKey: ["/api/blog"] 
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "삭제 완료",
        description: "블로그 포스트가 삭제되었습니다.",
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

  const filteredPosts = blogPosts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              <CardTitle data-testid="text-blog-title">블로그 관리</CardTitle>
              <Link href="/admin/blog/new">
                <Button data-testid="button-create-blog">
                  <Plus className="h-4 w-4 mr-2" />
                  새 포스트 작성
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목 또는 카테고리로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-blog"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>게시일</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id} data-testid={`row-blog-${post.id}`}>
                        <TableCell className="font-medium" data-testid={`text-blog-title-${post.id}`}>
                          {post.title}
                          {post.featured === 1 && (
                            <Badge className="ml-2" variant="secondary">추천</Badge>
                          )}
                        </TableCell>
                        <TableCell data-testid={`text-blog-category-${post.id}`}>
                          {post.category}
                        </TableCell>
                        <TableCell data-testid={`text-blog-author-${post.id}`}>
                          {post.author}
                        </TableCell>
                        <TableCell data-testid={`text-blog-date-${post.id}`}>
                          {post.publishedAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-edit-blog-${post.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("정말 삭제하시겠습니까?")) {
                                  deleteMutation.mutate(post.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-blog-${post.id}`}
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
                블로그 포스트가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
