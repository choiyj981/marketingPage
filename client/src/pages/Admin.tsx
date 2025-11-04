import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Package, FolderOpen, Wrench, Mail, Plus, HelpCircle, Star, Users, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { BlogPost, Product, Resource, Service, Contact, FaqEntry, Review, NewsletterSubscription, MetricsSnapshot } from "@shared/schema";

export default function Admin() {
  const { user } = useAuth();

  const { data: blogPosts } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: resources } = useQuery<Resource[]>({ queryKey: ["/api/resources"] });
  const { data: services } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const { data: contacts } = useQuery<Contact[]>({ queryKey: ["/api/contacts"] });
  const { data: faqs } = useQuery<FaqEntry[]>({ queryKey: ["/api/admin/faq"] });
  const { data: reviews } = useQuery<Review[]>({ queryKey: ["/api/admin/reviews"] });
  const { data: newsletters } = useQuery<NewsletterSubscription[]>({ queryKey: ["/api/admin/newsletter"] });
  const { data: metrics } = useQuery<MetricsSnapshot[]>({ queryKey: ["/api/metrics"] });

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

  const stats = [
    { title: "블로그 포스트", count: blogPosts?.length || 0, icon: FileText, href: "/admin/blog", hasNew: true },
    { title: "제품/강의", count: products?.length || 0, icon: Package, href: "/admin/products", hasNew: true },
    { title: "자료실", count: resources?.length || 0, icon: FolderOpen, href: "/admin/resources", hasNew: true },
    { title: "서비스", count: services?.length || 0, icon: Wrench, href: "/admin/services", hasNew: true },
    { title: "문의사항", count: contacts?.length || 0, icon: Mail, href: "/admin/contacts", hasNew: false },
    { title: "FAQ 관리", count: faqs?.length || 0, icon: HelpCircle, href: "/admin/faq", hasNew: true },
    { title: "리뷰 관리", count: reviews?.length || 0, icon: Star, href: "/admin/reviews", hasNew: false },
    { title: "뉴스레터 구독자", count: newsletters?.length || 0, icon: Users, href: "/admin/newsletter", hasNew: false },
    { title: "통계 관리", count: metrics?.length || 0, icon: BarChart3, href: "/admin/metrics", hasNew: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">관리자 대시보드</h1>
          <p className="text-muted-foreground">콘텐츠를 관리하고 사이트를 운영하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-${stat.title}-count`}>{stat.count}</div>
                <div className="mt-4 flex gap-2">
                  <Link href={stat.href}>
                    <Button variant="outline" size="sm" data-testid={`button-manage-${stat.title}`}>
                      관리
                    </Button>
                  </Link>
                  {stat.hasNew && (
                    <Link href={`${stat.href}/new`}>
                      <Button size="sm" data-testid={`button-create-${stat.title}`}>
                        <Plus className="h-4 w-4 mr-1" />
                        추가
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
