import * as React from "react";
import { SharedHeader } from "./SharedHeader";

// This component creates the consistent, centered layout for all pages.
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SharedHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
