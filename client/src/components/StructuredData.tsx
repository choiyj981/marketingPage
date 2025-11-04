import { useEffect } from "react";

interface OrganizationSchemaProps {
  type: "organization";
}

interface BlogPostingSchemaProps {
  type: "blog";
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
}

interface ProductSchemaProps {
  type: "product";
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  url: string;
}

interface FAQSchemaProps {
  type: "faq";
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

type StructuredDataProps =
  | OrganizationSchemaProps
  | BlogPostingSchemaProps
  | ProductSchemaProps
  | FAQSchemaProps;

export default function StructuredData(props: StructuredDataProps) {
  useEffect(() => {
    let schema: any;

    switch (props.type) {
      case "organization":
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "모두의광고",
          description: "효과적인 광고 솔루션과 마케팅 전략을 제공하는 프리미엄 플랫폼",
          url: window.location.origin,
          logo: `${window.location.origin}/favicon.png`,
          sameAs: [
            // Add social media links here if available
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            availableLanguage: "Korean",
          },
        };
        break;

      case "blog":
        schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: props.title,
          description: props.description,
          image: props.imageUrl,
          author: {
            "@type": "Person",
            name: props.author,
          },
          publisher: {
            "@type": "Organization",
            name: "모두의광고",
            logo: {
              "@type": "ImageObject",
              url: `${window.location.origin}/favicon.png`,
            },
          },
          datePublished: props.publishedAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": props.url,
          },
        };
        break;

      case "product":
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: props.name,
          description: props.description,
          image: props.imageUrl,
          offers: {
            "@type": "Offer",
            price: props.price.replace(/[^0-9]/g, ""),
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            url: props.url,
          },
        };
        break;

      case "faq":
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: props.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };
        break;
    }

    // Create or update script tag
    let scriptTag = document.getElementById("structured-data");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById("structured-data");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [props]);

  return null;
}
