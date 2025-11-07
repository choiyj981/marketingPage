import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "오토마케터",
  description = "효과적인 광고 솔루션과 마케팅 전략을 제공하는 프리미엄 플랫폼",
  keywords = "광고 운영, 페이스북 광고, 구글 애즈, 마케팅 교육, 광고 강의, 디지털 마케팅, 온라인 광고, 광고 컨설팅, 광고 대행",
  image = "/og-image.png",
  url = "",
  type = "website",
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const attrParts = selector.match(/\[(.*?)="(.*?)"\]/);
        if (attrParts) {
          element.setAttribute(attrParts[1], attrParts[2]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Basic meta tags
    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[name="keywords"]', "content", keywords);

    // Open Graph meta tags
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[property="og:image"]', "content", image);
    updateMetaTag('meta[property="og:url"]', "content", url || window.location.href);
    updateMetaTag('meta[property="og:type"]', "content", type);
    updateMetaTag('meta[property="og:site_name"]', "content", "오토마케터");

    // Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "content", title);
    updateMetaTag('meta[name="twitter:description"]', "content", description);
    updateMetaTag('meta[name="twitter:image"]', "content", image);

    // Additional SEO tags
    updateMetaTag('meta[name="robots"]', "content", "index, follow");
    updateMetaTag('meta[name="language"]', "content", "Korean");
    updateMetaTag('meta[name="author"]', "content", "준");
  }, [title, description, keywords, image, url, type]);

  return null;
}
