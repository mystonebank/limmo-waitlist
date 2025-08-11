import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// This header shows the app title and a conditional "Back" link.
export const SharedHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-3xl items-center justify-between">
        <div className="flex items-center">
          {/* Only show the back button if not on the home page */}
          {!isHomePage && (
            <Link
              to="/"
              className="mr-4 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              aria-label="Back to Hub"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary text-glow">
              Limmo
            </span>
          </Link>
        </div>
        {/* You can add other header items here in the future, like a user menu */}
      </div>
    </header>
  );
};
