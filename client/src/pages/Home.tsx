import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import ProductCard from "@/components/ProductCard";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import type { BlogPost, Product, Service } from "@shared/schema";

export default function Home() {
  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing fast performance and seamless interactions across all our platforms.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensuring your data and operations are always protected.",
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Join thousands of satisfied customers achieving their business goals with our solutions.",
    },
  ];

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        badge="Welcome to Business Platform"
        title="Digital Products & Services for Modern Businesses"
        subtitle="Empower your business with our comprehensive suite of digital products, programs, and professional services designed for growth and success."
        primaryCTA={{ text: "Get Started", href: "/contact" }}
        secondaryCTA={{ text: "Explore Products", href: "/products" }}
      />

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide world-class solutions backed by exceptional service and proven results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow" data-testid={`card-feature-${index}`}>
                <CardContent className="space-y-4 pt-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Discover our premium digital products and solutions
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-products">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      {!servicesLoading && services.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional services tailored to your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/services">
                <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-all-services">
                  View All Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                Latest Insights
              </h2>
              <p className="text-muted-foreground">
                Stay updated with our latest articles and thought leadership
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-blog">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Join thousands of businesses already transforming their operations with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 gap-2" data-testid="button-cta-contact">
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="px-8" data-testid="button-cta-resources">
                Browse Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
