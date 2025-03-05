import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <h1>Layout</h1>
      {children}
    </div>
  );
}
