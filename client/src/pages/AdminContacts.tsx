import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trash2, Search, ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import type { Contact } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminContacts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery<Contact[]>({ 
    queryKey: ["/api/contacts"] 
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "삭제 완료",
        description: "문의사항이 삭제되었습니다.",
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

  const filteredContacts = contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
            <CardTitle data-testid="text-contacts-title">문의사항 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 이메일, 제목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-contacts"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredContacts && filteredContacts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>문의일</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                        <TableCell className="font-medium" data-testid={`text-contact-name-${contact.id}`}>
                          {contact.name}
                        </TableCell>
                        <TableCell data-testid={`text-contact-email-${contact.id}`}>
                          {contact.email}
                        </TableCell>
                        <TableCell className="max-w-md truncate" data-testid={`text-contact-subject-${contact.id}`}>
                          {contact.subject}
                        </TableCell>
                        <TableCell data-testid={`text-contact-date-${contact.id}`}>
                          {new Date(contact.createdAt).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedContact(contact)}
                              data-testid={`button-view-contact-${contact.id}`}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("정말 삭제하시겠습니까?")) {
                                  deleteMutation.mutate(contact.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-contact-${contact.id}`}
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
                문의사항이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>문의사항 상세</DialogTitle>
            <DialogDescription>문의자의 메시지를 확인하세요</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">이름</h4>
                <p data-testid="text-dialog-name">{selectedContact.name}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">이메일</h4>
                <p data-testid="text-dialog-email">{selectedContact.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">제목</h4>
                <p data-testid="text-dialog-subject">{selectedContact.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">메시지</h4>
                <p className="whitespace-pre-wrap" data-testid="text-dialog-message">
                  {selectedContact.message}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">문의일</h4>
                <p data-testid="text-dialog-date">
                  {new Date(selectedContact.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
