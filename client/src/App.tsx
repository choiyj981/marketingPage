import { Switch, Route, useRoute, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Resources from "@/pages/Resources";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import AdminBlog from "@/pages/AdminBlog";
import AdminBlogForm from "@/pages/AdminBlogForm";
import AdminProducts from "@/pages/AdminProducts";
import AdminProductForm from "@/pages/AdminProductForm";
import AdminResources from "@/pages/AdminResources";
import AdminResourceForm from "@/pages/AdminResourceForm";
import AdminServices from "@/pages/AdminServices";
import AdminServiceForm from "@/pages/AdminServiceForm";
import AdminContacts from "@/pages/AdminContacts";
import AdminFaq from "@/pages/AdminFaq";
import AdminFaqForm from "@/pages/AdminFaqForm";
import AdminReviews from "@/pages/AdminReviews";
import AdminNewsletter from "@/pages/AdminNewsletter";
import AdminMetrics from "@/pages/AdminMetrics";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";
import MaintenanceMode from "@/components/MaintenanceMode";

function Router() {
  const [isAdminRoute] = useRoute("/admin*");
  const [isMaintenanceRoute] = useRoute("/maintenance");
  const [location] = useLocation();
  
  // 라우트 변경 시 최상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return (
    <>
      {!isAdminRoute && !isMaintenanceRoute && <Navigation />}
      <Switch>
        <Route path="/maintenance" component={MaintenanceMode} />
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/products" component={Products} />
        <Route path="/products/:slug" component={ProductDetail} />
        <Route path="/resources" component={Resources} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/blog/new" component={AdminBlogForm} />
        <Route path="/admin/blog/:id/edit" component={AdminBlogForm} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/products/new" component={AdminProductForm} />
        <Route path="/admin/products/:id/edit" component={AdminProductForm} />
        <Route path="/admin/resources" component={AdminResources} />
        <Route path="/admin/resources/new" component={AdminResourceForm} />
        <Route path="/admin/resources/:id/edit" component={AdminResourceForm} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/services/new" component={AdminServiceForm} />
        <Route path="/admin/services/:id/edit" component={AdminServiceForm} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/faq" component={AdminFaq} />
        <Route path="/admin/faq/new" component={AdminFaqForm} />
        <Route path="/admin/faq/:id/edit" component={AdminFaqForm} />
        <Route path="/admin/reviews" component={AdminReviews} />
        <Route path="/admin/newsletter" component={AdminNewsletter} />
        <Route path="/admin/metrics" component={AdminMetrics} />
        <Route component={NotFound} />
      </Switch>
      {!isAdminRoute && !isMaintenanceRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
