import { Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  url?: string;
  title?: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleKakaoShare = () => {
    // KakaoTalk sharing typically requires SDK initialization
    // For now, we'll use a simple URL scheme or fallback
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2" data-testid="social-share">
      <span className="text-sm text-muted-foreground">공유하기:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleFacebookShare}
        className="h-9 w-9"
        data-testid="button-share-facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleTwitterShare}
        className="h-9 w-9"
        data-testid="button-share-twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLinkedInShare}
        className="h-9 w-9"
        data-testid="button-share-linkedin"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleKakaoShare}
        className="h-9 w-9"
        data-testid="button-share-kakao"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
