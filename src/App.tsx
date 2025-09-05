import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Waitlist from "./pages/Waitlist";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Waitlist />
    </TooltipProvider>
  );
};

export default App;
