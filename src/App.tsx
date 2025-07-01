
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <AuthGuard>
              <Index />
            </AuthGuard>
          } />
          <Route path="/add-product" element={
            <AuthGuard requiredUserType="seller">
              <AddProduct />
            </AuthGuard>
          } />
          <Route path="/products" element={
            <AuthGuard requiredUserType="seller">
              <Products />
            </AuthGuard>
          } />
          <Route path="/sales" element={
            <AuthGuard requiredUserType="buyer">
              <Sales />
            </AuthGuard>
          } />
          <Route path="/cart" element={
            <AuthGuard requiredUserType="buyer">
              <Cart />
            </AuthGuard>
          } />
          <Route path="/checkout" element={
            <AuthGuard requiredUserType="buyer">
              <Checkout />
            </AuthGuard>
          } />
          <Route path="/orders" element={
            <AuthGuard>
              <Orders />
            </AuthGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
