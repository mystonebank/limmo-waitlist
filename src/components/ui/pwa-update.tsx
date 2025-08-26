import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PWAUpdateProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const PWAUpdate = ({ onUpdate, onDismiss }: PWAUpdateProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show update notification after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-6 md:w-80"
      >
        <Card className="bg-card/95 backdrop-blur border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Update Available</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CardDescription className="text-xs">
              A new version of Limmo is ready
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={onUpdate}
                size="sm"
                className="flex-1 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Update Now
              </Button>
              <Button
                onClick={onDismiss}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
