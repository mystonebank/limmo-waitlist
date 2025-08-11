import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Journal from "./pages/Journal";
import MemoryLane from "./pages/MemoryLane";
import Spark from "./pages/Spark";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout"; // Import the new layout

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthed(!!session?.user);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-wide text-primary text-glow">Limmo</h1>
          <p className="text-muted-foreground mt-2">Loading your space...</p>
        </div>
      </div>
    );
  }

  return isAuthed ? children : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* The Auth route remains outside the layout */}
          <Route path="/auth" element={<Auth />} />

          {/* Wrap all protected routes in the new AppLayout component */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/memory-lane" element={<MemoryLane />} />
                    <Route path="/spark" element={<Spark />} />
                    {/* The catch-all route for protected pages */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
