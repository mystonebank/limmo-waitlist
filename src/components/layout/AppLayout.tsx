import * as React from "react";
import { Outlet } from "react-router-dom";
import { SharedHeader } from "./SharedHeader";
import { FAB } from "./FAB"; // Import the new FAB component

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SharedHeader />
      <main className="w-full max-w-3xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <FAB /> {/* Add the FAB component here */}
    </div>
  );
};
