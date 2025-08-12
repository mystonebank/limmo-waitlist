import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FAB = () => {
  return (
    <motion.div
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button asChild size="icon" className="h-14 w-14 rounded-full card-glow shadow-lg">
        <Link to="/journal" aria-label="Capture a new win">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>
    </motion.div>
  );
};
