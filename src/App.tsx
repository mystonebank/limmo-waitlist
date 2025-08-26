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
import { AppLayout } from "@/components/layout/AppLayout";
import { PWAUpdate } from "@/components/ui/pwa-update";
import { updateSW } from "./pwa";

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

const App = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for PWA update events
    const handleUpdate = () => setShowUpdate(true);
    
    // Set up update listener
    updateSW.onNeedRefresh = handleUpdate;
    
    return () => {
      updateSW.onNeedRefresh = () => {};
    };
  }, []);

  const handleUpdate = () => {
    updateSW();
    setShowUpdate(false);
  };

  const handleDismissUpdate = () => {
    setShowUpdate(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route for authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* This is the new, corrected layout route structure */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {/* The AppLayout is now the parent route element */}
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* These routes will render inside AppLayout's <Outlet> */}
              <Route index element={<Index />} />
              <Route path="journal" element={<Journal />} />
              <Route path="memory-lane" element={<MemoryLane />} />
              <Route path="spark" element={<Spark />} />
            </Route>

            {/* Catch-all for any other path */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* PWA Update Notification */}
        {showUpdate && (
          <PWAUpdate
            onUpdate={handleUpdate}
            onDismiss={handleDismissUpdate}
          />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
