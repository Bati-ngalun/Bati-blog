import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/admin/ProtectedRoute";

// Client (Public Blog) Pages
import BlogHome from "@/client/BlogHome";
import PostDetail from "@/client/PostDetail";
import CategoryPage from "@/client/CategoryPage";

// Admin Pages
import AdminLayout from "@/admin/AdminLayout";
import Dashboard from "@/admin/Dashboard";
import PostsList from "@/admin/PostsList";
import PostEditor from "@/admin/PostEditor";
import MediaLibrary from "@/admin/MediaLibrary";
import Categories from "@/admin/Categories";
import Login from "@/admin/Login";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Blog Routes */}
              <Route path="/" element={<BlogHome />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/category/:slug" element={<CategoryPage />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="posts" element={<PostsList />} />
                  <Route path="posts/new" element={<PostEditor />} />
                  <Route path="posts/edit/:id" element={<PostEditor />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="categories" element={<Categories />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
