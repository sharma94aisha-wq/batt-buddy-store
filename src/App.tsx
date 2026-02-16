import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminRoute from "@/components/AdminRoute";
import AccountRoute from "@/components/AccountRoute";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/AdminLogin";
import CustomerAuth from "./pages/CustomerAuth";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPages from "./pages/admin/AdminPages";
import AdminContent from "./pages/admin/AdminContent";
import AdminOrders from "./pages/admin/AdminOrders";
import AccountLayout from "./pages/account/AccountLayout";
import AccountProfile from "./pages/account/AccountProfile";
import AccountBookmarks from "./pages/account/AccountBookmarks";
import AccountOrders from "./pages/account/AccountOrders";
import AccountOrderHistory from "./pages/account/AccountOrderHistory";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import Warranty from "./pages/Warranty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category/:slug" element={<CategoryProducts />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/auth" element={<CustomerAuth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
              <Route path="/account" element={<AccountRoute><AccountLayout /></AccountRoute>}>
                <Route index element={<AccountProfile />} />
                <Route path="bookmarks" element={<AccountBookmarks />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="order-history" element={<AccountOrderHistory />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
