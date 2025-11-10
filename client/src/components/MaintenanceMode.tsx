import { useEffect, useState } from "react";
import { RefreshCw, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MaintenanceMode() {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10;
  const retryInterval = 3000; // 3초

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("/api/blog", {
          method: "HEAD",
          cache: "no-cache",
        });
        
        if (response.ok) {
          // 서버가 정상 작동하면 페이지 새로고침
          window.location.reload();
        } else {
          throw new Error("Server not ready");
        }
      } catch (error) {
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, retryInterval);
        }
      }
    };

    const interval = setInterval(checkServer, retryInterval);
    return () => clearInterval(interval);
  }, [retryCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="pt-12 pb-12 px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Server className="h-16 w-16 text-blue-600 animate-pulse" />
              <RefreshCw className="h-8 w-8 text-blue-400 absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            서버 재기동 중입니다
          </h1>
          
          <p className="text-gray-600 mb-6">
            잠시만 기다려주세요. 서버가 업데이트되고 있습니다.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>서버 상태 확인 중...</span>
            </div>
            
            {retryCount > 0 && (
              <p className="text-xs text-gray-400">
                재시도 횟수: {retryCount} / {maxRetries}
              </p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

